import pymongo
from pymongo import MongoClient
from task_schema import task_schema
from collections import OrderedDict
import time
import datetime

import pyaztro
horoscope = pyaztro.Aztro(sign='aries')


def connect_db():
    """
    Connect to the mongodb data base.
    :return: the data base

    """

    cluster = MongoClient(
        "mongodb+srv://xz45:971215@cluster0.b5ke5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    curr_db = cluster["project"]
    return curr_db


def create_collection(curr_db):
    """
    Create a new collection according to the task_schema
    :param curr_db: the databse we access

    """
    curr_db['task'].drop()
    curr_db.create_collection('task')
    curr_db.command(OrderedDict(task_schema))


def cursor_to_list(cursor):
    """
    Convert a cursor to a list of dictionaries
    :param cursor : the input cursor

    :return : a list of dictionaries

    """
    result = []
    for document in cursor:
        result.append(document)
    return result


def find_task_by_date(curr_date, delay=0):
    """
    Get the tasks according to the date attribute and delay attribute.
    :param curr_date: the date we want to get  

    :param delay: whether we need to specify the delay, default to 0.
    This attribute is for the delay function on week 4.

    :return: a list of desired data

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None

    collection = curr_db["task"]
    if delay:
        result = collection.find({"date": curr_date, "delay": 1})
    else:
        result = collection.find({"date": curr_date})
    return cursor_to_list(result)


def find_task_by_date_title(curr_date, curr_title):
    """
    Get one specific task according to the date and title.
    :param curr_date: the date we want to get  

    :param curr_title: the title we want to get

    :return: a specific task if success, otherwise None

    """
    for doc in find_task_by_date(curr_date, 0):
        if doc["title"] == curr_title:
            return doc
    return None


def update_task_by_id(curr_id, new_data):
    """
    Update a task for one specific attribute.
    :param curr_id: the task id we want to update  

    :param new_data: new data of task to be updated

    :return: 0 if success, otherwise return different positive integers

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None

    collection = curr_db["task"]
    cursor = collection.find({'_id': curr_id})
    if cursor.count() == 0:
        return 1

    try:
        collection.update_one(
            filter={'_id': curr_id}, update={'$set': new_data})
        return 0

    except pymongo.errors.WriteError:
        return 2

    except:
        return 3


def delete_by_id(curr_id):
    """
    Delete a task according to the id.
    :param curr_id: the task id we want to update  

    :param attr: the attr to be updated

    :param attr_value: the value needs to be set

    :return: 0 if success, otherwise return different positive integers

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None

    collection = curr_db["task"]
    delete_result = collection.delete_one({'_id': curr_id})
    return delete_result.deleted_count


# def create_task(new_task):
#     """
#     Create a new task.
#     :param new_task: a dictionary contains all
#     the information about the new task

#     :return: 0 if success, otherwise return a positive integers

#     """
#     try:
#         curr_db = connect_db()
#         print('connect to databse')
#     except:
#         print('fail to connect the databse')
#         return 2

#     collection = curr_db["task"]
#     curr_id = new_task.get('_id', None)
#     if curr_id is None:
#         new_task['_id'] = int(time.time())

#     try:
#         year_month_day = new_task['date'].split('-')
#         new_task['year'] = int(year_month_day[0])
#         new_task['month'] = int(year_month_day[1])
#         new_task['day'] = int(year_month_day[2])
#     except ValueError:
#         return 1

#     try:
#         collection.insert_one(new_task)
#         return 0
#     except pymongo.errors.WriteError:
#         print(1)
#         return 1

def create_task(new_task):
    """
    Create a new task.
    :param new_task: a dictionary contains all 
    the information about the new task

    :return: 0 if success, otherwise return a positive integers

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return 2

    collection = curr_db["task"]
    curr_id = new_task.get('_id', None)
    if curr_id is None:
        new_task['_id'] = int(time.time())

    try:
        year_month_day = new_task['date'].split('-')
        new_task['year'] = int(year_month_day[0])
        new_task['month'] = int(year_month_day[1])
        new_task['day'] = int(year_month_day[2])
    except ValueError:
        return 1

    try:
        collection.insert_one(new_task)
        return 0
    except pymongo.errors.WriteError:
        print(1)
        return 1


def find_number_of_tasks_by_date(curr_date):
    """
    Find the number of tasks for curr_date
    :param curr_date: the desired day

    :return: the number of tasks

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None
    collection = curr_db["task"]
    result = collection.find({"date": curr_date})
    return result.count()


def find_tasks_by_day_range(start_date, end_date):
    """
    Find all the tasks in a time range
    :param start_date: the start date(inslusive)

    :param end_date: the end date(inslusive)

    :return: a list of tasks
    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None
    collection = curr_db["task"]
    query = {"$and": [{"date": {"$gte": start_date}},
                      {"date": {"$lte": end_date}}]}
    result = collection.find(query)
    return cursor_to_list(result)


def iter_dates(date1, date2):
    """
    Generate all the dates between date1 and date2
    in a list of format "yyyy-MM-dd"

    :param date1: the start date(inslusive)

    :param date2: the end date(inslusive)

    :return: a list of date
    """
    start = datetime.datetime.strptime(date1, '%Y-%m-%d')
    end = datetime.datetime.strptime(date2, '%Y-%m-%d')
    step = datetime.timedelta(days=1)
    result = []
    while start <= end:
        result.append(str(start.date()))
        start += step

    return result


def find_monthly_tasks_counts(start_date, end_date):
    """
    Find the number of tasks for each day in a range of days
    :param start_date: the start date(inslusive)

    :param end_date: the end date(inslusive)

    :return: a list of numbers
    """
    data = find_tasks_by_day_range(start_date, end_date)
    dates = iter_dates(start_date, end_date)
    result = {}
    for date in dates:
        count = [0, 0]
        for task in data:
            if task['date'] == date:
                if task['finish']:
                    count[1] += 1
                else:
                    count[0] += 1
        result[date] = count
    print(result)
    return result


def delay_all_tasks_by_date(curr_date):
    """
    Delay all the unfinished tasks for a specific day.

    :param curr_date: the date we want to delay

    :return: 0 if success, otherwise return different positive integers

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None

    collection = curr_db["task"]
    curr_day = datetime.datetime.strptime(curr_date, '%Y-%m-%d')
    step = datetime.timedelta(days=1)
    next_day = str((curr_day + step).date())
    new_data = {
        "date": next_day,
        "delay": 0
    }

    try:
        collection.update_many(
            filter={'date': curr_date, 'finish': 0}, update={'$set': new_data})
        return 0

    except pymongo.errors.WriteError:
        return 2

    except:
        return 3


def delay_task_by_id(curr_id):
    """
    Delay one particular task by its id.

    :param curr_id: the task id we want to delay  

    :return: 0 if success, otherwise return different positive integers

    """
    try:
        curr_db = connect_db()
        print('connect to databse')
    except:
        print('fail to connect the databse')
        return None

    collection = curr_db["task"]
    curr_day = collection.find({"_id": curr_id})
    curr_day = cursor_to_list(curr_day)[0]['date']
    print(curr_day)

    curr_day = datetime.datetime.strptime(curr_day, '%Y-%m-%d')
    step = datetime.timedelta(days=1)
    next_day = str((curr_day + step).date())

    new_data = {
        "date": next_day,
        "delay": 0,
        "finish": 0
    }

    try:
        collection.update_one(
            filter={'_id': curr_id}, update={'$set': new_data})
        return 0

    except pymongo.errors.WriteError:
        return 2

    except:
        return 3


def horoscope_description():
    """
    Get today's horoscope description.

    """
    return horoscope.description


def horoscope_lucky_number():
    """
    Get today's horoscope lucky number.

    """
    return horoscope.lucky_number


if __name__ == '__main__':
    print(horoscope.description)
