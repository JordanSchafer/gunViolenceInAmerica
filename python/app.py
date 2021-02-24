from flask import Flask, jsonify, Response
from flask_cors import CORS, cross_origin

import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func


app = Flask(__name__)
CORS(app, support_credentials=True)

#create engine 
connection_string = f"postgres:{password}@localhost:5432/GV_DB"
engine = create_engine(f'postgresql://{connection_string}')

#Reflect database into ORM class
Base = automap_base()
Base.prepare(engine, reflect=True)
Test=Base.classes.test_table

session = Session(engine)

@app.route("/")
def index():
    return "Hello"

@app.route("/test.json")
def test():
    stmt=session.query(Test).statement
    df=pd.read_sql_query(stmt,session.bind)
    return Response(df.to_json(orient="records"), mimetype='application/json')

if __name__ == "__main__":
    app.run(debug=True)
