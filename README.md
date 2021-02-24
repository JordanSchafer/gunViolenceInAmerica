# Gun Violence In America

The goal of this project was to preform ETL process on a data set, find insightful trends, create a flask application that can return a json file, using the json file create a webpage utilizing html, css, and javascript.

## Datasets

[Gun violence data](https://www.kaggle.com/jameslko/gun-violence-data) from kaggle

[US State Population estimates](https://www.census.gov/data/tables/time-series/demo/popest/2010s-state-total.html) from the US Census

[State geojson data](https://leafletjs.com/examples/choropleth/) from leafletjs

## Extract Transform Load

Extracted data from csv files into jupyter notebook using pandas. The initial dataset for gun violence was a collection of more than 260k gun violence incidents, with detailed information about each incident from 2013 to 2018. There was incomplete data for 2013 and 2018 so only 2014 to 2017 was used. Due to time limitation, it was decided to just focus on the state level and so the total amount of deaths and injuries by state and year was found. The different populations in the states needed to be accounted for, so the deaths and injuieries per million residents were calculated. The index, state, year, deaths, injuires, and death and injuries per million were then loaded into a table called State_stats in postgres using SQLAlchemy.

## Flask and JSON

A simple flask app was created to call the local database and retrieve the data. This was done by using SQLAlchemy and Pandas. SQLAlchemy will connect to the database, check to see what tables exists in the database, and then creates a class for that table. Once the class is created, SQLAlchemy can then send a statement, in this case "SELECT * FROM State_stats", the results can be loaded into a Panda's datafrom and then using Panda's to_json function returned to user in a json format.

## Webpages and Deployment

Now that a json file was availble, the work shifted to creating a front end display. Since the data is about states a choropleth was a good starting point. Mapbox provides free api to get maps and using leaflet layers can be added to the map. So a layer for each year for both deaths and injuries was created. Using charts.js a bar graph was also made to allow easier comparisons between states. The same was repeated on a seaperate page for deaths and injuries per million. Finally, using datatables.js, a searchable datatable was made to display the data.

When deploying to Heroku, the data was moved from a local database to the Heroku database provided. Edits to the flask app were made to connect to the Heroku database instead of the local and after some quick testing and tweeks to files a stable depolyment was succeful.
[Heroku Deployment](https://gvinusa.herokuapp.com/)
