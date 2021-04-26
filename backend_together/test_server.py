import server
import unittest

class TestServer(unittest.TestCase):
    def test_create_count(self):
        input = [
            {
                "_id": 5,
                "date": "2021-04-25",
                "day": 25,
                "delay": 0,
                "description": "nice nice",
                "finish": 0,
                "month": 4,
                "title": "watch owl",
                "type": "life",
                "year": 2021
            },
            {
                "_id": 1619324706,
                "date": "2021-04-25",
                "day": 25,
                "delay": 0,
                "description": "type1",
                "finish": 0,
                "month": 4,
                "title": "test vis",
                "type": "work",
                "year": 2021
            }
        ]
        expected = [
            {
                "all": 2,
                "label": "life",
                "value": 1
            },
            {
                "all": 2,
                "label": "work",
                "value": 1
            }
        ]

        result = server.create_count(input)
        self.assertEqual(expected, result)