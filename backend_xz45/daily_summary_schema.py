summary_attr = ['_id',
                'content',
                'mood']
summary_schema = [
    ('collMod', 'summary'),
    ('validator', {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': summary_attr,
            'properties': {
                '_id': {
                    'bsonType': 'Date'
                }
            }
        }
    })
]