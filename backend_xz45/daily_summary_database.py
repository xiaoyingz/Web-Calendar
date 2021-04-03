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

# def find_summary_by_date(date, collection_name='summary'):
#     curr_db = connect_db()
#     cursor = curr_db[collection_name].find({'date': date})
#     return cursor_to_list(cursor)

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
    summary_id = new_summary.get('_id', None)
    try:
        result = curr_db['summary'].replace_one(filter={'_id': summary_id},
                                                replacement=new_summary, upsert=True)
        if result.upserted_id is not None:
            return 0
        return 1
    except pymongo.errors.WriteError:
        return 2

def delete_by_id(curr_id):
    curr_db = connect_db()
    delete_result = curr_db['summary'].delete_one({'_id': curr_id})
    return delete_result.deleted_count