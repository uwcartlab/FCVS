
////////////////////////////////////////////////////////////////////////////////
// commented out to make everything global to be reference by the fmbols function which needs to
// be global and needs to access other functions.
//(function(){

// array for the ages to be binned into
var ageBin = [];
// array for markers to be placed into and removed from. May need to be outside this function.
var markers = new Array();
var ageCounter = 0;
var map;
var boxArr;
var age = [[0,1000]];

var myIcon = L.icon({
  iconUrl:'lib/leaflet/images/LeafIcon_dkblu_lg.png',
  iconSize: [20,40],
  iconAnchor:  [10,40],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  });

function createMap(){

    // set map bounds
    var southWest = L.latLng(39, -98),
    northEast = L.latLng(50, -79),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
     map = L.map('mapid', {
        center: [46, -94],
        zoom: 7,
        //maxBounds: bounds,
        maxBoundsViscosity:.7,
        minZoom: 7
    });

    //console.log(map);

    //add base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">Carto</a>',
      	subdomains: 'abcd'
    }).addTo(map);

        createControls(map);

        //window resize function so map takes up entirety of screen on resize
        $(window).on("resize", function () { $("#mapid").height($(window).height()); map.invalidateSize(); }).trigger("resize");
        $(document).ready(function() {$(window).resize(function() {
        var bodyheight = $(this).height();
        $("#page-content").height(bodyheight-70);
    }).resize();
});

};



/////////////////////////Taxa Dropdown Menu////////////////////////////////////

// creates taxa dropdown to change taxa that is being displayed. Need to add option for more
// and less taxa and a cap for the maximum amount you can have (probably around 6).

function createControls(map){

var taxon1 = L.control({position: 'topright'});
taxon1.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_dkblu.png" style="width:20px;height:30px;">'+
    '<select id="taxon1" onchange="updateSymbols(this)">'+
    '<option selected="selected" value="Spruce">Spruce</option>'+
    '<option value="Oak">Oak</option>'+
    '<option value="Maple">Maple</option>'+
    '<option value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};

taxon1.addTo(map);

var taxon2 = L.control({position: 'topright'});
taxon2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_ltblu.png" style="width:20px;height:30px;">'+
    '<select id="taxon2" onchange="updateSymbols(this)">'+
    '<option value="Spruce">Spruce</option>'+
    '<option selected="selected" value="Oak">Oak</option>'+
    '<option value="Maple">Maple</option>'+
    '<option value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon2.addTo(map);

var taxon3 = L.control({position: 'topright'});
taxon3.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_dkgrn.png" style="width:20px;height:30px;">'+
    '<select id="taxon3" onchange="updateSymbols(this)">'+
    '<option value="Spruce">Spruce</option>'+
    '<option value="Oak">Oak</option>'+
    '<option selected="selected" value="Maple">Maple</option>'+
    '<option value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon3.addTo(map);

var taxon4 = L.control({position: 'topright'});
taxon4.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_ltgrn.png" style="width:20px;height:30px;">'+
    '<select id="taxon4" onchange="updateSymbols(this)">'+
    '<option value="Spruce">Spruce</option>'+
    '<option value="Oak">Oak</option>'+
    '<option value="Maple">Maple</option>'+
    '<option selected="selected" value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon4.addTo(map);


// create the temporal selector. Eventually will be a slider
var tempLegend = L.control({position: 'topleft'});

tempLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'leaflet-control-layers-selector');

    div.innerHTML = '<form style="background-color:white; padding:2px; outline: solid; outline-width: 1px;"><input id="ybp1000" type="radio" checked="true" name="temporal"/>0-1000 YBP</input>'+
    '<br><input id="ybp2000" type="radio" name="temporal"/>1,001-2,000 YBP</input>'+
    '<br><input id="ybp3000" type="radio" name="temporal"/>2,001-3,000 YBP</input>'+
    '<br><input id="ybp4000" type="radio" name="temporal"/>3,001-4,000 YBP</input>'+
    '<br><input id="ybp5000" type="radio" name="temporal"/>4,001-5,000 YBP</input>'+
    '<br><input id="ybp6000" type="radio" name="temporal"/>5,001-6,000 YBP</input>'+
    '<br><input id="ybp7000" type="radio" name="temporal"/>6,001-7,000 YBP</input>'+
    '<br><input id="ybp8000" type="radio" name="temporal"/>7,001-8,000 YBP</input>'+
    '<br><input id="ybp9000" type="radio" name="temporal"/>8,001-9,000 YBP</input>'+
    '<br><input id="ybp10000" type="radio" name="temporal"/>9,001-10,000 YBP</input>'+
    '<br><input id="ybp11000" type="radio" name="temporal"/>10,001-11,000 YBP</input>'+
    '<br><input id="ybp12000" type="radio" name="temporal"/>11,001-12,000 YBP</input></form>';
    return div;
};

tempLegend.addTo(map);


document.getElementById ("ybp1000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp2000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp3000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp4000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp5000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp6000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp7000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp8000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp9000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp10000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp11000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp12000").addEventListener ("click", tempChange, false);


var box1 = document.getElementById("taxon1").id;
var box2 = document.getElementById("taxon2").id;
var box3 = document.getElementById("taxon3").id;
var box4 = document.getElementById("taxon4").id;
boxArr = [box1,box2,box3,box4];

// function to retrieve datasets is here so box IDs can be passed
getSites(age,boxArr);

};



////////////////////////////////////////////////////////////////////////////////

// temporal change used to call updateSymbols need to correct parameters
function tempChange() {
   var id = this.id;
   //console.log(map);
   if (id == "ybp1000"){
     getAllMarkers();
     age = [[0,1000]];
     getSites(age, boxArr);
   }
   else if (id == "ybp2000"){
     getAllMarkers();
     age = [[1001,2000]];
     getSites(age, boxArr);
   }else if (id == "ybp3000"){
     getAllMarkers();
     age = [[2001,3000]];
     getSites(age, boxArr);
   }else if (id == "ybp4000"){
     getAllMarkers();
     age = [[3001,4000]];
     getSites(age, boxArr);
   }else if (id == "ybp5000"){
     getAllMarkers();
     age = [[4001,5000]];
     getSites(age, boxArr);
   }else if (id == "ybp6000"){
     getAllMarkers();
     age = [[5001,6000]];
     getSites(age, boxArr);
   }else if (id == "ybp7000"){
     getAllMarkers();
     age = [[6001,7000]];
     getSites(age, boxArr);
   }else if (id == "ybp8000"){
     getAllMarkers();
     age = [[7001,8000]];
     getSites(age, boxArr);
   }else if (id == "ybp9000"){
     getAllMarkers();
     age = [[8001,9000]];
     getSites(age, boxArr);
   }else if (id == "ybp10000"){
     getAllMarkers();
     age = [[9001,10000]];
     getSites(age, boxArr);
   }else if (id == "ybp11000"){
     getAllMarkers();
     age = [[10001,11000]];
     getSites(age, boxArr);
   }else if (id == "ybp12000"){
     getAllMarkers();
     age = [[11001,12000]];
     getSites(age, boxArr);
   };

};


////////////////////////////////////////////////////////////////////////////////

function getSites(age, boxArr){
//console.log(datasets);
  // var datasetArray = datasets.sites;
  //
  //
  // //console.log(boxArr);
  // //console.log(datasetArray.length);
  //
  // // looping through to find every dataset in each site
  // for (var i = 0, l = datasetArray.length; i < l; i++){
  //   //console.log(datasetArray[i].Datasets);
  //   var datasets = datasetArray[i].Datasets;
  //
  //
  //   //a for loop to make an ajax call for each dataset based on the dataset ID (54 total in this example)
  //   for (var set = 0, len = datasets.length; set < len; set++){
  //       var obj = datasets[set];
  //       //console.log(obj);
  //       var dataID = obj.DatasetID;
  //       //console.log(dataID);
  //
  //       // ajax call based on datasetID that calls getSamples to retrieve data from each site
  //       // downloads are heavy and slow.
  //       $.ajax("http://api.neotomadb.org/v1/data/downloads/"+dataID, {
  //        dataType: "json",
  //        success: function(response){
  //          //console.log(response);
  //          getSamples(response,map);
  //          //createSymbols(response,map);
  //          }
  //          });
  //   }
  //
  //
  //         };

  var taxonIds = ["Pinus","Picea","Quercus","Acer"];
  var ageChunks = age;
  for (var i = 0; i < taxonIds.length; i++) {
    for (var j = 0; j < ageChunks.length; j++) {
      console.log(taxonIds[i]);
      var young = ageChunks[j][0];
      var old = ageChunks[j][1];
      var urlBaseMN = 'http://apidev.neotomadb.org/v1/data/pollen?wkt=POLYGON((-97.294921875%2048.93964118139728,-96.6357421875%2043.3601336603352,-91.20849609375%2043.53560718808973,-93.09814453125%2045.10745410539934,-92.17529296875%2046.69749299744142,-88.79150390625%2047.874907453605935,-93.53759765625%2048.910767192107755,-97.294921875%2048.93964118139728))';
      var url = [urlBaseMN, '&taxonname=', taxonIds[i], '&ageold=', old, '&ageyoung=', young].join('');
      $.ajax(url, {
        dataType: "json",
        success: function(response){
          console.log(young, "to", old);
          console.log(response);

          binDataBySite(response.data);
          // createSymbols(response, map);
        }
      });
    }
  }

  //console.log(ageBin);
  //console.log("done");
  //console.log(counter2);

};

////////////////////////////////////////////////////////////////////////////////

function binDataBySite(data) {
  var sites = [];
  var binnedData = [];
  for (var i = 0; i < data.length; i++) {
    sites.push(data[i].SiteID);
  }
  sitesDeDoop = [];
  sites.forEach(function(item) {
   if(sitesDeDoop.indexOf(item) < 0) {
     sitesDeDoop.push(item);
   }
  });

  var procData = [];
  var Value = 0;
  var currentSite = {};
  var index = 0;
  sitesDeDoop.forEach(function(item){
    for (var i = 0; i < data.length; i++) {
      if (item === data[i].SiteID) {
        index += 1;
        currentSite = data[i];
        Value += data[i].Value;
      }
    }
    var avgVal = Value/index;
    currentSite.Value = avgVal;
    procData.push(currentSite);
    currentSite = {};
    Value = 0;
    index = 0;
  });
  createSymbols(procData, map);
};


////////////////////////////////////////////////////////////////////////////////
// function added to easily check if elements are being fired.
function meow(){
  console.log("meow");
};
////////////////////////////////////////////////////////////////////////////////


// need to pass in taxa and taxon id (for each individual box) to be searched from the ones set in input boxes.
// add taxon box id (eg. taxon1) for icon rotation and taxa value from that box as arguments.
function getSamples(dataset, map){
    //console.log(dataset);

    // variable assigned to dataset (which contains site location, core, sample, and age data)
    var datasetData = dataset.data;
    //console.log(datasetData);


    //console.log(datasetData);
    // a loop to go through each object in the dataset array (which should only be one)
    for (var i = 0, l = datasetData.length; i < l; i++){

      // variable for array of all samples in a particular dataset
      var core = datasetData[i].Samples;
      // variable to access site location data
      // var site = datasetData[i].Site;
      // variables for the site's coordinates
      var siteLat = site.Latitude;
      var siteLon = site.Longitude;

      // temporary icons placed in the site locations. Need to do custom markers here
      // consider offering checkboxes with two years only rather than trying to do slider for now.
      var marker = L.marker([siteLat,siteLon], {
        icon:myIcon
      });
        map.addLayer(marker);
        markers[marker._leaflet_id] = marker;


      // loop to go through each level record in the core.
      for (var level = 0, len = core.length; level < len; level++){
        // incrementing the age counter.
        ageCounter++;
        // variable for each level in the core
        var obj = core[level];
        // variable for the depth of each level
        var depth = obj.AnalysisUnitDepth;
        // variable for array containing all samples found at a particular level in the core
        var samples = obj.SampleData;

        // gets the most recent addition in age of the sample, which is the most up to date and accurate dates
        // (think about calibrated vs non-calibrated radiocarbon dates)
        var sampleAge = obj.SampleAges[obj.SampleAges.length-1].Age

        //console.log(core);

        //pushes all ages of samples into the bin. Total of 2511 instances.
        //round each year to the
        ageBin.push(sampleAge);

        // if statement triggers once all ages are accounted for. Need a way of doing this without knowing the call since 2510 is used
        // with the knowledge of how many separate ages are being drawn.
        // postponing slider for now on age.
        if (ageCounter > 2510){

          // date for current year. just wanted the option in case I want to do YBP with an accurate present date.
          var date = new Date();
          var currentYear = date.getFullYear();

          //console.log(ageBin);
          //ages all measured relative to 1950. Thus negative numbers are younger than 1950.
          var min = Math.min.apply(null, ageBin),
              max = Math.max.apply(null, ageBin);

          //numbers corrected for current year. Unsure if this will work right now. Probably not as I need to call things based on their cataloged year.
          // will need to do this sort of correction for temporal filter, but not for searching data.

          //var diffCorrect = currentYear - 1950;
          var range = max - min;
          //console.log(range);

          //define the number of classes based on each class width being 1000 years.
          //rounded up to get everything. Equal interval classifications to bin by year
          var classNum = Math.ceil(range/1000);

          //console.log(classNum);
          // var maxCorrect = max + diffCorrect;
          // var minCorrect = min + diffCorrect;

        };
        //console.log(ageBin);
        //console.log(depth);
        //console.log(samples);
      };

    };

};


////////////////////////////////////////////////////////////////////////////////

// add taxon box id (eg. taxon1) for icon rotation and taxa value from that box as arguments.
// also need different icons based on the box the taxa is selected from (and will be rotated according to that box)

// ONLY WORKS WITH THE OLD JSON DATA NOT THE CURRENT DATA CALLS. NEEDS TO BE REDONE.

//Add proportional markers for each point in data.
function createSymbols(data, map){
  //console.log(data.data);
  var points = data;
  //console.log(points[0].LatitudeNorth);
  // console.log(data.features);
  // console.log(data.features[0].properties.degrees)
  var counter = 0;
  for (var i = 0, l = points.length; i < l; i++){
    // console.log("fired");
    var obj = points[i];

    //can be omitted due to access to each site's lon and lat values
    var lon = ((obj.LongitudeEast) + (obj.LongitudeWest))/2;
    var lat = ((obj.LatitudeNorth) + (obj.LatitudeSouth))/2;
    // console.log(lon);
    // console.log(lat);
    //console.log(obj);

    var value = obj.Value;
    var tax = obj.TaxonName;
    var site = obj.SiteID;
    //console.log(tax);

    // Have to do boxID into this function I think...
    // if (boxID == "taxon1"){
    //   var degrees = 360;
    // }
    // else if (boxID == "taxon2"){
    //   var degrees = 90;
    // }
    // else if (boxID == "taxon3"){
    //   var degrees = 180;
    // }
    // else if (boxID == "taxon4"){
    //   var degrees = 270;
    // };

    if (tax == "Picea"){
      var degrees = 360;
      var taxonID = "taxon1";
    }
    else if (tax == "Quercus"){
      var degrees = 90;
      var taxonID = "taxon2";
    }
    else if (tax == "Acer"){
      var degrees = 180;
      var taxonID = "taxon3";
    }
    else if (tax == "Pinus"){
      var degrees = 270;
      var taxonID = "taxon4";
    };
    //console.log(degrees);


    var myIcon_dkblu = L.icon({
      iconUrl:'lib/leaflet/images/LeafIcon_dkblu_lg.png',
      iconSize: [(.1*value),(.2*value)],
      iconAnchor:  [(.05*value),(.2*value)],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      });

      var myIcon_ltblu = L.icon({
        iconUrl:'lib/leaflet/images/LeafIcon_ltblu_lg.png',
        iconSize: [(.1*value),(.2*value)],
        iconAnchor:  [(.05*value),(.2*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

      var myIcon_dkgrn = L.icon({
        iconUrl:'lib/leaflet/images/LeafIcon_dkgrn_lg.png',
        iconSize: [(.1*value),(.2*value)],
        iconAnchor:  [(.05*value),(.2*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

      var myIcon_ltgrn = L.icon({
        iconUrl:'lib/leaflet/images/LeafIcon_ltgrn_lg.png',
        iconSize: [(.1*value),(.2*value)],
        iconAnchor:  [(.05*value),(.2*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

        if (degrees == 360){
          var myIcon = myIcon_dkblu;

        } else if (degrees == 90){
          var myIcon = myIcon_ltblu;

        } else if (degrees == 180){
          var myIcon = myIcon_dkgrn;

        } else if (degrees == 270){
          var myIcon = myIcon_ltgrn;

        };

        //console.log(myIcon);
    //console.log("blam");

    var marker = L.marker([lat,lon], {
      rotationAngle: degrees,
      icon:myIcon,
      siteID: site,
      legend: taxonID
    });
      map.addLayer(marker);
      //console.log(marker);
      markers[marker._leaflet_id] = marker;
      //console.log(markers);


      //counter++;

       //original popupContent changed to popupContent variable
       var popupContent = "<p><b>Taxon:</b> " + obj.TaxonName + "</p>";

       //add formatted attribute to popup content string
       //var year = attribute.split("_")[1];
       popupContent += "<p><b>% abundance:</b> <br>" + round(value/(obj.UPHE+obj.VACR),2) + "</p>";
       popupContent += "<p id='popup-site' value='"+site+"'><b>Site ID:</b> <br>" + site + "</p>";
       //console.log("yep");

       marker.bindPopup(popupContent);
       marker.on('click',coordinatedViz);

       //console.log(markers);

  };
  //console.log(counter);
};

////////////////////////////////////////////////////////////////////////////////

function coordinatedViz(){
  console.log(this.options.siteID);
};

////////////////////////////////////////////////////////////////////////////////

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};
////////////////////////////////////////////////////////////////////////////////
// function pointToLayer(feature, latlng){
//   console.log("meow");
//     //create marker options
//     var options = {
//         radius: 8,
//         fillColor: "#5e5e5e",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.6
//     };
//
//     //For each feature, determine its value for the selected attribute
//      var attValue = Number(feature.properties[attribute]);
//
//      //create circle marker layer
//      var layer = L.marker(latlng, options);
//
//
//      //return the circle marker to the L.geoJson pointToLayer option
//      return layer;
//  };

 ////////////////////////////////////////////////////////////////////////////////
 // function for changing and retrieving the value of the inner taxa to
 // change the representation.
 // Must be on the global scale to be called by onchange of the taxon dropdowns.
 // also must conform to temporal changes, not just changes based on taxon

 function updateSymbols(box){

   getAllMarkers();
   var taxon = document.getElementById(box.id).value;
   var boxID = box.id;

   if (boxID == "taxon1"){
     var degrees = 360;
   }
   else if (boxID == "taxon2"){
     var degrees = 90;
   }
   else if (boxID == "taxon3"){
     var degrees = 180;
   }
   else if (boxID == "taxon4"){
     var degrees = 270;
   };
   //console.log(map);
   //console.log(degrees);

   //if going this route, need to pass degrees so I know which ones to be removed


   //add new code for updating symbols here I think. resizing would take place here or adding new ones.

 };

////////////////////////////////////////////////////////////////////////////////

 // experimental extension of the marker addition.

 function getAllMarkers() {
   //console.log("fired");
   //console.log(markers);

     //var allMarkersObjArray = [];//new Array();
     //var allMarkersGeoJsonArray = [];//new Array();
     console.log(map._layers);

     $.each(map._layers, function (ml) {
         //console.log(ml)
         //formerly, map._layers[ml].feature
         if (markers[ml]) {
             //console.log('value in Array!');
             //map.removeLayer(map._layers[ml]);

        } else {
            //console.log('Not in array');
        };



        //  {
        //      map.removeLayer(map._layers[ml]);
        //      //need to look at geojson feature part...
        //      //allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()));
        //
        //  }

     })

     //console.log(allMarkersObjArray);
    // console.log(allMarkersGeoJsonArray);
    // alert("total Markers : " + allMarkersGeoJsonArray.length + "\n\n" + allMarkersGeoJsonArray + "\n\n Also see your console for object view of this array" );
 }



 ////////////////////////////////////////////////////////////////////////////////

$(document).ready(createMap);

//$(".get-markers").on("click", getAllMarkers);
//})();
