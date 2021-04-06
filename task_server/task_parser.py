import re

ATTR_TASK = ['_id', 'date', 'year', 'month', 'day', 'title',
             'description', 'type', 'finish', 'delay']


def re_matching(pattern, text):
    """
    :param pattern: the pattern we want to patch

    :param text: the content we want to use pattern to match

    :return: all the matching results

    """
    data = re.compile(pattern)
    return re.findall(data, text)


def has_operator(input_str, operator):
    """
    :param input_str: the input string to be parsed

    :param operator: the operator want to detect

    :return: whether the operator is in the input_str

    """
    freqency = len(re_matching(operator, input_str))
    return freqency


def is_attribute(attr, attrs):
    """
    :param attr: the attribute to be detect

    :param attrs: the list of all the attributes

    :return: whether the attr is in the attrs

    """
    return attr in attrs


def find_attribute_right(input_str):
    """
    :param input_str: the input string to be parsed

    :return: if the input_str is invalid, then return None
             otherwise, return a tuple of information, refering to 
             the table name and table attribute

    """
    if has_operator(input_str, '\.') != 1:
        print("invalid number of '.' operator")
        return None

    pattern = '(.*):(.*)'
    (attribute, right) = re_matching(pattern, input_str)[0]
    return (attribute, right)


def operator_quote(input_str):
    """
    :param input_str: the input string to be parsed

    :return: if the input_str is invalid, then return None
             if the input_str has valid "" operator,  
             return a tuple of information, refering to 
             the sql operator and the value. Otherwise, 
             return None with proper error message.

    """
    pattern = '"'
    if len(re_matching(pattern, input_str)):
        if len(re_matching(pattern, input_str)) == 2:
            pattern = '^"(.*)"$'
            value = re_matching(pattern, input_str)
            if len(value) == 0:
                print('invalid operator " value')
                return None
            return ('=', value[0])

        print('invalid operator " number')
        return None
    return ('no', 'operator')


def operator_inequality(input_str):
    """
    :param input_str: the input string to be parsed

    :return: if the input_str is invalid, then return None
             if the input_str has valid < or > operator,  
             return a tuple of information, refering to 
             the sql operator and the value. Otherwise, 
             return None with proper error message.

    """
    input_str = input_str.strip()
    if len(re_matching('[<>]', input_str)) == 0:
        return ('no', 'operator')

    if len(re_matching('[<>]', input_str)) > 1:
        print('invalid inequality operator number')
        return None

    if input_str[0] != '>' and input_str[0] != '<':
        print('invalid inequality expression')
        return None

    pattern = '[><](.*)'
    value = re_matching(pattern, input_str)
    if len(value):
        if len(value) == 1:
            value = value[0].strip()
            if re_matching('>', input_str):
                return ('$gt', value)
            else:
                return ('$lt', value)
        print('invalid inequality operator number')
        return None
    print('invalid inequality operator number')
    return None


def no_operator(input_str):
    """
    :param input_str: the input string to be parsed

    :return: (after filter all the operators), return 
             the raw value with the proper operator in sql

    """
    value = input_str.strip()
    return ('$regex', ".*" + value + ".*")


def operator_NOT(input_str):
    """
    :param input_str: the input string to be parsed

    :return: (after filter all the operators), return 
             the raw value with the proper operator in sql

    """
    input_str = input_str.strip()
    if len(re_matching('NOT', input_str)) == 0:
        return ('no', 'operator')

    if input_str == 'NOT':
        print('only NOT operator')
        return None

    pattern = 'NOT(.*)'
    value = re_matching(pattern, input_str)
    if len(value) == 1:
        value_sub = operator_inequality(value[0])
        if value_sub == None:
            return None

        # has inequality operator
        if value_sub[0] == '$gt':
            return ('$lte', value_sub[1])
        if value_sub[0] == '$lt':
            return ('$gte', value_sub[1])

        # no inequality operator
        if len(re_matching('"', value[0])):
            print('invalid NOT expression')
            return None
        value = no_operator(value[0])
        return ('$ne', value[1][2:-2])
    print('invalid NOT operator')
    return None


def find_value_range(right):
    """
    :param right: the input string to be parsed

    :return: if the right string is valid, then output
             the corresponding aql operator and the value.
             otherwise, return None with error message

    """
    if right == '':
        print('empty right part of the string')
        return None

    op_and_value = operator_quote(right)
    if op_and_value:
        if op_and_value[0] == 'no':
            op_and_value = operator_NOT(right)

            if op_and_value:
                if op_and_value[0] == 'no':
                    op_and_value = operator_inequality(right)

                    if op_and_value:
                        if op_and_value[0] == 'no':
                            op_and_value = no_operator(right)
                            return op_and_value

                        return op_and_value
                    return None
                return op_and_value
            return None
        return op_and_value
    return None


def parse_simple_query(input_str):
    """
    Not include AND & OR operators
    :param input_str: the input string to be parsed

    :return: if the input_str is valid, return a list of 
             four elements [table_name, attribute, 
             operator, value]. otherwise, return None with 
             error message.
    """
    input_str = input_str.strip()

    if not has_operator(input_str, '\:'):
        print("missing ':' operator")
        return None

    pattern = '(.*):(.*)'
    (attribute, right) = re_matching(pattern, input_str)[0]
    attribute = attribute.strip()
    right = right.strip()

    # right part
    if find_value_range(right) == None:
        return None
    (operator, value) = find_value_range(right)
    return [attribute, operator, value]


def operator_and_or(input_str):
    """
    :param input_str: the input string to be parsed

    :return: if the input_str is a valid string containing
             AND or OR, then return a tuple, which has the 
             operator AND or OR in the first unit, and a
             tuple of strings for the splited substrings
    """
    input_str = input_str.strip()
    num_and = len(re_matching('AND', input_str))
    num_or = len(re_matching('OR', input_str))
    if num_and + num_or == 0:
        return ('no', 'operator')

    if num_and + num_or != 1:
        print('can only contain one AND/OR')
        return None

    if num_and == 1:
        pattern = '(.*)AND(.*)'
        result = re_matching(pattern, input_str)[0]
        if not len(result[0]) or not len(result[1]):
            print('invalid sub strings after spliting')
            return None
        return ('$and', result)

    pattern = '(.*)OR(.*)'
    result = re_matching(pattern, input_str)[0]
    if not len(result[0]) or not len(result[1]):
        print('invalid sub strings after spliting')
        return None
    return ('$or', result)


def parse_complex_query(input_str):
    """
    :param input_str: the input string to be parsed

    :return: if the input_str is valid, return a list of 
             three elements, [AND/OR, list1, list2], where
             list1 and list2 have format of the return 
             value of parse_simple_query. otherwise, return
             None with error message.
    """
    strs = operator_and_or(input_str)
    if strs:
        operator = strs[0]
        if operator == 'no':
            return parse_simple_query(input_str)

        sub_query_1 = parse_simple_query(strs[1][0])
        if not sub_query_1:
            print('the left query is invald')
            return None

        sub_query_2 = parse_simple_query(strs[1][1])
        if not sub_query_2:
            print('the right query is invald')
            return None

        return [operator, sub_query_1, sub_query_2]

    return None


def generate_simple_query(values):
    """
    :param values: a list of values to be generated, i.e. ["$gt", "date", "2021-03-14"]

    :return: a mongodb query for find()
    """
    if values[1] == '=':
        result = '{ ' + values[0] + ' : "' + values[2] + '" }'
    else:
        result = '{ ' + values[0] + \
            ': { ' + values[1] + ' : "' + values[2] + '" } }'
    return result


def search(input_str):
    """
    :param values: input query i.e. "title: workout AND date: NOT < 2021-01-01"

    :return: a mongodb query for find()
    """
    values = parse_complex_query(input_str)
    if not values or not len(values):
        return

    if values[0][0] != '$':
        return generate_simple_query(values)

    query1 = generate_simple_query(values[1])
    query2 = generate_simple_query(values[2])
    return '{ ' + values[0] + ': [ ' + query1 + ', ' + query2 + ' ] }'
