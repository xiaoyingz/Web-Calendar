Web Calendar
===============

Project-xz45-1.1
---------------

Static frontend for daily overview, editing task, and editing summary\
Basic navigation between pages\
Added time filter operators in query parser\
Added manual test plan for static frontend

Compile static frontend:
--------
```bash
cd frontend/web-calendar/
npm start
```

User Guide for summary's query operators
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