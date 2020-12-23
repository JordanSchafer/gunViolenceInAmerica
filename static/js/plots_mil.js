d3.json('https://gvinusa.herokuapp.com/data.json',(error,data) =>{
  //set arrays to hold data
  //console.log(data);
  data_2014=[];
  data_2015=[];
  data_2016=[];
  data_2017=[];

  //parse through data
  data.forEach((d)=>{
    if(d.year===2014){
      data_2014.push(d);
    }
    else if(d.year===2015){
      data_2015.push(d);
    }
    else if(d.year===2016){
      data_2016.push(d);
    }
    else if(d.year===2017){
      data_2017.push(d);
    }
  });

  //Initilize Chart
  buildChart(data_2014);

  //TileLayer for choropleth map
  var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  //create choropleth layers
  var layer_2014_death=buildLayer(data_2014,"n_killed_per_mil");
  var layer_2015_death=buildLayer(data_2015,"n_killed_per_mil");
  var layer_2016_death=buildLayer(data_2016,"n_killed_per_mil");
  var layer_2017_death=buildLayer(data_2017,"n_killed_per_mil");

  var layer_2014_injured=buildLayer(data_2014,"n_injured_per_mil");
  var layer_2015_injured=buildLayer(data_2015,"n_injured_per_mil");
  var layer_2016_injured=buildLayer(data_2016,"n_injured_per_mil");
  var layer_2017_injured=buildLayer(data_2017,"n_injured_per_mil");
  
  //Initilize Map
  var map = L.map("myMap", {
    center: [
      40.7, -94.5
    ],
    zoom: 4,
    layers: [graymap,layer_2014_death]
  });

  //set layers to toggle between
  var baseMaps = {
    "2014 Deaths(per million)": layer_2014_death,
    "2015 Deaths(per million)": layer_2015_death,
    "2016 Deaths(per million)":layer_2016_death,
    "2017 Deaths(per million)":layer_2017_death,
    "2014 Injured(per million)": layer_2014_injured,
    "2015 Injured(per million)": layer_2015_injured,
    "2016 Injured(per million)":layer_2016_injured,
    "2017 Injured(per million)":layer_2017_injured
};

//Create layer controller
L.control.layers(baseMaps, null).addTo(map);


  // Here we create a legend control object.
  var legend_killed = L.control({
    position: "bottomright"
    }); 

  legend_killed.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 5, 10, 20, 35, 50, 80, 100];
    

    // Loop through our intervals and generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: "
        + getColor(grades[i])
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // We add our legend to the map.
  legend_killed.addTo(map);


  //Set up listener for to change the chart
  d3.select("#year").on("change",()=>{
    var value=d3.select("#year").property("value");
    if(value==2014){
      updateChart(data_2014);
    }
    else if(value==2015){
      updateChart(data_2015);
    }
    else if(value==2016){
      updateChart(data_2016);
    }
    else if(value==2017){
      updateChart(data_2017);
    }
  });

});

    
//function to init chart
function buildChart(data){

var ctx = document.getElementById('myChart').getContext('2d');
this.myChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: data.map((obj)=>{return obj.state}),
        datasets: [
          {
            label: 'Gun deaths',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: data.map((obj)=>{return obj.n_killed_per_mil})
          },
          {
            label: 'Gun injuries',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data:  data.map((obj)=>{return obj.n_injured_per_mil})
          }
        ]
    },

    // Configuration options go here
    options: {}
});
}

//function to destroy current chart and replace it
function updateChart(data){
  this.myChart.destroy();
  var ctx = document.getElementById('myChart').getContext('2d');
  this.myChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: data.map((obj)=>{return obj.state}),
        datasets: [
          {
            label: 'Gun deaths',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: data.map((obj)=>{return obj.n_killed_per_mil})
          },
          {
            label: 'Gun injuries',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data:  data.map((obj)=>{return obj.n_injured_per_mil})
          }
        ]
    },

    // Configuration options go here
    options: {}
});
}

//function to build choropleth layer
function buildLayer(data,key){
  var states=[];
  var values=[];
 
  data.forEach((d)=>{
      states.push(d.state);
      values.push(+d[key]);
  })
  tempStatesData=statesData;
  for (d in tempStatesData.features){
    tempStatesData.features[d].properties[key]=values[d];
    console.log(tempStatesData.features[d].properties);
  }
  if(key=="n_killed_per_mil"){
    var choro_layer=L.geoJson(tempStatesData,
      {
        style:style_killed,
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "Name: "
              + feature.properties.name
              + "<br>Killed: "
              + feature.properties[key]
          );
        }
      });
  }
  if(key=="n_injured_per_mil"){
    var choro_layer=L.geoJson(tempStatesData,
      {
        style:style_injuired,
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "Name: "
              + feature.properties.name
              + "<br>Injured: "
              + feature.properties[key]
          );
        }
      });
  }
  return choro_layer;

}

//set color for the choropleth feature layer
function getColor(d) {
  return d > 100 ? '#800026' :
         d > 80  ? '#BD0026' :
         d > 50  ? '#E31A1C' :
         d > 35  ? '#FC4E2A' :
         d > 20   ? '#FD8D3C' :
         d > 10   ? '#FEB24C' :
         d > 5  ? '#FED976' :
                    '#FFEDA0';
}

//set style for the killed per million key 
function style_killed(feature) {

  return {
      fillColor: getColor(feature.properties.n_killed_per_mil),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}


//set style for the injured per million key 
function style_injuired(feature) {

  return {
      fillColor: getColor(feature.properties.n_injured_per_mil),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}