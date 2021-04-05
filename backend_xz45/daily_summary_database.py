import os
import sys
import json
from collections import OrderedDict
import pymongo
from pymongo import MongoClient
import daily_summary_schema
import datetime


KEYS = ['year', 'month', 'day']
LONG_MONTHS = [1, 3, 5, 7, 8, 10, 12]


def connect_db():
    mongo_url = os.environ['MONGOURL']
    mongo_db = os.environ['DB']
    client = MongoClient(mongo_url)
    curr_db = client[mongo_db]
    return curr_db


def setup_collection(curr_db):
    curr_db['summary'].drop()
    curr_db.create_collection('summary')
    curr_db.command(OrderedDict(daily_summary_schema.summary_schema))


def find_summary_by_id(curr_id, collection_name='summary'):
    curr_db = connect_db()
    cursor = curr_db[collection_name].find({'_id': curr_id})
    return cursor_to_list(cursor)


def find_summary_by_mood(mood, collection_name='summary'):
    curr_db = connect_db()
    cursor = curr_db[collection_name].find({'mood': mood})
    result = cursor_to_list(cursor)
    return result


def update_summary_by_id(curr_id, new_data):
    curr_db = connect_db()
    cursor = curr_db['summary'].find({'_id': curr_id})
    if cursor.count() == 0:
        return 1
    try:
        curr_db['summary'].update_one(filter={'_id': curr_id}, update={'$set': new_data})
        return 0
    except pymongo.errors.WriteError:
        return 2
    except:
        return 3


def cursor_to_list(cursor):
    result = []
    for document in cursor:
        result.append(document)
    return result


def upload_single_summary(new_summary):
    curr_db = connect_db()
    summary_id = new_summary.get('_id')
    year_month_day = summary_id.split('-')

    for i in range(0, len(KEYS)):
        try:
            int_val = int(year_month_day[i])
            if i == 2 and check_day_range(new_summary['year'], new_summary['month'], int_val) is False:
                return 2
            new_summary[KEYS[i]] = int_val
        except ValueError:
            return 3

    if create_date(new_summary) == 1:
        return 3

    summary_id = new_summary['_id']

    try:
        result = curr_db['summary'].replace_one(filter={'_id': summary_id},
                                                replacement=new_summary, upsert=True)
        if result.upserted_id is not None:
            return 0
        return 1
    except pymongo.errors.WriteError:
        return 2


def create_date(new_summary):
    try:
        id_to_date = datetime.datetime.strptime(new_summary['_id']+'T00:00:00.000Z', '%Y-%m-%dT%H:%M:%S.000Z')
        new_summary['_id'] = str(id_to_date.date())
        # print(type(id_to_date))
        new_summary['date'] = id_to_date
        print(id_to_date)
        return 0
    except ValueError:
        return 1


def check_day_range(y, m, d):
    if m in LONG_MONTHS:
        return d <= 31
    if m == 2:
        max_day = 29 if y % 4 == 0 else 28
        return d <= max_day
    return d <= 30


def delete_by_id(curr_id):
    curr_db = connect_db()
    delete_result = curr_db['summary'].delete_one({'_id': curr_id})
    return delete_result.deleted_count


if __name__ == '__main__':
    curr_db = connect_db()
    setup_collection(curr_db)