Manual Test Plan
============
Prerequisite and environment setup
---------------
Python 3.8.5\
React\
React-router-dom\
React-router

Run backend
----------
```bash
cd backend_together/
npm start
```

Run frontend
----------
```bash
cd web-calendar/
npm start
```

Test 1: HOME page
-----
Start the frontend.\
Desired output:\
Today's overview will show up

![image info](pictures/home.png)

Test 2: Add summary 
----------
Find a daily view without daily summary created, click on New and add summary.\
For example:

![image info](pictures/to_add_summary.png)

Desired output:

![image info](pictures/summary_added.png)

Test 3: Update summary
----------
Find a daily view with daily summary created, click on edit to update summary.\
For example:

![image info](pictures/to_update_summary.png)

Desired output:

![image info](pictures/summary_updated.png)

Test 4: Edit task
----------------
On a daily view page, select a task and click edit to update task.\
For example:

![image info](pictures/to_update_task.png)

Desired output:

![image info](pictures/task_updated.png)

Test 5: Delete task
----------------
On a daily view page, select a task and click delete to delete task.\
For example:

![image info](pictures/task_to_delete.png)

Desired output:

![image info](pictures/task_deleted.png)