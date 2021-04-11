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