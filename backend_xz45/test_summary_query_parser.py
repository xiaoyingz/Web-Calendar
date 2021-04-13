import summary_query_parser
import unittest

class TestSummaryQueryParser(unittest.TestCase):
    def test_preprocess_query(self):
        string = "\AND\OR\:\$$"
        expected = "A_N_DO_RC_O_LD_O_L$"
        self.assertEqual(expected, summary_query_parser.preprocess_query(string))

    def test_revert_rule(self):
        rule = "A_N_DO_RC_O_LD_O_L$"
        expected = "ANDOR:$$"
        self.assertEqual(expected, summary_query_parser.revert_rule(rule))

    def test_exact_or_contain_1(self):
        rule = "abc"
        self.assertEqual(1, summary_query_parser.exact_or_contain(rule))

    def test_exact_or_contain_2(self):
        rule = "\"abc\""
        self.assertEqual(2, summary_query_parser.exact_or_contain(rule))

    def test_exact_or_contain_3(self):
        rule = "a\"abc\"b"
        self.assertEqual(3, summary_query_parser.exact_or_contain(rule))

    def test_exact_or_contain_unclosed(self):
        rule = "\"a\"abc\"b"
        self.assertEqual(3, summary_query_parser.exact_or_contain(rule))

    def test_handle_bounded_lt_invalid_type(self):
        rule = "< a"
        expected_string = 'Invalid filter type {}.'.format('a')
        b, string = summary_query_parser.handle_bounded('year', rule, op='<')
        self.assertEqual(False, b)
        self.assertEqual(expected_string, string)

    def test_handle_bounded_lt_valid_type(self):
        rule = "< 2021"
        b, _ = summary_query_parser.handle_bounded('year', rule, op='<')
        self.assertEqual(True, b)

    def test_handle_bounded_gt_invalid_type(self):
        rule = "> a"
        expected_string = 'Invalid filter type {}.'.format('a')
        b, string = summary_query_parser.handle_bounded('year', rule, op='>')
        self.assertEqual(False, b)
        self.assertEqual(expected_string, string)

    def test_handle_bounded_gt_valid_type(self):
        rule = "> 3"
        b, _ = summary_query_parser.handle_bounded('month', rule, op='>')
        self.assertEqual(True, b)

    def test_check_time_format_valid(self):
        time = "2021-04-12"
        b, result = summary_query_parser.check_time_format(time)
        self.assertEqual(True, b)
        self.assertEqual(time, result)

    def test_check_time_format_invalid(self):
        time = "2021-04-"
        b, _ = summary_query_parser.check_time_format(time)
        self.assertEqual(False, b)

    def test_handle_time_before_invalid(self):
        rule = 'BEFORE $'
        b, _ = summary_query_parser.handle_time('_id', rule, 'BEFORE')
        self.assertEqual(False, b)

    def test_handle_time_before_long(self):
        rule = 'BEFORE $2021-01-01 $'
        b, _ = summary_query_parser.handle_time('_id', rule, 'BEFORE')
        self.assertEqual(False, b)

    def test_handle_time_before_valid(self):
        rule = 'BEFORE $2021-01-01'
        b, q = summary_query_parser.handle_time('_id', rule, 'BEFORE')
        expected_q = {'_id': {'$lt': '2021-01-01'}}
        self.assertEqual(True, b)
        self.assertEqual(expected_q, q)

    def test_handle_time_after_invalid(self):
        rule = 'AFTER $2020'
        b, _ = summary_query_parser.handle_time('_id', rule, 'AFTER')
        self.assertEqual(False, b)

    def test_handle_time_after_long(self):
        rule = 'AFTER $2021-01-01 $2021-07-08'
        b, _ = summary_query_parser.handle_time('_id', rule, 'AFTER')
        self.assertEqual(False, b)

    def test_handle_time_after_valid(self):
        rule = 'AFTER $2021-01-01'
        b, q = summary_query_parser.handle_time('_id', rule, 'AFTER')
        expected_q = {'_id': {'$gt': '2021-01-01'}}
        self.assertEqual(True, b)
        self.assertEqual(expected_q, q)

    def test_handle_time_between_invalid(self):
        rule = 'BETWEEN $2020 $2021-01-01'
        b, _ = summary_query_parser.handle_time('_id', rule, 'BETWEEN')
        self.assertEqual(False, b)

    def test_handle_time_between_long(self):
        rule = 'BETWEEN $2020-02-01 $2021-01-01 $2021-04-04'
        b, _ = summary_query_parser.handle_time('_id', rule, 'BETWEEN')
        self.assertEqual(False, b)

    def test_handle_time_between_valid(self):
        rule = 'BETWEEN $2020-01-01 $2021-01-01'
        b, q = summary_query_parser.handle_time('_id', rule, 'BETWEEN')
        expected_q = {'$and': [{'_id': {'$gt': '2020-01-01'}}, {'_id': {'$lt': '2021-01-01'}}]}
        self.assertEqual(True, b)
        self.assertEqual(expected_q, q)