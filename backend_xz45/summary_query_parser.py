# : used to specify attribute, i.e. content:
# 'BETWEEN', 'AFTER', 'BEFORE' are filters for date attribute, use $ to specify time range,
# i.e. date: BETWEEN $2010-12-05 $2021-3-15, date: AFTER $2020-07-10, date: BEFORE $2020-07-03
# logic operator: AND, OR, NOT
# "" contains, otherwise exactly match
# '>', '<' for range of year, month, or day
# use escape '\' to prevent operators above to be parsed by parser
import daily_summary_schema, daily_summary_database
import json

OP_ESCAPE = ['\:', '\$', '\AND', '\OR', r'\NOT', '\BEFORE', '\AFTER', '\BETWEEN', r'\"', '\<', '\>']
OP_MASK = ['C_O_L', 'D_O_L', 'A_N_D', 'O_R', 'N_O_T', 'B_E_F', 'A_F_T', 'B_E_T', 'Q_U_O_T_E', 'L_T', 'G_T']
INT_ATTR = ['year', 'month', 'day']
MONGO_OP_MAP = {'<': '$lt', '>': '$gt'}

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


# def final_q(str_q):
#     items = CURL_MAP.items()
#     for item in items:
#         key, val = item
#         str_q = str_q.replace(key, val)
#     return str_q


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
    # mongo_q = json.dumps(str_query)
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