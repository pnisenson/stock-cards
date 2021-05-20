
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import json

engine = create_engine('sqlite:///Pickles.sqlite', echo=True)

# Reflect the Database using automap base
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()

# Assign the dow class to a variable called `Dow`
UseTable = Base.classes.pickles

# Create a session
session = Session(engine)

first_row = session.query(UseTable.cards).first()
# get_it = session.query()
# print(get_it[0])

# print(first_row[0])
#first_row[0] is our list of dictinoaries in string form
dictionize = json.loads(first_row[0])
print(dictionize)
print(dictionize[0])
print(dictionize[0]['tick'])
print(dictionize[0]['tick'])