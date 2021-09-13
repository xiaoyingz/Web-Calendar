Web_calendar
====================
Project Purpose
-----------------

The project provides a user-friendly interface that allows the user to schedule daily tasks. Users can mark up whether they finish the tasks or not. Moreover, They can also write down their feedbacks or summaries at the end of each day. In general, we want to create this project to better plan our life and record life.

Project Motivation
-------------------

Current web calendars like Google Calendar usually have professional UI for monthly overview. We would like to build a new one with extension that focuses more on daily planning, which is more like a diary or planner and give users more options in creating their agenda.

Features
---------------
- Monthly, weekly Overview
- Daily plan editing
- Daily summary
- Data(Task) analysis
- CRUD operations for daily To-do List

Prerequisite and environment
-------------
Python 3.8.5\
React\
React-router-dom\
React-router

Compile
---------------
* Run the server:
```
cd backend_together
Python3 server.py
```
* Render Web Page:
```
cd frontend_together
npm start
```
User guide for summary's query operators
------------
* There will be at most one of bounded, logic, and time filter operators
* : is used to specify attribute, i.e. content: \<query\>
* Substring quoted by "" means 'contains', otherwise exactly match
* 'BETWEEN', 'AFTER', 'BEFORE' are filters for _id attribute, use $ to specify time range. For example:
    ```
    _id: BETWEEN $2010-12-05 $2021-3-15
    _id: AFTER $2020-07-10
    _id: BEFORE $2020-07-03
    ```
* logic operator: AND, OR, NOT. For example:
    ```
    content: NOT abc --find summary whose content doesn't equal to abc
    mood: "a" AND "b" --find summary whose mood contains a and b
    mood: a OR "b" --find summary whose mood equals to a or contains b
    ```
* \< and \> can only be used in query related to integer attributes(year, month, day)
* use escape '\' to prevent operators above to be parsed by parser. For example:
    ```
    content: \NOT --find summary whose content equals to NOT.
    ```
