summary_attr = ['_id',
                'content',
                'mood',
                'year',
                'month',
                'day']

summary_schema = [
    ('collMod', 'summary'),
    ('validator', {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': summary_attr,
            'properties': {
                'year': {
                    'bsonType': 'int'
                },
                'month': {
                    'bsonType': 'int',
                    'minimum': 1,
                    'maximum': 12
                },
                'day': {
                    'bsonType': 'int',
                    'minimum': 1
                }
            }
        }
    })
]