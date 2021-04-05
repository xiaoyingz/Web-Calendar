import requests
import json
import daily_summary_database, daily_summary_schema, summary_query_parser
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


NOT_FOUND_MESSAGE = 'No such {} found.'
INVALID_REQUEST = 'Please specify {}.'
INVALID_ATTRIBUTE = 'Invalid attribute: {}'
UPDATE_SUCCESS = 'Summary with date {} has been updated.'
UPDATE_ERROR = 'Summary with date {} cannot be updated.'
UPLOAD_SUCCESS = 'Summary with date {} has been created.'
UPLOAD_ERROR = 'Summary with date {} cannot be created.'
DELETE_SUCCESS = 'Summary with date {} has been deleted.'
INVALID_FORMAT = 'Invalid format of {}.'


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
            return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result), 200
    return jsonify(INVALID_REQUEST.format('summary id')), 400


@app.route(rule='/summary/mood', methods=['GET'])
def get_summary_by_mood():
    """
    Define route searching for summary by mood, i.e. "/summary/mood?mood={mood to find}"
    :return: data if id exists, otherwise error message with status code
    """
    summary_mood = request.args.get('mood', None)
    if summary_mood:
        find_result = daily_summary_database.find_summary_by_mood(mood=summary_mood)
        if len(find_result) == 0:
            return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result), 200
    return jsonify(INVALID_REQUEST.format('mood')), 400


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
                return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
            return jsonify(result), 200
        return jsonify(result), 400
    return jsonify(INVALID_REQUEST.format('query')), 400


@app.route(rule='/summary', methods=['PUT'])
def put_summary_by_id():
    curr_id = request.args.get('id', None)
    if curr_id:
        new_data = request.json
        items = list(new_data.items())
        for item in items:
            key, val = item
            if key not in daily_summary_schema.summary_attr:
                return jsonify(INVALID_ATTRIBUTE.format(key)), 400
        update_result = daily_summary_database.update_summary_by_id(curr_id, new_data)
        if update_result == 0:
            return jsonify(UPDATE_SUCCESS.format(curr_id)), 201
        elif update_result == 1:
            return jsonify(NOT_FOUND_MESSAGE.format('summary'))
        elif update_result == 2:
            return jsonify('Update_one encountered errors.'), 400
        else:
            return jsonify(UPDATE_ERROR.format(curr_id)), 400
    return jsonify(INVALID_REQUEST.format('id')), 400


@app.route(rule='/summary', methods=['POST'])
def post_single_summary():
    new_summary = request.json
    curr_id = new_summary.get('_id', None)
    if curr_id:
        post_result = daily_summary_database.upload_single_summary(new_summary)
        if post_result == 0:
            return jsonify(UPLOAD_SUCCESS.format(curr_id)), 201
        elif post_result == 1:
            return jsonify(UPDATE_SUCCESS.format(curr_id)), 201
        elif post_result == 2:
            return jsonify(UPLOAD_ERROR.format(curr_id)), 400
        elif post_result == 3:
            return jsonify(INVALID_FORMAT.format('_id')), 400
    return jsonify(INVALID_REQUEST.format('_id')), 400


@app.route(rule='/summary', methods=['DELETE'])
def delete_summary_by_id():
    curr_id = request.args.get('id', None)
    if curr_id:
        deleted_count = daily_summary_database.delete_by_id(curr_id)
        if deleted_count == 1:
            return jsonify(DELETE_SUCCESS.format(curr_id)), 200
        return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
    return jsonify(INVALID_REQUEST.format('id')), 400


if __name__ == '__main__':
    app.run()