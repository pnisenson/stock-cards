from flask_login import UserMixin
from . import db
from sqlalchemy.types import TypeDecorator, VARCHAR
import json


class JSONEncodedDict(TypeDecorator):
    """Represents an immutable structure as a json-encoded string.
    Usage::
        JSONEncodedDict(255)
    """
    impl = VARCHAR
    cache_ok = True
    def process_bind_param(self, value, dialect):
        if value is not None:
            value = json.dumps(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = json.loads(value)
        return value

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    cards = db.Column(JSONEncodedDict())
    # card_one_tick = db.Column(db.String(20))
    # card_two_tick = db.Column(db.String(20))
    # card_three_tick = db.Column(db.String(20))
    # card_four_tick = db.Column(db.String(20))
    # card_five_tick = db.Column(db.String(20))
    # card_one_price = db.Column(db.Numeric)
    # card_two_price = db.Column(db.Numeric)
    # card_three_price = db.Column(db.Numeric)
    # card_four_price = db.Column(db.Numeric)
    # card_five_price = db.Column(db.Numeric)
    # card_one_date = db.Column(db.String(20))
    # card_two_date = db.Column(db.String(20))
    # card_three_date = db.Column(db.String(20))
    # card_four_date = db.Column(db.String(20))
    # card_five_date = db.Column(db.String(20))
