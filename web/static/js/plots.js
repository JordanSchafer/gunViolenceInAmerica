function getColor(d) {
  return d > 105 ? '#800026' :
         d > 90  ? '#BD0026' :
         d > 75  ? '#E31A1C' :
         d > 60  ? '#FC4E2A' :
         d > 45   ? '#FD8D3C' :
         d > 30   ? '#FEB24C' :
         d > 15   ? '#FED976' :
                    '#FFEDA0';
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.n_killed),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}


d3.json('http://127.0.0.1:5000/test.json',(error,data) =>{
    console.log(data);
    var states=[];
    var n_killed=[];
    var n_injured=[];

    data.forEach((d)=>{
        states.push(d.state);
        n_killed.push(+d.n_killed);
        n_injured.push(+d.n_injured);
    })

    console.log(states);

    var trace1 = {
          x: states,
          y: n_killed,
          name: 'Killed',
          type: 'bar'
        };

      var trace2 ={
          x: states,
          y: n_injured,
          name: 'Injured',
          type: 'bar'
        };
      
      console.log(n_injured)
      var trace_data=[trace1,trace2];
      var layout = {title:'2013 Gun Violence per million residents',barmode:'group'};
      
      Plotly.newPlot('plot', trace_data,layout);

      var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
      });

      for (d in statesData.features){
          statesData.features[d].properties['n_killed']=n_killed[d];
          console.log(statesData.features[d].properties);
      }

      var map = L.map("myMap", {
          center: [
            40.7, -94.5
          ],
          zoom: 4,
          layers: [graymap]
        });

        L.geoJson(statesData,
          {
            style:style,
            onEachFeature: function(feature, layer) {
              layer.bindPopup(
                "Name: "
                  + feature.properties.name
                  + "<br>Killed(per million): "
                  + feature.properties.n_killed
              );
            }
          }).addTo(map);


        // Here we create a legend control object.
        var legend = L.control({
          position: "bottomright"
          }); 

        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");
      
          var grades = [0, 15, 30, 45, 60, 75, 90, 105];
          
      
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
        legend.addTo(map);
      

      console.log(n_killed)


      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'bar',
      
          // The data for our dataset
          data: {
              labels: states,
              datasets: [
                {
                  label: 'Gun deaths per million residents',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: n_killed
                },
                {
                  label: 'Gun injuries per million residents',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderColor: 'rgb(54, 162, 235)',
                  data: n_injured
                }
              ]
          },
      
          // Configuration options go here
          options: {}
      });
  });


