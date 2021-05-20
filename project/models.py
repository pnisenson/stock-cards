from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    card_one_tick = db.Column(db.String(20))
    card_two_tick = db.Column(db.String(20))
    card_three_tick = db.Column(db.String(20))
    card_four_tick = db.Column(db.String(20))
    card_five_tick = db.Column(db.String(20))
    card_one_price = db.Column(db.Numeric)
    card_two_price = db.Column(db.Numeric)
    card_three_price = db.Column(db.Numeric)
    card_four_price = db.Column(db.Numeric)
    card_five_price = db.Column(db.Numeric)
    card_one_date = db.Column(db.String(20))
    card_two_date = db.Column(db.String(20))
    card_three_date = db.Column(db.String(20))
    card_four_date = db.Column(db.String(20))
    card_five_date = db.Column(db.String(20))
