# A Web Diary Calendar

Xiaoying Zhu (xz45) | Moderator: zehua chen (zehuac2)

Qirui Lu (qiruilu2) | Moderator: Amirthavarshini Sureshbabu (as43)

This is a web app about a project for CS242

## Abstract

### Project Purpose

The project provides a user-friendly interface that allows the user to schedule daily tasks. Users can mark up whether they finish the tasks or not. Moreover, They can also write down their feedbacks or summaries at the end of each day. In general, we want to create this project to better plan our life and record life.

### Project Motivation

Current web calendars like Google Calendar usually have professional UI for monthly overview. We would like to build a new one with extension that focuses more on daily planning, which is more like a diary or planner and give users more options in creating their agenda.

## Technical Specification

- Platform: Cross-platform app (React Native or React)
- Programming Languages: JavaScript (Python for Flask should backend required), MongoDB for database
- Stylistic Conventions: Airbnb JavaScript Style Guide, Python Style Guide
- SDK: IDK, Python3.8
- IDE: Visual Studio Code, Pycharm
- Tools/Interfaces: React, D3.js
- Backend: Flask, MongoDB
- Target Audience: Broad-range audience

## Functional Specification

### Features

- Monthly, weekly Overview
- Daily plan editing
- Daily summary
- Data(Task) analysis
- CRUD operations for daily To-do List

### Scope of the project

- Not familiar with React
- POST API may only create 1 task at a time
- Assuming PUT API only allows to update 1 attribute at a time

## Brief Timeline (Z for ZHU, L for LU)

- Week 1:

  1. design MongoDB database schema (Z & L)
  2. set up Flask server with APIs(PUT, GET, POST, DELETE) (Z)
  3. Query parser for querying tasks with the following filters: keywords, created time, task Tag, task status (Z)
  4. Server can display desired messages in Postman (Z & L)
  5. Error handling for backend (Z & L)

- Week 2:

  1. Frontend layer design, with static UI for testing purpose (L)
  2. Implement navigations between pages (L)
  3. Command line Interface for testing Server API (Z & L)
  4. Manual test for UI design (Z & L)

- Week 3:

  1. Design VMC architecture for the project (Z & L)
  2. Bind the frontend and backend, implement controllers for each UI component (L)
  3. Frontend can visualize daily routines in terms of different kinds of tasks. (L)

- Week 4:

  1. Implement functionalities of daily summary in frontend and backend (Z & L)
  2. API for Weather forecast(Z & L)
  3. Polish the UI design to be more user-friendly(Z & L)

## Rubrics

### Week 1

| Category        | Total Score Allocated | Detailed Rubrics                                                                               |
| --------------- | :-------------------: | ---------------------------------------------------------------------------------------------- |
| MongoDB databse |          10           | 0: Didn't implement anything <br> 5: implement proper attributes <br> 10: connect the database |
| Flask backend   |          10           | 0: Didn't implement anything <br> +2.5: implement each API(PUT GET POST DELETE)                |
| Query parser    |          10           | 0: Didn't implement anything <br> +2.5: implement each type                                    |
| Manual Test     |          10           | 0: Didn't implement tests <br> +2: per test                                                    |
| Error handling  |          10           | 0: No error handler <br> 6: partial-correctly use status codes<br> 10: proper error handling   |

### Week 2

| Category        | Total Score Allocated | Detailed Rubrics                                                                                               |
| --------------- | :-------------------: | -------------------------------------------------------------------------------------------------------------- |
| Monthly page    |          10           | 0: Didn't implement anything <br> 6: include main components <br> 10: properly organized with complete layouts |
| Weekly page     |          10           | 0: Didn't implement anything <br> 6: include main components <br> 10: properly organized with complete layouts |
| Daily page      |          10           | 0: Didn't implement anything <br> 6: include main components <br> 10: properly organized with complete layouts |
| Page navigation |          10           | 0: Didn't implement anything <br> 5: Navigation for Monthly & Weekly<br> 3: Navigation for Daily               |
| Test UI         |          10           | 0: Didn't implement tests <br> +2: per test                                                                    |

### Week 3

| Category         | Total Score Allocated | Detailed Rubrics                                                                                               |
| ---------------- | :-------------------: | -------------------------------------------------------------------------------------------------------------- |
| VMC architecture |          10           | 0: Didn't implement anything <br> 10: complete architecture                                                    |
| Visualization    |          10           | 0: Didn't implement anything <br> 6: successfully collect data of tasks <br> 10: elegant visualization display |
| Manual test      |          10           | 0: Didn't implement tests <br> +2: per test                                                                    |

### Week 4

| Category      | Total Score Allocated | Detailed Rubrics                                                                               |
| ------------- | :-------------------: | ---------------------------------------------------------------------------------------------- |
| Daily summary |          10           | 0: Didn't implement anything <br> 5: Only backend or frontend <br> 10: complete implementation |
| Weather API   |          10           | 0: Didn't implement anything <br> 5: valid request <br> 10: complete implementation            |
| Manual test   |          10           | 0: Didn't implement tests <br> +2: per test                                                    |
| Polish UI     |          10           | 5: Didn't polish <br> 10: user-friendly design                                                 |
