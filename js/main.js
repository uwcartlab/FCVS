
////////////////////////////////////////////////////////////////////////////////
// commented out to make everything global to be reference by the fmbols function which needs to
// be global and needs to access other functions.
//(function(){

// array for the ages to be binned into.
var ageBin = [];
// array for markers to be placed into and removed from. May need to be outside this function.
var markers = [];
// counter used to get all ages. Needs to be revamped to be independent of particular dataset.
var ageCounter = 0;
// global variable used to store map object.
var map;
// array that holds the element IDs of taxon dropboxes.
var boxArr =[];
// array that holds values (pollen scientific names) of the taxon dropboxes.
var taxonIDs;
// array that stores all called data in one place. Sorted by Taxa.
var allData = [];
// counter that sorts through data to store in allData.
var dataCounter = 0;
// array that stores all data by site.
var allSiteData = [];
// initial age of data shown.
var age = [[0,1000]];

// using custom icon.
var myIcon = L.icon({
  iconUrl:'lib/leaflet/images/LeafIcon_dkblu_lg.png',
  iconSize: [20,40],
  iconAnchor:  [10,40],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  });

// function that sets the whole thing in motion. Creates leaflet map
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



    //add base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">Carto</a>',
      	subdomains: 'abcd'
    }).addTo(map);

      // function used to create map controls.
        createControls(map);
        testBarChart(map);


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

// first taxon dropdown.
var taxon1 = L.control({position: 'topright'});
taxon1.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_dkblu.png" style="width:20px;height:30px;">'+
    '<select id="taxon1" onchange="updateSymbols(this)">'+
    '<option selected="selected" value="Picea">Spruce</option>'+
    '<option value="Quercus">Oak</option>'+
    '<option value="Acer">Maple</option>'+
    '<option value="Pinus">Pine</option>'+
    '<option value="Tsuga">Hemlock</option>'+
    '<option value="Betula">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};

taxon1.addTo(map);

// second taxon dropdown.
var taxon2 = L.control({position: 'topright'});
taxon2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_ltblu.png" style="width:20px;height:30px;">'+
    '<select id="taxon2" onchange="updateSymbols(this)">'+
    '<option value="Picea">Spruce</option>'+
    '<option selected="selected" value="Quercus">Oak</option>'+
    '<option value="Acer">Maple</option>'+
    '<option value="Pinus">Pine</option>'+
    '<option value="Tsuga">Hemlock</option>'+
    '<option value="Betula">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon2.addTo(map);

// third taxon dropdown.
var taxon3 = L.control({position: 'topright'});
taxon3.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_dkgrn.png" style="width:20px;height:30px;">'+
    '<select id="taxon3" onchange="updateSymbols(this)">'+
    '<option value="Picea">Spruce</option>'+
    '<option value="Quercus">Oak</option>'+
    '<option value="Acer">Maple</option>'+
    '<option value="Pinus">Pine</option>'+
    '<option value="Tsuga">Hemlock</option>'+
    '<option selected="selected" value="Betula">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon3.addTo(map);

// fourth taxon dropdown.
var taxon4 = L.control({position: 'topright'});
taxon4.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<img src="lib/leaflet/images/LeafIcon_ltgrn.png" style="width:20px;height:30px;">'+
    '<select id="taxon4" onchange="updateSymbols(this)">'+
    '<option value="Picea">Spruce</option>'+
    '<option value="Quercus">Oak</option>'+
    '<option value="Acer">Maple</option>'+
    '<option selected="selected" value="Pinus">Pine</option>'+
    '<option value="Tsuga">Hemlock</option>'+
    '<option value="Betula">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon4.addTo(map);


// create the temporal selector. Eventually will be a slider
var tempLegend = L.control({position: 'topleft'});

tempLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'leaflet-control-layers-selector');
    // all the options for the temporal legend
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

// event listeners bound to each temporal change, calling the tempChange function to redraw symbols.
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


// variables assigned to IDs to be stored in boxArr and the values in boxID
var box1 = document.getElementById("taxon1");
var box2 = document.getElementById("taxon2");
var box3 = document.getElementById("taxon3");
var box4 = document.getElementById("taxon4");
boxArr = [box1.id,box2.id,box3.id,box4.id];

taxonIDs = [box1.value, box2.value, box3.value, box4.value];

// function to retrieve datasets is here so box IDs can be passed
getSites(age,boxArr);

};

////////////////////////////////////////////////////////////////////////////////

// temporal change used to call updateSymbols need to correct parameters
function tempChange() {
  // variable assigned to element id of the selected temporal range.
   var id = this.id;

   // if else chain to get the sites from the proper time period.
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
// function used to call the neotoma database and retrieve the proper data based on a preset bounding box (which will eventually be user defined)
// and the preselected taxon names from boxArr
function getSites(age, boxArr){

  // for loop that looks at all the taxa in taxonIDs, retrieving data for each one.
  // age is used to determine which samples to retrieve
  // NOTE: want to take all the data and put it into one object/array to be dealt with that way.
  for (var i = 0; i < taxonIDs.length; i++) {
      var young = age[0][0];
      var old = age[0][1];
      // constructing URL based on coordinates (to be changed to user inputted bounding box later) and the taxon and ages.
      // need to change this so it retrieves information for all offered taxa.
      var urlBaseMN = 'http://apidev.neotomadb.org/v1/data/pollen?wkt=POLYGON((-97.294921875%2048.93964118139728,-96.6357421875%2043.3601336603352,-91.20849609375%2043.53560718808973,-93.09814453125%2045.10745410539934,-92.17529296875%2046.69749299744142,-88.79150390625%2047.874907453605935,-93.53759765625%2048.910767192107755,-97.294921875%2048.93964118139728))';
      var url = [urlBaseMN, '&taxonname=', taxonIDs[i], '&ageold=', old, '&ageyoung=', young].join('');
      // ajax call to neotoma database
      $.ajax(url, {
        dataType: "json",
        success: function(response){
          // calling function to organize data
          binDataBySite(response.data);
          // createPetalPlots(response, map);
        }
      });

    }



};

////////////////////////////////////////////////////////////////////////////////
// function used to organize all data of a particular taxon by site location.
//fires for each taxon desired
function binDataBySite(data) {

  // creates array to hold all sites where the taxon is found.
  var sites = [];

  // loop that pushes all the site IDs into the array.
  for (var i = 0; i < data.length; i++) {
    sites.push(data[i].SiteID);
  }
  //array created to place all unique siteIDs (as sites has duplicates) in for loop.
  sitesDeDoop = [];
  sites.forEach(function(item) {
   if(sitesDeDoop.indexOf(item) < 0) {
     sitesDeDoop.push(item);
   }
  });

  // array
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


  // making big array of all retrieved data to organized by taxon. This will be used
  // to make it easier for multiple vizualizations as well as not having to make
  // more ajax calls.
      allData[dataCounter] = procData;
      dataCounter++;
      console.log(allData);

      if (allSiteData.length == sitesDeDoop.length){

        // createBarCharts(allSiteData, map);
      };

  // will be moved outside of this function as the allData will be the source of information.
  createPetalPlots(procData, map);
};

////////////////////////////////////////////////////////////////////////////////


// need to pass in taxa and taxon id (for each individual box) to be searched from the ones set in input boxes.
// add taxon box id (eg. taxon1) for icon rotation and taxa value from that box as arguments.
function getSamples(dataset, map){


    // variable assigned to dataset (which contains site location, core, sample, and age data)
    var datasetData = dataset.data;



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


          //ages all measured relative to 1950. Thus negative numbers are younger than 1950.
          var min = Math.min.apply(null, ageBin),
              max = Math.max.apply(null, ageBin);

          //numbers corrected for current year. Unsure if this will work right now. Probably not as I need to call things based on their cataloged year.
          // will need to do this sort of correction for temporal filter, but not for searching data.

          //var diffCorrect = currentYear - 1950;
          var range = max - min;


          //define the number of classes based on each class width being 1000 years.
          //rounded up to get everything. Equal interval classifications to bin by year
          var classNum = Math.ceil(range/1000);


          // var maxCorrect = max + diffCorrect;
          // var minCorrect = min + diffCorrect;

        };

      };

    };

};


////////////////////////////////////////////////////////////////////////////////

// add taxon box id (eg. taxon1) for icon rotation and taxa value from that box as arguments.
// also need different icons based on the box the taxa is selected from (and will be rotated according to that box)

// ONLY WORKS WITH THE OLD JSON DATA NOT THE CURRENT DATA CALLS. NEEDS TO BE REDONE.

// Add initial symbols (petal plots) based on data
function createPetalPlots(data, map){

  var points = data;

  var counter = 0;
  for (var i = 0, l = points.length; i < l; i++){

    var obj = points[i];

    //can be omitted due to access to each site's lon and lat values
    var lon = ((obj.LongitudeEast) + (obj.LongitudeWest))/2;
    var lat = ((obj.LatitudeNorth) + (obj.LatitudeSouth))/2;

    var value = obj.Value;
    var tax = obj.TaxonName;
    var site = obj.SiteID;
    var dataset = obj.DatasetID;


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
    else if (tax == "Betula"){
      var degrees = 180;
      var taxonID = "taxon3";
    }
    else if (tax == "Pinus"){
      var degrees = 270;
      var taxonID = "taxon4";
    };


    // defining custom icons for each petal.
    var myIcon_dkblu = L.icon({
      // #4F77BB
      iconUrl:'lib/leaflet/images/LeafIcon_dkblu_lg.png',
      iconSize: [(.1*value),(.2*value)],
      iconAnchor:  [(.05*value),(.2*value)],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      });

      var myIcon_ltblu = L.icon({
        // #A6CFE5
        iconUrl:'lib/leaflet/images/LeafIcon_ltblu_lg.png',
        iconSize: [(.1*value),(.2*value)],
        iconAnchor:  [(.05*value),(.2*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

      var myIcon_dkgrn = L.icon({
        // #31A148
        iconUrl:'lib/leaflet/images/LeafIcon_dkgrn_lg.png',
        iconSize: [(.1*value),(.2*value)],
        iconAnchor:  [(.05*value),(.2*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

      var myIcon_ltgrn = L.icon({
        // #B3D88A
        iconUrl:'lib/leaflet/images/LeafIcon_ltgrn_lg.png',
        iconSize: [(.1*value),(.2*value)],
        iconAnchor:  [(.05*value),(.2*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

        // selecting the proper icon depending on the defined rotation.
        if (degrees == 360){
          var myIcon = myIcon_dkblu;

        } else if (degrees == 90){
          var myIcon = myIcon_ltblu;

        } else if (degrees == 180){
          var myIcon = myIcon_dkgrn;

        } else if (degrees == 270){
          var myIcon = myIcon_ltgrn;

        };

    // creating each individual marker.
    var marker = L.marker([lat,lon], {
      rotationAngle: degrees,
      icon:myIcon,
      siteID: site,
      datasetID: dataset,
      legend: taxonID
    });
      map.addLayer(marker);

      //adding markerID for tooltips
      markers[marker._leaflet_id] = marker;



      //counter++;

       //original popupContent changed to popupContent variable
       var popupContent = "<p><b>Taxon:</b> " + obj.TaxonName + "</p>";

       //add formatted attribute to popup content string
       //var year = attribute.split("_")[1];
       popupContent += "<p><b>% abundance:</b> <br>" + round(value/(obj.UPHE+obj.VACR),2) + "</p>";
       popupContent += "<p id='popup-site' value='"+site+"'><b>Site ID:</b> <br>" + site + "</p>";
       popupContent += "<p id='popup-site' value='"+site+"'><b>Dataset ID:</b> <br>" + dataset + "</p>";

       marker.bindPopup(popupContent);


  };

};

////////////////////////////////////////////////////////////////////////////////

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};
 ////////////////////////////////////////////////////////////////////////////////
 // function for changing and retrieving the value of the inner taxa to
 // change the representation.
 // Must be on the global scale to be called by onchange of the taxon dropdowns.
 // also must conform to temporal changes, not just changes based on taxon

 //currently doesn't work. But is on track.

 function updateSymbols(box){


   var taxon = document.getElementById(box.id).value;
   var boxID = box.id;

   // function that deletes all markers. Would rather just get all markers and tween to new values.
   getAllMarkers(boxID);

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

   //if going this route, need to pass degrees so I know which ones to be removed


   //add new code for updating symbols here I think. resizing would take place here or adding new ones.

 };

////////////////////////////////////////////////////////////////////////////////

 // experimental extension of the marker addition.
 // currently removes selected taxa but needs to redraw new ones according to new
 // taxa values. However, because of allData holding all available taxons, we
 // won't have to do another ajax call for it, just find it in the allData.

 function getAllMarkers(box) {

     //var allMarkersObjArray = [];//new Array();
     //var allMarkersGeoJsonArray = [];//new Array();

     if (box){
       $.each(map._layers, function (ml) {
           //formerly, map._layers[ml].feature
           if (markers[ml]) {
             if (markers[ml].options.legend == box){

               map.removeLayer(map._layers[ml]);
             }

          };

       })

     } else {
       $.each(map._layers, function (ml) {
           //formerly, map._layers[ml].feature
           if (markers[ml]) {

               map.removeLayer(map._layers[ml]);

          };

       })

     };



    // alert("total Markers : " + allMarkersGeoJsonArray.length + "\n\n" + allMarkersGeoJsonArray + "\n\n Also see your console for object view of this array" );
 };

////////////////////////////////////////////////////////////////////////////////
function testBarChart(map){

  // #4F77BB
// #A6CFE5
// #31A148
// #B3D88A

  //need to change the options under _loadComponents (I think) to make these stacked.

  // bar chart works well, just need to add something that looks at data in each site and pull it out.

  var options = {
	data: {
		'dataPoint1': Math.random() * 20,
		'dataPoint2': Math.random() * 20,
		'dataPoint3': Math.random() * 20,
		'dataPoint4': Math.random() * 20

	},
	chartOptions: {
		'dataPoint1': {
			fillColor: '#4F77BB',
			minValue: 0,
			maxValue: 20,
			maxHeight: 50,
			displayText: function (value) {
				return value.toFixed(2);
			}
		},
		'dataPoint2': {
			fillColor: '#A6CFE5',
			minValue: 0,
			maxValue: 20,
			maxHeight: 50,
			displayText: function (value) {
				return value.toFixed(2);
			}
		},
		'dataPoint3': {
			fillColor: '#31A148',
			minValue: 0,
			maxValue: 20,
			maxHeight: 50,
			displayText: function (value) {
				return value.toFixed(2);
			}
		},
		'dataPoint4': {
			fillColor: '#B3D88A',
			minValue: 0,
			maxValue: 20,
			maxHeight: 50,
			displayText: function (value) {
				return value.toFixed(2);
			}
		}
	},
	weight: 1,
	color: '#000000'
};

var barChartMarker = new L.BarChartMarker(new L.LatLng(45, -90), options);

barChartMarker.addTo(map);


};

////////////////////////////////////////////////////////////////////////////////

$(document).ready(createMap);

//$(".get-markers").on("click", getAllMarkers);
//})();
