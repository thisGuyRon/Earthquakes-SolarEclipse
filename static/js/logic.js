//create a map object centered in the USA
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 4});
//create a dark map layer and add it to the map object
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
}).addTo(myMap);

//json query to pull earthquake data for the day of the usa total eclipse
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2017-08-21&endtime=" +
  "2017-08-22&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
//function called to largen the map markers
function markerSize(radius) {
  return radius * 20000;
}

//call function to grap data and add items to map
d3.json(queryUrl, function(data) {
  // main for loop to increment through json data
  for (x=0; x<data.features.length; x++){
    console.log(data.features[x]);
    //log the color for the different magnitudes of earthquakes
    var color="";
    if (data.features[x].properties.mag<=1){
      color = "red";
    }
    else if (data.features[x].properties.mag<=2){
      color = "orange";
    }
    else if (data.features[x].properties.mag<=3){
      color = "yellow";
    }
    else if (data.features[x].properties.mag<=4){
      color = "green";
    }
    else if (data.features[x].properties.mag<=5){
      color="blue";
    }
    else{
      color="purple";
    }
    // grab the coordinates of the json object
    var earthquakeCoords = [data.features[x].geometry.coordinates[1], data.features[x].geometry.coordinates[0]];
    //create circles to log to the map
    L.circle(earthquakeCoords, {
      fillOpacity: 1,
      color: color,
      fillcolor: color,
      //call markersize function to increase marker size
      radius: markerSize(data.features[x].properties.mag)
      //bind popup notifications
      }).bindPopup("<h3>" + data.features[x].properties.place + "</h3><hr><p>" + data.features[x].properties.time + "</p>").addTo(myMap);
      
    }
  }  
    
);

var legend = L.control({ position: "bottomright"});

   legend.onAdd = function (map) {

       var div = L.DomUtil.create("div", "info legend"),
           magnitude = [0, 1, 2, 3, 4, 5],
           labels = [];
           colors = ["red", "orange", "yellow", "green", "blue", "purple"];

       div.innerHTML += "<h4 style=‘margin:4px’>Magnitude</h4>";

       for (var i = 0; i < magnitude.length; i++) {
           div.innerHTML +=
           "<i style='background:" + colors[i] + "'></i>"  +
               magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
       }

       return div;
   };
   legend.addTo(myMap);

