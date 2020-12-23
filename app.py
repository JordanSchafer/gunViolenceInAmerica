from flask import Flask, jsonify, Response,render_template
from flask_cors import CORS, cross_origin

import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func


app = Flask(__name__)
CORS(app, support_credentials=True)

database=os.environ.get("DATABASE_URL",'')

#create engine 
engine = create_engine(f'{database}')
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
