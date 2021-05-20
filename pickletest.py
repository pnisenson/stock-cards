# Imports the method used for connecting to DBs
from sqlalchemy import create_engine
# Imports the methods needed to abstract classes into tables
from sqlalchemy.ext.declarative import declarative_base
# Allow us to declare column types
from sqlalchemy import Column, Integer, String, Float
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
# Sets an object to utilize the default declarative base in SQL Alchemy
Base = declarative_base()

# Creates Classes which will serve as the anchor points for our Tables
class UserTest(Base):
    __tablename__ = 'pickles'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255))
    password = Column(String(255))
    cards = Column(JSONEncodedDict())

sample_cards = [{'id':0,'tick': "GE", "price":20.00},{'id':1,'tick': "IBM", "price":10.47}]
tester = UserTest(name= 'paul', email='paul@gmail.com', password="trytry", cards=sample_cards)

engine = create_engine('sqlite:///Pickles.sqlite', echo=True)
conn = engine.connect()
Base.metadata.create_all(engine)

# Session is a temporary binding to our DB
from sqlalchemy.orm import Session
session = Session(bind=engine)

session.add(tester)
session.commit()

