Web_calendar
====================
project-xz45-1.2
------------------
* Integrated qiruilu2's and xz45's frontend from 1.1
* Responsive daily overview page
* Responsive page for adding a task
* Responsive page for editing a task
* Responsive page for editing summary

Prerequisite and environment
-------------
Python 3.8.5\
React\
React-router-dom\
React-router

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
