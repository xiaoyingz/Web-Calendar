# Manual Test Plan

## Version 1.1

This manual test plan extends the web server for daily task for Qirui Lu and Xiaoying Zhu's final project, with the help of Postman to simulate user requests.

## Prerequisite

1. macOS 10.15.7 (19H2) is the recommending operating system
2. Python 3.8 with `pymongo`, `request`, `re`, `flask` should be installed for the server.
3. Postman 7.36.5 is required.
4. React App with `react-dropdown`, `react-datepicker`, `date-fns` are required.

## Environment Setup and configurations

Please download the source file and run task_server.py with command `python3 task_server.py` to start the server. Then use Postman with `http://localhost:5000/` to manually test different APIs.

## Test for the task server

This is a screenshot of a glimps of the database.
![db1](screen_shots/db1.png "db1")

We will display the moderations of our databse after calling different APIs.

For the `GET` request, The API will get all the matched data with the desired date. Moreover, if the user wants to delay the unfinished tasks and put them off to the next day, the API will only get data with delay equals to 1.

If the request in Postman is: `http://localhost:5000/task?date=2021-03-15`, then we want to get all the tasks on 2021.03.05. The Postman will return:

![get1](screen_shots/get1.png "get1")

The database contains two tasks. We notice that the delay value for the first task is 1, and the second one is 0. Therefore, if we want to specify delay equals to 1 and make another request: `http://localhost:5000/task?date=2021-03-15&delay=1`, the Postman will return:

![get2](screen_shots/get2.png "get2")

It will only get the tasks from the desired date which has delay value 1.

If there is no data in the databse, the Postman will return `No such task found.`, with status code 404:

![get3](screen_shots/get3.png "get3")

If the request is invalid, say the attribute does not exist: `http://localhost:5000/task?name=2021-03-11`. The Postman will return `Please specify task.` with status code 400.

![get4](screen_shots/get4.png "get4")

For the `POST` request, the API will add a new document into the database.
![post1](screen_shots/post1.png "post1")

All the required information will be passed in the body, once the post request is success, the Postman will return a message with the new task id `Task with id 6 has been created`. If we look back to the database, we will find the new data:

![post2](screen_shots/post2.png "post2")

If we want to insert the same data again, it will occur an error due to the id duplication. The Postman will return `"Task with id 6 cannot be created."`:

![post3](screen_shots/post3.png "post3")

The message will show up if the new task has not been created.

For the `PUT` request, the API can update any valid attribute. Say we want to update the description for task id 6. We send the reuqest `http://localhost:5000/task?id=6` with the new description.

![put1](screen_shots/put1.png "put1")

If success, it will show the message with the id `"Task with date 6 has been updated."` The database will be updated to:

![put2](screen_shots/put2.png "put2")

The put API also support update multiple attributes at the same time.

![put3](screen_shots/put3.png "put3")

In the database:

![put4](screen_shots/put4.png "put4")

For the `DELETE` request, the API will delete a task according to the id. If we want to delete task 6, the reqest will be `/task?id=6`, and the Postman will show:

![delete1](screen_shots/delete.png "delete1")

If success, the message will show `Task with date 6 has been deleted.`

If the id does not exist, the message will be `No such task found.` with status code 404.

![delete2](screen_shots/delete2.png "delete2")

## Test for Add new task page

The add new task page is under url: `/addTask`. As you can see, the basic format is:

![addtask1](screen_shots/addtask1.png "addtask1")

The page has 4 attributes: date, title description and type.

The date attribute has a default value for the present date. Once the user click the date, it will show a calendar for the user to select the desired date.

![addtask2](screen_shots/addtask2.png "addtask2")

Since normally user will not assign task to the past days. Therefore, we do not allow the user to create new tasks on the past days.

Once the user select a new date, the Date bar will be set to the selected date.

![addtask3](screen_shots/addtask3.png "addtask3")
![addtask4](screen_shots/addtask4.png "addtask4")

The title and description are simple text bars. So the user can input simple text in them.

![addtask5](screen_shots/addtask5.png "addtask5")

Type is a dropdown, which includes 3 different choices: work (default), life and others.

![addtask6](screen_shots/addtask6.png "addtask6")

After the user input all the information, by clicking the submit button, the data will be created in the database.

## Test for WeeklyView page

The weeklyView page is under the url: `/weeklyView`.

The basic layout of the weeklyView page looks like this:

![week1](screen_shots/week1.png "week1")

By default, it includes the current week, and it also highlight the current date with a blue texture. For each day, it will show the user different tasks. On the top of the cells, it shows the current week among the whole year with year-month info. It also contains two buttons for the previous week and the next week.

First, let's test the functionalities of the buttons. By clicking the prev-week button, the page will be changed to:

![week2](screen_shots/week2.png "week2")

Then, if we click on the next-week button twice, the page will become to:

![week3](screen_shots/week3.png "week3")

Now, let's back to the current week.
If the mouse is on one of the date, the background will show the user a nice-looking blue text with the number of that date:

![week4](screen_shots/week4.png "week4")

By clicking a day cell, the page will jump to the daily view page related to that date.

![daily1](screen_shots/daily1.png "daily1")

## Test for MonthlyView page

The weeklyView page is under the url: `/monthlyView`.

The basic layout of the weeklyView page looks like this:

![month1](screen_shots/month1.png "month1")

By default, it includes the current month, and it also highlight the current date with a blue texture. For each day, it will show the user the number of different tasks and the mood of that day. On the top of the cells, it shows the whole year-month info. It also contains two buttons for the previous week and the next week.

Notice that the text for days which do not belong to the desired month is faded and unselected.

First, let's test the functionalities of the buttons. By clicking the prev-month button, the page will be changed to:

![month2](screen_shots/month2.png "month2")

Then, if we click on the next-month button twice, the page will become to:

![month3](screen_shots/month3.png "month3")

Now, let's back to the current month.
If the mouse is on one of the date, the background will show the user a nice-looking blue text with the number of that date:

![month4](screen_shots/month4.png "month4")

By clicking a day cell, the page will jump to the daily view page related to that date.

![daily1](screen_shots/daily1.png "daily1")
