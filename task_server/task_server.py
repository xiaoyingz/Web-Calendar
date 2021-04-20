from flask import Flask, request, jsonify
import task_database

NOT_FOUND_MESSAGE = 'No such {} found.'
INVALID_REQUEST = 'Please specify {}.'
UPLOAD_ERROR = 'Task with id {} cannot be created.'
UPLOAD_SUCCESS = 'Task with id {} has been created.'
DELETE_SUCCESS = 'Task with date {} has been deleted.'
UPDATE_ERROR = 'Task with date {} cannot be updated.'
UPDATE_SUCCESS = 'Task with date {} has been updated.'

app = Flask(__name__)
app.secret_key = "Secret Key"


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
    Define route searching for task by date, i.e. "/task?date=2021-03-15&delay=1" or 
    "/task?date=2021-03-15", the delay arguement is for the delay functionality on week 4.
    :return: data if id exists, otherwise error message with status code
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
    Define route searching for task by date, i.e. "/task?date=2021-03-15&delay=1" or 
    "/task?date=2021-03-15", the delay arguement is for the delay functionality on week 4.
    :return: data if id exists, otherwise error message with status code
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


@app.route('/task', methods=['POST'])
def post_single_task():
    """
    Define route posting for a new task, the body will contain all the information
    about the new data.
    :return: success message with the new _id, otherwise error message with status code
    """
    new_task = request.json
    curr_id = new_task['_id']

    post_result = task_database.create_task(new_task)
    if post_result:
        return jsonify(UPLOAD_ERROR.format(curr_id)), 400
    return jsonify(UPLOAD_SUCCESS.format(curr_id)), 200


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
        for attr in new_data:
            try:
                task_database.update_task_by_id(curr_id, attr, new_data[attr])
            except:
                return jsonify(UPDATE_ERROR.format(curr_id)), 400
    return jsonify(UPDATE_SUCCESS.format(curr_id)), 200


if __name__ == '__main__':
    app.run(debug=True)
