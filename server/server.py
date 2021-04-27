from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, reqparse
import daily_summary_database
import daily_summary_schema
import summary_query_parser
import task_database

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

SUMMARY_NOT_FOUND_MESSAGE = 'No such {} found.'
SUMMARY_INVALID_REQUEST = 'Please specify {}.'
SUMMARY_INVALID_ATTRIBUTE = 'Invalid attribute: {}'
SUMMARY_UPDATE_SUCCESS = 'Summary with date {} has been updated.'
SUMMARY_UPDATE_ERROR = 'Summary with date {} cannot be updated.'
SUMMARY_UPLOAD_SUCCESS = 'Summary with date {} has been created.'
SUMMARY_UPLOAD_ERROR = 'Summary with date {} cannot be created.'
SUMMARY_DELETE_SUCCESS = 'Summary with date {} has been deleted.'
SUMMARY_INVALID_FORMAT = 'Invalid format of {}.'


NOT_FOUND_MESSAGE = 'No such {} found.'
INVALID_REQUEST = 'Please specify {}.'
UPLOAD_ERROR = 'Task with title {} cannot be created.'
UPLOAD_SUCCESS = 'Task with title {} has been created.'
DELETE_SUCCESS = 'Task with id {} has been deleted.'
UPDATE_ERROR = 'Task with id {} cannot be updated.'
UPDATE_SUCCESS = 'Task with id {} has been updated.'
UPDATE_SUCCESS_DATE = 'Tasks with date {} has been delayed.'
UPDATE_ERROR_DATE = 'Tasks with date {} cannot be delayed.'


@app.route(rule='/summary/id', methods=['GET'])
def get_summary_by_id():
    """
    Define route searching for summary by id, i.e. "/summary/id?id={id to find}"
    :return: data if id exists, otherwise error message with status code
    """
    summary_id = request.args.get('id', None)
    if summary_id:
        find_result = daily_summary_database.find_summary_by_id(summary_id)
        if len(find_result) == 0:
            return jsonify(SUMMARY_NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result[0]), 200
    return jsonify(SUMMARY_INVALID_REQUEST.format('summary id')), 400


@app.route(rule='/summary/mood', methods=['GET'])
def get_summary_by_mood():
    """
    Define route searching for summary by mood, i.e. "/summary/mood?mood={mood to find}"
    :return: data if id exists, otherwise error message with status code
    """
    summary_mood = request.args.get('mood', None)
    if summary_mood:
        find_result = daily_summary_database.find_summary_by_mood(
            mood=summary_mood)
        if len(find_result) == 0:
            return jsonify(SUMMARY_NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result), 200
    return jsonify(SUMMARY_INVALID_REQUEST.format('mood')), 400


@app.route(rule='/summary/search', methods=['GET'])
def get_summary_by_query():
    """
    Define route searching for summary by query, i.e. "/summary/search?query={query to find}"
    :return: data if query is satisfied, otherwise error message with status code
    """
    query = request.args.get('query', None)
    if query:
        status, result = summary_query_parser.parser(query)
        if status is True:
            if len(result) == 0:
                return jsonify(SUMMARY_NOT_FOUND_MESSAGE.format('summary')), 400
            return jsonify(result), 200
        return jsonify(result), 400
    return jsonify(SUMMARY_INVALID_REQUEST.format('query')), 400


@app.route(rule='/summary', methods=['PUT'])
def put_summary_by_id():
    """
    Define route of updating data by id, i.e. "/summary?id={id to update}", new data is stored
    in request.json
    :return: message and status code
    """
    curr_id = request.args.get('id', None)
    if curr_id:
        new_data = request.json
        # items = list(new_data.items())
        # for item in items:
        #     key, val = item
        #     if key not in daily_summary_schema.summary_attr:
        #         return jsonify(SUMMARY_INVALID_ATTRIBUTE.format(key)), 400
        update_result = daily_summary_database.update_summary_by_id(
            curr_id, new_data)
        if update_result == 0:
            return jsonify(SUMMARY_UPDATE_SUCCESS.format(curr_id)), 201
        elif update_result == 1:
            return jsonify(SUMMARY_NOT_FOUND_MESSAGE.format('summary'))
        elif update_result == 2:
            return jsonify('Update_one encountered errors.'), 400
        else:
            return jsonify(SUMMARY_UPDATE_ERROR.format(curr_id)), 400
    return jsonify(SUMMARY_INVALID_REQUEST.format('id')), 400


@app.route(rule='/summary', methods=['POST'])
@cross_origin(supports_credentials=True)
def post_single_summary():
    """
    Define route of uploading a single piece of data, i.e. "/summary", new data is stored
    in request.json
    :return: message and status code
    """
    # if check_content_type(request) is False:
    #     return jsonify("Invalid content type"), 415
    new_summary = request.json
    curr_id = new_summary.get('_id', None)
    if curr_id:
        post_result = daily_summary_database.upload_single_summary(new_summary)
        if post_result == 0:
            return jsonify(SUMMARY_UPLOAD_SUCCESS.format(curr_id)), 201
        elif post_result == 1:
            return jsonify(SUMMARY_UPDATE_SUCCESS.format(curr_id)), 201
        elif post_result == 2:
            return jsonify(SUMMARY_UPLOAD_ERROR.format(curr_id)), 400
        elif post_result == 3:
            return jsonify(SUMMARY_INVALID_FORMAT.format('_id')), 400
    return jsonify(SUMMARY_INVALID_REQUEST.format('_id')), 400


@app.route(rule='/summary', methods=['DELETE'])
def delete_summary_by_id():
    """
    Define route for deleting summary by id, i.e. "/summary/id?id={id to delete}"
    :return: message and status code
    """
    curr_id = request.args.get('id', None)
    if curr_id:
        deleted_count = daily_summary_database.delete_by_id(curr_id)
        if deleted_count == 1:
            return jsonify(SUMMARY_DELETE_SUCCESS.format(curr_id)), 200
        return jsonify(SUMMARY_NOT_FOUND_MESSAGE.format('summary')), 400
    return jsonify(SUMMARY_INVALID_REQUEST.format('id')), 400


@app.route('/task/id', methods=['GET'])
def get_task_by_id():
    """
    Define route searching for task by id, i.e. "/task/id?id={id to find}"
    :return: data if id exists, otherwise error message with status code
    """
    task_id = request.args.get('id', None)
    try:
        print(type(task_id))
        task_id = int(task_id)
        print(type(task_id))
    except ValueError:
        return jsonify("Invalid format of id."), 400
    if task_id:
        find_result = daily_summary_database.find_summary_by_id(
            task_id, collection_name='task')
        if len(find_result) == 0:
            return jsonify(SUMMARY_NOT_FOUND_MESSAGE.format('task')), 400
        return jsonify(find_result[0]), 200
    return jsonify(SUMMARY_INVALID_REQUEST.format('task id')), 400


@app.route('/task/date', methods=['GET'])
def get_task_by_date():
    """
    Define route searching for task by date, i.e. "/task?date=2021-03-15&delay=1" or 
    "/task?date=2021-03-15", the delay arguement is for the delay functionality on week 4.
    :return: data if id exists, otherwise error message with status code
    """
    try:
        task_date = request.args['date']
        print(task_date)
    except:
        return jsonify(INVALID_REQUEST.format('task')), 400

    try:
        task_delay = request.args['delay']
        task_delay = int(task_delay)
    except:
        task_delay = 0

    find_result = task_database.find_task_by_date(task_date, task_delay)

    if find_result:
        response = jsonify(find_result)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    return jsonify(NOT_FOUND_MESSAGE.format('task')), 400


@app.route('/task/monthlyTasks', methods=['GET'])
def get_monthly_tasks():
    """
    Define route searching for number of tasks by a range of days.
    i.e. "/task/monthlyTasks?start=2021-04-01&end=2021-04-30".

    :return: a list of numbers, otherwise error message with status code
    """
    try:
        start_date = request.args['start']
        end_date = request.args['end']
    except:
        response = jsonify(INVALID_REQUEST.format('task'))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400

    find_result = task_database.find_monthly_tasks_counts(start_date, end_date)
    response = jsonify(find_result)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/task/weeklyTasks', methods=['GET'])
def get_weekly_tasks():
    """
    Define route searching for tasks by a range of days in a week.
    i.e. "/task/weeklyTasks?start=2021-04-01&end=2021-04-30".

    :return: a list of tasks, otherwise error message with status code
    """
    try:
        start_date = request.args['start']
        end_date = request.args['end']
    except:
        response = jsonify(INVALID_REQUEST.format('task'))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400

    find_result = task_database.find_tasks_by_day_range(start_date, end_date)
    response = jsonify(find_result)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# @app.route('/task', methods=['POST'])
# def post_single_task():
#     """
#     Define route posting for a new task, the body will contain all the information
#     about the new data.
#     :return: success message with the new _id, otherwise error message with status code
#     """
#     new_task = request.json
#     curr_id = new_task['_id']

#     post_result = task_database.create_task(new_task)
#     if post_result:
#         return jsonify(UPLOAD_ERROR.format(curr_id)), 400
#     return jsonify(UPLOAD_SUCCESS.format(curr_id)), 200

@app.route('/task', methods=['POST'])
def post_single_task():
    """
    Define route posting for a new task, the body will contain all the information
    about the new data.
    :return: success message with the new _id, otherwise error message with status code
    """
    new_task = request.json
    title = new_task['title']
    post_result = task_database.create_task(new_task)
    if post_result:
        return jsonify(UPLOAD_ERROR.format(title)), 400
    return jsonify(UPLOAD_SUCCESS.format(title)), 200


@app.route('/task', methods=['DELETE'])
def delete_task_by_id():
    """
    Define route deleting a task by its id, i.e. "/task?id=6"
    :return: success message with the deleted _id, otherwise error message with status code
    """
    try:
        curr_id = request.args['id']
        curr_id = int(curr_id)
        print(curr_id)
    except:
        return jsonify(INVALID_REQUEST.format('task')), 400

    deleted_count = task_database.delete_by_id(curr_id)
    if deleted_count == 1:
        return jsonify(DELETE_SUCCESS.format(curr_id)), 200
    return jsonify(NOT_FOUND_MESSAGE.format('task')), 404


@app.route('/task', methods=['PUT'])
def put_task_by_id():
    """
    Define route updating for a specific task , i.e. "/task?id=6".
    The body will contain all the updated information.
    :return: success message with the new _id, otherwise error message with status code
    """
    curr_id = request.args['id']
    curr_id = int(curr_id)
    if curr_id:
        new_data = request.json
        try:
            task_database.update_task_by_id(curr_id, new_data)
        except:
            return jsonify(UPDATE_ERROR.format(curr_id)), 400
    return jsonify(UPDATE_SUCCESS.format(curr_id)), 200


@app.route('/task/date', methods=['PUT'])
def delay_task_by_date():
    """
    Define route updating for a specific task , i.e. "/task?date=2021-04-23".
    The body will contain all the updated information.
    :return: success message with the new _id, otherwise error message with status code
    """
    curr_date = request.args['date']
    if curr_date:
        try:
            task_database.delay_all_tasks_by_date(curr_date)
        except:
            return jsonify(UPDATE_ERROR_DATE.format(curr_date)), 400
    return jsonify(UPDATE_SUCCESS_DATE.format(curr_date)), 200


@app.route('/task/id', methods=['PUT'])
def delay_task_by_id():
    """
    Define route updating for a specific task , i.e. "/task?date=2021-04-23".
    The body will contain all the updated information.
    :return: success message with the new _id, otherwise error message with status code
    """
    curr_id = int(request.args['id'])
    print("the task id is: ", curr_id)
    if curr_id:
        try:
            task_database.delay_task_by_id(curr_id)
        except:
            return jsonify(UPDATE_ERROR.format(curr_id)), 400
    return jsonify(UPDATE_SUCCESS.format(curr_id)), 200


@app.route('/horoscope/description', methods=['GET'])
def get_horoscope_description():
    """
    Define route updating for a specific task , i.e. "/task?date=2021-04-23".
    The body will contain all the updated information.
    :return: success message with the new _id, otherwise error message with status code
    """
    return jsonify(task_database.horoscope_description()), 200


@app.route('/horoscope/luckyNumber', methods=['GET'])
def get_horoscope_lucky_number():
    """
    Get the lucky number of today.
    :return: The lucky number.
    """
    return jsonify(task_database.horoscope_lucky_number()), 200


if __name__ == '__main__':
    app.run()
