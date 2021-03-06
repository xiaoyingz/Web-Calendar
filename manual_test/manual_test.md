# Manual Test Plan

## Version 1.2

This manual test plan extends the web server for daily task for Qirui Lu and Xiaoying Zhu's final project, with the help of Postman to simulate user requests. It also extends the frontend which combines both of Xiaoying and Qirui's parts.

## Prerequisite

1. macOS 10.15.7 (19H2) is the recommending operating system
2. Python 3.8 with `pymongo`, `request`, `re`, `flask` should be installed for the server.
3. Postman 7.36.5 is required.
4. React App is required.

## Environment Setup and configurations

Please download the source file and run task_server.py with command `python3 task_server.py` to start the server. Then use Postman with `http://localhost:5000/` to manually test different APIs. For frontend, please run `npm start` to visist the website.

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

## Test for the frontend

By combining the frontend with Xiaoying, the home page looks like this:

![dailyView1](screen_shots/combine-01.png "dailyView1")

The home page is a daily view page for the present day. It shows the date, the tasks and the daily summary.

If we click on the task it will show the details in the right side.

![dailyView2](screen_shots/combine-02.png "dailyView2")

The `edit` button on the right side will redirect to the task editing page:

![dailyView3](screen_shots/combine-03.png "dailyView3")

The type attribute has a dropdown, which looks like this:

![dailyView4](screen_shots/combine-04.png "dailyView4")

Since the backend still needs to be combined, we will leave it to the next week.

Now, Let's back to the Home page.

![dailyView1](screen_shots/combine-01.png "dailyView1")

The color of the text for tasks has two different kinds. If the task has been finished, it will in gray, otherwise it will be black.

![dailyView5](screen_shots/combine-05.png "dailyView5")

By clicking on the `edit` button at the bottom, it will redirect to the summary editing page.

![dailyView6](screen_shots/combine-06.png "dailyView6")

If we change the mood, the image will also change.

![dailyView7](screen_shots/combine-07.png "dailyView7")

Now, Let's take a look at the weekly overview. The default weekly page will display the present week.

![weeklyView1](screen_shots/combine-08.png "weeklyView1")

It will display the task title for each day. By clicking on the prev/next week button, the tasks and week will also change.

![weeklyView2](screen_shots/combine-09.png "weeklyView2")

If we click on a specific day, it will redirect to its daily view page as well.

![weeklyView3](screen_shots/combine-10.png "weeklyView3")

![weeklyView4](screen_shots/combine-11.png "weeklyView4")

Finally, Let's do some test for the monthly oveerview page.

![monthlyView1](screen_shots/combine-12.png "monthlyView1")

For each day, it will shows the number of tasks to be done. The mood data will be added once the backend has been combined. Besides, the user can also go to the daily view of a specific day by clicking the day.

![monthlyView2](screen_shots/combine-13.png "monthlyView2")

![monthlyView3](screen_shots/combine-11.png "monthlyView3")
