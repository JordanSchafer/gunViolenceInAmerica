from flask import Flask, jsonify, Response,render_template
from flask_cors import CORS, cross_origin

import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func


app = Flask(__name__)
CORS(app, support_credentials=True)

#create engine 
engine = create_engine(f'postgres://tufccuajymkqad:7184d008508f162241f7f5e0168baefa61fbaf72bf4a78f9c5f5e645f127f901@ec2-54-159-107-189.compute-1.amazonaws.com:5432/d4rnujgekjttnl')
#print(engine.table_names())
#Reflect database into ORM class
Base = automap_base()
Base.prepare(engine, reflect=True)
Stats=Base.classes.state_stats

session = Session(engine)

#create routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/per_mil")
def per_mil():
    return render_template("per_mil.html")



@app.route("/data.json")
def data():
    stmt=session.query(Stats).statement
    df=pd.read_sql_query(stmt,session.bind)
    return Response(df.to_json(orient="records"), mimetype='application/json')

@app.route("/table")
def table():
    return render_template("table.html")

if __name__ == "__main__":
    app.run(debug=True)
