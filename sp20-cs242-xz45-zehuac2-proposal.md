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

### UI Sketch
Montyly Overview

![image info](pictures/monthly.png)

Weekly Overview

![image info](pictures/weekly.png)

Daily Overview

![image info](pictures/daily.png)

New Task

![image info](pictures/add.png)

Edit Task

![image info](pictures/edit.png)

### Scope of the project

- This project currently might be only deployed on localhost
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
  2. Bind the frontend and backend, implement controllers for each UI component (Z & L)
  3. Frontend can visualize daily routines in terms of different kinds of tasks. (L)

- Week 4:

  1. Implement functionalities of daily summary in frontend and backend (Z & L)
  2. API for Weather forecast(Z & L)
  3. Polish the UI design to be more user-friendly(Z & L)

## Detailed division of labor by week

| Week               | Qirui Lu                            | Xiaoying Zhu                        |
| :----------: | :---------------------------- | :---------------------------- |
| Week 1|- Design schema for to-do and daily summary <br> - List required APIs for backend based on primary functionality of frontend design <br> - Check error messages of backend and use of status codes <br> - test APIs using Postman|- Design schema for to-do and daily summary <br> - impelement desired API routes <br> - write exception classes and handle them in server <br> - test APIs using Postman <br> - Unit tests for query parser|
| Week 2|- Static frontend UI <br> - Navigation bar and buttons for navigation between pages <br> - Manual test plan for UI design |- Command-line interface for thoroughly testing server API (simulate frondend request) <br> - Manual test plan for UI design|
| Week 3|- Design VMC architecture for the project <br> - Responsive UI(search/add task) <br> - Data visualization|- Design VMC architecture for the project <br> - Responsive UI(edit/delete task)|
| Week 4|- functionality of daily summary(frontend) <br> - API for Weather forecast <br> - Polish the UI design to be more user-friendly(mainly focus on pages related to add/search task)|- functionality of daily summary(backend) <br> - API for Weather forecast <br> - Polish the UI design to be more user-friendly(mainly focus on pages related to add/search task)|

## Rubrics

### Week 1
[Week 1 calculator](https://drive.google.com/file/d/1CshEsQGbAE0xHlaYOFb_QOuW7hO4pyVo/view?usp=sharing)

| Category        | Total Score Allocated | Detailed Rubrics                                                                               |
| --------------- | :-------------------: | ---------------------------------------------------------------------------------------------- |
| MongoDB databse |          3            | 0: Didn't implement anything <br> +1: implement proper attributes <br> +1: connect the database <br> +1: use environment variables for security |
| Flask backend   |          5            | 0: Didn't implement anything <br> +1.25: implement each API(PUT GET POST DELETE)               |
| Query parser    |          5            | 0: Didn't implement anything <br> +1.25: implement each type                                   |
| Error handling  |          2            | 0: No error handling <br> +1: correct use of status code <br> +1: properly reporting errors    |
| Manual test plan|          5            | 0: No manual test plan <br> +1: per test                                                       |
| Unit Test       |          5            | 0: No unit test <br> +1: per unit test                                                     |

### Week 2
[Week 2 calculator](https://drive.google.com/file/d/1YmRSdg5GNLXsE7QtrUlCxKqSIpJG56g6/view?usp=sharing)

| Category        | Total Score Allocated | Detailed Rubrics                                                                                               |
| --------------- | :-------------------: | -------------------------------------------------------------------------------------------------------------- |
| Overview page design|         3        | 0: Didn't implement anything <br> +1.5: be able to render monthly overview <br> +1.5: be able to render weekly overview |
| Page navigation |          2           | responsive navigation bar and buttons for navigating                                                            |
| Daily page      |          5           | 0: Didn't implement anything <br> +1.25: component for adding new task <br> +1.25: component for editing task <br> +1.25: component for deleting task <br> +1.25: component for searching|
| CLI             |          5            | 0: Didn't implement tests <br> +1.25: per command line related to each API (PUT, POST, GET, DELETE)|
| Manual test plan for CLI|          5           | 0: No manual test plan <br> +1: per test                                                                      |
| Manual test plan for static UI|          5           | 0: No manual test plan <br> +1: per test |

### Week 3
[Week 3 calculator](https://drive.google.com/file/d/1zrTETjDaKIPKvX0BeipJML5wxLMkWWj6/view?usp=sharing)

| Category         | Total Score Allocated | Detailed Rubrics                                                                                               |
| ---------------- | :-------------------: | -------------------------------------------------------------------------------------------------------------- |
| Making requests |          5           | +1: be able to search task by keyword <br> +1: be able to delete a certain task <br> +1.5 be able to update a certain task <br> +1.5: be able to create a new task|
| Rendering result    |          5           | +2.5: Rendering result of get request <br> +2.5: rendering error/success messages for all requests|
| Data visualization    |          5           | +2.5: Display monthly top tags <br> +2.5: Display weekly top tags|
| Manual test plan |          5            | 0: No manual test plan <br> +1: per test                                                                    |
| Unit test|          5           | 0: No unit test <br> +1: per test                                                    |

### Week 4
[Week 4 calculator](https://drive.google.com/file/d/1JZcPs00KbhCpV7-8D5UAcQBealD2sk99/view?usp=sharing)

| Category      | Total Score Allocated | Detailed Rubrics                                                                               |
| ------------- | :-------------------: | ---------------------------------------------------------------------------------------------- |
| Additionaly functionality(i.e. daily summary) backend|          5           | 0: Didn't implement anything <br> +1.25: implement each API(PUT GET POST DELETE)|
| Additionaly functionality(i.e. daily summary) frontend|          5           | +2.5: be able to make requests <br> +2.5: be able to render result/messages|
| Weather API   |           5           | +2: successfully make API request <br> +2: properly render result <br> +1: hide |
| Manual test plan|          5           | 0: No manual test plan <br> +1: per test                                                   |
| Unit test|          5           | 0: No unit test <br> +1: per test                                                    |
