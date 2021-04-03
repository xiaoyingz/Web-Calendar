import os
import sys
import json
from collections import OrderedDict
import pymongo
from pymongo import MongoClient
import daily_summary_schema

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
    return cursor_to_list(cursor)

def find_summary_by_date(date, collection_name='summary'):
    curr_db = connect_db()
    cursor = curr_db[collection_name].find({'date': date})
    return cursor_to_list(cursor)

def cursor_to_list(cursor):
    result = []
    for document in cursor:
        result.append(document)
    return result
