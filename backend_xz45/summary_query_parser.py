# : used to specify attribute, i.e. content:
# 'BETWEEN', 'AFTER', 'BEFORE' are filters for date attribute, use $ to specify time range,
# i.e. date: BETWEEN $2010-12-05 $2021-3-15, date: AFTER $2020-07-10, date: BEFORE $2020-07-03
# logic operator: AND, OR, NOT
# "" contains, otherwise exactly match
# '>', '<' for range of year, month, or day
# use escape '\' to prevent operators above to be parsed by parser
# Unbounded, logic, and time range operator will only appear once in a query
import daily_summary_schema, daily_summary_database
import re

OP_ESCAPE = ['\:', '\$', '\AND', '\OR', r'\NOT', '\BEFORE', '\AFTER', '\BETWEEN', r'\"', '\<', '\>']
OP_MASK = ['C_O_L', 'D_O_L', 'A_N_D', 'O_R', 'N_O_T', 'B_E_F', 'A_F_T', 'B_E_T', 'Q_U_O_T_E', 'L_T', 'G_T']
INT_ATTR = ['year', 'month', 'day']
MONGO_OP_MAP = {'<': '$lt', '>': '$gt', 'AND': '$and', 'OR': '$or', 'NOT': '$not'}

INVALID_ATTRIBUTE = 'Invalid attribute {}.'
INVALID_OP_USE = 'Invalid use of {}.'

def parser(query):
    query = preprocess_query(query)
    if ':' not in query:
        return False, 'Query should contain operator ":".'
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
                print(rule)
                value = int(rule)
                q = {attr: value}
                result = call_db(q)
                return True, result
            except ValueError:
                return False, 'Invalid filter type {}.'.format(rule)
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


def handle_logic(attr, rule, op='AND'):
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
    expr = re.compile(f".*{rule[1:-1]}.*", re.I)
    return {'$regex': expr}


def exact_or_contain(rule):
    if '"' not in rule:
        return 1
    if rule[0] == '"' and rule[-1] == '"':
        if len(rule) >= 2 and '"' not in rule[1:-1]:
            return 2
    return 3


def handle_bounded(attr, rule, op='<'):
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
    # print('call db')
    curr_db = daily_summary_database.connect_db()
    # print('mongo', mongo_q)
    cursor = curr_db['summary'].find(mongo_q)
    result = daily_summary_database.cursor_to_list(cursor)
    # print(result)
    return result


def preprocess_query(query):
    for i in range(0, len(OP_ESCAPE)):
        query = query.replace(OP_ESCAPE[i], OP_MASK[i])
    return query


def revert_rule(rule):
    for i in range(0, len(OP_ESCAPE)):
        rule = rule.replace(OP_MASK[i], OP_ESCAPE[i][1:])
    return rule