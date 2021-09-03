import daily_summary_database
import unittest

class TestDailySummaryDatabase(unittest.TestCase):
    def test_check_day_range_invalid_leap(self):
        y = 2019
        m = 2
        d = 29
        result = daily_summary_database.check_day_range(y, m, d)
        self.assertFalse(result)

    def test_check_day_range_valid_leap(self):
        y = 2012
        m = 2
        d = 29
        result = daily_summary_database.check_day_range(y, m, d)
        self.assertTrue(result)

    def test_check_day_range_invalid(self):
        y = 2012
        m = 4
        d = 31
        result = daily_summary_database.check_day_range(y, m, d)
        self.assertFalse(result)

    def test_check_day_range_valid(self):
        y = 2021
        m = 5
        d = 31
        result = daily_summary_database.check_day_range(y, m, d)
        self.assertTrue(result)

    def test_create_date_valid(self):
        input = {
            '_id': '2021-04-26',
        }
        result = daily_summary_database.create_date(input)
        self.assertEqual(0, result)

    def test_create_date_missing_month_zero(self):
        input = {
            '_id': '2021-4-26'
        }
        expected = '2021-04-26'
        result = daily_summary_database.create_date(input)
        self.assertEqual(expected, input['_id'])
        self.assertEqual(0, result)

    def test_create_date_missing_day_zero(self):
        input = {
            '_id': '2021-04-1'
        }
        expected = '2021-04-01'
        result = daily_summary_database.create_date(input)
        self.assertEqual(expected, input['_id'])
        self.assertEqual(0, result)

    def test_create_date_missing_part(self):
        input = {
            '_id': '2021-04',
        }
        result = daily_summary_database.create_date(input)
        self.assertEqual(1, result)

    def test_create_date_missing_day(self):
        input = {
            '_id': '2021-04-',
        }
        result = daily_summary_database.create_date(input)
        self.assertEqual(1, result)