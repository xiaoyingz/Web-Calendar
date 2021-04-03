summary_attr = ['_id',
                'date',
                'content',
                'mood']
summary_schema = [
    ('collMod', 'summary'),
    ('validator', {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': summary_attr,
            'properties': {
                'date': {
                    'bsonType': 'Date'
                }
            }
        }
    })
]