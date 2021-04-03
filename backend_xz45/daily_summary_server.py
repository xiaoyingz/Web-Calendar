import requests
import json
import daily_summary_database
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

NOT_FOUND_MESSAGE = 'No such {} found.'
INVALID_GET = 'Please specify {}.'

@app.route(rule='/summary', methods=['GET'])
def get_summary_by_id():
    """
    Define route searching for summary by id, i.e. "/summary?id={id to find}"
    :return: data if id exists, otherwise error message with status code
    """
    summary_id = request.args.get('id', None)
    if summary_id:
        find_result = daily_summary_database.find_summary_by_id(summary_id)
        if len(find_result) == 0:
            return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result), 200
    return jsonify(INVALID_GET.format('summary id')), 400


@app.route(rule='/summary', methods=['GET'])
def get_summary_by_mood():
    """
    Define route searching for summary by mood, i.e. "/summary?mood={mood to find}"
    :return: data if id exists, otherwise error message with status code
    """
    summary_mood = request.args.get('mood', None)
    if summary_mood:
        find_result = daily_summary_database.find_summary_by_id(summary_mood)
        if len(find_result) == 0:
            return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result), 200
    return jsonify(INVALID_GET.format('mood')), 400


@app.route(rule='/summary', methods=['GET'])
def get_summary_by_date():
    """
    Define route searching for summary by date, i.e. "/summary?date={date to find}"
    :return: data if id exists, otherwise error message with status code
    """
    summary_date = request.args.get('date', None)
    if summary_date:
        find_result = daily_summary_database.find_summary_by_date(summary_date)
        if len(find_result) == 0:
            return jsonify(NOT_FOUND_MESSAGE.format('summary')), 400
        return jsonify(find_result), 200
    return jsonify(INVALID_GET.format('date')), 400

