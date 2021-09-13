task_attr = [
    '_id',
    'date',
    'year',
    'month',
    'day',
    'title',
    'description',
    'type',
    'finish',
    'delay'
]

task_schema = [
    ('collMod', 'task'),
    ('validator', {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': task_attr,
            'properties': {
                '_id': {
                    'bsonType': 'int',
                    'description': 'the unique id for the task'
                },

                'date': {
                    'bsonType': 'date',
                    'description': "task date such as '3/13/2019' "
                },

                'title': {
                    'bsonType': 'string'
                },

                'description': {
                    'bsonType': 'string'
                },

                'type': {
                    'enum': ["life", "work", "other"],
                    'description': "can only be one of the enum values and is required"
                },

                'finish': {
                    'bsonType': 'int',
                    "minimum": 0,
                    "maximum": 1,
                    'description': 'whether the task has been finished'
                },

                'delay': {
                    'bsonType': 'int',
                    "minimum": 0,
                    "maximum": 1,
                    'description': 'whether the task needs to be delay'
                },

                'year': {
                    'bsonType': 'int',
                },

                'month': {
                    'bsonType': 'int',
                    "minimum": 1,
                    "maximum": 12,
                },

                'day': {
                    'bsonType': 'int',
                    "minimum": 1,
                    "maximum": 31,
                }
            }
        }
    })
]
