import unittest
import task_parser


class TestApp(unittest.TestCase):

    def test_re_matching(self):
        text = '{"followingCount":254,"isFollowing":false,'\
               '"authorFollowingId":null,"source":false},"4837":'\
               '{"followingCount":1376,"isFollowing":false,'\
               '"authorFollowingId":null,"source":false},"16623":'\
               '{"followingCount":467,"isFollowing":false,'\
               '"authorFollowingId":null,"source":false},"25215":'
        pattern = '{"followingCount":(.*?),"isFollowing":false,"authorFollowingId'

        result = task_parser.re_matching(pattern, text)
        self.assertEqual(result, ['254', '1376', '467'])

    def test_has_operator(self):
        input_str = 'date:>2021-01-06'
        self.assertEqual(task_parser.has_operator(input_str, '>'), 1)
        self.assertEqual(task_parser.has_operator(input_str, '<'), 0)

    def test_operator_quote_valid(self):
        input_str = '"242"'
        value = task_parser.operator_quote(input_str)
        self.assertEqual(value, ('=', '242'))

        input_str = '"work out"'
        value = task_parser.operator_quote(input_str)
        self.assertEqual(value, ('=', 'work out'))

    def test_operator_quote_invalid(self):
        input_str = '> 242'  # don't have "" operator
        value = task_parser.operator_quote(input_str)
        self.assertEqual(value, ('no', 'operator'))

        input_str = 'cs242"'  # missing " operator
        value = task_parser.operator_quote(input_str)
        self.assertEqual(value, None)

        input_str = '"cs3"45'  # invalid expression
        value = task_parser.operator_quote(input_str)
        self.assertEqual(value, None)

    def test_operator_inequality_valid(self):
        input_str = '> 242'
        value = task_parser.operator_inequality(input_str)
        self.assertEqual(value, ('$gt', '242'))

        input_str = '< 150'
        value = task_parser.operator_inequality(input_str)
        self.assertEqual(value, ('$lt', '150'))

    def test_operator_inequality_invalid(self):
        input_str = 'NOT 242'  # don't have > or < operator
        value = task_parser.operator_inequality(input_str)
        self.assertEqual(value, ('no', 'operator'))

        input_str = '>> 242'  # too many operators
        value = task_parser.operator_inequality(input_str)
        self.assertEqual(value, None)

        input_str = '2 > 33'  # invalid expression
        value = task_parser.operator_inequality(input_str)
        self.assertEqual(value, None)

    def test_no_operator(self):
        input_str = '242'
        value = task_parser.no_operator(input_str)
        self.assertEqual(value, ('$regex', '.*242.*'))

        input_str = 'work out'
        value = task_parser.no_operator(input_str)
        self.assertEqual(value, ('$regex', '.*work out.*'))

    def test_operator_NOT_valid_simple(self):
        input_str = 'NOT 242'
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, ('$ne', '242'))

        input_str = 'NOT work out'
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, ('$ne', 'work out'))

    def test_operator_NOT_valid_hard(self):
        input_str = 'NOT > 242'
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, ('$lte', '242'))

        input_str = 'NOT < 242'
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, ('$gte', '242'))

    def test_operator_NOT_invalid_simple(self):
        input_str = 'cs242'  # no NOT operator
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, ('no', 'operator'))

        input_str = 'NOT "cs242"'  # invalid NOT expression                 #no NOT operator
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, None)

    def test_find_value_range_valid(self):
        input_str = 'NOT > 242'
        value = task_parser.operator_NOT(input_str)
        self.assertEqual(value, ('$lte', '242'))

        input_str = 'work out'
        value = task_parser.no_operator(input_str)
        self.assertEqual(value, ('$regex', '.*work out.*'))

        input_str = '"242"'
        value = task_parser.operator_quote(input_str)
        self.assertEqual(value, ('=', '242'))

    def test_search_valid(self):
        input_str = 'date : NOT >  2021-03-15 OR title : workout'
        real_result = task_parser.search(input_str)
        expect_result = '{ $or: [ { date: { $lte : "2021-03-15" } }, '\
            '{ title: { $regex : ".*workout.*" } } ] }'
        self.assertEqual(real_result, expect_result)


if __name__ == '__main__':
    unittest.main()
