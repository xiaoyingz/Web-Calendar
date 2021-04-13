# : used to specify attribute, i.e. content:
# 'BETWEEN', 'AFTER', 'BEFORE' are filters for _id attribute, use $ to specify time range,
# i.e. _id: BETWEEN $2010-12-05 $2021-3-15, _id: AFTER $2020-07-10, _id: BEFORE $2020-07-03
# logic operator: AND, OR, NOT
# "" contains, otherwise exactly match
# '>', '<' for range of year, month, or day
# use escape '\' to prevent operators above to be parsed by parser
# Unbounded, logic, and time range operator will only appear once in a query
import daily_summary_schema, daily_summary_database
import re
import datetime

OP_ESCAPE = ['\:', '\$', '\AND', '\OR', r'\NOT', '\BEFORE', '\AFTER', '\BETWEEN', r'\"', '\<', '\>']
OP_MASK = ['C_O_L', 'D_O_L', 'A_N_D', 'O_R', 'N_O_T', 'B_E_F', 'A_F_T', 'B_E_T', 'Q_U_O_T_E', 'L_T', 'G_T']
INT_ATTR = ['year', 'month', 'day']
MONGO_OP_MAP = {'<': '$lt', '>': '$gt', 'AND': '$and', 'OR': '$or', 'BEFORE': '$lt', 'AFTER': '$gt'}

INVALID_ATTRIBUTE = 'Invalid attribute {}.'
INVALID_OP_USE = 'Invalid use of {}.'

def parser(query):
    """
    Parse and execute query for daily summary collection
    :param query: given query
    :return: True and query result if query is valid, False and error message otherwise
    """
    query = preprocess_query(query)
    if ':' not in query:
        return False, '"Query should contain operator :.'
    attr, rule = query.split(':')
    attr = attr.strip()
    rule = rule.strip()
    if attr not in daily_summary_schema.summary_attr:
        return False, INVALID_ATTRIBUTE.format(attr)
    if attr in INT_ATTR:
        if '>' in rule:
            return handle_bounded(attr, rule, op='>')
        elif '<' in rule:
            return handle_bounded(attr, rule, op='<')
        else:
            try:
                value = int(rule)
                q = {attr: value}
                result = call_db(q)
                return True, result
            except ValueError:
                return False, 'Invalid filter type {}.'.format(rule)
    elif attr == '_id':
        if 'BETWEEN' in rule:
            b, result = handle_time(attr, rule, op='BETWEEN')
        elif 'AFTER' in rule:
            b, result = handle_time(attr, rule, op='AFTER')
        elif 'BEFORE' in rule:
            b, result = handle_time(attr, rule, op='BEFORE')
        else:
            return False, INVALID_OP_USE.format('time filter')
        if b is True:
            result = call_db(result)
            return b, result
        return b, result
    else:
        if 'AND' in rule:
            return handle_logic(attr, rule, op='AND')
        elif 'OR' in rule:
            return handle_logic(attr, rule, op='OR')
        elif 'NOT' in rule:
            return handle_logic(attr, rule, op='NOT')
        else:
            match_code = exact_or_contain(rule)
            if match_code == 3:
                return False, INVALID_OP_USE.format('""')
            curr_q = {}
            if match_code == 1:
                curr_q = {attr: rule}
            elif match_code == 2:
                regex = build_regex(rule)
                curr_q = {attr: regex}
            result = call_db(curr_q)
            return True, result


def handle_time(attr, rule, op=None):
    """
    Helper to handle with time filter operations
    :param attr: query's target attribute
    :param rule: query's rule
    :param op: BETWEEN, BEFORE, AFTER
    :return: False and error message if rule is invalid, otherwise return
            True and corresponding mongodb query
    """
    parsed_rule = rule.split('$')
    if op == 'BETWEEN':
        if len(parsed_rule) != 3:
            return False, INVALID_OP_USE.format(op)
        _, begin, end = parsed_rule
        begin_checked = check_time_format(begin.strip())
        end_checked = check_time_format(end.strip())
        if begin_checked[0] is True and end_checked[0] is True:
            return True, {"$and":[{attr: {"$gt": begin_checked[1]}}, {"_id": {"$lt": end_checked[1]}}]}
    else:
        if len(parsed_rule) != 2:
            return False, INVALID_OP_USE.format(op)
        time = parsed_rule[1].strip()
        time_checked = check_time_format(time)
        if time_checked[0] is True:
            return True, {attr: {MONGO_OP_MAP[op]: time}}
    return False, 'Malformed _id.'


def check_time_format(time):
    """
    Helper to check if given string is in format of "YY-MM-DD"
    :param time: string to be checked
    :return: False and error message if invalid, otherwise return
            True and "YY-MM-DD"
    """
    try:
        date_obj = datetime.datetime.strptime(time, '%Y-%m-%d')
        return True, str(date_obj.date())
    except ValueError:
        return False, "Malformed time."


def handle_logic(attr, rule, op='AND'):
    """
    Helper to parse logic operators
    :param attr: query's target attribute
    :param rule: query's rule
    :param op: given logic operator(AND, OR, NOT)
    :return: True and query result if rule is valid, False and error message otherwise
    """
    split_rule = rule.split(op)
    if op == 'NOT':
        if split_rule[0].strip() != '':
            return False, INVALID_OP_USE.format(op)
        rule1 = split_rule[1].strip()
        match_code = exact_or_contain(rule1)
        if match_code == 1:
            mongo_q = {attr: {'$ne': rule1}}
            result = call_db(mongo_q)
            return True, result
        elif match_code == 2:
            regex = build_regex(rule1)
            mongo_q = {attr: {'$not': regex}}
            result = call_db(mongo_q)
            return True, result
        return False, INVALID_OP_USE.format('""')
    else:
        rule1 = split_rule[0].strip()
        rule2 = split_rule[1].strip()
        if rule1 == '' or rule2 == '':
            return False, INVALID_OP_USE.format(op)
        return execute_and_or(attr, rule1, rule2, op=op)


def execute_and_or(attr, rule1, rule2, op='AND'):
    """
    Helper to build and execute rules engaged in 'AND', 'OR'
    :param attr: target attribute of rule
    :param rule1: rule before given operator
    :param rule2: rule after given operator
    :param op: 'AND', 'OR'
    :return: True and query result if both rules are valid, False and error message otherwise
    """
    match_code1 = exact_or_contain(rule1)
    match_code2 = exact_or_contain(rule2)
    if match_code1 == 3 or match_code2 == 3:
        return False, INVALID_OP_USE.format(op)

    if match_code1 == 1:
        cond1 = {attr: rule1}
    else:
        regex = build_regex(rule1)
        cond1 = {attr: regex}

    if match_code2 == 1:
        cond2 = {attr: rule2}
    else:
        regex = build_regex(rule2)
        cond2 = {attr: regex}
    mongo_q = {MONGO_OP_MAP[op]: [cond1, cond2]}
    result = call_db(mongo_q)
    return True, result


def build_regex(rule):
    """
    Helper to generate part of the query that is related to 'contains' operator
    :param rule: substring result should contain
    :return: json represents meaning of 'contains'
    """
    expr = re.compile(f".*{rule[1:-1]}.*", re.I)
    return {'$regex': expr}


def exact_or_contain(rule):
    """
    Helper to check if the result should contain or exactly match the given substring
    :param rule: given substring
    :return: 1: exactly match, 2: contains, 3: invalid use of double quotes
    """
    if '"' not in rule:
        return 1
    if rule[0] == '"' and rule[-1] == '"':
        if len(rule) >= 2 and '"' not in rule[1:-1]:
            return 2
    return 3


def handle_bounded(attr, rule, op='<'):
    """
    Helper to parse and execute query related to bounded operators
    :param attr: target attribute of query
    :param rule: rule of query
    :param op: '<', '>'
    :return: True and query result if rule is valid, False and error message otherwise
    """
    split_rule = rule.split(op)
    if split_rule[0].strip() != '':
        return False, INVALID_OP_USE.format(op)
    try:
        value = int(split_rule[1].strip())
        q = {attr: {MONGO_OP_MAP[op]: value}}
        result = call_db(q)
        return True, result
    except ValueError:
        return False, 'Invalid filter type {}.'.format(split_rule[1].strip())


def call_db(mongo_q):
    """
    Helper to call database to execute query
    :param mongo_q: MongDB query
    :return: list of json storing querying result
    """
    curr_db = daily_summary_database.connect_db()
    cursor = curr_db['summary'].find(mongo_q)
    result = daily_summary_database.cursor_to_list(cursor)
    return result


def preprocess_query(query):
    """
    Detect escapes of special operators in query and cover them with masks
    :param query: query to be preprocessed
    :return: preprocessed query
    """
    for i in range(0, len(OP_ESCAPE)):
        query = query.replace(OP_ESCAPE[i], OP_MASK[i])
    return query


def revert_rule(rule):
    """
    Uncover masked special operators in the given rule
    :param rule: rule to be uncovered
    :return: uncovered rule
    """
    for i in range(0, len(OP_ESCAPE)):
        rule = rule.replace(OP_MASK[i], OP_ESCAPE[i][1:])
    return rule