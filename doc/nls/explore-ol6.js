
var overlayTree; // tree structure of historic overlayTree
var overlay; //current historic overlay node
var overlayOldName; // former historic overlay name
var overlayLayers;
var overlaySelected;
var baseLayers; // base layers include Google, Bing and OS maps, and OpenStreetMap
var initialisation = true; // initialisation mode
var args;
var urlLayerName;
var baseLayerName;
var overlaygroupno;
var vectorSource;
var vectorSourceGeol;
var vectorSourceGMS;
var vectorSourceCounty;
var vectorSourceParish;
var vectorSourceSixInch;
var vectorstyle;
var DEFAULT_LAT = 56.0;
var DEFAULT_LON = -4.0;
var DEFAULT_ZOOM = 5;
var DEFAULT_MAPSLIDERVALUE = 100;
var opacity = 1;
var pointClicked;
var noOverlaySelected;
var selectedFeatures = [];
var results = "";
var colorhex;
var rgb_r = 255;
var rgb_g = 165;
var rgb_b = 0;
var getCoordinates;
var addMarker;
var opacityvalue;

var inScotland;
var inFrance;
var inEdinburgh = false;
var inUK;

var countyname;
var countynameold;
var overlaySelectedSixInchLayer;

var countynameRight;
var countynameoldRight;
var overlaySelectedSixInchLayerRight;

var wfsOFF = true;
var wfsparishOFF = true;
var wfsSixInchON = true;

var userInput = document.getElementById("searchtrenchmap");
var currentConversion = {name:userInput,sheet:'',quadrant:'',letter:'',number:0,grid:'',xOrdinate:0,yOrdinate:0,easting:0,northing:0,bonneX:0,bonneY:0,latitude:0,longitude:0,bound:'',uLHSbonneX:0,uLHSbonneY:0,uRHSbonneX:0,uRHSbonneY:0,lRHSbonneX:0,lRHSbonneY:0,lLHSbonneX:0,lLHSbonneY:0,description:'',preferredNLS:0}; 

var zoomproperty;

var copyEmailBtn;

var draw;

var overlayTreeRight; // tree structure of historic overlayTree
var overlayRight; //current historic overlay node
var overlayOldNameRight; // former historic overlay name
var overlayLayersRight;
var overlaySelectedRight;

var keywordsearchcontent;

var AllMapsAnnotationURL;

var onMoveEndinprocess = false;

let hasGeometry = false;

let featuresCount = 0;

proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");

proj4.defs("EPSG:29902","+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +a=6377340.189 +rf=299.3249646 +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs +type=crs");

ol.proj.proj4.register(proj4);

const userAgent = navigator.userAgent.toLowerCase();
const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
console.log(isTablet);


const styleJson = `https://api.maptiler.com/maps/hybrid/style.json?key=7Y0Q1ck46BnB8cXXXg8X`;


var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz"; 

// var BingapiKey = "AuYEqWbz68YDIF-vezpAjVmKys4NULAlcJRxFVL4C_bLYw95RGrgC33Nw6UgTCxy";

var MapQuestKey = "H1O1fTnoHXxeehojtMyNwlPGqotj0L2O";

var getCoordinates = false;

var addMarker = false;

if (WebGL) {
	
	var warpedMapLayer = new Allmaps.WarpedMapLayer();
	
    var allmapslayer = new ol.layer.Group({ 
							  title: "World - Allmaps Layer",
						  relevance: 8,
						  mindate: 1801,
						  maxdate:	2025,
						  typename: 'nls:OS_One_inch_1st_GB_WFS',
						  layers: [warpedMapLayer],
							minx: -180.000000,
							miny: -72.483427, 
							maxx: 180.000000, 
							maxy: 82.099060,
							maxZ: 16,
						  key: 'maps.nls.uk/os/one-inch-old-series/symbols-popup.html'
	
	});	
}

Number.prototype.toRad = function() {
               return this * Math.PI / 180;
}

/**
 * Renders a progress bar.
 * @param {HTMLElement} el The target element.
 * @class
 */
function Progress(el) {
  this.el = el;
  this.loading = 0;
  this.loaded = 0;
}

/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function () {
  ++this.loading;
  this.update();
};

/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function () {
  ++this.loaded;
  this.update();
};

/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {
  const width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
  this.el.style.width = width;
};

/**
 * Show the progress bar.
 */
Progress.prototype.show = function () {
  this.el.style.visibility = 'visible';
};

/**
 * Hide the progress bar.
 */
Progress.prototype.hide = function () {
  const style = this.el.style;
  setTimeout(function () {
    style.visibility = 'hidden';
    style.width = 0;
  }, 250);
};

const progress = new Progress(document.getElementById('progress-explore'));

var WFS_Feature = 'https://maps.nls.uk/geo/scripts/wfs-feature.js';

function isNum(val){
  return !isNaN(val)
}

	var scotland_geojson = 'https://maps.nls.uk/geo/scripts/scotland.js';
	
	var france_geojson = 'https://maps.nls.uk/geo/scripts/france.js';
	
	var united_kingdom_geojson = 'https://maps.nls.uk/geo/scripts/united_kingdom.js';

	var scotland_source = new ol.source.Vector({
		    url:  scotland_geojson,
    		    format: new ol.format.GeoJSON(),
				tilePixelRatio: 1
		  });

	var france_source = new ol.source.Vector({
		    url:  france_geojson,
    		    format: new ol.format.GeoJSON(),
				tilePixelRatio: 1
		  });
		  
	var united_kingdom_source = new ol.source.Vector({
		    url:  united_kingdom_geojson,
    		    format: new ol.format.GeoJSON(),
				tilePixelRatio: 1
		  });

	var wfs_source = new ol.source.Vector({
		    url:  WFS_Feature,
    		    format: new ol.format.GeoJSON(),
				tilePixelRatio: 1
		  });

	var scotland_layer = new ol.layer.Vector({
		  title: "Scotland",
		  source: scotland_source,
		  style: new ol.style.Style({}),
	      });
		  
	var france_layer = new ol.layer.Vector({
		  title: "France",
		  source: france_source,
		  style: new ol.style.Style({}),
	      });

	var united_kingdom_layer = new ol.layer.Vector({
		  title: "United Kingdom",
		  source: united_kingdom_source,
		  style: new ol.style.Style({}),
	      });

	var scotland_layer2 = new ol.layer.Vector({
		  title: "Scotland2",
		  source: wfs_source,
		  style: new ol.style.Style({}),
	      });

	var scotland_layer3 = new ol.layer.Vector({
		  title: "Scotland3",
		  source: wfs_source,
		  style: new ol.style.Style({}),
	      });
		  
	var blank_layer = new ol.layer.Vector({
		  mosaic_id: '22',
		  title: "Background - Blank Layer",
		  source: new ol.source.Vector(),
		  style: new ol.style.Style({}),
	      });
		  
	var add_more_layers = new ol.layer.Vector({
		  mosaic_id: '23',
		  title: "Background - Add all other historic map layers...",
		  source: new ol.source.Vector(),
		  style: new ol.style.Style({}),
	      });

	var invisiblestyle = new ol.style.Style({
		    	fill: new ol.style.Fill({
				color: 'rgba(0, 0, 0, 0)'
	                    }),
	                });

	var redvector =  new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(250, 0, 0, 0.5)',
							  width: 1
								})
							});


	function go() {
	
		const elep = new ol.control.ElevationPath({
						stylesOptions : {
							draw : {
								finish : new ol.style.Stroke({
									color : "rgba(0, 0, 0, 0.8)",
									width : 2
								})
							},
						}
				});
				
		var controls = map.getControls(); // this is a ol.Collection
		  controls.forEach(function(control){
			if (control instanceof "ElevationPath") 
			{alert("y") };
		  });


		var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
		if ( centre[1] < 60 )
			
			{

			jQuery("#drawControlFormElevation-div").show();
			
			}


		map.addControl(elep);
/*
		setTimeout( function(){
			if (inFrance == true)				
				{	

				}
			else
				{
				map.removeControl(elep); 
				}

		}, 500); // delay 50 ms
		
*/
//	france();
	
	}
	
	function france() {
		
		setTimeout( function(){
					if (inFrance == true)				
				{	
				jQuery("div[id^=GPelevationPath-]").css({ "display": "inline" }); 
				}
			else
				{
				jQuery("div[id^=GPelevationPath-]").css({ "display": "none" }); 
				}
		}, 1500); // delay 50 ms
	}

function zoomto9()  {

	document.getElementById('showLayersInfo').innerHTML = '';
	jQuery('#showLayersInfo').hide();
	
	if ((urlLayerName == 170) ||  (urlLayerName == 117746212))
	{
		zoomtoextent();
	}
	else
	{
		map.getView().setZoom(9);
	}

	switchWFSOFF();
	switchWFSON();
	
	$('#map').focus();
}


function zoomtoextent() {
	$( "#layerfiltercheckbox" ).prop( "checked", false );
	
	if ( urlLayerName = 117746211)
	{
        var extent = [map.getLayers().getArray()[4].get('minx'), map.getLayers().getArray()[4].get('miny'), map.getLayers().getArray()[4].get('maxx'), map.getLayers().getArray()[4].get('maxy')];		
	}
	else
	{
	var overlay = getOverlay(urlLayerName);
        var extent = [overlay.get('minx'), overlay.get('miny'), overlay.get('maxx'), overlay.get('maxy')];
	}
        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
        map.getView().fit(extent, map.getSize());
				if ( $(window).width() < 850)
		{
		jQuery("#layersSideBarOutlines").hide();
		jQuery("#showlayersOutlinesExplore").show();
		}

			$('#map').focus();

}


function getOverlay(mosaic_id) {
    var layers = overlayLayers.slice();
    for (var x = 0; x < layers.length; x++) {
        if (layers[x].get('mosaic_id') == mosaic_id) return layers[x];
    }
}

function getOverlayRight(mosaic_id) {
    var layers = overlayLayersRight.slice();
    for (var x = 0; x < layers.length; x++) {
        if (layers[x].get('mosaic_id') == mosaic_id) return layers[x];
    }
}

function getColorLayers() {
 var layers = map.getLayers().getArray().slice();	
	for (var x = 0; x < layers.length; x++) {
         if (layers[x].get('title') == 'vectorcolor') return layers[x];
		    }
}

function getbaseLayer(mosaic_id) {
    var layers = baseLayers.slice();
    for (var x = 0; x < layers.length; x++) {
        if (layers[x].get('mosaic_id') == mosaic_id) return layers[x];
    }
}

function findByName(mosaic_id) {
		var layers = overlayLayers.slice();
		for (var i = 0; i < layers.length; i++) {
			if (mosaic_id == layers.item(i).get('mosaic_id')) {
			return layers.item(i);
			}
		}
	return null;
}



if ($("#layersSideBarOutlines").length > 0 )

	{

	// Make the DIV element draggable:
	 dragElement(document.getElementById("layersSideBarOutlines"));

}


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
	

	
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


	const layersSideBarOutlinesHeight = jQuery("#layersSideBarOutlines").css( "height" );


	jQuery("#layersSideBarOutlines").css({ 'bottom': "auto" });
//	jQuery("#layersSideBarOutlines").css({ 'height': layersSideBarOutlinesHeight + "px" });
	
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}



if ($("#searchSideBar").length > 0 )

	{

	// Make the DIV element draggable:
	 dragElementn(document.getElementById("searchSideBar"));
	 dragElementn(document.getElementById("mapkeypanel"));
}


function dragElementn(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDownn;
//    document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDownn;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDownn;
  }

  function dragMouseDownn(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
//	document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

  }

  function elementDrag(e) {

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
	

	
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
//    document.ontouchend = null;
    document.onmousemove = null;
//    document.ontouchmove  = null;
  }
}


jQuery("#searchSideBar").on("mouseenter", function(event) {
 		document.getElementById('searchSideBar').style.zIndex = 2002;
	}); 

jQuery("#searchSideBar").on("mouseleave", function(event) {
 		document.getElementById('searchSideBar').style.zIndex = 2000;
	}); 
	

jQuery("#layersSideBarOutlines").on("mouseenter", function(event) {
 		document.getElementById('layersSideBarOutlines').style.zIndex = 2002;
	}); 


jQuery("#layersSideBarOutlines").on("mouseleave", function(event) {
 		document.getElementById('layersSideBarOutlines').style.zIndex = 2001;
	}); 


function setURL() {

	var zoom = map.getView().getZoom();
	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	var mapgroupno = map.getLayers().getArray()[4].get('group_no');
    if (mapgroupno == 8) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=22&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
    else if (mapgroupno == 9) { window.location = "https://maps.nls.uk/openlayers/?id=11&zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5); }
	else if (mapgroupno == 18) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5)  + "&layers=24&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 31) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=11&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 32) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=14&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 34) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=101&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 35) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom="  + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=102&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 36) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=102&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 39) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }	
	else if (mapgroupno == 40) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 43) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=32&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 45) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom="  + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=34&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 50) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom="  + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=34&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 55) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 56) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 57) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=38&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 58) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 59) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=102&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 60) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=60&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 61) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=61&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 64) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=101&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 65) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=65&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 66) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=66&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 67) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom="  + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=28&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 69) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=69&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 70) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=70&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 79) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=79&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 80) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=34&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 82) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=77&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 84) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=80&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 85) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=34&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 93) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=83&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 95) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=14&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 96) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=83&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 98) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 100) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 107) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=80&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 108) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=80&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 109) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 116) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=84&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 170) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=170&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 187) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=70&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 188) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=70&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 193) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=193&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 195) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 199) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=103&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 208) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=118&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 209) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=118&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 210) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=118&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 211) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=118&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
  	else if (mapgroupno == 234) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=234&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
  	else if (mapgroupno == 242) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=242&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 253) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=11&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 257) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=257&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 258) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=258&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 271) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=268&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 272) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=271&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 282) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=242&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 284) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=284&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 285) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=285&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 287) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=285&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	else if (mapgroupno == 289) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5) + "&layers=289&b=1&point=" + centre[1].toFixed(5) + "," +  centre[0].toFixed(5); }
	
	else { 	window.location = "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5); }



}

function sidebysideURL() {
   var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
   var urlLayerno = map.getLayers().getArray()[4].get('mosaic_id');
   
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	    if ((windowWidth >= 850) && (windowHeight >= 400))  {
			if (pointClicked == '0,0')
				{  
			var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
			window.location = "https://" + window.location.hostname + "/geo/explore/side-by-side/#zoom=" + map.getView().getZoom()  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) +  "&layers=" + urlLayerno + "&right=ESRIWorld";
				}
			else
				{  
			var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
			window.location = "https://" + window.location.hostname + "/geo/explore/side-by-side/#zoom=" + map.getView().getZoom()  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) +  "&layers=" + urlLayerno + "&right=ESRIWorld"  + "&marker=" + pointClicked;
				}
		}
		else {

			if (pointClicked == '0,0')
				{  			
			window.location = "https://" + window.location.hostname + "/geo/explore/side-by-side/swipe/#zoom=" + map.getView().getZoom()  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) +  "&layers=" + urlLayerno + "&right=ESRIWorld";
				}
			else
				{  
			window.location = "https://" + window.location.hostname + "/geo/explore/side-by-side/swipe/#zoom=" + map.getView().getZoom()  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) +  "&layers=" + urlLayerno + "&right=ESRIWorld"  + "&marker=" + pointClicked;
				}
		}
}


function printURL() {
   // var permalink =  new OpenLayers.Control.Permalink({div: document.getElementById("permalink"), anchor: true});   
   // map.addControl(permalink);
   var a = document.createElement('a');
   a = window.location.hash;
   window.location = "/geo/explore/print/" + a ;
}

function spyURL() {
   // var permalink =  new OpenLayers.Control.Permalink({div: document.getElementById("permalink"), anchor: true});   
   // map.addControl(permalink);
   var a = document.createElement('a');
   a = window.location.hash;
   window.location = "spy/" + a ;
}

function cesiumURL() { 
   var resolution = map.getView().getResolutionForExtent(extent, map.getSize());
//   var distance = (Math.round(resolution)) * 200;
   var zoom = map.getView().getZoom();
   var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
   var urlLayerno = map.getLayers().getArray()[4].get('mosaic_id');
   window.location = "3d/#zoom=" + zoom + "&tilt=1.0&heading=0&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) + "&layers=" + urlLayerno ; 
}

function printURLback() {
   // var zoom = map.getZoom();
   // var longlat = map.getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")); 
   var a = document.createElement('a');
   a = window.location.hash;
   window.location = "/geo/explore/" + a ;
}

function gotoOS1900() {
   var zoom = map.getView().getZoom();
   var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");

   window.location = "/projects/os1900/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5); 
}

	
var acc = document.getElementsByClassName("showfilters");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {

    this.classList.toggle("active");
	
	if 		($("#filters").is(":visible"))
			{
				

			jQuery("#filters").hide();

			
			}
			else
			{
			jQuery("#filters").removeClass("hidden");
			jQuery("#filters").show();
			jQuery("#layersSideBarOutlines").css({ 'bottom' : '30px' } );
			
			}

  });
  
}

function loadOptions()
{
	args = [];
	var hash = window.location.hash;
	if (hash.length > 0)
	{
		var elements = hash.split('&');
		elements[0] = elements[0].substring(1); /* Remove the # */

		for(var i = 0; i < elements.length; i++)
		{
			var pair = elements[i].split('=');
			args[pair[0]] = pair[1];
		}
	}
}


function checkwfsResults()

	{


	setTimeout( function(){

		if ((map.getView().getZoom() > 10) && (document.getElementById('wfsResults').innerHTML.length < 50))
	
			{
			document.getElementById('wfsResults').innerHTML = '&nbsp;<a href="javascript:setZoomLimit();" alt="View map details" title="View map details" >View map details?</a>&nbsp;';
			}

	}, 500); // delay 50 ms
}


function switchparishWFSON()

	{
	wfsparishOFF = false;
	// jQuery("#wfsParishCountyResults").show();
	var parishinfo = document.getElementById('wfsParishCountyResults');
	parishinfo.innerHTML =  '&nbsp;Loading... please wait&nbsp;';
	checkparishWFS();

//			$('#map').focus();

	}


function switchparishWFSOFF()

	{
	wfsparishOFF = true;
	// jQuery("#wfsParishCountyResults").hide();
		var parishinfo = document.getElementById('wfsParishCountyResults');
		parishinfo.innerHTML =  '&nbsp;<a href="javascript:switchparishWFSON();" alt="Show specific parishes under mouse cursor" title="Show specific parishes under mouse cursor">Show parish details?</a>&nbsp;';
		if (map.getLayers().getArray()[7].get('name') == 'vectorParish') {  
	
			vectorSourceParish.clear();
		}

//			$('#map').focus();

	checkparishWFS();

	}


function checkparishWFS() 

	{

	var center = [];
	center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");

	if ((Math.round(center[0])  < -230000) || (Math.round(center[0]) > 700000 ) || (Math.round(center[1]) < 0) || (Math.round(center[1]) > 1300000 )) 
		{ return; }


	var mapZoom = map.getView().getZoom();
	var parishinfo = document.getElementById('wfsParishCountyResults');

	if (mapZoom  < 13) 
		
		{

		parishinfo.innerHTML =  '';

		}

	else if  ((mapZoom  > 12) && (wfsparishOFF == true))

	{

	parishinfo.innerHTML =  '&nbsp;<a href="javascript:switchparishWFSON();" alt="Show specific parishes under mouse cursor" title="Show specific parishes under mouse cursor">Show parish details?</a>&nbsp;';
	}

	else if ((mapZoom  > 12) && (wfsparishOFF == false))

	{

	getParish();
	}

}




function checkvectorSource()

	{

										$("#showLayersInfo").removeClass("hidden");
										jQuery('#showLayersInfo').show();	

										document.getElementById('showLayersInfo').innerHTML = 'No historic map overlay shown? <a href="javascript:zoomto9();">Zoom out</a> to view overlay.';
										
										$('#showLayersInfo').focus();

											setTimeout( function(){
												document.getElementById('showLayersInfo').innerHTML = '';

												jQuery('#showLayersInfo').hide();
												
												$('#map').focus();
											}, 10000); // delay 50 ms
							
	}


function getParish()   

	{


	console.log ("getParish_initiated");

//	document.getElementById('wfsParishCountyResults').innerHTML = '';

	var mapZoom = map.getView().getZoom();


	if (map.getLayers().getArray().length > 7)

	if (map.getLayers().getArray()[7].get('name') == 'vectorParish') {  

		map.getLayers().removeAt(7);
		vectorSourceParish.clear();

	}


	if (mapZoom < 13)

		{

			vectorSourceParish = new ol.source.Vector();


 	  		var geojsonFormat = new ol.format.GeoJSON();

			  var loadFeaturesParish = function(WFS_Feature) {
			     vectorSourceParish.addFeatures(geojsonFormat.readFeatures(WFS_Feature));
			};

		}

	else 


		{
			
		if (wfsparishOFF == false)
			
			{
			
			
			
		console.log("looking up parishes");

	    var geojsonFormat = new ol.format.GeoJSON();

		const geometryName = 'the_geom';
		var extent = map.getView().calculateExtent(map.getSize());
		const srsName = 'EPSG:3857';

		const bboxFilter = new ol.format.filter.Bbox(geometryName, extent, srsName);

				var featureRequestParish = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['Scot_Eng_Wales_Ireland_1950s_parish'],
				  propertyNames: ['the_geom','COUNTY','PARISH','TYPE'],
				  outputFormat: 'application/json',
				  filter: bboxFilter
					
				  });					
		


		
//		console.log("featureRequest: " + featureRequest);
		
		var xmlString = new XMLSerializer().serializeToString(featureRequestParish);
		console.log( "featureRequest: " + xmlString);


// then post the request and add the received features to a layer
		fetch('https://geoserver3.nls.uk/geoserver/wfs', {

		  method: 'POST',

		  body: new XMLSerializer().serializeToString(featureRequestParish),
		}).then(function(response) {

		  return response.json();
		  


		}).then(function(json) {


        vectorSourceParish.clear(true);
	

				
		  var features = new ol.format.GeoJSON().readFeatures(json);
		  vectorSourceParish.addFeatures(features);

			var vectorParish = new ol.layer.Vector({
			  name: 'vectorParish',
			  source: vectorSourceParish,
			  style: new ol.style.Style({
			    fill: new ol.style.Fill({
			      color: 'rgba(0, 0, 0, 0)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: 'rgba(0, 0, 0, 0)',
			      width: 0
			    })
			  }),
			className: 'vectorParish'
			});

		if (map.getLayers().getArray()[7].get('name') !== 'vectorParish')
	
			{
			map.getLayers().insertAt(7,vectorParish);
			}



			var infoCounty = document.getElementById('wfsParishCountyResults');

			var displayFeatureInfoParish = function(pixel) {

				var selectedFeaturesParish = [];
			
				  var feature = map.forEachFeatureAtPixel(pixel, function ( feature, layer ) {

					console.log("feature: " + feature);

					infoCounty.innerHTML = feature.get('PARISH');

					selectedFeaturesParish.push(feature);
				    }, {
				        layerFilter: function(layer) {
				            return layer === vectorParish;
				        }
				
				    });


			          if (selectedFeaturesParish.length> 0)

				  {

				  if (selectedFeaturesParish[0].get('COUNTY').length > 0) 
					{infoCounty.innerHTML = '&nbsp;' + selectedFeaturesParish[0].get('PARISH') + '&nbsp;parish, '  + selectedFeaturesParish[0].get('COUNTY') + ' (1950s)&nbsp;<a href="javascript:switchparishWFSOFF();" alt="Turn off parish details" title="Turn off parish details"><span class="WFSclose">&times;</span></a>&nbsp;';   } 
				  if (selectedFeaturesParish[0].get('TYPE').length > 0) 
//					if (inScotland = true)
					{infoCounty.innerHTML = '&nbsp;' + selectedFeaturesParish[0].get('PARISH') + '&nbsp;parish, '  + selectedFeaturesParish[0].get('COUNTY') + ' (1950s) - <a href="javascript:showthisparish();" alt="View this parish in Boundaries Viewer" title="View this parish in Boundaries Viewer" >View parish</a> &nbsp; (1950s)&nbsp;<a href="javascript:switchparishWFSOFF();" alt="Turn off parish details" title="Turn off parish details"><span class="WFSclose">&times;</span></a>&nbsp;';    } 
						
				  }
				};




				map.on('pointermove', function(evt) {

				  evt.preventDefault();

				  var center = [];
				  center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");




				  if (map.getView().getZoom() < 11) 
					{  document.getElementById('wfsParishCountyResults').innerHTML = ''; return; }
				
					else if ((map.getView().getZoom() > 10) && (wfsparishOFF == true ))
						
					{  document.getElementById('wfsParishCountyResults').innerHTML = '&nbsp;<a href="javascript:switchparishWFSON();" alt="Show specific parishes under mouse cursor" title="Show specific parishes under mouse cursor">Show parish details?</a>&nbsp;'; return; }
				  else
				  {
				  var pixel = evt.pixel; 
					console.log("displayFeatureinfo working");

				  displayFeatureInfoParish(pixel);

				   }
				});
				
//			displayFeatureInfoParish([100,100]);
			})
			.catch(error => {
				
			    console.error("Fetch error:", error.message);
				document.getElementById('wfsParishCountyResults').innerHTML = '';
				return;
			})
			
			}
			
		}
}


function switchWFSON()

	{
	wfsOFF = false;
	var info = document.getElementById('wfsResults');
	info.innerHTML =  '&nbsp;loading... please wait&nbsp;';

//	$('#map').focus();

	checkWFS();
	}


function switchWFSOFF()

	{
	wfsOFF = true;
	
//	if (map.getLayers().getArray()[6].get('name') == 'vector') {  
//			vectorSource = new ol.source.Vector();
//			map.getLayers().removeAt(6); 
//	}

//	$('#map').focus();

	checkWFS();
	}
	


function splitLists() {

 jQuery('#singlelist').hide();

 jQuery('#keyword').hide(); 
 

 
 jQuery('#keyword-search').show();
 
  document.getElementById('filteroverlaysinput').value = 'Type keyword...';

 jQuery('#splitlist').show();
 document.getElementById( "slider" ).noUiSlider.set([1745,1990]);
 jQuery( "#scaleslider" ).slider('setValue',[12,20]);
// zoomInOut();
	scaleslidestop();
	$('#map').focus();
}

function singleList() {

 jQuery('#singlelist').show();
 
 jQuery('#keyword').removeClass('hidden');
 
  jQuery('#keyword').show(); 
  
  jQuery('#keyword-search').hide();
  
  document.getElementById('keywordsearch').value = 'Type keyword...';
 
  jQuery('#splitlist').hide();

// zoomInOut();
	  scaleslidestop();
	$('#map').focus();
}

function checkWFS() 

	{

	var mapZoom = map.getView().getZoom();
	var info = document.getElementById('wfsResults');
	var map_group_no = map.getLayers().getArray()[4].get('group_no');
	var map_mosaic_id = map.getLayers().getArray()[4].get('mosaic_id');

	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");

	
	if (mapZoom  < 13) 
		
		{

		if (map_group_no == 1 ) {info.innerHTML =  '&amp;<span style="color:grey">Display map in centre of screen</span> (<a href="javascript:zoomin13();">Zoom in</a>)&amp;';}
		else if (map_group_no == 31 ) {info.innerHTML =  '&nbsp;<span style="color:grey">Display photo details?</span> ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 32 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 34 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 35 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 36 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 38 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 39 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 40 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 41 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 43 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 50 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 55 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 56 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 57 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 58 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 59 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 61 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 64 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 65 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 66 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 70 ) 
/*		    { if ( map_mosaic_id == 117746211 )
			  {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
			else if ( map_mosaic_id == 117746212 ) 
			 {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
			else if ( map_mosaic_id == 117746213 ) 
			 {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
			else if ( map_mosaic_id == 117746214 ) 
			 {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
			else if ( map_mosaic_id == 187 ) 
			 {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
			else if ( map_mosaic_id == 188 ) */
			
			 {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}

//		    }
		else if (map_group_no == 84 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 85 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 93 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 95 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 96 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 98 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 100 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 101 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 106 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 116 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 147 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 148 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 150 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 152 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 155 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 170 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 173 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 178 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 180 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 187 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 193 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 194 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 195 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 196 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 199 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}

		else if (map_group_no == 206 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 208 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 209 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 210 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 211 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 242 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 253 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 257 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 258 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 282 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 284 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 285 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 287 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}
		else if (map_group_no == 289 ) {info.innerHTML =  '&nbsp;Display map details? ( <a href="javascript:zoomin13();">Zoom in</a> )&nbsp;';}

		else 
			{
			info.innerHTML =  '';
			return;
			}
		}

	else if  ((mapZoom  > 12) && (wfsOFF == true))

		{
//		alert("wfsOFF1: " + wfsOFF);

		if (map_group_no == 1 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 31 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of photo under mouse cursor" title="Show specific details of photo under mouse cursor">Display photo details? / View or order this photo?</a>&nbsp;';}
		else if (map_group_no == 32 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 34 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 35 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 36 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 38 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 39 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 40 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 41 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 43 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 50 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 55 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 56 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 57 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 58 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 59 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 61 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 64 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 65 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 66 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 70 ) 
/*		    { if ( map_mosaic_id == 117746211 )
			  {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
			else if ( map_mosaic_id == 117746212 ) 
			 {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
			else if ( map_mosaic_id == 117746213 ) 
			 {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
			else if ( map_mosaic_id == 117746214 ) 
			 {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
			else if ( map_mosaic_id == 187 ) 
			 {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
			else if ( map_mosaic_id == 188 ) */
			
			 {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}

//		    }
		else if (map_group_no == 84 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 85 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 93 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 95 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 96 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 98 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 100 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 101 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 106 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 116 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 147 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 148 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 150 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 152 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 155 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 170 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 173 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 178 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 180 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 187 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 193 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 194 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 195 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 196 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 199 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 206 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 208 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 209 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 210 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 211 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 242 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 253 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of photo under mouse cursor" title="Show specific details of photo under mouse cursor">Display photo details? / View or order this photo?</a>&nbsp;';}
		else if (map_group_no == 257 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}
		else if (map_group_no == 258 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of photo under mouse cursor" title="Show specific details of photo under mouse cursor">Display photo details? / View or order this photo?</a>&nbsp;';}
		else if (map_group_no == 282 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details?</a>&nbsp;';}
		else if (map_group_no == 284 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details?</a>&nbsp;';}
		else if (map_group_no == 285 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details?</a>&nbsp;';}
		else if (map_group_no == 287 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details?</a>&nbsp;';}
		else if (map_group_no == 289 ) {info.innerHTML =  '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';}

		else 
			{
			info.innerHTML =  '';
			return;
			}
		}

	        else if  ((mapZoom  > 12) && (wfsOFF == false))
			{
//		alert("wfsOFF2: " + wfsOFF);
			setZoomLimit();

			}

		
	}

function zoomin13()  {
	
		$("#showCoordinatesinfo").removeClass("hidden");
			if ($("#morePanel") != null ) { jQuery("#morePanel").hide(); }
			if ($("#footermore") != null ) { jQuery("#footermore").show(); }

			$("#showCoordinatesinfo").css({ 'text-align': 'center' });
				$("#showCoordinatesinfo").css({ 'min-width': '250px' });

			jQuery('#showCoordinatesinfo').show();
       			document.getElementById('showCoordinatesinfo').innerHTML = 'Zooming in...';
	
			setTimeout( function(){
				map.getView().setZoom(13);
			}, 500); // delay 50 ms
	
		setTimeout( function(){
       			document.getElementById('showCoordinatesinfo').innerHTML = '';
			jQuery('#showCoordinatesinfo').hide();
			
			jQuery("#morePanel").show(); 
			jQuery("#footermore").hide(); 
			
			}, 2000); // delay 50 ms
	
				if ($(window).width() < 850)
				{
				checkWFSmobile();
				}
				else
				{
				checkWFS();
				}
//		$('#map').focus();
}

function checkWFSmobile() 

	{

	var mapZoom = map.getView().getZoom();
	var info = document.getElementById('wfsResults-mobile');
	var map_group_no = map.getLayers().getArray()[4].get('group_no');
	var map_mosaic_id = map.getLayers().getArray()[4].get('mosaic_id');

	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");

	if (mapZoom  < 13) 
		
		{

		info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div>Display map in centre of screen (<a href="javascript:zoomin13();">Zoom in</a>)';

		}


	else if  ((mapZoom  > 12) && (wfsOFF == true))

		{
//		alert("wfsOFF1: " + wfsOFF);

		if (map_group_no == 1 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 31 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of photo in centre of screen" title="Show specific details of photo in centre of screen">Display photo in centre of screen</a>';}
		else if (map_group_no == 32 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 34 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 35 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 36 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 38 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 39 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 40 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 41 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 43 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 50 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 55 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 56 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 57 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 58 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 59 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 61 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 64 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 65 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 66 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 70 ) 
/*		    { if ( map_mosaic_id == 117746211 )
			  {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
			else if ( map_mosaic_id == 117746212 ) 
			 {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
			else if ( map_mosaic_id == 117746213 ) 
			 {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
			else if ( map_mosaic_id == 117746214 ) 
			 {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
			else if ( map_mosaic_id == 187 ) 
			 {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
			else if ( map_mosaic_id == 188 ) */
			
			
			 {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}

//		    }
		else if (map_group_no == 84 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 85 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 93 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 95 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 96 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 98 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 100 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 101 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 106 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 116 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 147 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 148 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 150 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 152 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 155 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 170 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 173 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 178 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 180 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 187 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 193 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 194 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 195 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 196 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 199 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}

		else if (map_group_no == 206 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 208 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 209 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 210 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 211 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 242 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 253 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of photo in centre of screen" title="Show specific details of photo in centre of screen">Display photo in centres of screen</a></li>';}
		else if (map_group_no == 257 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 258 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 282 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 284 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 285 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 287 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}
		else if (map_group_no == 289 ) {info.innerHTML =  '<div class="morePanel-img"><img src="/img/display-map.png" alt="display map icon image" width="28" /></div><a href="javascript:getmapsheetexplore();" alt="Show specific details of map in centre of screen" title="Show specific details of map in centre of screen">Display map in centre of screen</a>';}

		else 
			{
			info.innerHTML =  '';
			return;
			}
		}

	        else if  ((mapZoom  > 12) && (wfsOFF == false))
			{
//		alert("wfsOFF2: " + wfsOFF);
			setZoomLimit();

			}

		
	}


function setZoomLimit()

	{ 

	var mapZoom = map.getView().getZoom();

	var extent = map.getView().calculateExtent(map.getSize());

	if (map.getLayers().getArray().length > 6)

	if (map.getLayers().getArray()[6].get('name') == 'vector') {  

			vectorSource = new ol.source.Vector();

			map.getLayers().removeAt(6); 

//	console.log("removing vector layer 6");

	}


// console.log("Afterclear onmove length: " + map.getLayers().getArray()[6].getSource().getFeatures().length);


// setTimeout( function(){


	if (mapZoom  < 13)

		{

//	console.log("less than 13");


/*
			vectorSource = new ol.source.Vector();

	  		var geojsonFormat = new ol.format.GeoJSON();
		
			loadFeatures = function(WFS_Feature) {
  			     vectorSource.addFeatures(geojsonFormat.readFeatures(WFS_Feature));
			};
*/

			vectorSource.clear(true);

		}

     else if     (mapZoom  > 12) 

	 {
		 
	    var geojsonFormat = new ol.format.GeoJSON();

		const geometryName = 'the_geom';
		var extent = map.getView().calculateExtent(map.getSize());
		const srsName = 'EPSG:3857';

		const bboxFilter = new ol.format.filter.Bbox(geometryName, extent, srsName);
		
		var TypeName = map.getLayers().getArray()[4].get('typename');
		
		if (TypeName)
		{
		TypeName2 = TypeName.replace("nls:", "");
		
		if ( map.getLayers().getArray()[4].get('group_no') == '173')
			
			{
		
				var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['National_Grid_WFS_1250','National_Grid_WFS_2500'],
				  propertyNames: ['the_geom','IMAGEURL','WFS_TITLE','SCALE'],
				  outputFormat: 'application/json',
				  filter: bboxFilter
					
				  });					

			}
			
			else

			{
		

				var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: [TypeName2],
				  propertyNames: ['the_geom','IMAGEURL','WFS_TITLE'],
				  outputFormat: 'application/json',
				  filter: bboxFilter
					
				  });					

			}


		// then post the request and add the received features to a layer
				fetch('https://geoserver.nls.uk/geoserver/wfs', {

				  method: 'POST',

				  body: new XMLSerializer().serializeToString(featureRequest)
				}).then(function(response) {

				  return response.json();
				}).then(function(json) {


				vectorSource.clear(true);
			

						
				  var features = new ol.format.GeoJSON().readFeatures(json);
				  vectorSource.addFeatures(features);


				var vector = new ol.layer.Vector({
				  name: 'vector',
				  source: vectorSource,
				  style: new ol.style.Style({
					fill: new ol.style.Fill({
					  color: 'rgba(0, 0, 0, 0)'
					}),
					stroke: new ol.style.Stroke({
					  color: 'rgba(0, 0, 0, 0)',
					  width: 0
					})
				  })
				});

		// if (map.getLayers().getLength() > 3) 

		if (map.getLayers().getArray()[6].get('name') !== 'vector')
		
			{

			map.getLayers().insertAt(6,vector);
//			console.log("adding vector layer 6");

			}

			
				var displayFeatureInfo = function(pixel) {

				selectedFeatures = [];
				
				  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				        // return feature;

					selectedFeatures.push(feature);
				    }, {
				        layerFilter: function(layer) {
				            return layer === vector;
				        }
				
				    });

				  var info = document.getElementById('wfsResults');

//			selectedFeatures.sort(function(a, b){
//					   var nameA=a.id, nameB=b.id
//					   if (nameA < nameB) //sort string ascending
//					       return -1 
//					   if (nameA > nameB)
//					       return 1
//					   return 0 //default return value (no sorting)
//			
//					})


				if ( map.getLayers().getArray()[4].get('group_no') == '173')
				{
					selectedFeatures.sort(function(a, b){
				   var nameA=a.get('SCALE'), nameB=b.get('SCALE')
					   if (nameA < nameB) //sort string ascending
					       return -1 
					   if (nameA > nameB)
					       return 1
					   return 0 //default return value (no sorting)
			
					})
					
				}

				  var selectedFeaturesLength = selectedFeatures.length;
				  var selectedFeaturesLengthMinusOne = (selectedFeatures.length - 1);
	
			          if (selectedFeaturesLength == '0')
						  
						  {
							  info.innerHTML = '';
						  }
	
			          if (selectedFeaturesLength > 0)

				  {


			           if (selectedFeaturesLength == '1') 

				  {
					if (selectedFeatures[0].get('WFS_TITLE').length < 2) { return; }
					else
						
					
					if  ( map.getLayers().getArray()[4].get('group_no') == '282')
						  
						  {
							  if (selectedFeatures[0].get('IMAGEURL') == 'javascript:gotosheetgeo();')
								  
								  {

							info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp;<a href="javascript:switchWFSOFF();" alt="Turn off specific map details" title="Turn off specific map details"><span class="WFSclose">&times;</span></a>&nbsp;';  
							
								  }
								  
								  else
							{
							info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + ' - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();" alt="Turn off specific map details" title="Turn off specific map details"><span class="WFSclose">&times;</span></a>&nbsp;';  
							}
							  
						  }
					else
							{
							info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + ' - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();" alt="Turn off specific map details" title="Turn off specific map details"><span class="WFSclose">&times;</span></a>&nbsp;';  
							}
				  }


			      else if (selectedFeaturesLength == '2')
					  
					  {

					  if  ( map.getLayers().getArray()[4].get('group_no') == '173')
						  
						  {
							  info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;'
						  }
						  else
						  {

					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;<br/>' +
					'&nbsp;' + selectedFeatures[1].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[1].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
					
						  }
						  
					  }

			          else if (selectedFeaturesLength == '3')

				  {

					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;<br/>' +
					'&nbsp;' + selectedFeatures[1].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[1].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
              				'&nbsp;' + selectedFeatures[2].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[2].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
   
				  }

			          else if (selectedFeaturesLength == '4')

				  {

					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();" alt="Turn off specific map details" title="Turn off specific map details"><span class="WFSclose">&times;</span></a>&nbsp;<br/>' +
					'&nbsp;' + selectedFeatures[1].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[1].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
              				'&nbsp;' + selectedFeatures[2].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[2].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
                 			'&nbsp;' + selectedFeatures[3].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[3].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;';  
   
				  }

				}
			
				};


				map.on('pointermove', function(evt) {

				  evt.preventDefault();

				  var center = [];
				  center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");

				  if ((Math.round(center[0])  < -230000) || (Math.round(center[0]) > 700000 ) || (Math.round(center[1]) < 0) || (Math.round(center[1]) > 1300000 )) 
					{ return; }

				  if (map.getView().getZoom() < 12)
					{ document.getElementById('wfsResults').innerHTML = ''; return; }


				if (wfsOFF == false)
				{
				  var pixel = map.getEventPixel(evt.originalEvent);
				  displayFeatureInfo(pixel);
				}


				});

			displayFeatureInfo([100, 100]);
            })
			.catch(error => {
				
			    console.error("Fetch error:", error.message);
				return;
			})
		}
	}

}

function checknumWFSFeatures() {

			var mapZoom = map.getView().getZoom();	
			
//			if ((mapZoom  > 12) && ($(window).width() > 850))
//				{
//				wfsOFF = false;				
//				}
			
			
	
			var mapGroupNo = map.getLayers().getArray()[4].get('group_no');

			if ((( ((((( (mapGroupNo ==	31	) || (mapGroupNo ==	34	) || (mapGroupNo ==	41	) || (mapGroupNo ==	61	) || (mapGroupNo ==	64	) || (mapGroupNo ==	70	) ||  (mapGroupNo ==	116	) ||  (mapGroupNo ==	187	)  || (mapGroupNo == 253) ))))) )))
				
			{

			var mapZoom = map.getView().getZoom();							
			if ((mapZoom  > 12) && ($(window).width() > 850))
				
				{
					
					var extent = map.getView().calculateExtent(map.getSize());
						
					var geoJsonUrl = 'https://geoserver.nls.uk/geoserver/wfs?service=WFS&' +
			        'version=2.0.0&request=GetFeature&typename=' + map.getLayers().getArray()[4].get('typename') +
			        '&resultType=hits&outputFormat=text/xml' +
			        '&srsname=EPSG:3857&bbox=' + extent + ',EPSG:3857';		
							
					$.ajax({
							  type: 'GET',
							  url: geoJsonUrl,
							  dataType: "xml",
							  headers: { 'Content-Type': 'text/plain' },
							  contentType: 'text/xml',
							  success: function (data){

//								  console.log(data);						  
							  
							var serializer = new XMLSerializer();
							var featString = serializer.serializeToString(data);
						
//								  console.log("featString: " + featString);

							var $doc = $.parseXML(featString);
								  
//								 console.log($doc);
								 
							var numWFSFeatures = $($doc).find("[numberMatched]").attr("numberMatched");

//								 console.log("numWFSFeatures: " + numWFSFeatures);				

							if (numWFSFeatures == 0)
								
									{ 
									checkvectorSource();
									}

							  }   
							});
				}
			}

}

// checkwfsResults();

function updateUrl()
{

		noOverlaySelected = false;

	 if (urlLayerName == undefined)
	 {

		noOverlaySelected = true;
		urlLayerName = '6';

	 }

	 else 
	{
	 urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
	 }

 	if (baseLayerName == undefined) 
			 {
				baseLayerName = '1';

			 }

	 else 
			{

			 baseLayerName = map.getLayers().getArray()[2].get('mosaic_id');
			 }

	 if (mapslidervalue.length < 1)
	 {
		mapslidervalue = 100;
	 }

	if (pointClicked == undefined)
			{
			pointClicked = '0,0';
			}
	
	if (pointClicked.length > 20)
		{

		pointClicked2 = pointClicked.split(",");

		pointClicked2lon = parseFloat(pointClicked2[0]);
		pointClicked2lat = parseFloat(pointClicked2[1]);
	
		pointClicked = pointClicked2lon.toFixed(6) + "," + pointClicked2lat.toFixed(6);
		
		}

	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");

	if (pointClicked == '0,0')
	{
	window.location.hash = "zoom=" + map.getView().getZoom().toFixed(1)  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) +  "&layers=" + urlLayerName + "&b=" + baseLayerName + "&o=" + mapslidervalue; 
	}
	else
	{
	window.location.hash = "zoom=" + map.getView().getZoom().toFixed(1)  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) +  "&layers=" + urlLayerName + "&b=" + baseLayerName + "&o=" + mapslidervalue + "&marker=" + pointClicked ; 
	}

	var zoom = map.getView().getZoom();
	
//		checkWidth();
}

function getmapkey() {
	
	document.getElementById("mapkeypanelcontent").innerHTML = '';
	
//	console.log("getmapkey running");
	
	$("#mapkeypanel").removeClass("hidden");
	
	var windowHeight = $(window).height();
	
	var windowWidth = $(window).width();	
	
	if ( (windowWidth >= 850) && (windowHeight >= 700))
		{
		var mapkeypanelHeight = (windowHeight - 520);
		}
	else
		{
		var mapkeypanelHeight = (windowHeight - 360);
		
			jQuery("#mapkeypanel").css({ 'height': '250px' });
			jQuery("#mapkeypanel").css({ 'width': '250px' });
			
			
			if ($("#searchSideBar") != null )  { jQuery("#searchSideBar").hide(); }
			if ($("#show") != null ) { jQuery("#show").show(); }
		}
		
	const mapkeypanelPx = (mapkeypanelHeight + 'px');
	
	jQuery("#mapkeypanel").css({ 'top': mapkeypanelPx });
	
	$("#mapkeypanel").show();
	
	
	jQuery("#layersSideBarOutlines").hide();
	jQuery("#showlayersOutlinesExplore").show();
	
		if (map.getLayers().getArray()[4].get('group_no') == '66') // Soil Survey - special function to return specific sheet popup

		{
			
					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
					// console.log("bboxextent: " + bboxextent );

					var geojsonFormat = new ol.format.GeoJSON();
					
					var urlgeoserver =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=' + map.getLayers().getArray()[4].get('typename') +
							'&PropertyName=(the_geom,IMAGEURL,WFS_TITLE)&outputFormat=text/javascript&format_options=callback:loadFeatures' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857';
							
					var ajaxgeoserver = $.ajax({url: urlgeoserver, dataType: 'jsonp', cache: false })

					vectorSourceGeol = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					window.loadFeatures = function(response) {
						 vectorSourceGeol.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					
					// console.log("featuresALL.length:" + featuresALL.length);
					
					if (featuresALL.length < 1)
								{	    
						

									// newwindow= window.open("https://maps.nls.uk/view/91541632", "popup", "height=80%,width=100%,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://maps.nls.uk/view-sp/107394481" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';
								}
							
							
						  else  {

							var keytext = featuresALL[0].properties.IMAGEURL;
							var keytext1 = keytext.replace('view','view-sp');
							
							// console.log("keytext1:" + keytext1);

							// console.log(keytext);
							

									// newwindow= window.open(keytext1, "popup", "height=650,width=500,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="' + keytext1 + '" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';


							} 

				};

						var vectorLayerGeol = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - Geol",
							source: vectorSourceGeol,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(0, 0, 0, 0)',
							  width: 0
							})
						})
					});
					
					var maplayerlength = map.getLayers().getLength();
					map.getLayers().insertAt(maplayerlength,vectorLayerGeol);
			
			
		}

		else if (map.getLayers().getArray()[4].get('group_no') == '93') // Geological Survey - special function to return specific sheet popup

		{

					// console.log("getmapkey group_no== 93");

					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
					// console.log("bboxextent: " + bboxextent );

					var geojsonFormat = new ol.format.GeoJSON();
					
					var urlgeoserver =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=' + map.getLayers().getArray()[4].get('typename') +
							'&PropertyName=(the_geom,IMAGEURL,WFS_TITLE)&outputFormat=text/javascript&format_options=callback:loadFeatures' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857';
							
					var ajaxgeoserver = $.ajax({url: urlgeoserver, dataType: 'jsonp', cache: false })

					vectorSourceGeol = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					window.loadFeatures = function(response) {
						 vectorSourceGeol.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					
					// console.log("featuresALL.length:" + featuresALL.length);
					
					if (featuresALL.length < 1)
							{	    
						
								if 	(lat > 54)
									
									{
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://maps.nls.uk/view-sp/91541629" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';								
									}
								else
								{
									// newwindow= window.open("https://maps.nls.uk/view/91541632", "popup", "height=80%,width=100%,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://maps.nls.uk/view-sp/91541632" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';
								}
							}
							
						  else  {

							var keytext = featuresALL[0].properties.IMAGEURL;
							var keytext1 = keytext.replace('view','view-sp');
							
							// console.log("keytext1:" + keytext1);

							// console.log(keytext);
							

									// newwindow= window.open(keytext1, "popup", "height=650,width=500,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="' + keytext1 + '" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';


							} 

				};

						var vectorLayerGeol = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - Geol",
							source: vectorSourceGeol,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(0, 0, 0, 0)',
							  width: 0
							})
						})
					});
					
					var maplayerlength = map.getLayers().getLength();
					map.getLayers().insertAt(maplayerlength,vectorLayerGeol);


		}
			
		
		else if (map.getLayers().getArray()[4].get('group_no') == '96') // Geological Survey - special function to return specific sheet popup

		{


					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
					// console.log("bboxextent: " + bboxextent );


						
					var geojsonFormat = new ol.format.GeoJSON();
				

					
					var urlgeoserver =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=' + map.getLayers().getArray()[4].get('typename') +
							'&PropertyName=(the_geom,IMAGEURL,WFS_TITLE)&outputFormat=text/javascript&format_options=callback:loadFeatures' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857';
							
					var ajaxgeoserver = $.ajax({url: urlgeoserver, dataType: 'jsonp', cache: false })

					vectorSourceGeol = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					 window.loadFeatures = function(response) {
						 vectorSourceGeol.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					

					
					if (featuresALL.length < 1)
							{	    
						
								if 		(lat > 54)
									
									{
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://maps.nls.uk/view-sp/91541629" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';								
									}
								else
								{
									// newwindow= window.open("https://maps.nls.uk/view/91541632", "popup", "height=80%,width=100%,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://maps.nls.uk/view-sp/91541632" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';
								}
							}
							
						  else  {

							var keytext = featuresALL[0].properties.IMAGEURL;
							var keytext1 = keytext.replace('view','view-sp');
							
						//	console.log("keytext1:" + keytext1);

						//	console.log(keytext);
							

									// newwindow= window.open(keytext1, "popup", "height=650,width=500,status=no,toolbar=no,scrollbars=yes,menubar=no,location=no,fullscreen=no");
									document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="' + keytext1 + '" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';


							} 

				};

						var vectorLayerGeol = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - Geol",
							source: vectorSourceGeol,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(0, 0, 0, 0)',
							  width: 0
							})
						})
					});
					
					var maplayerlength = map.getLayers().getLength();
					map.getLayers().insertAt(maplayerlength,vectorLayerGeol);
			
		}
		
		else
		{
			var keytext = map.getLayers().getArray()[4].get('key');			
		
		
		
		if (keytext.includes("symbols-popup"))
			
			{
				
			document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://' + keytext + '" style= "width: 100%;  height: 100%; resize: both;  overflow-y: scroll; border: 1px; padding: 5px;" ></iframe>';
			
			}
			else
			
			{
				
			document.getElementById("mapkeypanelcontent").innerHTML += '<iframe src="https://' + keytext + '" scrolling="no" style= "width: 100%;  height: 100%; resize: both;  overflow: auto; border: 1px; padding: 5px; z-index:0"></iframe>';
			
			}
			
		}
}


function showthismap(imageurl) {


//			console.log("imageurl" + imageurl);

			 if (imageurl.length > 0)
	
				{ 

				window.location = imageurl; 

				}
	
			else {	    
				// setURL();
				document.getElementById('wfsResults').innerHTML = "Sorry, couldn't find this map";
			}

}

function showthisparish() {

		var coordinate = map.getView().getCenter();

		var pixel = map.getPixelFromCoordinate(coordinate);

			var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				        return feature;
				 }, {
				     layerFilter: function(layer) {
				         return layer === vectorParish;
				 }
				
			});

		if (feature) 
				{

				var extent = feature.getGeometry().getExtent();
				}
			else
				{
        			var extent = map.getView().calculateExtent(map.getSize());
				}

		  	 var resolution = map.getView().getResolutionForExtent(extent, map.getSize());
	 		 var zoom1 = map.getView().getZoomForResolution(resolution);

		  	 var resolution = map.getView().getResolutionForExtent(extent, map.getSize());
	 		 var zoom1 = map.getView().getZoomForResolution(resolution);

			 var y = extent[1] + (extent[3] - extent[1]) / 2; 

		
			 if (map.getSize()[0] < 600 ) 
								
					{
			 		var x1 = extent[0] + (extent[2] - extent[0]) / 2; 
			 		var x = extent[2] + (x1 - extent[0] ) / 2; 
					var zoom = Math.round(zoom1 - 2);
					}
				else
					{
					var zoom = Math.round(zoom1 - 1);
			 		var x = extent[0] + (extent[2] - extent[0]) / 2; 
					}

		var newCentre = [];
		var newCentre = ol.proj.transform([x,y], "EPSG:3857", "EPSG:4326");
		window.location = "https://maps.nls.uk/geo/boundaries/#zoom=" + zoom + "&lat=" + newCentre[1].toFixed(5) + "&lon=" + newCentre[0].toFixed(5) + "&dates=1950" + "&point=" + newCentre[1].toFixed(5) + "," + newCentre[0].toFixed(5);

}

function showmymap(image) {



				  if (image) {

//  console.log("https://maps.nls.uk/view/" + image);


						window.location = "https://maps.nls.uk/view/" + image; 

						}
	
					   else {	    
						// setURL();
						document.getElementById('wfsResults').innerHTML = "Sorry, couldn't find this map";
					  }
						

}


      var container = document.getElementById('popup');
      var content = document.getElementById('popup-content');
      var closer = document.getElementById('popup-closer');

      var overlaylayer = new ol.Overlay(({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      }));
       
      closer.onclick = function() {
        overlaylayer.setPosition(undefined);
	remove_getCoordinates();
        closer.blur();

		$('#map').focus();

        return false;
      };



const convertToClick = (e) => {
    const evt = new MouseEvent('click', { bubbles: true })
    evt.stopPropagation = () => {}
    e.target.dispatchEvent(evt)
}


// From https://www.movable-type.co.uk/scripts/latlong-gridref.html NT261732
    function gridrefNumToLet(e, n, digits) {
        // get the 100km-grid indices
        var e100k = Math.floor(e / 100000),
        n100k = Math.floor(n / 100000);

        if (e100k < 0 || e100k > 6 || n100k < 0 || n100k > 12) return '';

        // translate those into numeric equivalents of the grid letters
        var l1 = (19 - n100k) - (19 - n100k) % 5 + Math.floor((e100k + 10) / 5);
        var l2 = (19 - n100k) * 5 % 25 + e100k % 5;

        // compensate for skipped 'I' and build grid letter-pairs
        if (l1 > 7) l1++;
        if (l2 > 7) l2++;
        var letPair = String.fromCharCode(l1 + 'A'.charCodeAt(0), l2 + 'A'.charCodeAt(0));

        // strip 100km-grid indices from easting & northing, and reduce precision
        e = Math.floor((e % 100000) / Math.pow(10, 5 - digits / 2));
        n = Math.floor((n % 100000) / Math.pow(10, 5 - digits / 2));

        Number.prototype.padLZ = function(w) {
            var n = this.toString();
            while (n.length < w) n = '0' + n;
            return n;
        }

        var gridRef = letPair + " " + e.padLZ(digits / 2) + " " + n.padLZ(digits / 2);

        return gridRef;
    }
	function gridrefLetToNum(gridref) {
	  // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
	  var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	  var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
	  // shuffle down letters after 'I' since 'I' is not used in grid:
	  if (l1 > 7) l1--;
	  if (l2 > 7) l2--;

	  // convert grid letters into 100km-square indexes from false origin (grid square SV):
	  var e = ((l1-2)%5)*5 + (l2%5);
	  var n = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);

	  // skip grid letters to get numeric part of ref, stripping any spaces:
	  gridref = gridref.slice(2).replace(/ /g,'');

	  // append numeric part of references to grid index:
	  e += gridref.slice(0, gridref.length/2);
	  n += gridref.slice(gridref.length/2);

	  // normalise to 1m grid, rounding up to centre of grid square:
	  switch (gridref.length) {
		case 2: e += '5000'; n += '5000'; break;
	    case 4: e += '500'; n += '500'; break;
	    case 6: e += '50'; n += '50'; break;
	    case 8: e += '5'; n += '5'; break;
	    // 10-digit refs are already 1m
	  }

	  return [e, n];
	}



if (document.getElementById('Modal') !== null) {

	// Get the modal
	var modal = document.getElementById('Modal');
	
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("modal-close")[0];
	
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}

}


/**
 * Parses Grid Reference to OsGridRef object.
 *
 * Accepts standard Grid References (eg 'SU 387 148'), with or without whitespace separators, from
 * two-digit references up to 10-digit references (1m × 1m square), or fully numeric comma-separated
 * references in metres (eg '438700,114800').
 *
 * @param   {string}    gridref - Standard format OS Grid Reference.
 * @returns {OsGridRef} Numeric version of Grid Reference in metres from false origin (SW corner of
 *   supplied grid square).
 * @throws Error on Invalid Grid Reference.
 *
 * @example
 *   var grid = OsGridRef.parse('TG 51409 13177'); // grid: { easting: 651409, northing: 313177 }
 */

function gridreferror() {
	


		modal.style.display = "block";

		document.getElementById('modal-text').innerHTML = 'Sorry - this entry could not be located. Please type: <br/>' +
					'1. A standard <strong>National Grid Reference</strong> (eg. "NT 263 721", "NT263721" ), ' +
					'with or without whitespace separators, from two-digit references (eg. "NT26" - 10km x 10km square) ' +
					'up to 10-digit references (eg. "NT2637572134" - 1m × 1m square), ' +
					'or a fully numeric comma-separated reference in metres (eg "326375,672134");<br/>' +
					'2. <strong>latitute, longitude</strong> with a decimal point after the degree number (eg. "52.123,-2.345");<br/>' +
					'3. a <strong>postcode</strong> area (ie. "EH"), district (ie. "EH9"), sector (ie. "EH9 1"), or the full unit ' +
					'(ie. "EH9 1SL"), either with a space in the middle (ie. "EH9 1SL") or without (ie. "EH91SL"). <br/><br/>' +
					'Click on the cross (top right) or outside this box to close it.';

	}

function gridreference (gridref) {
    gridref = String(gridref).trim();

 console.log("gridref: " + gridref);

    // check for fully numeric comma-separated gridref format
    var match = gridref.match(/^(\d+),\s*(\d+)$/);
    if (match) return [match[1], match[2]];

    // validate format

    match = gridref.match(/^[A-Z]{2}\s*[0-9]+\s*[0-9]+$/i);


    if (!match) { 

				console.log("yes"); 	
	
		var matchNW = gridref.match(/^[A-Z]{2}\s*[0-9]+\s*[0-9]+\s*[A-Z]{2}$/i);
	
		if (matchNW)
			
		
	//			if ( gridref.toUpperCase().endsWith('NW') ) 
			
			{

	//|| gridref.endsWith('NE') || gridref.endsWith('SW') || gridref.endsWith('SE')		



				var quadrant;
				
				if ( gridref.toUpperCase().endsWith('NW') ) 
				{ quadrant = 'NW'; }
				else if ( gridref.toUpperCase().endsWith('NE') ) 
				{ quadrant = 'NE'; }
				else if ( gridref.toUpperCase().endsWith('SW') ) 
				{ quadrant = 'SW'; }
				else if ( gridref.toUpperCase().endsWith('SE') ) 
				{ quadrant = 'SE'; }

					console.log("quadrant: " + quadrant); 

					// get numeric values of letter references, mapping A->0, B->1, C->2, etc:
					var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
					var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
					// shuffle down letters after 'I' since 'I' is not used in grid:
					if (l1 > 7) l1--;
					if (l2 > 7) l2--;

					// convert grid letters into 100km-square indexes from false origin (grid square SV):
					var e100km = ((l1-2)%5)*5 + (l2%5);
					var n100km = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);


					// skip grid letters to get numeric (easting/northing) part of ref
					var en1 = gridref.slice(0, -2).trim();
					var en = en1.slice(2).trim().split(/\s+/);
					// if e/n not whitespace separated, split half way
					if (en.length == 1) en = [ en[0].slice(0, en[0].length/2), en[0].slice(en[0].length/2) ];

					// validation
					if (e100km<0 || e100km>6 || n100km<0 || n100km>12) {  gridreferror(); return; }
					if (en.length != 2) { gridreferror();  return; }
					if (en[0].length != en[1].length) { gridreferror();  return; }

					// standardise to 10-digit refs (metres)

				// console.log("en[0]: " + en[0]);
				// console.log("en[1]: " + en[1]);


					
					console.log("quadrant: " + quadrant); 
						


					if (gridref.length == 2)
					{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'500000').slice(0, 5);  }
					if (gridref.length == 3)
					{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'500000').slice(0, 5);  }
					else if (gridref.length == 4)
					{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'50000').slice(0, 5);  }
					else if (gridref.length == 5)
					{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'50000').slice(0, 5);  }
					else if (gridref.length == 6)
					{ if (quadrant == 'NW')
						{en[0] = (en[0]+'2500').slice(0, 5); en[1] = (en[1]+'7500').slice(0, 5);  }
					  else if (quadrant == 'NE')
						{en[0] = (en[0]+'7500').slice(0, 5); en[1] = (en[1]+'7500').slice(0, 5);  }
					  else if (quadrant == 'SW')
						{en[0] = (en[0]+'2500').slice(0, 5); en[1] = (en[1]+'2500').slice(0, 5);  }
					  else if (quadrant == 'SE')
						{en[0] = (en[0]+'7500').slice(0, 5); en[1] = (en[1]+'2500').slice(0, 5);  }
						else
						{
						gridreferror(); 
						return;   
						}
					}
					else if (gridref.length == 7)

					{en[0] = (en[0]+'5000').slice(0, 5); en[1] = (en[1]+'5000').slice(0, 5);  }
					else if (gridref.length == 8)
					{ if (quadrant == 'NW')
						{en[0] = (en[0]+'250').slice(0, 5); en[1] = (en[1]+'750').slice(0, 5);  }
					  else if (quadrant == 'NE')
						{en[0] = (en[0]+'750').slice(0, 5); en[1] = (en[1]+'750').slice(0, 5);  }
					  else if (quadrant == 'SW')
						{en[0] = (en[0]+'250').slice(0, 5); en[1] = (en[1]+'250').slice(0, 5);  }
					  else if (quadrant == 'SE')
						{en[0] = (en[0]+'750').slice(0, 5); en[1] = (en[1]+'250').slice(0, 5);  }
						else
						{
						gridreferror(); 
						return;   
						}
					}
					else if (gridref.length == 9)
					{en[0] = (en[0]+'500').slice(0, 5); en[1] = (en[1]+'500').slice(0, 5);  }
					else if (gridref.length == 10)
					{en[0] = (en[0]+'50').slice(0, 5); en[1] = (en[1]+'50').slice(0, 5);  }
					else if (gridref.length == 11)
					{en[0] = (en[0]+'5').slice(0, 5); en[1] = (en[1]+'5').slice(0, 5);  }
					else if (gridref.length == 12)
					{en[0] = (en[0]+'5').slice(0, 5); en[1] = (en[1]+'5').slice(0, 5);  }
				
					

				// console.log("en2[0]: " + en[0]);
				// console.log("en2[1]: " + en[1]);


					var e = e100km + en[0];
					var n = n100km + en[1];

				// console.log("e: " + e);
				// console.log("n: " + n);

					return [e, n];




			}

		if (!matchNW) { 
		
			if (gridref.indexOf('.') )
				{
					
					
					var gridreflength = gridref.length;
					


					var latlon = gridref.split(',');
					
	//				console.log("latlon[0].length: " + latlon[0].length);
					
					if ((latlon[0].length < 1) || (latlon[1].length < 1))

					{	
					gridreferror(); 
					return; 
					}
					
					if (( Math.round(latlon[1]) > 90 ) || ( Math.round(latlon[1]) < -90 ) || ( Math.round(latlon[0]) > 180 ) || ( Math.round(latlon[1]) < -180 ))
						
					{	
					gridreferror(); 
					return; 
					}			
					
					var point3857 = ol.proj.transform([latlon[1],latlon[0]],"EPSG:4326", "EPSG:3857");
					
					var x = point3857[0].toFixed(0);
					var y = point3857[1].toFixed(0);
					

					
					if (overlaySelected.get('maxZ'))
						{
						var oszoom = overlaySelected.get('maxZ');
						var oSzoom = parseInt(oszoom - 1);
						}
						else
						{
						if (gridreflength < 10) { oSzoom = 10; }
							else if ((gridreflength > 9) && (gridreflength < 12)) { oSzoom = 12; }
							else if ((gridreflength > 11) && (gridreflength < 14)) { oSzoom = 14; }
							else if (gridreflength > 14)  { oSzoom = 16; }
						}
					
					map.getView().setCenter([x , y ]);
					map.getView().setZoom(oSzoom);
					
					if (map.getLayers().getArray()[5].getSource().getFeatures().length > 0)
						{map.getLayers().getArray()[5].getSource().clear(); }

					var feature = new ol.Feature(
						new ol.geom.Point(point3857)
					);
					feature.setStyle(iconStyle);

				  document.getElementById('stopmeasuringmessage').innerHTML = 'Click/tap on map to move marker, or <a href="javascript:remove_marker()">Remove Marker</a>';

					espg4326 = [];
					espg4326 = ol.proj.transform(point3857,"EPSG:3857", "EPSG:4326");
					

					
					pointClicked = [];
					pointClicked.push(espg4326[1].toFixed(6), espg4326[0].toFixed(6));
					updateUrl();

					vectorSource_new.addFeature(feature);
					
					$('#map').focus();
					
					return;
				}	
		}

		else
			{	
			gridreferror(); 
			return; 
			}
	}
    // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
    var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
    // shuffle down letters after 'I' since 'I' is not used in grid:
    if (l1 > 7) l1--;
    if (l2 > 7) l2--;

    // convert grid letters into 100km-square indexes from false origin (grid square SV):
    var e100km = ((l1-2)%5)*5 + (l2%5);
    var n100km = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);

    // skip grid letters to get numeric (easting/northing) part of ref
    var en = gridref.slice(2).trim().split(/\s+/);
    // if e/n not whitespace separated, split half way
    if (en.length == 1) en = [ en[0].slice(0, en[0].length/2), en[0].slice(en[0].length/2) ];

    // validation
    if (e100km<0 || e100km>6 || n100km<0 || n100km>12) {  gridreferror(); return; }
    if (en.length != 2) { gridreferror();  return; }
    if (en[0].length != en[1].length) { gridreferror();  return; }

    // standardise to 10-digit refs (metres)

// console.log("en[0]: " + en[0]);
// console.log("en[1]: " + en[1]);



    if (gridref.length == 2)
	{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'500000').slice(0, 5);  }
    if (gridref.length == 3)
	{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'500000').slice(0, 5);  }
    else if (gridref.length == 4)
	{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'50000').slice(0, 5);  }
    else if (gridref.length == 5)
	{en[0] = (en[0]+'50000').slice(0, 5); en[1] = (en[1]+'50000').slice(0, 5);  }
    else if (gridref.length == 6)
	{en[0] = (en[0]+'5000').slice(0, 5); en[1] = (en[1]+'5000').slice(0, 5);  }
    else if (gridref.length == 7)
	{en[0] = (en[0]+'5000').slice(0, 5); en[1] = (en[1]+'5000').slice(0, 5);  }
    else if (gridref.length == 8)
	{en[0] = (en[0]+'500').slice(0, 5); en[1] = (en[1]+'500').slice(0, 5);  }
    else if (gridref.length == 9)
	{en[0] = (en[0]+'500').slice(0, 5); en[1] = (en[1]+'500').slice(0, 5);  }
    else if (gridref.length == 10)
	{en[0] = (en[0]+'50').slice(0, 5); en[1] = (en[1]+'50').slice(0, 5);  }
    else if (gridref.length == 11)
	{en[0] = (en[0]+'5').slice(0, 5); en[1] = (en[1]+'5').slice(0, 5);  }
    else if (gridref.length == 12)
	{en[0] = (en[0]+'5').slice(0, 5); en[1] = (en[1]+'5').slice(0, 5);  }

// console.log("en2[0]: " + en[0]);
// console.log("en2[1]: " + en[1]);


    var e = e100km + en[0];
    var n = n100km + en[1];

// console.log("e: " + e);
// console.log("n: " + n);

    return [e, n];


};



// WGS84 to Irish Grid Reference (simplified, for educational use)
// For production, use a geodesy library that supports the Irish Grid

	function degToRad(degrees) {
	    return degrees * Math.PI / 180;
	}
	
	// Airy Modified 1849 ellipsoid parameters (Irish Grid)
	// const a = 6377340.189; // semi-major axis
	// const b = 6356034.447; // semi-minor axis
	// const f0 = 1.000035; // scale factor on central meridian
	const lat0 = degToRad(53.5); // True origin latitude (53°30'N)
	const lon0 = degToRad(-8); // True origin longitude (8°W)
	const N0 = 250000; // Northing of true origin (m)
	const E0 = 200000; // Easting of true origin (m)
	const e2 = (6377340.189*6377340.189 - 6356034.447 *6356034.447) / (6377340.189*6377340.189); // eccentricity squared
	
	function latLonToIrishGrid(lat, lon) {
	    // Convert input degrees to radians
	    lat = degToRad(lat);
	    lon = degToRad(lon);
	
	    // Helmert transform parameters from WGS84 to Irish Grid datum
	    // (for high accuracy, a full Helmert transform is needed; this is simplified)
	    // For production, use a geodesy library for the full transform
	
	    // Compute nu, rho, eta2
	    const sinLat = Math.sin(lat);
	    const cosLat = Math.cos(lat);
	    const nu = 6377340.189* 1.000035/ Math.sqrt(1 - e2 * sinLat * sinLat);
	    const rho = 6377340.189 * 1.000035* (1 - e2) / Math.pow(1 - e2 * sinLat * sinLat, 1.5);
	    const eta2 = nu / rho - 1;
	
	    // Compute meridional arc
	    const M = computeM(lat, lat0);
	
	    const dLon = lon - lon0;
	    const tanLat = Math.tan(lat);
	    const secLat = 1 / cosLat;
	
	    // Calculate Easting (E) and Northing (N)
	    const I = M + N0;
	    const II = (nu / 2) * sinLat * cosLat;
	    const III = (nu / 24) * sinLat * Math.pow(cosLat, 3) * (5 - tanLat * tanLat + 9 * eta2);
	    const IV = nu * cosLat;
	    const V = (nu / 6) * Math.pow(cosLat, 3) * (nu / rho - tanLat * tanLat);
	    const VI = (nu / 120) * sinLat * Math.pow(cosLat, 5) * (61 - 58 * tanLat * tanLat + Math.pow(tanLat, 4));
	
	    const N = I + II * dLon * dLon + III * Math.pow(dLon, 4);
	    const E = E0 + IV * dLon + V * Math.pow(dLon, 3) + VI * Math.pow(dLon, 5);
	
	    return {E: Math.round(E), N: Math.round(N)};
	}
	
	function computeM(lat, lat0) {
	    // Meridional arc calculation for Airy Modified 1849 ellipsoid
	    const n = (6377340.189 - 6356034.447) / (6377340.189 + 6356034.447);
	    const n2 = n * n;
	    const n3 = n2 * n;
	
	    return 6356034.447* 1.000035* (
	        (1 + n + (5/4)*n2 + (5/4)*n3) * (lat - lat0)
	        - (3*n + 3*n2 + (21/8)*n3) * Math.sin(lat - lat0) * Math.cos(lat + lat0)
	        + ((15/8)*n2 + (15/8)*n3) * Math.sin(2*(lat - lat0)) * Math.cos(2*(lat + lat0))
	        - (35/24)*n3 * Math.sin(3*(lat - lat0)) * Math.cos(3*(lat + lat0))
	    );
	}
	
	// Example usage:
	
	/*
	const lat = 54.6; // Latitude in decimal degrees
	const lon = -5.9; // Longitude in decimal degrees
	const grid = latLonToIrishGrid(lat, lon);
	console.log(`Easting: ${grid.E}, Northing: ${grid.N}`);
	*/
	
	function irishGridRef(easting, northing, digits) {
	    // Irish grid letters (excluding I)
	    var letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
	    // The Irish grid origin is at (0,0), so no offset needed
	    var e100k = Math.floor(easting / 100000);
	    var n100k = Math.floor(northing / 100000);
	
	    // Irish grid is 5x5 squares, skipping 'I'
	    var letterIndex = (4 - n100k) * 5 + e100k;
	 //   if (letterIndex > 8) letterIndex++; // skip 'I'
	    var letter = letters[letterIndex];
	
	    // Get easting/northing within the 100km square
	    var eWithin = easting % 100000;
	    var nWithin = northing % 100000;
	
	    // Pad to required digits (default 5 each for 10-digit ref)
	    var eStr = String(Math.floor(eWithin / Math.pow(8, 4 - digits/2))).padStart(digits/2, '0');
	    var nStr = String(Math.floor(nWithin / Math.pow(8, 4 - digits/2))).padStart(digits/2, '0');
	
	    return letter + ' '+ eStr + ' ' + nStr;
	}
	
	// Example usage:
	// var gridRef = irishGridRef(316102, 234569, 8); // "O1610234569"
	

function setZoomLayers() {


	var mapZoom = map.getView().getZoom();

	
	if ((WebGL) && (map.getLayers().getArray()[4].get('group_no') == '257'))	
		
		{ if (mapZoom < 9)
		
                     {
                      osoneincholdseriestileset.setVisible(true);
                     }
	 else  
                     {
                      osoneincholdseriestileset.setVisible(false);
                     }
					 
		}

	if ((map.getLayers().getArray()[4].get('group_no') == '82') && (mapZoom < 4)) 


                     {
                           tsa_layer_01.setVisible(false);
                           tsa_layer_02.setVisible(false);
                           tsa_layer_03.setVisible(false);
                           tsa_layer_04.setVisible(false);
                           tsa_layer_05.setVisible(false);
                           document.getElementById('wfsResults').innerHTML = "Around 1:80 million scale map. Zoom in for more detailed scales.&nbsp;";
                     }
       
       else if ((map.getLayers().getArray()[4].get('group_no') == '82') && ((mapZoom > 3) && (mapZoom < 5))) 

                     {
                           tsa_layer_01.setVisible(true);
                           tsa_layer_02.setVisible(false);
                           tsa_layer_03.setVisible(false);
                           tsa_layer_04.setVisible(false);
                            tsa_layer_05.setVisible(false);
                           document.getElementById('wfsResults').innerHTML = "&nbsp;Around 1:14 million scale maps. Zoom in for more detailed scales.&nbsp;";
                     }

       else if ((map.getLayers().getArray()[4].get('group_no') == '82') && ((mapZoom > 4) && (mapZoom < 6))) 

                     {
                           tsa_layer_01.setVisible(true);
                           tsa_layer_02.setVisible(false);
                           tsa_layer_03.setVisible(false);
                           tsa_layer_04.setVisible(false);
                           tsa_layer_05.setVisible(false);
                           document.getElementById('wfsResults').innerHTML = "&nbsp;Around 1:14 million scale maps. Zoom in for more detailed scales.&nbsp;";
                     }

       else if ((map.getLayers().getArray()[4].get('group_no') == '82') && ((mapZoom > 5) && (mapZoom < 7))) 

                     {
                           tsa_layer_01.setVisible(true);
                           tsa_layer_02.setVisible(true);
                           tsa_layer_03.setVisible(false);
                           tsa_layer_04.setVisible(false);
                           tsa_layer_05.setVisible(false);
                           document.getElementById('wfsResults').innerHTML = "&nbsp;Around 1:12 million scale maps. Zoom in for more detailed scales.&nbsp;";
                     }

       else if ((map.getLayers().getArray()[4].get('group_no') == '82') && ((mapZoom > 6) && (mapZoom < 8))) 

                     {
                           tsa_layer_01.setVisible(true);
                           tsa_layer_02.setVisible(true);
                           tsa_layer_03.setVisible(true);
                           tsa_layer_04.setVisible(false);
                           tsa_layer_05.setVisible(false);
                           document.getElementById('wfsResults').innerHTML = "&nbsp;Around 1:5 million scale maps. Zoom in for more detailed scales.&nbsp;";
                     }

       else if ((map.getLayers().getArray()[4].get('group_no') == '82') && ((mapZoom > 7) && (mapZoom < 9))) 

                     {
                           tsa_layer_01.setVisible(true);
                           tsa_layer_02.setVisible(true);
                           tsa_layer_03.setVisible(true);
                           tsa_layer_04.setVisible(true);
                           tsa_layer_05.setVisible(false);
                           document.getElementById('wfsResults').innerHTML = "&nbsp;Around 1:2 million scale maps. Zoom in for more detailed scales.&nbsp;";
                     }

       else if ((map.getLayers().getArray()[4].get('group_no') == '82') && (mapZoom > 9)) 

                     {
                           tsa_layer_01.setVisible(true);
                           tsa_layer_02.setVisible(true);
                           tsa_layer_03.setVisible(true);
                           tsa_layer_04.setVisible(true);
                           tsa_layer_05.setVisible(true);
                           document.getElementById('wfsResults').innerHTML = "&nbsp;Around 1:1 million scale maps. Zoom out for less detailed scales.&nbsp;";
                     }

       if ((map.getLayers().getArray()[4].get('group_no') == '225') && (mapZoom < 17)) 

		     {
			OS1900sGB_layer.setVisible(true);
			OStwentyfiveinchnewcastleadds.setVisible(false);
			 OStwentyfiveinchholes.setVisible(false);
			 OStwentyfiveinchbedfordshire.setVisible(false);
			 OStwentyfiveinchberkshire.setVisible(false);
			 OStwentyfiveinchcambridge.setVisible(false);
			  OStwentyfiveinchcheshire.setVisible(false);
			 OStwentyfiveinchcornwall.setVisible(false);
			 OStwentyfiveinchcumberland.setVisible(false);
			 OStwentyfiveinchdevon.setVisible(false);
			 OStwentyfiveinchdorset.setVisible(false);
			  OStwentyfiveinchdurham.setVisible(false);
			 OStwentyfiveinchhampshire.setVisible(false);
			 OStwentyfiveinchbuckingham.setVisible(false);
			 OStwentyfiveinchessex.setVisible(false);
			 OStwentyfiveinch_raywilson.setVisible(false);
			 OStwentyfiveinchgloucestershire.setVisible(false);
			 OStwentyfiveinchherefordshire.setVisible(false);
			 OStwentyfiveinchhuntingdon.setVisible(false);
			 OStwentyfiveinchlancashire.setVisible(false);
			 OStwentyfiveinchleicestershire.setVisible(false);
			 OStwentyfiveinchlincolnshire.setVisible(false);
			 OStwentyfiveinchmiddlesex.setVisible(false);
			 OStwentyfiveinchnorfolk.setVisible(false);
			 OStwentyfiveinchnorthampton.setVisible(false);
			 OStwentyfiveinchnorthumberland.setVisible(false);
			 OStwentyfiveinchnottinghamshire.setVisible(false);
			 OStwentyfiveinchkent.setVisible(false);
			 OStwentyfiveinchrutland.setVisible(false);
			 OStwentyfiveinchshropshire_derby.setVisible(false);
			 OStwentyfiveinchstaffordshire.setVisible(false);
			 OStwentyfiveinchsurrey.setVisible(false);
			 OStwentyfiveinchsussex.setVisible(false);
			 OStwentyfiveinchlondon.setVisible(false);
			 OStwentyfiveinchhertfordshire.setVisible(false);
			 OStwentyfiveinchoxford.setVisible(false);
			 OStwentyfiveinchsomerset.setVisible(false);
			 OStwentyfiveinchsuffolk.setVisible(false);
			 OStwentyfiveinchwarwick.setVisible(false);
			 OStwentyfiveinchwestmorland.setVisible(false);
			 OStwentyfiveinchwiltshire.setVisible(false);
			 OStwentyfiveinchworcestershire.setVisible(false);
			 OStwentyfiveinchyorkshire.setVisible(false);
			 OStwentyfiveinchwales.setVisible(false);
			 os25scotland.setVisible(false);
			 os25scotland2.setVisible(false);
			 os25scotland2_lauder.setVisible(false);


		     }
	else if ((map.getLayers().getArray()[4].get('group_no') == '225') && (mapZoom > 16)) 
		     {
			OS1900sGB_layer.setVisible(false);
			OStwentyfiveinchnewcastleadds.setVisible(true);
			 OStwentyfiveinchholes.setVisible(true);
			 OStwentyfiveinchbedfordshire.setVisible(true);
			 OStwentyfiveinchberkshire.setVisible(true);
			 OStwentyfiveinchcambridge.setVisible(true);
			  OStwentyfiveinchcheshire.setVisible(true);
			 OStwentyfiveinchcornwall.setVisible(true);
			 OStwentyfiveinchcumberland.setVisible(true);
			 OStwentyfiveinchdevon.setVisible(true);
			 OStwentyfiveinchdorset.setVisible(true);
			 OStwentyfiveinchdurham.setVisible(true);
			 OStwentyfiveinchhampshire.setVisible(true);
			 OStwentyfiveinchbuckingham.setVisible(true);
			 OStwentyfiveinchessex.setVisible(true);
			 OStwentyfiveinch_raywilson.setVisible(true);
			 OStwentyfiveinchgloucestershire.setVisible(true);
			 OStwentyfiveinchherefordshire.setVisible(true);
			 OStwentyfiveinchhuntingdon.setVisible(true);
			 OStwentyfiveinchlancashire.setVisible(true);
			 OStwentyfiveinchleicestershire.setVisible(true);
			 OStwentyfiveinchlincolnshire.setVisible(true);
			 OStwentyfiveinchmiddlesex.setVisible(true);
			 OStwentyfiveinchnorfolk.setVisible(true);
			 OStwentyfiveinchnorthampton.setVisible(true);
			 OStwentyfiveinchnorthumberland.setVisible(true);
			 OStwentyfiveinchnottinghamshire.setVisible(true);
			 OStwentyfiveinchkent.setVisible(true);
			 OStwentyfiveinchrutland.setVisible(true);
			 OStwentyfiveinchshropshire_derby.setVisible(true);
			 OStwentyfiveinchstaffordshire.setVisible(true);
			 OStwentyfiveinchsurrey.setVisible(true);
			 OStwentyfiveinchsussex.setVisible(true);
			 OStwentyfiveinchlondon.setVisible(true);
			 OStwentyfiveinchhertfordshire.setVisible(true);
			 OStwentyfiveinchoxford.setVisible(true);
			 OStwentyfiveinchsomerset.setVisible(true);
			 OStwentyfiveinchsuffolk.setVisible(true);
			 OStwentyfiveinchwarwick.setVisible(true);
			 OStwentyfiveinchwestmorland.setVisible(true);
			 OStwentyfiveinchwiltshire.setVisible(true);
			 OStwentyfiveinchworcestershire.setVisible(true);
			 OStwentyfiveinchyorkshire.setVisible(true);
			 OStwentyfiveinchwales.setVisible(true);
			 os25scotland.setVisible(true);
			 os25scotland2.setVisible(true);
			 os25scotland2_lauder.setVisible(true);


		     }

    	if ((map.getLayers().getArray()[4].get('group_no') == '175') && (mapZoom < 15)) 

		     {
			OS1900sGB_layer.setVisible(true);
			sixinch2scot_api_layer.setVisible(false);
			sixinch2scot_76411765.setVisible(false);
			sixinch2scot_loch_resort.setVisible(false);

		     }
		else if ((map.getLayers().getArray()[4].get('group_no') == '175') && (mapZoom > 14)) 
		     {
			OS1900sGB_layer.setVisible(false);
			sixinch2scot_api_layer.setVisible(true);
			sixinch2scot_76411765.setVisible(true);
			sixinch2scot_loch_resort.setVisible(true);
		     }


		if (map.getLayers().getArray()[4].get('group_no') == '34')  
		     {
			OS1900sGB_layer.setVisible(false);
			OStwentyfiveinchnewcastleadds.setVisible(true);
			 OStwentyfiveinchholes.setVisible(true);
			 OStwentyfiveinchbedfordshire.setVisible(true);
			 OStwentyfiveinchberkshire.setVisible(true);
			 OStwentyfiveinchcambridge.setVisible(true);
			  OStwentyfiveinchcheshire.setVisible(true);
			 OStwentyfiveinchcornwall.setVisible(true);
			 OStwentyfiveinchcumberland.setVisible(true);
			 OStwentyfiveinchdevon.setVisible(true);
			 OStwentyfiveinchdorset.setVisible(true);
			 OStwentyfiveinchdurham.setVisible(true);
			 OStwentyfiveinchhampshire.setVisible(true);
			 OStwentyfiveinchbuckingham.setVisible(true);
			 OStwentyfiveinchessex.setVisible(true);
			 OStwentyfiveinch_raywilson.setVisible(true);
			 OStwentyfiveinchgloucestershire.setVisible(true);
			 OStwentyfiveinchherefordshire.setVisible(true);
			 OStwentyfiveinchhuntingdon.setVisible(true);
			 OStwentyfiveinchlancashire.setVisible(true);
			 OStwentyfiveinchleicestershire.setVisible(true);
			 OStwentyfiveinchlincolnshire.setVisible(true);
			 OStwentyfiveinchmiddlesex.setVisible(true);
			 OStwentyfiveinchnorfolk.setVisible(true);
			 OStwentyfiveinchnorthampton.setVisible(true);
			 OStwentyfiveinchnorthumberland.setVisible(true);
			 OStwentyfiveinchnottinghamshire.setVisible(true);
			 OStwentyfiveinchkent.setVisible(true);
			 OStwentyfiveinchrutland.setVisible(true);
			 OStwentyfiveinchshropshire_derby.setVisible(true);
			 OStwentyfiveinchstaffordshire.setVisible(true);
			 OStwentyfiveinchsurrey.setVisible(true);
			 OStwentyfiveinchsussex.setVisible(true);
			 OStwentyfiveinchlondon.setVisible(true);
			 OStwentyfiveinchhertfordshire.setVisible(true);
			 OStwentyfiveinchoxford.setVisible(true);
			 OStwentyfiveinchsomerset.setVisible(true);
			 OStwentyfiveinchsuffolk.setVisible(true);
			 OStwentyfiveinchwarwick.setVisible(true);
			 OStwentyfiveinchwestmorland.setVisible(true);
			 OStwentyfiveinchwiltshire.setVisible(true);
			 OStwentyfiveinchworcestershire.setVisible(true);
			 OStwentyfiveinchyorkshire.setVisible(true);
			 OStwentyfiveinchwales.setVisible(true);
			 os25scotland.setVisible(true);
			 os25scotland2.setVisible(true);
			 os25scotland2_lauder.setVisible(true);


		     }

       }


	var esri_world_imagery = new ol.layer.Tile({
		// preload: Infinity,,
		title: 'Change background - ESRI World Image',
	        mosaic_id: 'ESRIWorld',
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>. ',

			              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			                  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
					tilePixelRatio: 1,
					tileSize: 256,
					crossOrigin: 'anonymous'
	      	}),
		maxZ: 18
	    });

	var esri_world_topo = new ol.layer.Tile({
		// preload: Infinity,,
		title: 'Background - ESRI World Topo',
	        mosaic_id: 'ESRITopo',
		type: 'base', 
		    source: new ol.source.XYZ({
		          attributions: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>. ',

			              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			                  'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
					tilePixelRatio: 1,
					tileSize: 256,
					crossOrigin: 'anonymous'
	      	})
	    });
		




	var maptiler_basic =  new ol.layer.Tile({
		title: 'Background - MapTiler Streets',
	        mosaic_id: 'MapTilerStr',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/streets-v2/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',
			tilePixelRatio: 1,
			tileSize: 512,
              crossOrigin: 'anonymous'
            })
          });
		  

		  
	var maptiler_satellite =  new ol.layer.Tile({
		title: 'Background - MapTiler Satellite Hybrid',
	        mosaic_id: 'MapTilerSat',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/hybrid/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			tilePixelRatio: 1,
			tileSize: 512,
              crossOrigin: 'anonymous'
            })
          });
		  

	var maptiler_elevation =  new ol.layer.Tile({
		title: 'Background - MapTiler Elevation',
	        mosaic_id: 'MapTilerElev',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/outdoor/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',
              crossOrigin: 'anonymous'
            })
          });

	var maptiler_hillshade =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR -  MapTiler Hillshading',
				  relevance: 5,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'MapTilerHil',
		    key: 'geo.nls.uk/maps/nokey.html',
            	source: new ol.source.TileJSON({
					
     		url: 'https://api.maptiler.com/tiles/hillshade/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			tileSize: 256,
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
		maxZ: 20
          });
		  	  
	var R_maptiler_hillshade =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR -  MapTiler Hillshading',
				  relevance: 5,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'MapTilerHil',
		    key: 'geo.nls.uk/maps/nokey.html',
            	source: new ol.source.TileJSON({

     		url: 'https://api.maptiler.com/tiles/hillshade/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			tileSize: 256,
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
		maxZ: 20
          });

	var google_satellite =  new ol.layer.Tile({
		title: 'Background - Google Satellite',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'GoogleSat',
				source: new ol.source.XYZ({
				url:  'https://mt1.google.com/vt/lyrs=s@113&hl=en&&x={x}&y={y}&z={z}&key=AIzaSyBxU0zSPn92V4KO4sj6GD9g5zfVNcArRbk',
	      	attributions: '',
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
			maxZ: 20
          });

	var google_satellite_hybrid =  new ol.layer.Tile({
		title: 'Background - Google Satellite Hybrid',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'GoogleSatHyb',
				source: new ol.source.XYZ({
				url:  'https://mt1.google.com/vt/lyrs=y@113&hl=en&&x={x}&y={y}&z={z}&key=AIzaSyBxU0zSPn92V4KO4sj6GD9g5zfVNcArRbk',
	      	attributions: '',
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
			maxZ: 20
          });
		  
	var R_google_satellite =  new ol.layer.Tile({
		title: 'Background - Google Satellite',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'GoogleSat',
				source: new ol.source.XYZ({
				url:  'https://mt1.google.com/vt/lyrs=s@113&hl=en&&x={x}&y={y}&z={z}&key=AIzaSyBxU0zSPn92V4KO4sj6GD9g5zfVNcArRbk',
	      	attributions: '',
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
			maxZ: 20
          });

	var R_google_satellite_hybrid =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR - Google Satellite Hybrid',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'GoogleSatHyb',
				source: new ol.source.XYZ({
				url:  'https://mt1.google.com/vt/lyrs=y@113&hl=en&&x={x}&y={y}&z={z}&key=AIzaSyBxU0zSPn92V4KO4sj6GD9g5zfVNcArRbk',
	      	attributions: '',
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
			maxZ: 20
          });
		  


	// OpenStreetMap
	var osm = new ol.layer.Tile({
                 // preload: Infinity,,
	         title: 'Background - OpenStreetMap',
	         mosaic_id: 'osm',
	              source: new ol.source.OSM({
	              // attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			tilePixelRatio: 1
	          })/*,
	      opacity: 0.7*/
	});

	var osm2 = new ol.layer.Tile({
                 // preload: Infinity,,
	         title: 'Background - OpenStreetMap',
	         mosaic_id: 'osm',
	              source: new ol.source.OSM({
	              // attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	          })/*,
	      opacity: 0.7*/
	});



	var OSMapsAPI = new ol.layer.Tile({
		      // preload: Infinity,,
	              title: 'Background - OS Maps API',
	              mosaic_id: 'OSAPI',
	              type: 'base',
    			visible: false,	
		      source: new ol.source.XYZ({
				    attributions: 'Contains OS data © Crown copyright and database right 2025',

				    url: 'https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=' + 'Rt69sv62Dv1JNAvlJAcM0upXIaIcpua8',
				    minZoom: 7,
					tilePixelRatio: 1
				  })
	           });

	var OSOpendata = new ol.layer.Tile({
	              title: 'Background - OS Opendata',
	              mosaic_id: 'Opendata',
	              type: 'base',
		      source: new ol.source.XYZ({
				    attributions:'<a href="https://www.ordnancesurvey.co.uk/oswebsite/opendata/">Ordnance Survey OpenData</a>. Contains OS data © Crown copyright and database right (2010)',

				    url: 'https://mapseries-tilesets.s3.amazonaws.com/opendata/{z}/{x}/{y}.png',
				    // minZoom: 10,
				    maxZoom: 17,
				    tilePixelRatio: 1
				  })
	        });
						
						
	var OS1920s =  	new ol.layer.Tile({
	            title: 'Background - OS 1920s-1940s',
	            mosaic_id: 'OS1920s',
	            type: 'base',
		    source: new ol.source.XYZ({
			          attributions:  '<a href=\'https://maps.nls.uk/projects/api/\'>NLS Historic Maps API</a>',

				url: 'https://mapseries-tilesets.s3.amazonaws.com/api/nls/{z}/{x}/{y}.jpg',
				// minZoom: 10,
				maxZoom: 13,
				tilePixelRatio: 1
		})
          });


	var OS1900sGBback =  new ol.layer.Tile({
	            title: 'Background - OS 1900s',
		        group_no: '',
		        mosaic_id: '175',
			typename: 'nls:WFS',
			source: new ol.source.TileJSON({
			          attributions:  '<a href=\'https://maps.nls.uk/projects/api/\'>NLS Historic Maps API layer</a>',

			        url: 'https://api.maptiler.com/tiles/uk-osgb1888/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
			        tileSize: 512,
					tilePixelRatio: 1,
			        crossOrigin: 'anonymous'
				}),
			        type: 'overlay', 
			        visible: false,
			        minx: -8.8, 
				miny: 49.8,
			        maxx: 1.77, 
			        maxy: 60.9
          });



	var maptiler_topo =  new ol.layer.Tile({
		title: 'Background - MapTiler Topo',
	        mosaic_id: 'MapTilerStr',
            	source: new ol.source.TileJSON({
         	url: 'https://api.maptiler.com/maps/topo-v2/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X', 
	      	attributions: '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',
				crossOrigin: 'anonymous'
            })
          });

	

	var opentopomap = new ol.layer.Tile({
                // preload: Infinity,,
		title: 'Background - OpenTopoMap',
	        mosaic_id: 'OpenTopoMap',
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: 'Map tiles under <a href=\'https://creativecommons.org/licenses/by/3.0/\'>CC BY SA</a> from <a href=\'https://opentopomap.org/\'>OpenTopoMap</a>',
			          urls:[
			            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
			            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
			            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
			          ],
					  crossOrigin: 'anonymous'
	      	})
	    });
		
		var darkskiessourcelayer = new ol.layer.Tile({
        		// preload: Infinity,,
	            title: 'Background - Light Pollution / Dark Skies, 2016',
				extent: ol.proj.transformExtent([-9.25208293, 49.79735011, 2.72784970, 60.87708322], 'EPSG:4326', 'EPSG:3857'),
				mosaic_id: '',
		        minx: -9.25208293, 
				miny: 49.79735011, 
		        maxx: 2.72784970, 
		        maxy: 60.87708322,
				source: new ol.source.XYZ({
				    attributions: 'Earth Observation Group, NOAA National Geophysical Data Center. Data processed by <a href="https://www.landuse.co.uk/">LUC</a> on behalf of <a href="https://www.cpre.org.uk/light-pollution-dark-skies-map/ ">CPRE</a>',

				    url: 'https://geo.nls.uk/maps/light-pollution/{z}/{x}/{y}.png',
				    minZoom: 7,
					tilePixelRatio: 1,
					crossOrigin: 'anonymous'
				  }),
			maxZ: 9,
			opacity: 0.7
	        });

	var landcovermapsource = new ol.layer.Tile({
        		// preload: Infinity,,
	              title: 'ESRI / OSM / LiDAR - Land Cover Map 2021',
			mosaic_id: 'Land_Cover',
		        minx: -9.4971399999999999,
			miny: 49.7668000000000035,
		        maxx: 3.6320199999999998,
		        maxy: 61.5810000000000031,

			extent: ol.proj.transformExtent([-9.4971399999999999,49.7668000000000035, 3.6320199999999998,61.5810000000000031], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://catalogue.ceh.ac.uk/documents/017313c6-954b-4343-8784-3d61aa6e44da">Based upon LCM2021 © UKCEH 2022</a>',
//		           url: 'https://catalogue.ceh.ac.uk/maps/4f88a4f0-3bbc-4735-b078-11919d1865e0?request=getCapabilities&service=WMS&cache=false&',
		           url: 'https://catalogue.ceh.ac.uk/maps/68712ac3-d740-41df-bcb3-4d341f859909?request=getCapabilities&service=WMS&cache=false&',
		           params: {'LAYERS': 'LC.10m.GB', 'TILED': true, crossOrigin: 'anonymous'},
//		           serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
					tilePixelRatio: 1,
					crossOrigin: 'anonymous',
					minZoom: 6,
					
		          }),
			maxZ:15,
			opacity: 0.4
	        });

				


	var OSMapsLeisure = new ol.layer.Tile({
		title: 'Background - OS Maps Leisure (1:50,000/1:25,000)',
		mosaic_id: 'OSLeisure'
			});
	
	const parser = new ol.format.WMTSCapabilities();
	
		fetch('https://api.os.uk/maps/raster/v1/wmts?key=Q9ESJToD1he64kb6Aacq2Wqjy2EMhkUY&service=WMTS&request=GetCapabilities&version=2.0.0')
		  .then(function (response) {
			return response.text();
		  })
		  .then(function (text) {
			const result = parser.read(text);
			const options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'Leisure_27700',
                matrixSet: 'EPSG:27700',
				maxZoom: 9,

			});
			options.crossOrigin = '';
			options.projection = 'EPSG:27700';
			options.attributions = 'Contains OS data © Crown copyright and database right 2025'
			options.wrapX = false;
			OSMapsLeisure.setSource(new ol.source.WMTS(options));
		  });

		const startResolution = ol.extent.getWidth([ -238375.0, 0.0, 900000.0, 1376256.0 ]) / 256;
		const resolutions = new Array(22);
		for (let i = 0, ii = resolutions.length; i < ii; ++i) {
		  resolutions[i] = startResolution / Math.pow(2, i);
		}




	var OSMapsAPI = new ol.layer.Tile({
		      // preload: Infinity,,
	              title: 'Background - OS Maps API',
	              mosaic_id: 'OSAPI',
	              type: 'base',
		      source: new ol.source.XYZ({
				    attributions: 'Contains OS data © Crown copyright and database right 2021',

			    url: 'https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=' + 'Rt69sv62Dv1JNAvlJAcM0upXIaIcpua8',
//					url: 'https://api.os.uk/maps/raster/v1/zxy/Leisure_3857/{z}/{x}/{y}.png?key=Q9ESJToD1he64kb6Aacq2Wqjy2EMhkUY',
				    minZoom: 7,
					tilePixelRatio: 1,
					crossOrigin: 'anonymous'
				  })
	    });

	
	var darkskiessource = new ol.layer.Group({
        		// preload: Infinity,,
	            title: 'Background -  Light Pollution / Dark Skies, 2016',
				extent: ol.proj.transformExtent([-9.25208293, 49.79735011, 2.72784970, 60.87708322], 'EPSG:4326', 'EPSG:3857'),
				mosaic_id: 'Light_Pollution',
		        minx: -9.25208293, 
				miny: 49.79735011, 
		        maxx: 2.72784970, 
		        maxy: 60.87708322,
				key: 'geo.nls.uk/maps/nokey.html',
				layers: [ OSMapsAPI, darkskiessourcelayer],
	        });	
			
	var landcovermap = new ol.layer.Group({
        		// preload: Infinity,,
	              title: 'Background - Land Cover Map 2021',
			mosaic_id: 'Land_Cover',
		        minx: -9.4971399999999999,
			miny: 49.7668000000000035,
		        maxx: 3.6320199999999998,
		        maxy: 61.5810000000000031,
				layers: [ OSMapsAPI, landcovermapsource],
				crossOrigin: 'anonymous'
	        });

	var LIDAR_PhaseIDSM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR - Scotland LiDAR DSM 1m',
        	      mosaic_id: 'LIDAR_1m',
		        minx: -6.018560765016743, 
			miny: 54.7202519250655257,
		        maxx: -1.7394074862220423,
		        maxy: 59.16548440533408,
			extent: ol.proj.transformExtent([-6.018560765016743,54.7202519250655257,-1.7394074862220423,59.16548440533408], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search#/metadata/92367c84-74d3-4426-8b0f-6f4a8096f593">Crown copyright Scottish Government, SEPA and Scottish Water (2012).</a>',
		           url: 'https://srsp-ows.jncc.gov.uk/ows?service=wms',
		           params: {'LAYERS': 'scotland-lidar-1-dsm', 'TILED': true, crossOrigin: 'anonymous'},
		           serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
					crossOrigin: 'anonymous'
		          })
	        });



	var LIDAR_PhaseIIDSM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR - Scotland LiDAR DSM 1m',
		        minx: -6.707079677043194, 
			miny: 55.39718748727408,
		        maxx: -1.1045617513147379,
		        maxy: 60.214145102884835,
			extent: ol.proj.transformExtent([-6.707079677043194,55.39718748727408,-1.1045617513147379,60.214145102884835], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search#/metadata/92367c84-74d3-4426-8b0f-6f4a8096f593">Crown copyright Scottish Government, SEPA and Scottish Water (2012).</a>',
		           url: 'https://srsp-ows.jncc.gov.uk/ows?service=wms',
		           params: {'LAYERS': 'scotland-lidar-2-dsm', 'TILED': true},
		           serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
					crossOrigin: 'anonymous'
		          })
	        });

	var LIDAR_PhaseIIIDSM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR - Scotland LiDAR DSM 1m',
		        minx: -5.301796092147682, 
			miny: 54.57852588884711,
		        maxx: -1.7598842659693053,
		        maxy: 56.192386501638076,
			extent: ol.proj.transformExtent([-5.301796092147682,54.57852588884711,-1.7598842659693053,56.192386501638076], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search#/metadata/92367c84-74d3-4426-8b0f-6f4a8096f593">Crown copyright Scottish Government, SEPA and Scottish Water (2012).</a>',
		           url: 'https://srsp-ows.jncc.gov.uk/ows?service=wms',
		           params: {'LAYERS': 'scotland-lidar-3-dsm', 'TILED': true},
		           serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
					crossOrigin: 'anonymous'
		          })
	        });

	var LIDAR_PhaseIVDSM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR - Scotland LiDAR DSM 1m',
		        minx: -5.167737424724375, 
			miny: 55.03117291033663,
		        maxx: -2.0485138495768784,
		        maxy: 56.51603850769755,

			extent: ol.proj.transformExtent([-5.167737424724375,55.03117291033663,-2.0485138495768784,56.51603850769755], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://www.spatialdata.gov.scot/geonetwork/srv/eng/catalog.search#/metadata/92367c84-74d3-4426-8b0f-6f4a8096f593">Crown copyright Scottish Government, SEPA and Scottish Water (2012).</a>',
		           url: 'https://srsp-ows.jncc.gov.uk/ows?service=wms',
		           params: {'LAYERS': 'scotland-lidar-4-dsm', 'TILED': true},
		           serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
					crossOrigin: 'anonymous'
		          })
	        });



   var LIDAR_Comp_DSM_1m = new ol.layer.Tile({
        		// preload: Infinity,,
	              title: 'ESRI / OSM / LiDAR -LiDAR DSM 1m',
        	      mosaic_id: 'LIDAR_1m',
		      minx: -7.09, 
			miny: 49.814, 
		        maxx: 2.1452, 
		        maxy: 55.8332,
			extent: ol.proj.transformExtent([-7.0980160000000003,49.8141069999999999,2.1452689999999999,55.8332639999999998], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				attributions: '<a href="https://environment.data.gov.uk/dataset/000734e9-15bd-4768-80c8-f37235591efb">&copy; Environment Agency copyright 2022.</a>',
		            url: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-1m-2022/wms',

		           params: {'LAYERS': 'Lidar_Composite_LZ_DSM_1m', 'TILED': true},
		            serverType: 'geoserver',
					// crossOrigin: 'anonymous',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
		          minResolution: 2445,
				tilePixelRatio: 1
		          }),
			maxZ:15
	        });

// LIDAR_PhaseIIDSM_1m, LIDAR_PhaseIIIDSM_1m, LIDAR_PhaseIVDSM_1m, 

	    var LIDAR_1m = new ol.layer.Group({
	  	extent: ol.proj.transformExtent([-8.8, 49.8, 1.8, 60.9], 'EPSG:4326', 'EPSG:3857'),
	        // preload: Infinity,,
		title: "Background - LiDAR DSM 1m - Eng, Scot, Wales", 	
		mosaic_id: 'LIDAR_DSM_1m',
		layers: [ LIDAR_PhaseIVDSM_1m, LIDAR_PhaseIIIDSM_1m, LIDAR_PhaseIIDSM_1m,  LIDAR_PhaseIDSM_1m, LIDAR_Comp_DSM_1m, LIDAR_Wales_1m ],
	        tileOptions: {crossOriginKeyword: null},      
	        minx: -8.8, 
		miny: 49.8,
	        maxx: 1.8, 
	        maxy: 60.9,
			crossOrigin: 'anonymous'
	    });



	var LIDAR_PhaseIDSM_DTM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - &nbsp;&nbsp;(LiDAR DTM 1m - Scotland, Ph 1)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_1m_dtm1',
		        minx: -5.64082049, 
			miny: 54.75447998,
		        maxx: -1.75109870,
		        maxy: 59.16445469,
			extent: ol.proj.transformExtent([-5.64082049, 54.75447998, -1.75109870, 59.16445469], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/phase1/{z}/{x}/{y}.png',
//				maxZ: 16,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ: 16
	        });


	var LIDAR_PhaseIIDSM_DTM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - &nbsp;&nbsp;(LiDAR DTM 1m - Scotland, Ph 2)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_1m_dtm2',
		        minx: -6.45731344, 
			miny: 55.42393632, 
		        maxx: -1.10455815, 
		        maxy: 60.21362318,
			extent: ol.proj.transformExtent([-6.45731344, 55.42393632, -1.10455815, 60.21362318], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/phase2/{z}/{x}/{y}.png',
//				maxZ: 16,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ:16
	        });


	var LIDAR_PhaseIIIDSM_DTM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - &nbsp;&nbsp;(LiDAR DTM 50cm - Scotland, Ph 3)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_50cm_dtm3',
		        minx: -5.20888029, 
			miny: 54.58438826, 
		        maxx: -1.76291556, 
		        maxy: 56.16226120,
			extent: ol.proj.transformExtent([-5.20888029, 54.58438826, -1.76291556, 56.16226120], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/phase3/{z}/{x}/{y}.png',
//				maxZ: 17,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ:17
	        });



	var LIDAR_PhaseIVDSM_DTM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - &nbsp;&nbsp;(LiDAR DTM 50cm - Scotland, Ph 4)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_50cm_dtm4',
		        minx: -5.06296279, 
			miny: 55.03117110, 
		        maxx: -2.00156025, 
		        maxy: 56.54875244,
			extent: ol.proj.transformExtent([-5.06296279, 55.03117110, -2.00156025, 56.54875244], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/phase4/{z}/{x}/{y}.png',
//				maxZ: 17,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ:17
	        });

	var LIDAR_PhaseVDSM_DTM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - &nbsp;&nbsp;(LiDAR DTM 50cm - Scotland, Ph 5)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_50cm_dtm5',
		        minx: -5.06296279, 
			miny: 55.03117110, 
		        maxx: -2.00156025, 
		        maxy: 56.54875244,
			extent: ol.proj.transformExtent([-4.72643490, 55.67676503, -2.48441827, 56.50383840], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/phase5/{z}/{x}/{y}.png',
//				maxZ: 17,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ:17
	        });

	var LIDAR_PhaseVIDSM_DTM_1m = new ol.layer.Tile({
	                     // preload: Infinity,,
	      title: 'ESRI / OSM / LiDAR  -  (LiDAR DTM 50cm - Scotland, Ph 6)',

        	      mosaic_id: 'LIDAR_50cm_dtm6',
		        minx: -5.03248614, 
				miny: 55.53402677, 
		        maxx: -4.14607739, 
		        maxy: 55.98785472,
			extent: ol.proj.transformExtent([-5.03248614, 55.53402677, -4.14607739, 55.98785472], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/phase6/{z}/{x}/{y}.png',
//				maxZ: 17,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ:17
	        });

	var LIDAR_Hebrides_DTM_1m = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - &nbsp;&nbsp;(LiDAR DTM 50cm - Hebrides)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_50cm_dtm_hebrides',
		        minx: -7.47930274, 
			miny: 57.04121284, 
		        maxx: -6.12453882, 
		        maxy: 58.52140630,
			extent: ol.proj.transformExtent([-7.47930274, 57.04121284, -6.12453882, 58.52140630], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '<a href="https://remotesensingdata.gov.scot/data#/list">Crown copyright Scottish Government, SEPA, Fugro and Scottish Water (2012-2022).</a> With thanks to Richard Pearson for processing using <a href="https://plugins.qgis.org/plugins/rvt-qgis/">RVT</a>.',
				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/rgb/hebrides/{z}/{x}/{y}.png',
//				maxZ: 17,
				tilePixelRatio: 1,
				crossOrigin: 'anonymous'
		          }),
			maxZ:17
	        });




   var LIDAR_DTM_1m_2017 = new ol.layer.Tile({
	              title: 'Bing / ESRI / OSM / LiDAR  - LiDAR DTM 1m - England 2017',
        	      mosaic_id: 'LIDAR_1m_2017',
		      minx: -7.09, 
			miny: 49.814, 
		        maxx: 2.1452, 
		        maxy: 55.8332,
			extent: ol.proj.transformExtent([-7.0980160000000003,49.8141069999999999,2.1452689999999999,55.8332639999999998], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				attributions: '<a href="https://environment.data.gov.uk/dataset/42e28b44-32d8-43ad-b60c-f8a2a916cc3f">&copy; Environment Agency copyright 2022.</a>',
		            url: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-dtm-1m/wms',
		           params: {'LAYERS': 'LIDAR_Composite_DTM_1m', 'TILED': true},
		            serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
		       //   minResolution: 2445
		          })
	        });
			

			
   var LIDAR_Comp_DTM_1m_2020 = new ol.layer.Tile({
        		// preload: Infinity,,
	              title: ' Bing / ESRI / OSM / LiDAR  -LiDAR DTM 1m (2020)',
        	      mosaic_id: 'LIDAR_1m',
		      minx: -7.09, 
			miny: 49.814, 
		        maxx: 2.1452, 
		        maxy: 55.8332,
			extent: ol.proj.transformExtent([-7.0980160000000003,49.8141069999999999,2.1452689999999999,55.8332639999999998], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				attributions: '<a href="https://environment.data.gov.uk/dataset/42e28b44-32d8-43ad-b60c-f8a2a916cc3f">&copy; Environment Agency copyright 2022.</a>',
		       //     url: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-dtm-1m/wms',
		            url: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-1m-2022/wms',
		           params: {'LAYERS': 'Lidar_Composite_DTM_1m', 'TILED': true},
		            serverType: 'geoserver',
		            transition: 0,
					tilePixelRatio: 1,
//					crossOrigin: 'anonymous'
		       //   minResolution: 2445
		          }),
			maxZ:15
	        });


			
 var LIDAR_Wales_DTM_1m_RVT = new ol.layer.Tile({

        // preload: Infinity,,
  	extent: ol.proj.transformExtent([-5.30262397, 51.36623130, -2.63613744, 53.44690280], 'EPSG:4326', 'EPSG:3857'),
	title: "LIDAR_Wales_2m_RVT",
	source: new ol.source.XYZ({

		          url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/wales/{z}/{x}/{y}.png',
				attributions: '<a href="https://datamap.gov.wales/maps/lidar-viewer/">Contains public sector information licensed under the Open Government Licence v3.0.</a>',

//		          minZoom: 1,
//		          maxZ: 17,
		          tilePixelRatio: 1,
				  crossOrigin: 'anonymous'
		        }),
        visible: true,
        minx: -5.30262397, 
		miny: 51.36623130, 
        maxx: -2.63613744, 
        maxy: 53.44690280,
		maxZ: 18
    });			




 var LIDAR_England_DTM_RVT = new ol.layer.Tile({
        // preload: Infinity,,
  	extent: ol.proj.transformExtent([-6.46653553, 49.85060192, 1.77817766, 55.87815717], 'EPSG:4326', 'EPSG:3857'),
	title: "LIDAR_England_1m_RVT1",
				  mindate: 2012,
				  maxdate:	2023,
				  relevance: 4,
	source: new ol.source.XYZ({
		          url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/england/{z}/{x}/{y}.png',
				  attributions: '',
		          tilePixelRatio: 1,
				  crossOrigin: 'anonymous'
		        }),
        visible: true,
        minx: -6.46653553, 
		miny: 49.85060192, 
        maxx: 1.77817766, 
        maxy: 55.87815717,
		maxZ: 18
    });

      var LIDAR_1m_DTM = new ol.layer.Group({
  	extent: ol.proj.transformExtent([-8.8, 49.8, 1.8, 60.9], 'EPSG:4326', 'EPSG:3857'),
        // preload: Infinity,,
	title: "Background - LiDAR DTM 50cm-1m - Eng, Scot, Wales", 	
				  mindate: 2012,
				  maxdate:	2021,
	mosaic_id: 'LIDAR_DTM_1m',
	group_no: '14',	
	layers: [ LIDAR_Wales_DTM_1m, LIDAR_England_DTM_RVT, LIDAR_Wales_DTM_1m_RVT, LIDAR_Hebrides_DTM_1m,  LIDAR_PhaseIIDSM_DTM_1m, LIDAR_PhaseIDSM_DTM_1m, LIDAR_PhaseIVDSM_DTM_1m, LIDAR_PhaseIIIDSM_DTM_1m, LIDAR_PhaseVDSM_DTM_1m, LIDAR_PhaseVIDSM_DTM_1m ],
        tileOptions: {crossOriginKeyword: null},      
        minx: -8.8, 
		miny: 49.8,
        maxx: 1.8, 
        maxy: 60.9,
	maxZ: 17
    });



 var LIDAR_Wales__DTM_2m = new ol.layer.Tile({

  	extent: ol.proj.transformExtent([-5.77774100, 51.24082900, -2.60886500, 53.51306700], 'EPSG:4326', 'EPSG:3857'),
	        	// preload: Infinity,,
title: " LIDAR_Wales_2m",
	source: new ol.source.XYZ({
		 //         url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/latest/2m_dtm/{z}/{x}/{y}.png',
		          url: 'https://d3rykcmoi4kytu.cloudfront.net/lidar/latest/2m_dtm/{z}/{x}/{y}.png',
				attributions: '<a href="https://datamap.gov.wales/maps/lidar-viewer/">Contains public sector information licensed under the Open Government Licence v3.0.</a>',

//		          minZoom: 1,
//		          maxZ: 17,
		          tilePixelRatio: 1,
				  crossOrigin: 'anonymous'
		        }),
        visible: true,
        minx: -5.77774100, 
	miny: 51.24082900, 
        maxx: -2.60886500, 
        maxy: 53.51306700,
	maxZ: 17
    });



	var LIDAR_Comp_DTM_2m = new ol.layer.Tile({
        		// preload: Infinity,,
	              title: 'ESRI / OSM / LiDAR -LiDAR DTM 2m', 
		      minx: -7.09, 
			miny: 49.814, 
		        maxx: 2.1452, 
		        maxy: 55.8332,
				key: 'geo.nls.uk/maps/nokey.html',
			extent: ol.proj.transformExtent([-7.0980160000000003,49.8141069999999999,2.1452689999999999,55.8332639999999998], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://environment.data.gov.uk/dataset/73c25700-052a-4d3e-87cf-71326fe2d73a">&copy; Environment Agency copyright 2022.</a>',
		                    url: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-terrain-model-dtm-2m-2022/wms',
		                    params: {'LAYERS': 'Lidar_Composite_DTM_2m', 'TILED': true},

		     //       serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
				tilePixelRatio: 1
		          }),
			maxZ:15
	        });



    var LIDAR_2m_DTM = new ol.layer.Group({
        		// preload: Infinity,,
  	extent: ol.proj.transformExtent([-8.8, 49.8, 1.8, 60.9], 'EPSG:4326', 'EPSG:3857'),
        // preload: Infinity,,
		title: "Background - LiDAR DTM 2m - Eng, Wales", 
		mosaic_id: 'LIDAR_DTM_2m',	

// LIDAR_Comp_DTM_2m removed - June 2020

	layers: [ LIDAR_Comp_DTM_2m, LIDAR_Wales__DTM_2m ],
        tileOptions: {crossOriginKeyword: null},      
        minx: -8.8, 
		miny: 49.8,
        maxx: 1.8, 
        maxy: 55.8,
		maxZ:15
    });


    var LIDAR_Wales_2m = new ol.layer.Tile({
        		// preload: Infinity,,
  	extent: ol.proj.transformExtent([-5.77774100, 51.24082900, -2.60886500, 53.51306700], 'EPSG:4326', 'EPSG:3857'),
	title: " LIDAR_Wales_2m",
	group_no: '14',	
	source: new ol.source.XYZ({
		  //        url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/latest/2m_dsm/{z}/{x}/{y}.png',
		          url: 'https://d3rykcmoi4kytu.cloudfront.net/lidar/latest/2m_dsm/{z}/{x}/{y}.png',
				attributions: '<a href="https://datamap.gov.wales/maps/lidar-viewer/">Contains public sector information licensed under the Open Government Licence v3.0.</a>',

//		          minZoom: 1,
//		          maxZ: 17,
		          tilePixelRatio: 1,
				  crossOrigin: 'anonymous'
		        }),
        visible: true,
        minx: -5.77774100, 
	miny: 51.24082900, 
        maxx: -2.60886500, 
        maxy: 53.51306700,
	maxZ: 17
    });



	var LIDAR_Comp_DSM_2m = new ol.layer.Tile({
        		// preload: Infinity,,
	              title: ' Bing / ESRI / OSM / LiDAR -LiDAR DSM 2m',
        	      mosaic_id: 'LIDAR_2m',
		      minx: -7.09, 
			miny: 49.814, 
		        maxx: 2.1452, 
		        maxy: 55.8332,
			extent: ol.proj.transformExtent([-7.0980160000000003,49.8141069999999999,2.1452689999999999,55.8332639999999998], 'EPSG:4326', 'EPSG:3857'),
		          source: new ol.source.TileWMS({
				    attributions: '<a href="https://environment.data.gov.uk/dataset/2cef2771-fa6a-477e-ab40-48e9a9b31714">&copy; Environment Agency copyright 2022.</a>',
		            url: 'https://environment.data.gov.uk/spatialdata/lidar-composite-digital-surface-model-last-return-dsm-2m-2022/wms',
		           params: {'LAYERS': 'Lidar_Composite_LZ_DSM_2m', 'TILED': true },
		            serverType: 'geoserver',
		            // Countries have transparency, so do not fade tiles:
		            transition: 0,
				tilePixelRatio: 1
//				crossOrigin: 'anonymous'
		          }),
			maxZ:15
	        });




    var LIDAR_2m = new ol.layer.Group({
        		// preload: Infinity,,
  	extent: ol.proj.transformExtent([-8.8, 49.8, 1.8, 60.9], 'EPSG:4326', 'EPSG:3857'),
        // preload: Infinity,,
		title: "Background - LiDAR DSM 2m - Eng, Wales", 
		mosaic_id: 'LIDAR_2m',
	group_no: '21',		
	layers: [ LIDAR_Comp_DSM_2m, LIDAR_Wales_2m ],
        tileOptions: {crossOriginKeyword: null},      
        minx: -8.8, 
	miny: 49.8,
        maxx: 1.8, 
        maxy: 55.8,
	maxZ: 15
    });


	var R_osm = new ol.layer.Tile({
	        title: 'ESRI / OSM / LiDAR - OpenStreetMap',
        	mosaic_id: 'osm',
				  relevance: 6,
				  mindate: 2010,
				  maxdate:	2025,
		minx: -170, 
	        miny: -85, 
	        maxx: 170, 
	        maxy: 85,
	  	source: new ol.source.OSM({
	    		// attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	    	url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	  		}),
		maxZ: 20
	});

	var R_esri_world_topo = new ol.layer.Tile({
		// preload: Infinity,,
		title: 'ESRI / OSM / LiDAR - ESRI World Topo',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
	        mosaic_id: 'ESRITopo',
		minx: -170, 
	        miny: -85, 
	        maxx: 170, 
	        maxy: 85,
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',

			              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			                  'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
				maxZoom: 18
	      	}),
		maxZ: 20
	    });

	var R_esri_world_imagery = new ol.layer.Tile({
		// preload: Infinity,,
		title: 'ESRI / OSM / LiDAR - ESRI World Imagery',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
	        mosaic_id: 'ESRIWorld',
		minx: -170, 
	        miny: -85, 
	        maxx: 170, 
	        maxy: 85,
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',

			              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			                  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
				maxZoom: 18
	      	}),
		maxZ: 19
	    });
      
	var R_esri_world_boundaries = new ol.layer.Tile({
		// preload: Infinity,,
		title: 'ESRI / OSM / LiDAR - ESRI World Imagery',
				  relevance: 8,
				  mindate: 2010,
				  maxdate:	2025,
	        mosaic_id: 'ESRIWorld',
		minx: -170, 
	        miny: -85, 
	        maxx: 170, 
	        maxy: 85,
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',

			              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			                  'World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
	      	})
	    });

	var R_maptiler_basic =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR - MapTiler Streets',
				  relevance: 7,
				  mindate: 2010,
				  maxdate:	2025,
		   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'MapTiler',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/streets-v2/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',

              crossOrigin: 'anonymous'
            }),
		maxZ: 19
          });
		  
	var R_maptiler_satellite =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR -  MapTiler Satellite Hybrid',
				  relevance: 7,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'MapTilerSat',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/hybrid/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
			maxZ: 20
          });


	var R_google_satellite =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR -  Google Satellite',
				  relevance: 10,
				  mindate: 2010,
				  maxdate:	2025,
				   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'GoogleSat',
				source: new ol.source.XYZ({
				url:  'https://mt1.google.com/vt/lyrs=s@113&hl=en&&x={x}&y={y}&z={z}&key=AIzaSyBxU0zSPn92V4KO4sj6GD9g5zfVNcArRbk',
	      	attributions: '',
			tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
			maxZ: 20
          });


	var maptiler_elevation =  new ol.layer.Tile({
		title: 'Background - MapTiler Elevation',
				  relevance: 5,
				  mindate: 2010,
				  maxdate:	2025,
						   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'MapTilerElev',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/outdoor/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',
						tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
		maxZ: 20
          });

	var R_maptiler_elevation =  new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR - MapTiler Elevation',
				  relevance: 5,
				  mindate: 2010,
				  maxdate:	2025,
						   minx: -170, 
	           miny: -85, 
	           maxx: 170, 
	           maxy: 85,
	        mosaic_id: 'MapTilerElev',
            	source: new ol.source.TileJSON({
     		url: 'https://api.maptiler.com/maps/outdoor/256/tiles.json?key=7Y0Q1ck46BnB8cXXXg8X',
	      	attributions: '<a href="https://www.openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap contributors</a>',
						tilePixelRatio: 1,
              crossOrigin: 'anonymous'
            }),
		maxZ: 20
          });


	var R_OS1920s =  	new ol.layer.Tile({
	            title: 'ESRI / OSM / LiDAR -  OS 1920s',
        	    mosaic_id: 'OS1920s',
				  relevance: 7,
				  mindate: 1920,
				  maxdate:	1930,
			minx: -8.4, 
		        miny: 50.5, 
		        maxx: 2.4, 
		        maxy: 60.4,
		    source: new ol.source.XYZ({
				// attributions: [nlsTILEATTRIBUTION],
				url: 'https://geo.nls.uk/maps/api/nls/{z}/{x}/{y}.jpg',
				// minZoom: 10,
				maxZoom: 15,
				tilePixelRatio: 1
		}),
		maxZ: 15
          });





	var R_OSOpendata = new ol.layer.Tile({
	              title: 'ESRI / OSM / LiDAR -  OS Opendata',
        	      mosaic_id: 'Opendata',
				  relevance: 7,
				  mindate: 2010,
				  maxdate:	2025,
		      minx: -7.68, 
			miny: 49.8, 
		        maxx: 1.77, 
		        maxy: 60.9,
		      source: new ol.source.XYZ({
				    attributions: '<a href="https://www.ordnancesurvey.co.uk/oswebsite/opendata/">Ordnance Survey OpenData</a>.',
				    url: 'https://mapseries-tilesets.s3.amazonaws.com/opendata/{z}/{x}/{y}.png',
				    // minZoom: 10,
				    maxZoom: 16,
				    tilePixelRatio: 1
				  }),
		maxZ: 20
	                    });



	var R_OSMapsLeisure = new ol.layer.Tile({
		title: 'ESRI / OSM / LiDAR - OS Maps Leisure (1:50,000/1:25,000)',
		mosaic_id: 'OSLeisure',
				  relevance: 7,
				  mindate: 2010,
				  maxdate:	2025,
			minx: -7.68, 
			miny: 49.8, 
		    maxx: 1.77, 
		    maxy: 60.9,
		maxZ: 20
			});

	
		fetch('https://api.os.uk/maps/raster/v1/wmts?key=Q9ESJToD1he64kb6Aacq2Wqjy2EMhkUY&service=WMTS&request=GetCapabilities&version=2.0.0')
		  .then(function (response) {
			return response.text();
		  })
		  .then(function (text) {
			const result = parser.read(text);
			const options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'Leisure_27700',
                matrixSet: 'EPSG:27700',
				maxZoom: 9,

			});
			options.crossOrigin = '';
			options.projection = 'EPSG:27700';
			options.attributions = 'Contains OS data © Crown copyright and database right 2025'
			options.wrapX = false;
			R_OSMapsLeisure.setSource(new ol.source.WMTS(options));
		  });






	var R_OSMapsAPI = new ol.layer.Tile({
		      // preload: Infinity,,
	              title: 'ESRI / OSM / LiDAR -  OS Maps API',
	              mosaic_id: 'OSAPI',
				  relevance: 7,
				  mindate: 2010,
				  maxdate:	2025,
		      minx: -7.68, 
			miny: 49.8, 
		        maxx: 1.77, 
		        maxy: 60.9,
		      source: new ol.source.XYZ({
				    attributions:  'Contains OS data © Crown copyright and database right 2022',

				    url: 'https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=' + 'Rt69sv62Dv1JNAvlJAcM0upXIaIcpua8',
				    minZoom: 7
				  }),
		maxZ: 20
	   });


	var R_opentopomap = new ol.layer.Tile({
		// preload: Infinity,,
		title: 'ESRI / OSM / LiDAR -  OpenTopoMap',
	        mosaic_id: 'OpenTopoMap',
				  relevance: 5,
				  mindate: 2010,
				  maxdate:	2025,
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions:  'Map tiles under <a href=\'https://creativecommons.org/licenses/by/3.0/\'>CC BY SA</a> from <a href=\'https://opentopomap.org/\'>OpenTopoMap</a>',

			          urls:[
			            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
			            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
			            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
			          ],
	      	}),
		maxZ: 20
	    });

	var R_LIDAR_Sherwood_DTM = new ol.layer.Tile({
	              title: 'ESRI / OSM / LiDAR - LiDAR DTM 16cm (Sherwood Forest)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_16cm_dtm_sherwood',
				  relevance: 3,
				  mindate: 2010,
				  maxdate:	2025,
		        minx: -1.24943539, 
			miny: 53.00462605, 
		        maxx: -0.95231618, 
		        maxy: 53.25151704,
			extent: ol.proj.transformExtent([-1.24943539, 53.00462605, -0.95231618, 53.25151704], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
		          attributions: '&copy; 2021. <a href="https://miner2major.nottinghamshire.gov.uk/projects/heritage/the-veiled-landscape/">Miner2Major Veiled Landscape Project.',

				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/sherwood/dtm/{z}/{x}/{y}.png',
				maxZoom: 19,
				tilePixelRatio: 1
		          }),
			maxZ: 19
	        });


	var R_LIDAR_Sherwood_DSM = new ol.layer.Tile({
	              title: 'ESRI / OSM / LiDAR - LiDAR DSM 16cm (Sherwood Forest)',
        		// preload: Infinity,,
        	      mosaic_id: 'LIDAR_16cm_dsm_sherwood',
				  relevance: 3,
				  mindate: 2010,
				  maxdate:	2025,
		        minx: -1.24943539, 
			miny: 53.00462605, 
		        maxx: -0.95231618, 
		        maxy: 53.25151704,
			extent: ol.proj.transformExtent([-1.24943539, 53.00462605, -0.95231618, 53.25151704], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '&copy; 2021. <a href="https://miner2major.nottinghamshire.gov.uk/projects/heritage/the-veiled-landscape/">Miner2Major Veiled Landscape Project.',

				url: 'https://mapseries-tilesets.s3.amazonaws.com/lidar/sherwood/dsm/{z}/{x}/{y}.png',
				maxZoom: 19,
				tilePixelRatio: 1
		          }),
			maxZ: 19
	        });

	var plan = new ol.layer.Geoportail({
		title: "Background - IGN",
	  	layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
	  	className: 'plan',
	   	mosaic_id: '22'
	});
	
		var E_osm = new ol.layer.Tile({
	        title: 'ESRI / OSM / LiDAR - OpenStreetMap',
        	mosaic_id: 'osm',
				  relevance: 6,
				  mindate: 2010,
				  maxdate:	2025,
			minx: -170, 
	        miny: -85, 
	        maxx: 170, 
	        maxy: 85,
		    key: 'geo.nls.uk/maps/nokey.html',
	  	source: new ol.source.OSM({
	    		// attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	    	url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	  		}),
		maxZ: 20
	});
	
		var R_blank_layer = new ol.layer.Vector({
		  mosaic_id: '22',
		  title: "ESRI / OSM / LiDAR - Blank Layer",			  
		  relevance: 83,
				  
			mindate: 1800,
				  maxdate:	2025,
			minx: -170, 
	        miny: -85, 
	        maxx: 170, 
	        maxy: 85,
		  source: new ol.source.Vector(),
		  style: new ol.style.Style({}),
	      });

	var baseLayers = [ esri_world_imagery, esri_world_topo, maptiler_basic, maptiler_satellite, maptiler_elevation, google_satellite, google_satellite_hybrid, osm, OSMapsLeisure, OSMapsAPI, OSOpendata, OS1920s, OS1900sGBback, opentopomap, darkskiessource, landcovermap, LIDAR_1m_DTM, LIDAR_2m_DTM, LIDAR_1m,  LIDAR_2m, blank_layer, add_more_layers];


	if (WebGL)
		
		{

	var overlayLayersRightAll = [R_esri_world_imagery, R_esri_world_topo, R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM, R_blank_layer, R_osoneinchfirstgb, R_ossixinchfirstgreatbritain, R_oneinchgeology, R_twentyfive_inch_gloucester_wiltshire_somerset_britain, R_oneinch2nd, R_one_inch_2nd_hills, R_sixinch2, R_ostwentyfiveinchGreatBritain, R_bartgreatbritain, R_quarterinchfirsthills, R_quarterinchfirstoutline, R_OS1900sGB, R_os1900s_all_scales, R_sixinchgeology, R_oneinchthirdgbcolour,  R_OS25inchEdinburgh1914, R_OS25inchGloucester3rd, R_quarterinch, R_quarterinchcivilair, R_quarterinchfourth, R_twentyfivethousand, R_twentyfivethousandoutline, R_oneinchpopular_britain, R_halfinchmot, R_nls, R_halfinchoutlineblue, R_oneinchlanduse, R_landutilisationsurveygb, R_landutilisationsurveyengwal25kpub, R_bartgreatbritain1940s, R_airphotos1250, R_airphotos, R_scot1944_1966_group_great_britain, R_os1250_group_great_britain, R_os1250_scot_b, R_os1250_scot_c, R_os2500_group_great_britain, R_os2500_scot_b, R_os2500_scot_c, R_OS10knatgridgreat_britain, R_oneinchseventh, R_admin, R_coal_iron, R_farming, R_general, R_geological, R_iron_steel, R_land_classification, R_land_utilisation, R_limestone, R_physical, R_population_change_1921, R_population_change_1931, R_population_change_1939, R_population_density_1931, R_population_density_1951, R_railways, R_rainfall, R_roads_46, R_roads_56, R_royhighlands, R_roylowlands, R_hole1607, R_dorret1750, R_arrowsmith1807, R_sixinch, R_oneinchscotlandfirstcol, R_oneinch2ndscot, R_one_inch_2nd_hills_scot, R_sixinch2scot_api, R_os25inch1890s, R_os25inchblueandblacks, R_os25inchblueandblacksOS, R_oneinchthirdcolour, R_bartsurveyatlas, R_oneinchpopular, R_oneinchpopular_outline, R_barthalfinch, R_twentyfivethousandscot, R_gsgs3906, R_oneinchgsgs3908, R_scot1944_1966_group, R_os1250_group_great_britain_scot, R_os1250_scot_b_scot, R_os1250_scot_c_scot, R_os2500_group_great_britain_scot, R_os2500_scot_b_scot, R_os2500_scot_c_scot, R_oneinchnatgrid, R_oneinchnatgridoutline, R_oneinchgsgs4639, R_quarterinchadmin1950, R_oneinchsoils, R_OS10knatgridscot, R_oneinchseventhscot, R_quarterinchadmin1960, R_secondlandusescot, R_ch00000529, R_ch00000541, R_ch74400306, R_ch85449271, R_ch85449274, R_ch85449277, R_ch85449280, R_ch85449283, R_ch85449286, R_ch85449289, R_ch85449292, R_adch101942045, R_adch101942048, R_adch101942078, R_adch101942108, R_adch101942111, R_adch101942114, R_adch101942117, R_adch101942630, R_adch74412450, R_adch101942603, R_adch101942606, R_adch101942612, R_adch101942615, R_adch101942618, R_adch101942621, R_adch101942624, R_adch101942627, R_adch101942633, R_adch101942687, R_adch101942690, R_adch101942693, R_adch101942696, R_adch101942699, R_adch101942702, R_adch101942705, R_adch101942708, R_adch101942711, R_adch101942714, R_adch101942669, R_adch101942672, R_adch101942675, R_adch101942678, R_adch101942681, R_adch101942735, R_adch101942726, R_adch101942729, R_adch101942732, R_adch101942741, R_adch101942738, R_adch101942759, R_adch101942762, R_adch101943347, R_adch101942906_inset2, R_adch101942909_inset2, R_adch101942912_inset2, R_adch101942915_inset2, R_adch101942915_inset4, R_adch101942906_inset3, R_adch101942909_inset3, R_adch101942912_inset3, R_adch101942915_inset3, R_adch101942906_inset1, R_adch101942909_inset1, R_adch101942912_inset1, R_adch101942915_inset1, R_adch101942975, R_adch101942981, R_adch101942984, R_adch101942987, R_adch101942993, R_adch101942996, R_adch101943350, R_adch101943353, R_adch101943356, R_adch101943491, R_adch101943494, R_adch101943500, R_adch101943503, R_adch101943506, R_adch101943509, R_adch101943512, R_adch101944457, R_adch101944460, R_adch101944463, R_adch74401001, R_adch101944847_inset3, R_adch101944847_inset4, R_adch101944847_inset2, R_adch101944847_inset1, R_adch101944847_inset5, R_adch101944847_inset6, R_adch101944847_inset7, R_adch101944850_inset3, R_adch101944850_inset4, R_adch101944850_inset2, R_adch101944850_inset1, R_adch101944850_inset5, R_adch101944850_inset6, R_adch101944850_inset7, R_adch101944853_inset3, R_adch101944853_inset4, R_adch101944853_inset2, R_adch101944853_inset1, R_adch101944853_inset5, R_adch101944853_inset6, R_adch101944853_inset7, R_adch101944856_inset3, R_adch101944856_inset4, R_adch101944856_inset2, R_adch101944856_inset1, R_adch101944856_inset5, R_adch101944856_inset6, R_adch101944883, R_adch101944865, R_adch101944874, R_adch101944886, R_adch101944889, R_adch101944892, R_adch101944895, R_adch101945726, R_adch101945729, R_adch74400307, R_adch74400307_inset1, R_adch74400307_inset2, R_adch74400307_inset3, R_adch74400307_inset4, R_adch101946716, R_adch101946716_inset2, R_adch101946716_inset3, R_adch101946716_inset4, R_adch101946716_inset1, R_adch101946695_inset, R_adch101946695, R_adch101946698_inset, R_adch101946698, R_adch74401002, R_adch101947403_dunvegan, R_adch101947403_snizort, R_adch101947406, R_adch101947409, R_adch101947898, R_adch101947901, R_adch101947907, R_adch101947910, R_adch101947916, R_adch101947919, R_adch101947922, R_adch101947925, R_adch101947919_inset1, R_adch101947922_inset1, R_adch101947922_inset2, R_adch101947925_inset1, R_adch101947925_inset2, R_adch74401003, R_adch101948129, R_adch101948132, R_adch101948135, R_adch101948138, R_adch101948141, R_adch101948132_inset, R_adch101948135_inset, R_adch101948138_inset, R_adch101948141_inset, R_adch74401004, R_adch101948144, R_adch101948147, R_adch101948150, R_adch101948153, R_adch101948225, R_adch101948228, R_adch101948234, R_adch101948237, R_adch101948240, R_adch101948243, R_adch101948246, R_adch101948249, R_adch101948252, R_adch101948276, R_adch101948285, R_adch74412387, R_adch101948291, R_adch101948294, R_adch101948297, R_adch101948300, R_adch101948303, R_adch101948306, R_adch101948279, R_adch74400302, R_adch101948390, R_adch74401005, R_adch101948420_inset, R_adch101948420, R_adch101948423_inset, R_adch101948423, R_adch101948426_inset, R_adch101948426, R_adch101948429_inset, R_adch101948429, R_adch101948432_inset, R_adch101948432, R_adch101948435_inset, R_adch101948435, R_adch101948438_inset, R_adch101948438, R_adch101948441_inset, R_adch101948441, R_adch101948444_inset, R_adch101948444, R_adch101948504, R_adch101948507, R_adch101948510, R_adch101948513, R_adch101948516, R_adch101948510_inset, R_adch101948513_inset, R_adch101948516_inset, R_adch74412388, R_adch74412388_inset, R_adch101948543, R_adch74412457, R_adch74412457_inset, R_adch74413949, R_adch74412463, R_adch74401006_oban, R_adch74401006_troon, R_adch74401007, R_adch74401008, R_adch74401009, R_adch74401010, R_adch74401011, R_adch74401012, R_adch74401060, R_adch74401014, R_adch74401015, R_adch74401016, R_adch74401017, R_adch74412462, R_adch74400305, R_adch74412454, R_adch74401019, R_adch74401019_inset, R_adch74401020, R_adch74401022, R_adch74401023, R_adch74400296, R_adch74400296_inset1, R_adch74400296_inset2, R_adch74400296_inset3, R_adch74401025, R_adch74401026, R_adch74401027, R_adch74401028, R_adch74401029, R_adch74401030, R_adch74401031, R_adch74401032, R_adch74401033, R_adch74401034, R_adch74401035, R_adch74401036, R_adch74401037, R_adch74401000, R_adch74401000_inset, R_adch74412461, R_adch74401038, R_adch74401039, R_adch74400294, R_adch74401040, R_adch74401041, R_adch74401042, R_adch74401043, R_adch74401044, R_adch74401045, R_adch74401046, R_adch74401047, R_adch74401048, R_adch74401048_inset, R_adch74401049, R_adch74401052, R_adch74401053, R_adch74401053_inset, R_adch74401054, R_adch74401051, R_adch74401055, R_adch74401056, R_adch74412460, R_adch74401057, R_adch101961533, R_bathlochawenorth, R_bathlochawesouth, R_bathlochcluanie, R_bathlochdoon, R_bathlochduntelchaig, R_bathlochearn, R_bathlocherichtlower, R_bathlocherichtupper, R_bathlochfannich, R_bathlochgarryness, R_bathlochgarrytay, R_bathlochglass, R_bathlochharray, R_bathlochlaidon, R_bathlochleven, R_bathlochlomondnorth, R_bathlochlomondsouth, R_bathlochloyne, R_bathlochluichart, R_bathlochlyon, R_bathlochmhor, R_bathlochmonar, R_bathlochmullardoch, R_bathlochquoich, R_bathlochrannoch, R_bathlochshiellower, R_bathlochshielupper, R_bathlochshinlower, R_bathlochshinupper, R_bathlochtayeast, R_bathlochtaywest, R_bathlochtreig, R_bathlochtummel, R_county119952600, R_county74400145, R_county135908105, R_county74400334, R_estate121129476, R_estate121129386, R_estate121129410, R_estate121129416, R_estate121129419, R_estate132293752, R_estate129392884, R_estate132293758, R_estate121129389, R_estate121129413, R_estate129393076, R_estate129393010, R_estate129393148, R_estate114473788, R_estate114473785, R_estate103427429, R_estate129392971, R_estate129393253, R_estate125491577, R_estate121129473, R_estate121129458, R_estate110069086, R_estate132293749, R_estate132293755, R_estate129392983, R_estate129392986, R_estate129392989, R_estate129392992, R_estate129392995, R_estate129392911, R_estate121129434, R_estate129392908, R_estate114473773, R_estate110069083, R_estate129393019, R_estate129393103, R_estate129393049, R_estate110323727, R_estate132293842, R_estate121129461, R_estate110069080, R_estate103427459, R_estate103427450, R_estate103427447, R_estate129392893, R_estate129393328, R_estate129393580, R_estate121129443, R_estate121129392, R_estate129393397, R_estate129392887, R_estate121129464, R_estate132293743, R_estate129392947, R_estate129392950, R_estate106697318, R_estate129392935, R_estate132293857, R_estate106697324, R_estate129392887t, R_estate129393172, R_estate_balmaclellan, R_estate129393712, R_estate129393715, R_estate129393718, R_estate129393721, R_estate129393724, R_estate129393676, R_estate129393709, R_estate129393706, R_estate129393763, R_estate_earlstoun, R_estate125491588, R_estate129393664, R_estate132293782, R_estate129393778, R_estate129393754, R_estate129393745, R_estate125491585, R_estate129393751, R_estate125491597, R_estate129393583, R_estate129393661, R_estate106697330, R_estate106697333, R_estate106697336, R_estate106697339, R_estate125491591, R_estate125491601, R_estate114473887, R_estate106697342, R_estate129393769, R_estate125491594, R_estate114473800, R_estate114473809, R_estate114473806, R_estate114473794, R_estate114473797, R_estate114473815, R_estate125491581, R_estate114473830, R_estate114473845, R_estate114473854, R_estate114473824, R_estate114473836, R_estate114473842, R_estate114473848, R_estate114473851, R_estate114473839, R_estate114473827, R_estate129393667, R_estate129393016, R_estate129393076l, R_estate129393016c, R_estate74436591, R_aberdeen, R_aberdeen1879, R_aberdeen1883, R_aberdeen1895, R_aberdeen1902, R_aberdeen1905, R_aberdeen1915, R_airdrie, R_alexandria, R_alloa, R_annan, R_arbroath, R_ardhallow, R_ayr, R_barry, R_berwick, R_braefoot, R_brechin, R_burntisland, R_burntisland1824, R_campbeltown, R_campbeltown_goad, R_cloch, R_coatbridge, R_cramond, R_cupar1854, R_cupar1893, R_dalkeith1852, R_dalkeith1893, R_dreghorn, R_dumbarton, R_dumfries1850, R_dumfries1893, R_dundee_goad, R_dundee1857, R_dundee1870, R_dundee1882, R_dundee1888, R_dundee1891, R_dundee1892, R_dundee1893, R_dundee1897, R_dundee1900, R_dundee1903, R_dundee1906, R_dundee1908, R_dundee1910, R_dundee1911, R_dunfermline1854, R_dunfermline1893, R_edin_newington_1826, R_edin1765, R_edin1784, R_edin1804, R_edin1817, R_edin1819, R_edin1821, R_edin1822, R_edin1831, R_edin1832, R_edin1849, R_edin1865, R_edin1876, R_edin1882, R_edin1885, R_edin1888, R_edin1891, R_edin1892, R_edin1892b, R_edin1893, R_edin1902, R_edin1905, R_edin1907, R_edin1910, R_edin1912, R_edin1917, R_edin1918, R_edin1919, R_edin1932, R_edin1939, R_edin1944_1963, R_edinburgh_castle, R_edinburgh_goad, R_elgin, R_falkirk, R_forfar, R_forres, R_galashiels, R_girvan, R_glas1778, R_glas1807, R_glas1857, R_glas1882, R_glas1888, R_glas1891, R_glas1894, R_glas1895, R_glas1900, R_glas1905, R_glas1910, R_glas1914, R_glas1920, R_glas1925, R_glasgow_goad, R_glasgow1930, R_glasgow1936, R_greenock, R_greenock_goad, R_greenock1861, R_greenock1879, R_greenock1887, R_greenock1895, R_greenock1915, R_haddington1853, R_haddington1893, R_hamilton, R_hawick, R_inchcolm, R_inchkeith_2500, R_inchkeith_500, R_inchmickery, R_inverness, R_irvine, R_jedburgh, R_kelso, R_kilmarnock, R_kirkcaldy1855, R_kirkcaldy1894, R_kirkcudbright1850, R_kirkcudbright1893, R_kirkintilloch, R_kirriemuir, R_lanark, R_leith_goad, R_linlithgow, R_maybole, R_montrose, R_musselburgh1853, R_musselburgh1893, R_nairn, R_oban, R_osoneincholdseries, R_ossixinchfirstengland, R_sixinchenglandwales, R_oneinchrevisedcolouredengland, R_oneinchthirdengwalcolour, R_OS25inchGloucester3rdengland, R_OS25inchGuildford, R_bartholomew_half_1919, R_twentyfivethousandengwal, R_oneinchpopular_england, R_oneinchpopular_outline_england, R_oneinchnewpop, R_landutilisationsurveyengwal25k, R_landutilisationsurveyengwalscapes, R_landutilisationsurveyengwalwildscapeveg, R_landutilisationsurveyengwalwildscapehab,  R_oneinchseventhengwal, R_OStownsALL, R_OStownsALL1056, R_OSTownsAberdare, R_OSTownsAbergavenny, R_OSTownsAberystwyth, R_OSTownsAbingdon, R_OStownsAccrington, R_OSTownsAccrington, R_OSTownsAldershot, R_OSTownsAlnwick, R_OStownsAlnwick2640, R_OSTownsAltrincham, R_OSTownsAndover, R_OSTownsAppleby, R_OSTownsAshford, R_OStownsAshton, R_OStownsAshton2, R_OSTownsAtherstone, R_OSTownsAylesbury, R_OStownsBacup, R_OSTownsBacup, R_OSTownsBanbury, R_OSTownsBangor, R_OStownsBarnsley, R_OSTownsBarnsley, R_OSTownsBarnstaple, R_OSTownsBarrowinFurness, R_OSTownsBasingstoke, R_OSTownsBath, R_OSTownsBatley, R_OSTownsBeccles, R_OSTownsBedford, R_OSTownsBelper, R_OSTownsBerkhamstead, R_OStownsBeverley, R_OSTownsBeverley, R_OSTownsBideford, R_OSTownsBiggleswade, R_OStownsBingley, R_OSTownsBingley, R_OSTownsBirkenhead, R_TownsBirmimgham1855, R_OSTownsBirmingham, R_OSTownsBirstal, R_OSTownsBishopAuckland, R_OSTownsBishopsStortford, R_OStownsBlackburn, R_OSTownsBlackburn, R_OSTownsBlackpool, R_OStownsBlyth, R_OSTownsBlyth, R_OSTownsBodmin, R_OStownsBolton, R_OSTownsBolton, R_OSTownsBoston, R_OSTownsBournemouth, R_OStownsBradford, R_OSTownsBradford, R_OSTownsBradfordonAvon, R_OSTownsBraintree, R_OSTownsBrentwood, R_OSTownsBridgnorth, R_OSTownsBridgwater, R_OStownsBridlington, R_OSTownsBridlington, R_OSTownsBridport, R_OSTownsBrierleyHill, R_OSTownsBrighouse, R_OSTownsBrighton, R_OSTownsBristol, R_OSTownsBrixham, R_OSTownsBromsgrove, R_OSTownsBuckingham, R_OStownsBurnley, R_OSTownsBurnley, R_OSTownsBurslem, R_OSTownsBurtonuponTrent, R_OStownsBury, R_OSTownsBury, R_OSTownsBuryStEdmunds, R_OSTownsBuxton, R_OSTownsCamborne, R_OSTownsCambridge, R_OSTownsCanterbury, R_OSTownsCardiff, R_OSTownsCarmarthen, R_OSTownsCarnarvon, R_OSTownsCastleford, R_OSTownsCheltenham, R_OSTownsChertsey, R_OSTownsChester, R_OSTownsChesterfield, R_OSTownsChesterton, R_OSTownsChichester, R_OSTownsChippenham, R_OStownsChorley, R_OSTownsChorley, R_OSTownsChowbent, R_OSTownsChristchurch, R_OSTownsCirencester, R_OSTownsClaytonleMoors, R_OSTownsCleckheaton, R_OSTownsClevedon, R_OStownsClitheroe, R_OSTownsCockermouth, R_OSTownsColchester, R_OStownsColne, R_OSTownsColne, R_OSTownsCongleton, R_OSTownsCoventry, R_OSTownsCrediton, R_OSTownsCrewe, R_OSTownsCrewkerne, R_OSTownsCroydon, R_OSTownsDaltoninFurness, R_OSTownsDarlaston, R_OStownsDarlington, R_OSTownsDartford, R_OSTownsDartmouth, R_OSTownsDarwen, R_OSTownsDawlish, R_OSTownsDeal, R_OSTownsDenbigh, R_OSTownsDerby, R_OSTownsDevizes, R_OStownsDewsbury, R_OStownsDoncaster, R_OSTownsDoncaster, R_OSTownsDorchester, R_OSTownsDorking, R_OSTownsDouglas, R_OSTownsDover, R_OSTownsDroitwich, R_OSTownsDudley, R_OSTownsDunstable, R_OSTownsDurham, R_OSTownsEastbourne, R_OSTownsEastDereham, R_OSTownsEastRetford, R_OSTownsEccles, R_OSTownsElland, R_OSTownsEly, R_OSTownsEvesham, R_OSTownsExeter, R_OSTownsExmouth, R_OSTownsFalmouth, R_OSTownsFarnham, R_OSTownsFarnworth, R_OSTownsFarsley, R_OSTownsFaversham, R_OStownsFleetwood, R_OSTownsFleetwood, R_OSTownsFolkestone, R_OSTownsFrome, R_OSTownsGainsborough, R_OSTownsGarston, R_OSTownsGlossop, R_OSTownsGloucester, R_OSTownsGodmanchester, R_OSTownsGoole, R_OSTownsGosport, R_OSTownsGrantham, R_OSTownsGravesend, R_OSTownsGreatDriffield, R_OSTownsGreatGrimsby, R_OSTownsGreatHarwood, R_OSTownsGreatMalvern, R_OSTownsGreatMarlow, R_OSTownsGreatYarmouth, R_OSTownsGuildford, R_OStownsHalifax, R_OSTownsHalifax, R_OSTownsHalstead, R_OSTownsHarrogate, R_OSTownsHartlepool, R_OSTownsHarwich, R_OStownsHaslingden, R_OSTownsHaslingden, R_OSTownsHastings, R_OSTownsHaverfordwest, R_OSTownsHebdenBridge, R_OSTownsHeckmondwike, R_OSTownsHemelHempstead, R_OSTownsHenleyonThames, R_OSTownsHereford, R_OSTownsHertford, R_OSTownsHexham, R_OStownsHeywood, R_OSTownsHeywood, R_OSTownsHighWycombe, R_OSTownsHinckley, R_OSTownsHindley, R_OSTownsHolyhead, R_OSTownsHolywell, R_OSTownsHorncastle, R_OSTownsHorsham, R_OSTownsHorwich, R_OStownsHowden, R_OSTownsHucknallTorkard, R_OStownsHuddersfield, R_OSTownsHuddersfield, R_OSTownsHuntingdon, R_OSTownsHyde, R_OSTownsIdle, R_OSTownsIlfracombe, R_OSTownsIlkeston, R_OSTownsIlkley, R_OSTownsIpswich, R_OStownsKeighley, R_OSTownsKeighley, R_OSTownsKendal, R_OSTownsKettering, R_OSTownsKidderminster, R_OSTownsKidsgrove, R_OSTownsKingsLynn, R_OStownsKingstonuponHull, R_OSTownsKingstonuponHull, R_OStownsKingstonuponThames, R_OStownsKnaresborough, R_OSTownsKnaresborough, R_OSTownsKnottingley, R_OSTownsLancaster, R_OStownsLancaster1056, R_OSTownsLeeds, R_OStownsLeeds1056, R_OSTownsLeek, R_OSTownsLeicester, R_OSTownsLeigh, R_OSTownsLeightonBuzzard, R_OSTownsLeominster, R_OSTownsLewes, R_OSTownsLichfield, R_OSTownsLincoln, R_OSTownsLiskeard, R_OSTownsLittleborough, R_OStownsLiverpool, R_OSTownsLiverpool, R_OSTownsLlandudno, R_OSTownsLlanelly, R_OStownsLondon5280, R_OStownsLondon, R_OStownsLondon1056, R_OSTownsLongEaton, R_OSTownsLoughborough, R_OSTownsLouth, R_OSTownsLowestoft, R_OSTownsLudlow, R_OSTownsLuton, R_OSTownsLymington, R_OSTownsLytham, R_OSTownsMacclesfield, R_OSTownsMaidenhead, R_OSTownsMaidstone, R_OSTownsMaldon, R_OStownsMalton, R_OStownsManchester, R_OSTownsManchesterandSalford, R_OSTownsMansfield, R_OSTownsMarch, R_OSTownsMargate, R_OSTownsMaryport, R_OSTownsMelcombeRegis, R_OSTownsMeltonMowbray, R_OSTownsMerthyrTydfil, R_OStownsMiddlesbrough, R_OSTownsMiddlesbrough, R_OStownsMiddleton, R_OSTownsMiddleton, R_OSTownsMirfield, R_OSTownsMold, R_OSTownsMonmouth, R_OSTownsMorecambe, R_OSTownsMorley, R_OSTownsMorpeth, R_OSTownsMossley, R_OSTownsNantwich, R_OSTownsNeath, R_OSTownsNelson, R_OSTownsNewark, R_OSTownsNewbury, R_OSTownsNewcastle1894, R_OSTownsNewcastle1900s, R_OSTownsNewMalton, R_OSTownsNewmarket, R_OSTownsNewport, R_OSTownsNewportIsleofWight, R_OSTownsNewtonAbbot, R_OSTownsNewtown, R_OSTownsNorthampton, R_OSTownsNorthwich, R_OSTownsNorwich, R_OSTownsNottingham, R_OSTownsNuneaton, R_OSTownsOldbury, R_OSTownsOldham, R_OStownsOrmskirk, R_OSTownsOrmskirk, R_OSTownsOswestry, R_OSTownsOtley, R_OSTownsOxford, R_OSTownsPadiham, R_OSTownsPembroke, R_OSTownsPembrokeDock, R_OSTownsPenrith, R_OSTownsPenzance, R_OSTownsPeterborough, R_OSTownsPetersfield, R_OSTownsPetworth, R_OSTownsPlumstead, R_OStownsPlymouth1850s, R_OStownsPontefract, R_OSTownsPontefract, R_OSTownsPontypool, R_OSTownsPoole, R_OSTownsPortsmouth, R_OStownsPrescot, R_OSTownsPrescot, R_OStownsPreston, R_OSTownsPreston, R_OSTownsRamsbottom, R_OSTownsRamsey, R_OSTownsRamsgate, R_OSTownsRavensthorpe, R_OSTownsRawtenstall, R_OSTownsReading, R_OSTownsRedditch, R_OSTownsRedhill, R_OSTownsRedruth, R_OSTownsReigate, R_OSTownsRhyl, R_OStownsRichmond, R_OSTownsRichmond, R_OStownsRipon, R_OSTownsRipon, R_OSTownsRishton, R_OStownsRochdale, R_OSTownsRochdale, R_OSTownsRochester, R_OSTownsRomford, R_OSTownsRomsey, R_OStownsRotherham, R_OSTownsRotherham, R_OSTownsRoyalLemingtonSpa, R_OSTownsRoyton, R_OSTownsRugby, R_OSTownsRuncorn, R_OSTownsRyde, R_OSTownsRye, R_OSTownsSaffronWalden, R_OSTownsSalisbury, R_OSTownsSandwich, R_OStownsScarborough, R_OSTownsScarborough, R_OStownsSelby, R_OSTownsSelby, R_OSTownsSevenoaks, R_OStownsSheffield, R_OSTownsSheffield, R_OSTownsSheptonMallet, R_OSTownsSherborne, R_OSTownsShipley, R_OSTownsShrewsbury, R_OStownsSkipton, R_OSTownsSkipton, R_OSTownsSleaford, R_OSTownsSlough, R_OSTownsSouthampton, R_OSTownsSouthport, R_OSTownsSowerbyBridge, R_OSTownsSpalding, R_OStownsSt_Helens, R_OSTownsStafford, R_OSTownsStamford, R_OSTownsStAustell, R_OSTownsStHelens, R_OSTownsStIves, R_OStownsStockport, R_OStownsStockport2, R_OSTownsStocktonuponTees, R_OStownsStockton1890s, R_OSTownsStone, R_OSTownsStourbridge, R_OSTownsStowmarket, R_OSTownsStratfordonAvon, R_OSTownsStroud, R_OSTownsSudbury, R_OSTownsSuttoninAshfield, R_OSTownsSwansea, R_OSTownsSwindon, R_OSTownsSwinton, R_OSTownsTamworth, R_OSTownsTaunton, R_OSTownsTavistock, R_OSTownsTenby, R_OSTownsTewkesbury, R_OSTownsThetford, R_OSTownsTiverton, R_OStownsTodmorden, R_OSTownsTodmorden, R_OSTownsTonbridge, R_OSTownsTorquay, R_OSTownsTotnes, R_OSTownsTring, R_OSTownsTrowbridge, R_OSTownsTruro, R_OSTownsTunbridgeWells, R_OSTownsTyldesley, R_OSTownsTyneside, R_OStownsTyneside1890s, R_OStownsUlverston, R_OSTownsUlverston, R_OStownsWakefield, R_OSTownsWakefield, R_OSTownsWallsend, R_OSTownsWalsall, R_OSTownsWalthamAbbey, R_OSTownsWare, R_OSTownsWarminster, R_OStownsWarrington, R_OSTownsWarrington, R_OSTownsWarwick, R_OSTownsWatford, R_OSTownsWednesbury, R_OSTownsWellingborough, R_OSTownsWellington, R_OSTownsWells, R_OSTownsWelshpool, R_OSTownsWestBromwich, R_OSTownsWestCowes, R_OSTownsWestonsuperMare, R_OSTownsWeymouth, R_OStownsWhitby, R_OSTownsWhitby, R_OSTownsWhitchurch, R_OSTownsWhitehaven, R_OSTownsWidnes, R_OStownsWigan, R_OSTownsWigan, R_OSTownsWinchester, R_OStownsWindsor, R_OSTownsWisbech, R_OSTownsWithington, R_OSTownsWokingham, R_OSTownsWolverhampton, R_OSTownsWorcester, R_OSTownsWorksop, R_OSTownsWorthing, R_OSTownsYeovil, R_OStownsYork, R_OSTownsYork, R_paisley, R_paisley_goad, R_peebles, R_perth1716, R_perth1783, R_perth1823, R_perth1827, R_perth1832, R_perth1860, R_perth1860b, R_perth1893, R_perth1895, R_perth1901, R_perth1902, R_perth1907, R_perth1912, R_perth1933, R_peterhead, R_portglasgow, R_portkil, R_portobello, R_rothesay, R_selkirk, R_standrews1854, R_standrews1893, R_stirling, R_stonehaven, R_stranraer1847, R_stranraer1867, R_stranraer1893, R_strathaven, R_wick, R_wigtown1848, R_wigtown1894, R_county_chester_1794, R_county_cumberland_1823, R_county_durham_1819, R_county_lancashire_1828, R_county_lincolnshire_1828, R_county_westmorland_1823, R_county_yorkshire_1828, R_london_gsgs4157, R_greatbritain50k, R_irelandbart, R_irelandgsgs, R_channel_islands_town_plans, R_os2500_group_great_britain_channel_islands, R_sixinch2_channel_islands, R_channel_islands_six_inch_1960s, R_channel_islands_two_inch, R_channel_islands_three_inch, R_trench101723168, R_trench101723205, R_trench101723208, R_trench101723211, R_trench101723214, R_trench101724055, R_trench101723220, R_trench101723223, R_trench101723229, R_trench101724060, R_trench101723232, R_trench101724050, R_trench101724027, R_trench101724030, R_trench101723171, R_trench101723174, R_trench101723196, R_trench101723217, R_trench101723199, R_trench101724033, R_trench101724036, R_trench101464585, R_trench101464588, R_trench101464591, R_trench101464594, R_trench101464609, R_trench101464612, R_trench101464615, R_trench101464618, R_trench101464630, R_trench101464627, R_trench101464639, R_trench101464642, R_trench101464645, R_trench101464636, R_trench101464681, R_trench101464684, R_trench101464687, R_trench101464648, R_trench101464651, R_trench101464654, R_trench101464657, R_trench101464660, R_trench101464663, R_trench101464666, R_trench101464669, R_trench101464672, R_trench101464675, R_trench101464693, R_trench101464696, R_trench101464705, R_trench101464708, R_trench101464711, R_trench101464714, R_trench101464699, R_trench101464702, R_trench101464726, R_trench101464729, R_trench101464732, R_trench101464735, R_trench101464738, R_trench101464741, R_trench101464744, R_trench101464747, R_trench101464750, R_trench101464753, R_trench101464756, R_trench101464759, R_trench101464762, R_trench101464765, R_trench101464768, R_trench101464765, R_trench101464774, R_trench101464777, R_trench101464780, R_trench101464783, R_trench101464771, R_trench101464786, R_trench101464789, R_trench101464792, R_trench101464795, R_trench101464798, R_trench101464801, R_trench101464804, R_trench101464807, R_trench101464810, R_trench101464813, R_trench101464816, R_trench101464822, R_trench101464825, R_trench101464828, R_trench101464831, R_trench101724021, R_trench101723247, R_trench101723250, R_trench101723253, R_trench101464837, R_trench101464834, R_trench101464840, R_trench101464846, R_trench101464843, R_trench101464849, R_trench101464855, R_trench101464858, R_trench101464867, R_trench101464864, R_trench101464861, R_trench101464873, R_trench101464870, R_trench101464876, R_trench101464879, R_trench101464882, R_trench101464885, R_trench101464897, R_trench101464903, R_trench101464900, R_trench101464918, R_trench101464915, R_trench101464912, R_trench101464909, R_trench101464939, R_trench101464936, R_trench101464933, R_trench101464930, R_trench101464927, R_trench101464924, R_trench101464921, R_trench101464948, R_trench101464945, R_trench101464942, R_trench101464951, R_trench101464954, R_trench101464957, R_trench101464960, R_trench101464966, R_trench101464963, R_trench101464969, R_trench101464978, R_trench101464975, R_trench101464987, R_trench101464984, R_trench101464981, R_trench101464990, R_trench101464999, R_trench101464996, R_trench101464993, R_trench101465002, R_trench101465011, R_trench101465008, R_trench101465005, R_trench101465020, R_trench101465017, R_trench101465023, R_trench101465029, R_trench101465032, R_trench101465035, R_trench101465050, R_trench101465047, R_trench101465044, R_trench101465071, R_trench101465068, R_trench101465065, R_trench101465062, R_trench101465059, R_trench101465056, R_trench101465053, R_trench101465095, R_trench101465092, R_trench101465089, R_trench101465086, R_trench101465083, R_trench101465080, R_trench101465077, R_trench101465074, R_trench101465098, R_trench101465104, R_trench101465101, R_trench101465107, R_trench101465119, R_trench101465116, R_trench101465122, R_trench101465137, R_trench101465134, R_trench101465131, R_trench101465128, R_trench101465140, R_trench101465161, R_trench101465158, R_trench101465155, R_trench101465152, R_trench101465149, R_trench101465146, R_trench101465164, R_trench101465167, R_trench101465194, R_trench101465191, R_trench101465188, R_trench101465185, R_trench101465182, R_trench101465176, R_trench101465170, R_trench101465209, R_trench101465206, R_trench101465203, R_trench101465200, R_trench101465197, R_trench101465224, R_trench101465221, R_trench101465218, R_trench101465215, R_trench101465251, R_trench101465248, R_trench101465245, R_trench101465242, R_trench101465239, R_trench101465236, R_trench101465233, R_trench101465230, R_trench101465227, R_trench101465257, R_trench101465254, R_trench101465263, R_trench101465260, R_trench101465269, R_trench101465266, R_trench101465275, R_trench101465272, R_trench101465287, R_trench101465284, R_trench101465281, R_trench101465278, R_trench101465293, R_trench101465290, R_trench101465302, R_trench101465296, R_trench101465308, R_trench101465305, R_trench101465311, R_trench101465323, R_trench101465320, R_trench101465317, R_trench101465314, R_trench101465329, R_trench101465326, R_trench101465332, R_trench101465368, R_trench101465365, R_trench101465341, R_trench101465344, R_trench101465338, R_trench101465335, R_trench101465347, R_trench101465350, R_trench101465353, R_trench101465356, R_trench101465359, R_trench101465371, R_trench101465362, R_trench101465377, R_trench101465374, R_trench101465380, R_trench101465383, R_trench101465386, R_trench101465389, R_trench101465392, R_trench101465395, R_trench101465398, R_trench101723235, R_trench101723238, R_trench101723833, R_trench101723202, R_trench101724065, R_trench101724042, R_trench101724045, R_trench101724024, R_trench101724039, R_trench101723830, R_trench101723165, R_belgiumgsgs4042, R_belgiumgsgs4336, R_belgiumgsgs4040, R_cyprus_kitchener, R_jamaica, R_india_half_first_ed, R_india_half_second_ed, R_india_one_first_ed, R_india_one_second_ed, R_hongkongcollinson, R_world_arrowsmith, R_world_bartholomew, R_tsa_ALL ]; 

	var overlayLayersRight = [R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM, R_blank_layer, R_osoneinchfirstgb, R_ossixinchfirstgreatbritain, R_oneinchgeology, R_twentyfive_inch_gloucester_wiltshire_somerset_britain, R_oneinch2nd, R_one_inch_2nd_hills, R_sixinch2, R_ostwentyfiveinchGreatBritain, R_bartgreatbritain, R_quarterinchfirsthills, R_quarterinchfirstoutline, R_OS1900sGB, R_os1900s_all_scales, R_sixinchgeology, R_oneinchthirdgbcolour,  R_OS25inchEdinburgh1914, R_OS25inchGloucester3rd, R_quarterinch, R_quarterinchcivilair, R_quarterinchfourth, R_twentyfivethousand, R_twentyfivethousandoutline, R_oneinchpopular_britain, R_halfinchmot, R_nls, R_halfinchoutlineblue, R_oneinchlanduse, R_landutilisationsurveygb, R_landutilisationsurveyengwal25kpub, R_bartgreatbritain1940s, R_airphotos1250, R_airphotos, R_scot1944_1966_group_great_britain, R_os1250_group_great_britain, R_os1250_scot_b, R_os1250_scot_c, R_os2500_group_great_britain, R_os2500_scot_b, R_os2500_scot_c, R_OS10knatgridgreat_britain, R_oneinchseventh, R_admin, R_coal_iron, R_farming, R_general, R_geological, R_iron_steel, R_land_classification, R_land_utilisation, R_limestone, R_physical, R_population_change_1921, R_population_change_1931, R_population_change_1939, R_population_density_1931, R_population_density_1951, R_railways, R_rainfall, R_roads_46, R_roads_56, R_royhighlands, R_roylowlands, R_hole1607, R_dorret1750, R_arrowsmith1807, R_sixinch, R_oneinchscotlandfirstcol, R_oneinch2ndscot, R_one_inch_2nd_hills_scot, R_sixinch2scot_api, R_os25inch1890s, R_os25inchblueandblacks, R_os25inchblueandblacksOS, R_oneinchthirdcolour, R_bartsurveyatlas, R_oneinchpopular, R_oneinchpopular_outline, R_barthalfinch, R_twentyfivethousandscot, R_gsgs3906, R_oneinchgsgs3908, R_scot1944_1966_group, R_os1250_group_great_britain_scot, R_os1250_scot_b_scot, R_os1250_scot_c_scot, R_os2500_group_great_britain_scot, R_os2500_scot_b_scot, R_os2500_scot_c_scot, R_oneinchnatgrid, R_oneinchnatgridoutline, R_oneinchgsgs4639, R_quarterinchadmin1950, R_oneinchsoils, R_OS10knatgridscot, R_oneinchseventhscot, R_quarterinchadmin1960, R_secondlandusescot, R_ch00000529, R_ch00000541, R_ch74400306, R_ch85449271, R_ch85449274, R_ch85449277, R_ch85449280, R_ch85449283, R_ch85449286, R_ch85449289, R_ch85449292, R_adch101942045, R_adch101942048, R_adch101942078, R_adch101942108, R_adch101942111, R_adch101942114, R_adch101942117, R_adch101942630, R_adch74412450, R_adch101942603, R_adch101942606, R_adch101942612, R_adch101942615, R_adch101942618, R_adch101942621, R_adch101942624, R_adch101942627, R_adch101942633, R_adch101942687, R_adch101942690, R_adch101942693, R_adch101942696, R_adch101942699, R_adch101942702, R_adch101942705, R_adch101942708, R_adch101942711, R_adch101942714, R_adch101942669, R_adch101942672, R_adch101942675, R_adch101942678, R_adch101942681, R_adch101942735, R_adch101942726, R_adch101942729, R_adch101942732, R_adch101942741, R_adch101942738, R_adch101942759, R_adch101942762, R_adch101943347, R_adch101942906_inset2, R_adch101942909_inset2, R_adch101942912_inset2, R_adch101942915_inset2, R_adch101942915_inset4, R_adch101942906_inset3, R_adch101942909_inset3, R_adch101942912_inset3, R_adch101942915_inset3, R_adch101942906_inset1, R_adch101942909_inset1, R_adch101942912_inset1, R_adch101942915_inset1, R_adch101942975, R_adch101942981, R_adch101942984, R_adch101942987, R_adch101942993, R_adch101942996, R_adch101943350, R_adch101943353, R_adch101943356, R_adch101943491, R_adch101943494, R_adch101943500, R_adch101943503, R_adch101943506, R_adch101943509, R_adch101943512, R_adch101944457, R_adch101944460, R_adch101944463, R_adch74401001, R_adch101944847_inset3, R_adch101944847_inset4, R_adch101944847_inset2, R_adch101944847_inset1, R_adch101944847_inset5, R_adch101944847_inset6, R_adch101944847_inset7, R_adch101944850_inset3, R_adch101944850_inset4, R_adch101944850_inset2, R_adch101944850_inset1, R_adch101944850_inset5, R_adch101944850_inset6, R_adch101944850_inset7, R_adch101944853_inset3, R_adch101944853_inset4, R_adch101944853_inset2, R_adch101944853_inset1, R_adch101944853_inset5, R_adch101944853_inset6, R_adch101944853_inset7, R_adch101944856_inset3, R_adch101944856_inset4, R_adch101944856_inset2, R_adch101944856_inset1, R_adch101944856_inset5, R_adch101944856_inset6, R_adch101944883, R_adch101944865, R_adch101944874, R_adch101944886, R_adch101944889, R_adch101944892, R_adch101944895, R_adch101945726, R_adch101945729, R_adch74400307, R_adch74400307_inset1, R_adch74400307_inset2, R_adch74400307_inset3, R_adch74400307_inset4, R_adch101946716, R_adch101946716_inset2, R_adch101946716_inset3, R_adch101946716_inset4, R_adch101946716_inset1, R_adch101946695_inset, R_adch101946695, R_adch101946698_inset, R_adch101946698, R_adch74401002, R_adch101947403_dunvegan, R_adch101947403_snizort, R_adch101947406, R_adch101947409, R_adch101947898, R_adch101947901, R_adch101947907, R_adch101947910, R_adch101947916, R_adch101947919, R_adch101947922, R_adch101947925, R_adch101947919_inset1, R_adch101947922_inset1, R_adch101947922_inset2, R_adch101947925_inset1, R_adch101947925_inset2, R_adch74401003, R_adch101948129, R_adch101948132, R_adch101948135, R_adch101948138, R_adch101948141, R_adch101948132_inset, R_adch101948135_inset, R_adch101948138_inset, R_adch101948141_inset, R_adch74401004, R_adch101948144, R_adch101948147, R_adch101948150, R_adch101948153, R_adch101948225, R_adch101948228, R_adch101948234, R_adch101948237, R_adch101948240, R_adch101948243, R_adch101948246, R_adch101948249, R_adch101948252, R_adch101948276, R_adch101948285, R_adch74412387, R_adch101948291, R_adch101948294, R_adch101948297, R_adch101948300, R_adch101948303, R_adch101948306, R_adch101948279, R_adch74400302, R_adch101948390, R_adch74401005, R_adch101948420_inset, R_adch101948420, R_adch101948423_inset, R_adch101948423, R_adch101948426_inset, R_adch101948426, R_adch101948429_inset, R_adch101948429, R_adch101948432_inset, R_adch101948432, R_adch101948435_inset, R_adch101948435, R_adch101948438_inset, R_adch101948438, R_adch101948441_inset, R_adch101948441, R_adch101948444_inset, R_adch101948444, R_adch101948504, R_adch101948507, R_adch101948510, R_adch101948513, R_adch101948516, R_adch101948510_inset, R_adch101948513_inset, R_adch101948516_inset, R_adch74412388, R_adch74412388_inset, R_adch101948543, R_adch74412457, R_adch74412457_inset, R_adch74413949, R_adch74412463, R_adch74401006_oban, R_adch74401006_troon, R_adch74401007, R_adch74401008, R_adch74401009, R_adch74401010, R_adch74401011, R_adch74401012, R_adch74401060, R_adch74401014, R_adch74401015, R_adch74401016, R_adch74401017, R_adch74412462, R_adch74400305, R_adch74412454, R_adch74401019, R_adch74401019_inset, R_adch74401020, R_adch74401022, R_adch74401023, R_adch74400296, R_adch74400296_inset1, R_adch74400296_inset2, R_adch74400296_inset3, R_adch74401025, R_adch74401026, R_adch74401027, R_adch74401028, R_adch74401029, R_adch74401030, R_adch74401031, R_adch74401032, R_adch74401033, R_adch74401034, R_adch74401035, R_adch74401036, R_adch74401037, R_adch74401000, R_adch74401000_inset, R_adch74412461, R_adch74401038, R_adch74401039, R_adch74400294, R_adch74401040, R_adch74401041, R_adch74401042, R_adch74401043, R_adch74401044, R_adch74401045, R_adch74401046, R_adch74401047, R_adch74401048, R_adch74401048_inset, R_adch74401049, R_adch74401052, R_adch74401053, R_adch74401053_inset, R_adch74401054, R_adch74401051, R_adch74401055, R_adch74401056, R_adch74412460, R_adch74401057, R_adch101961533, R_bathlochawenorth, R_bathlochawesouth, R_bathlochcluanie, R_bathlochdoon, R_bathlochduntelchaig, R_bathlochearn, R_bathlocherichtlower, R_bathlocherichtupper, R_bathlochfannich, R_bathlochgarryness, R_bathlochgarrytay, R_bathlochglass, R_bathlochharray, R_bathlochlaidon, R_bathlochleven, R_bathlochlomondnorth, R_bathlochlomondsouth, R_bathlochloyne, R_bathlochluichart, R_bathlochlyon, R_bathlochmhor, R_bathlochmonar, R_bathlochmullardoch, R_bathlochquoich, R_bathlochrannoch, R_bathlochshiellower, R_bathlochshielupper, R_bathlochshinlower, R_bathlochshinupper, R_bathlochtayeast, R_bathlochtaywest, R_bathlochtreig, R_bathlochtummel, R_county119952600, R_county74400145, R_county135908105, R_county74400334, R_estate121129476, R_estate121129386, R_estate121129410, R_estate121129416, R_estate121129419, R_estate132293752, R_estate129392884, R_estate132293758, R_estate121129389, R_estate121129413, R_estate129393076, R_estate129393010, R_estate129393148, R_estate114473788, R_estate114473785, R_estate103427429, R_estate129392971, R_estate129393253, R_estate125491577, R_estate121129473, R_estate121129458, R_estate110069086, R_estate132293749, R_estate132293755, R_estate129392983, R_estate129392986, R_estate129392989, R_estate129392992, R_estate129392995, R_estate129392911, R_estate121129434, R_estate129392908, R_estate114473773, R_estate110069083, R_estate129393019, R_estate129393103, R_estate129393049, R_estate110323727, R_estate132293842, R_estate121129461, R_estate110069080, R_estate103427459, R_estate103427450, R_estate103427447, R_estate129392893, R_estate129393328, R_estate129393580, R_estate121129443, R_estate121129392, R_estate129393397, R_estate129392887, R_estate121129464, R_estate132293743, R_estate129392947, R_estate129392950, R_estate106697318, R_estate129392935, R_estate132293857, R_estate106697324, R_estate129392887t, R_estate129393172, R_estate_balmaclellan, R_estate129393712, R_estate129393715, R_estate129393718, R_estate129393721, R_estate129393724, R_estate129393676, R_estate129393709, R_estate129393706, R_estate129393763, R_estate_earlstoun, R_estate125491588, R_estate129393664, R_estate132293782, R_estate129393778, R_estate129393754, R_estate129393745, R_estate125491585, R_estate129393751, R_estate125491597, R_estate129393583, R_estate129393661, R_estate106697330, R_estate106697333, R_estate106697336, R_estate106697339, R_estate125491591, R_estate125491601, R_estate114473887, R_estate106697342, R_estate129393769, R_estate125491594, R_estate114473800, R_estate114473809, R_estate114473806, R_estate114473794, R_estate114473797, R_estate114473815, R_estate125491581, R_estate114473830, R_estate114473845, R_estate114473854, R_estate114473824, R_estate114473836, R_estate114473842, R_estate114473848, R_estate114473851, R_estate114473839, R_estate114473827, R_estate129393667, R_estate129393016, R_estate129393076l, R_estate129393016c, R_estate74436591, R_aberdeen, R_aberdeen1879, R_aberdeen1883, R_aberdeen1895, R_aberdeen1902, R_aberdeen1905, R_aberdeen1915, R_airdrie, R_alexandria, R_alloa, R_annan, R_arbroath, R_ardhallow, R_ayr, R_barry, R_berwick, R_braefoot, R_brechin, R_burntisland, R_burntisland1824, R_campbeltown, R_campbeltown_goad, R_cloch, R_coatbridge, R_cramond, R_cupar1854, R_cupar1893, R_dalkeith1852, R_dalkeith1893, R_dreghorn, R_dumbarton, R_dumfries1850, R_dumfries1893, R_dundee_goad, R_dundee1857, R_dundee1870, R_dundee1882, R_dundee1888, R_dundee1891, R_dundee1892, R_dundee1893, R_dundee1897, R_dundee1900, R_dundee1903, R_dundee1906, R_dundee1908, R_dundee1910, R_dundee1911, R_dunfermline1854, R_dunfermline1893, R_edin_newington_1826, R_edin1765, R_edin1784, R_edin1804, R_edin1817, R_edin1819, R_edin1821, R_edin1822, R_edin1831, R_edin1832, R_edin1849, R_edin1865, R_edin1876, R_edin1882, R_edin1885, R_edin1888, R_edin1891, R_edin1892, R_edin1892b, R_edin1893, R_edin1902, R_edin1905, R_edin1907, R_edin1910, R_edin1912, R_edin1917, R_edin1918, R_edin1919, R_edin1932, R_edin1939, R_edin1944_1963, R_edinburgh_castle, R_edinburgh_goad, R_elgin, R_falkirk, R_forfar, R_forres, R_galashiels, R_girvan, R_glas1778, R_glas1807, R_glas1857, R_glas1882, R_glas1888, R_glas1891, R_glas1894, R_glas1895, R_glas1900, R_glas1905, R_glas1910, R_glas1914, R_glas1920, R_glas1925, R_glasgow_goad, R_glasgow1930, R_glasgow1936, R_greenock, R_greenock_goad, R_greenock1861, R_greenock1879, R_greenock1887, R_greenock1895, R_greenock1915, R_haddington1853, R_haddington1893, R_hamilton, R_hawick, R_inchcolm, R_inchkeith_2500, R_inchkeith_500, R_inchmickery, R_inverness, R_irvine, R_jedburgh, R_kelso, R_kilmarnock, R_kirkcaldy1855, R_kirkcaldy1894, R_kirkcudbright1850, R_kirkcudbright1893, R_kirkintilloch, R_kirriemuir, R_lanark, R_leith_goad, R_linlithgow, R_maybole, R_montrose, R_musselburgh1853, R_musselburgh1893, R_nairn, R_oban, R_osoneincholdseries,   R_ossixinchfirstengland, R_sixinchenglandwales, R_oneinchrevisedcolouredengland, R_oneinchthirdengwalcolour, R_OS25inchGloucester3rdengland, R_OS25inchGuildford, R_bartholomew_half_1919, R_twentyfivethousandengwal, R_oneinchpopular_england, R_oneinchpopular_outline_england, R_oneinchnewpop, R_landutilisationsurveyengwal25k, R_landutilisationsurveyengwalscapes, R_landutilisationsurveyengwalwildscapeveg, R_landutilisationsurveyengwalwildscapehab,  R_oneinchseventhengwal, R_OStownsALL, R_OStownsALL1056, R_OSTownsAberdare, R_OSTownsAbergavenny, R_OSTownsAberystwyth, R_OSTownsAbingdon, R_OStownsAccrington, R_OSTownsAccrington, R_OSTownsAldershot, R_OSTownsAlnwick, R_OStownsAlnwick2640, R_OSTownsAltrincham, R_OSTownsAndover, R_OSTownsAppleby, R_OSTownsAshford, R_OStownsAshton, R_OStownsAshton2, R_OSTownsAtherstone, R_OSTownsAylesbury, R_OStownsBacup, R_OSTownsBacup, R_OSTownsBanbury, R_OSTownsBangor, R_OStownsBarnsley, R_OSTownsBarnsley, R_OSTownsBarnstaple, R_OSTownsBarrowinFurness, R_OSTownsBasingstoke, R_OSTownsBath, R_OSTownsBatley, R_OSTownsBeccles, R_OSTownsBedford, R_OSTownsBelper, R_OSTownsBerkhamstead, R_OStownsBeverley, R_OSTownsBeverley, R_OSTownsBideford, R_OSTownsBiggleswade, R_OStownsBingley, R_OSTownsBingley, R_OSTownsBirkenhead, R_TownsBirmimgham1855, R_OSTownsBirmingham, R_OSTownsBirstal, R_OSTownsBishopAuckland, R_OSTownsBishopsStortford, R_OStownsBlackburn, R_OSTownsBlackburn, R_OSTownsBlackpool, R_OStownsBlyth, R_OSTownsBlyth, R_OSTownsBodmin, R_OStownsBolton, R_OSTownsBolton, R_OSTownsBoston, R_OSTownsBournemouth, R_OStownsBradford, R_OSTownsBradford, R_OSTownsBradfordonAvon, R_OSTownsBraintree, R_OSTownsBrentwood, R_OSTownsBridgnorth, R_OSTownsBridgwater, R_OStownsBridlington, R_OSTownsBridlington, R_OSTownsBridport, R_OSTownsBrierleyHill, R_OSTownsBrighouse, R_OSTownsBrighton, R_OSTownsBristol, R_OSTownsBrixham, R_OSTownsBromsgrove, R_OSTownsBuckingham, R_OStownsBurnley, R_OSTownsBurnley, R_OSTownsBurslem, R_OSTownsBurtonuponTrent, R_OStownsBury, R_OSTownsBury, R_OSTownsBuryStEdmunds, R_OSTownsBuxton, R_OSTownsCamborne, R_OSTownsCambridge, R_OSTownsCanterbury, R_OSTownsCardiff, R_OSTownsCarmarthen, R_OSTownsCarnarvon, R_OSTownsCastleford, R_OSTownsCheltenham, R_OSTownsChertsey, R_OSTownsChester, R_OSTownsChesterfield, R_OSTownsChesterton, R_OSTownsChichester, R_OSTownsChippenham, R_OStownsChorley, R_OSTownsChorley, R_OSTownsChowbent, R_OSTownsChristchurch, R_OSTownsCirencester, R_OSTownsClaytonleMoors, R_OSTownsCleckheaton, R_OSTownsClevedon, R_OStownsClitheroe, R_OSTownsCockermouth, R_OSTownsColchester, R_OStownsColne, R_OSTownsColne, R_OSTownsCongleton, R_OSTownsCoventry, R_OSTownsCrediton, R_OSTownsCrewe, R_OSTownsCrewkerne, R_OSTownsCroydon, R_OSTownsDaltoninFurness, R_OSTownsDarlaston, R_OStownsDarlington, R_OSTownsDartford, R_OSTownsDartmouth, R_OSTownsDarwen, R_OSTownsDawlish, R_OSTownsDeal, R_OSTownsDenbigh, R_OSTownsDerby, R_OSTownsDevizes, R_OStownsDewsbury, R_OStownsDoncaster, R_OSTownsDoncaster, R_OSTownsDorchester, R_OSTownsDorking, R_OSTownsDouglas, R_OSTownsDover, R_OSTownsDroitwich, R_OSTownsDudley, R_OSTownsDunstable, R_OSTownsDurham, R_OSTownsEastbourne, R_OSTownsEastDereham, R_OSTownsEastRetford, R_OSTownsEccles, R_OSTownsElland, R_OSTownsEly, R_OSTownsEvesham, R_OSTownsExeter, R_OSTownsExmouth, R_OSTownsFalmouth, R_OSTownsFarnham, R_OSTownsFarnworth, R_OSTownsFarsley, R_OSTownsFaversham, R_OStownsFleetwood, R_OSTownsFleetwood, R_OSTownsFolkestone, R_OSTownsFrome, R_OSTownsGainsborough, R_OSTownsGarston, R_OSTownsGlossop, R_OSTownsGloucester, R_OSTownsGodmanchester, R_OSTownsGoole, R_OSTownsGosport, R_OSTownsGrantham, R_OSTownsGravesend, R_OSTownsGreatDriffield, R_OSTownsGreatGrimsby, R_OSTownsGreatHarwood, R_OSTownsGreatMalvern, R_OSTownsGreatMarlow, R_OSTownsGreatYarmouth, R_OSTownsGuildford, R_OStownsHalifax, R_OSTownsHalifax, R_OSTownsHalstead, R_OSTownsHarrogate, R_OSTownsHartlepool, R_OSTownsHarwich, R_OStownsHaslingden, R_OSTownsHaslingden, R_OSTownsHastings, R_OSTownsHaverfordwest, R_OSTownsHebdenBridge, R_OSTownsHeckmondwike, R_OSTownsHemelHempstead, R_OSTownsHenleyonThames, R_OSTownsHereford, R_OSTownsHertford, R_OSTownsHexham, R_OStownsHeywood, R_OSTownsHeywood, R_OSTownsHighWycombe, R_OSTownsHinckley, R_OSTownsHindley, R_OSTownsHolyhead, R_OSTownsHolywell, R_OSTownsHorncastle, R_OSTownsHorsham, R_OSTownsHorwich, R_OStownsHowden, R_OSTownsHucknallTorkard, R_OStownsHuddersfield, R_OSTownsHuddersfield, R_OSTownsHuntingdon, R_OSTownsHyde, R_OSTownsIdle, R_OSTownsIlfracombe, R_OSTownsIlkeston, R_OSTownsIlkley, R_OSTownsIpswich, R_OStownsKeighley, R_OSTownsKeighley, R_OSTownsKendal, R_OSTownsKettering, R_OSTownsKidderminster, R_OSTownsKidsgrove, R_OSTownsKingsLynn, R_OStownsKingstonuponHull, R_OSTownsKingstonuponHull, R_OStownsKingstonuponThames, R_OStownsKnaresborough, R_OSTownsKnaresborough, R_OSTownsKnottingley, R_OSTownsLancaster, R_OStownsLancaster1056, R_OSTownsLeeds, R_OStownsLeeds1056, R_OSTownsLeek, R_OSTownsLeicester, R_OSTownsLeigh, R_OSTownsLeightonBuzzard, R_OSTownsLeominster, R_OSTownsLewes, R_OSTownsLichfield, R_OSTownsLincoln, R_OSTownsLiskeard, R_OSTownsLittleborough, R_OStownsLiverpool, R_OSTownsLiverpool, R_OSTownsLlandudno, R_OSTownsLlanelly, R_OStownsLondon5280, R_OStownsLondon, R_OStownsLondon1056, R_OSTownsLongEaton, R_OSTownsLoughborough, R_OSTownsLouth, R_OSTownsLowestoft, R_OSTownsLudlow, R_OSTownsLuton, R_OSTownsLymington, R_OSTownsLytham, R_OSTownsMacclesfield, R_OSTownsMaidenhead, R_OSTownsMaidstone, R_OSTownsMaldon, R_OStownsMalton, R_OStownsManchester, R_OSTownsManchesterandSalford, R_OSTownsMansfield, R_OSTownsMarch, R_OSTownsMargate, R_OSTownsMaryport, R_OSTownsMelcombeRegis, R_OSTownsMeltonMowbray, R_OSTownsMerthyrTydfil, R_OStownsMiddlesbrough, R_OSTownsMiddlesbrough, R_OStownsMiddleton, R_OSTownsMiddleton, R_OSTownsMirfield, R_OSTownsMold, R_OSTownsMonmouth, R_OSTownsMorecambe, R_OSTownsMorley, R_OSTownsMorpeth, R_OSTownsMossley, R_OSTownsNantwich, R_OSTownsNeath, R_OSTownsNelson, R_OSTownsNewark, R_OSTownsNewbury, R_OSTownsNewcastle1894, R_OSTownsNewcastle1900s, R_OSTownsNewMalton, R_OSTownsNewmarket, R_OSTownsNewport, R_OSTownsNewportIsleofWight, R_OSTownsNewtonAbbot, R_OSTownsNewtown, R_OSTownsNorthampton, R_OSTownsNorthwich, R_OSTownsNorwich, R_OSTownsNottingham, R_OSTownsNuneaton, R_OSTownsOldbury, R_OSTownsOldham, R_OStownsOrmskirk, R_OSTownsOrmskirk, R_OSTownsOswestry, R_OSTownsOtley, R_OSTownsOxford, R_OSTownsPadiham, R_OSTownsPembroke, R_OSTownsPembrokeDock, R_OSTownsPenrith, R_OSTownsPenzance, R_OSTownsPeterborough, R_OSTownsPetersfield, R_OSTownsPetworth, R_OSTownsPlumstead, R_OStownsPlymouth1850s, R_OStownsPontefract, R_OSTownsPontefract, R_OSTownsPontypool, R_OSTownsPoole, R_OSTownsPortsmouth, R_OStownsPrescot, R_OSTownsPrescot, R_OStownsPreston, R_OSTownsPreston, R_OSTownsRamsbottom, R_OSTownsRamsey, R_OSTownsRamsgate, R_OSTownsRavensthorpe, R_OSTownsRawtenstall, R_OSTownsReading, R_OSTownsRedditch, R_OSTownsRedhill, R_OSTownsRedruth, R_OSTownsReigate, R_OSTownsRhyl, R_OStownsRichmond, R_OSTownsRichmond, R_OStownsRipon, R_OSTownsRipon, R_OSTownsRishton, R_OStownsRochdale, R_OSTownsRochdale, R_OSTownsRochester, R_OSTownsRomford, R_OSTownsRomsey, R_OStownsRotherham, R_OSTownsRotherham, R_OSTownsRoyalLemingtonSpa, R_OSTownsRoyton, R_OSTownsRugby, R_OSTownsRuncorn, R_OSTownsRyde, R_OSTownsRye, R_OSTownsSaffronWalden, R_OSTownsSalisbury, R_OSTownsSandwich, R_OStownsScarborough, R_OSTownsScarborough, R_OStownsSelby, R_OSTownsSelby, R_OSTownsSevenoaks, R_OStownsSheffield, R_OSTownsSheffield, R_OSTownsSheptonMallet, R_OSTownsSherborne, R_OSTownsShipley, R_OSTownsShrewsbury, R_OStownsSkipton, R_OSTownsSkipton, R_OSTownsSleaford, R_OSTownsSlough, R_OSTownsSouthampton, R_OSTownsSouthport, R_OSTownsSowerbyBridge, R_OSTownsSpalding, R_OStownsSt_Helens, R_OSTownsStafford, R_OSTownsStamford, R_OSTownsStAustell, R_OSTownsStHelens, R_OSTownsStIves, R_OStownsStockport, R_OStownsStockport2, R_OSTownsStocktonuponTees, R_OStownsStockton1890s, R_OSTownsStone, R_OSTownsStourbridge, R_OSTownsStowmarket, R_OSTownsStratfordonAvon, R_OSTownsStroud, R_OSTownsSudbury, R_OSTownsSuttoninAshfield, R_OSTownsSwansea, R_OSTownsSwindon, R_OSTownsSwinton, R_OSTownsTamworth, R_OSTownsTaunton, R_OSTownsTavistock, R_OSTownsTenby, R_OSTownsTewkesbury, R_OSTownsThetford, R_OSTownsTiverton, R_OStownsTodmorden, R_OSTownsTodmorden, R_OSTownsTonbridge, R_OSTownsTorquay, R_OSTownsTotnes, R_OSTownsTring, R_OSTownsTrowbridge, R_OSTownsTruro, R_OSTownsTunbridgeWells, R_OSTownsTyldesley, R_OSTownsTyneside, R_OStownsTyneside1890s, R_OStownsUlverston, R_OSTownsUlverston, R_OStownsWakefield, R_OSTownsWakefield, R_OSTownsWallsend, R_OSTownsWalsall, R_OSTownsWalthamAbbey, R_OSTownsWare, R_OSTownsWarminster, R_OStownsWarrington, R_OSTownsWarrington, R_OSTownsWarwick, R_OSTownsWatford, R_OSTownsWednesbury, R_OSTownsWellingborough, R_OSTownsWellington, R_OSTownsWells, R_OSTownsWelshpool, R_OSTownsWestBromwich, R_OSTownsWestCowes, R_OSTownsWestonsuperMare, R_OSTownsWeymouth, R_OStownsWhitby, R_OSTownsWhitby, R_OSTownsWhitchurch, R_OSTownsWhitehaven, R_OSTownsWidnes, R_OStownsWigan, R_OSTownsWigan, R_OSTownsWinchester, R_OStownsWindsor, R_OSTownsWisbech, R_OSTownsWithington, R_OSTownsWokingham, R_OSTownsWolverhampton, R_OSTownsWorcester, R_OSTownsWorksop, R_OSTownsWorthing, R_OSTownsYeovil, R_OStownsYork, R_OSTownsYork, R_paisley, R_paisley_goad, R_peebles, R_perth1716, R_perth1783, R_perth1823, R_perth1827, R_perth1832, R_perth1860, R_perth1860b, R_perth1893, R_perth1895, R_perth1901, R_perth1902, R_perth1907, R_perth1912, R_perth1933, R_peterhead, R_portglasgow, R_portkil, R_portobello, R_rothesay, R_selkirk, R_standrews1854, R_standrews1893, R_stirling, R_stonehaven, R_stranraer1847, R_stranraer1867, R_stranraer1893, R_strathaven, R_wick, R_wigtown1848, R_wigtown1894, R_county_chester_1794, R_county_cumberland_1823, R_county_durham_1819, R_county_lancashire_1828, R_county_lincolnshire_1828, R_county_westmorland_1823, R_county_yorkshire_1828, R_london_gsgs4157, R_greatbritain50k, R_irelandbart, R_irelandgsgs, R_channel_islands_town_plans, R_os2500_group_great_britain_channel_islands, R_sixinch2_channel_islands, R_channel_islands_six_inch_1960s, R_channel_islands_two_inch, R_channel_islands_three_inch, R_trench101723168, R_trench101723205, R_trench101723208, R_trench101723211, R_trench101723214, R_trench101724055, R_trench101723220, R_trench101723223, R_trench101723229, R_trench101724060, R_trench101723232, R_trench101724050, R_trench101724027, R_trench101724030, R_trench101723171, R_trench101723174, R_trench101723196, R_trench101723217, R_trench101723199, R_trench101724033, R_trench101724036, R_trench101464585, R_trench101464588, R_trench101464591, R_trench101464594, R_trench101464609, R_trench101464612, R_trench101464615, R_trench101464618, R_trench101464630, R_trench101464627, R_trench101464639, R_trench101464642, R_trench101464645, R_trench101464636, R_trench101464681, R_trench101464684, R_trench101464687, R_trench101464648, R_trench101464651, R_trench101464654, R_trench101464657, R_trench101464660, R_trench101464663, R_trench101464666, R_trench101464669, R_trench101464672, R_trench101464675, R_trench101464693, R_trench101464696, R_trench101464705, R_trench101464708, R_trench101464711, R_trench101464714, R_trench101464699, R_trench101464702, R_trench101464726, R_trench101464729, R_trench101464732, R_trench101464735, R_trench101464738, R_trench101464741, R_trench101464744, R_trench101464747, R_trench101464750, R_trench101464753, R_trench101464756, R_trench101464759, R_trench101464762, R_trench101464765, R_trench101464768, R_trench101464765, R_trench101464774, R_trench101464777, R_trench101464780, R_trench101464783, R_trench101464771, R_trench101464786, R_trench101464789, R_trench101464792, R_trench101464795, R_trench101464798, R_trench101464801, R_trench101464804, R_trench101464807, R_trench101464810, R_trench101464813, R_trench101464816, R_trench101464822, R_trench101464825, R_trench101464828, R_trench101464831, R_trench101724021, R_trench101723247, R_trench101723250, R_trench101723253, R_trench101464837, R_trench101464834, R_trench101464840, R_trench101464846, R_trench101464843, R_trench101464849, R_trench101464855, R_trench101464858, R_trench101464867, R_trench101464864, R_trench101464861, R_trench101464873, R_trench101464870, R_trench101464876, R_trench101464879, R_trench101464882, R_trench101464885, R_trench101464897, R_trench101464903, R_trench101464900, R_trench101464918, R_trench101464915, R_trench101464912, R_trench101464909, R_trench101464939, R_trench101464936, R_trench101464933, R_trench101464930, R_trench101464927, R_trench101464924, R_trench101464921, R_trench101464948, R_trench101464945, R_trench101464942, R_trench101464951, R_trench101464954, R_trench101464957, R_trench101464960, R_trench101464966, R_trench101464963, R_trench101464969, R_trench101464978, R_trench101464975, R_trench101464987, R_trench101464984, R_trench101464981, R_trench101464990, R_trench101464999, R_trench101464996, R_trench101464993, R_trench101465002, R_trench101465011, R_trench101465008, R_trench101465005, R_trench101465020, R_trench101465017, R_trench101465023, R_trench101465029, R_trench101465032, R_trench101465035, R_trench101465050, R_trench101465047, R_trench101465044, R_trench101465071, R_trench101465068, R_trench101465065, R_trench101465062, R_trench101465059, R_trench101465056, R_trench101465053, R_trench101465095, R_trench101465092, R_trench101465089, R_trench101465086, R_trench101465083, R_trench101465080, R_trench101465077, R_trench101465074, R_trench101465098, R_trench101465104, R_trench101465101, R_trench101465107, R_trench101465119, R_trench101465116, R_trench101465122, R_trench101465137, R_trench101465134, R_trench101465131, R_trench101465128, R_trench101465140, R_trench101465161, R_trench101465158, R_trench101465155, R_trench101465152, R_trench101465149, R_trench101465146, R_trench101465164, R_trench101465167, R_trench101465194, R_trench101465191, R_trench101465188, R_trench101465185, R_trench101465182, R_trench101465176, R_trench101465170, R_trench101465209, R_trench101465206, R_trench101465203, R_trench101465200, R_trench101465197, R_trench101465224, R_trench101465221, R_trench101465218, R_trench101465215, R_trench101465251, R_trench101465248, R_trench101465245, R_trench101465242, R_trench101465239, R_trench101465236, R_trench101465233, R_trench101465230, R_trench101465227, R_trench101465257, R_trench101465254, R_trench101465263, R_trench101465260, R_trench101465269, R_trench101465266, R_trench101465275, R_trench101465272, R_trench101465287, R_trench101465284, R_trench101465281, R_trench101465278, R_trench101465293, R_trench101465290, R_trench101465302, R_trench101465296, R_trench101465308, R_trench101465305, R_trench101465311, R_trench101465323, R_trench101465320, R_trench101465317, R_trench101465314, R_trench101465329, R_trench101465326, R_trench101465332, R_trench101465368, R_trench101465365, R_trench101465341, R_trench101465344, R_trench101465338, R_trench101465335, R_trench101465347, R_trench101465350, R_trench101465353, R_trench101465356, R_trench101465359, R_trench101465371, R_trench101465362, R_trench101465377, R_trench101465374, R_trench101465380, R_trench101465383, R_trench101465386, R_trench101465389, R_trench101465392, R_trench101465395, R_trench101465398, R_trench101723235, R_trench101723238, R_trench101723833, R_trench101723202, R_trench101724065, R_trench101724042, R_trench101724045, R_trench101724024, R_trench101724039, R_trench101723830, R_trench101723165, R_belgiumgsgs4042, R_belgiumgsgs4336, R_belgiumgsgs4040, R_cyprus_kitchener, R_jamaica, R_india_half_first_ed, R_india_half_second_ed, R_india_one_first_ed, R_india_one_second_ed, R_hongkongcollinson, R_world_arrowsmith, R_world_bartholomew, R_tsa_ALL ]; 

	
	var overlayLayersAll = [osoneinchfirstgb, ossixinchfirstgreatbritain, oneinchgeology, twentyfive_inch_gloucester_wiltshire_somerset_britain, oneinch2nd, one_inch_2nd_hills,  sixinch2, ostwentyfiveinchGreatBritain, bartgreatbritain, quarterinchfirsthills, quarterinchfirstoutline, OS1900sGB, os1900s_all_scales, sixinchgeology, oneinchthirdgbcolour, OS25inchEdinburgh1914, OS25inchGloucester3rd, quarterinch, quarterinchcivilair, quarterinchfourth, twentyfivethousand,  twentyfivethousandoutline,  oneinchpopular_britain, halfinchmot, nls, halfinchoutlineblue, oneinchlanduse, landutilisationsurveygb, landutilisationsurveyengwal25kpub, bartgreatbritain1940s, airphotos1250, airphotos, scot1944_1966_group_great_britain, os1250_group_great_britain, os1250_scot_b, os1250_scot_c, os2500_group_great_britain, os2500_scot_b, os2500_scot_c, OS10knatgridgreat_britain, oneinchseventh, admin, coal_iron, farming, general, geological, iron_steel, land_classification, land_utilisation, limestone,  physical, population_change_1921, population_change_1931, population_change_1939, population_density_1931, population_density_1951, railways, rainfall, roads_46, roads_56, royhighlands, roylowlands, hole1607, dorret1750, arrowsmith1807, sixinch, oneinchscotlandfirstcol,  oneinch2ndscot, one_inch_2nd_hills_scot, sixinch2scot_api, os25inch1890s, os25inchblueandblacks, os25inchblueandblacksOS, oneinchthirdcolour, bartsurveyatlas, oneinchpopular, oneinchpopular_outline, barthalfinch,  twentyfivethousandscot, gsgs3906, oneinchgsgs3908, scot1944_1966_group, os1250_group_great_britain_scot, os1250_scot_b_scot, os1250_scot_c_scot, os2500_group_great_britain_scot, os2500_scot_b_scot, os2500_scot_c_scot, oneinchnatgrid, oneinchnatgridoutline, oneinchgsgs4639, quarterinchadmin1950, oneinchsoils,  OS10knatgridscot, oneinchseventhscot, quarterinchadmin1960, secondlandusescot, ch00000529, ch00000541, ch74400306, ch85449271, ch85449274, ch85449277, ch85449280, ch85449283, ch85449286, ch85449289, ch85449292, adch101942045, adch101942048, adch101942078, adch101942108, adch101942111, adch101942114, adch101942117, adch101942630, adch74412450, adch101942603, adch101942606, adch101942612, adch101942615, adch101942618, adch101942621, adch101942624, adch101942627, adch101942633, adch101942687, adch101942690, adch101942693, adch101942696, adch101942699, adch101942702, adch101942705, adch101942708, adch101942711, adch101942714, adch101942669, adch101942672, adch101942675, adch101942678, adch101942681, adch101942735, adch101942726, adch101942729, adch101942732, adch101942741, adch101942738, adch101942759, adch101942762, adch101943347, adch101942906_inset2, adch101942909_inset2, adch101942912_inset2, adch101942915_inset2, adch101942915_inset4, adch101942906_inset3, adch101942909_inset3, adch101942912_inset3, adch101942915_inset3, adch101942906_inset1, adch101942909_inset1, adch101942912_inset1, adch101942915_inset1, adch101942975, adch101942981, adch101942984, adch101942987, adch101942993, adch101942996, adch101943350, adch101943353, adch101943356, adch101943491, adch101943494, adch101943500, adch101943503, adch101943506, adch101943509, adch101943512, adch101944457, adch101944460, adch101944463, adch74401001, adch101944847_inset3, adch101944847_inset4, adch101944847_inset2, adch101944847_inset1, adch101944847_inset5, adch101944847_inset6, adch101944847_inset7, adch101944850_inset3, adch101944850_inset4, adch101944850_inset2, adch101944850_inset1, adch101944850_inset5, adch101944850_inset6, adch101944850_inset7, adch101944853_inset3, adch101944853_inset4, adch101944853_inset2, adch101944853_inset1, adch101944853_inset5, adch101944853_inset6, adch101944853_inset7, adch101944856_inset3, adch101944856_inset4, adch101944856_inset2, adch101944856_inset1, adch101944856_inset5, adch101944856_inset6, adch101944883, adch101944865, adch101944874, adch101944886, adch101944889, adch101944892, adch101944895, adch101945726, adch101945729, adch74400307, adch74400307_inset1, adch74400307_inset2, adch74400307_inset3, adch74400307_inset4, adch101946716, adch101946716_inset2, adch101946716_inset3, adch101946716_inset4, adch101946716_inset1, adch101946695_inset, adch101946695, adch101946698_inset, adch101946698, adch74401002, adch101947403_dunvegan, adch101947403_snizort, adch101947406, adch101947409, adch101947898, adch101947901, adch101947907, adch101947910, adch101947916, adch101947919, adch101947922, adch101947925, adch101947919_inset1, adch101947922_inset1, adch101947922_inset2, adch101947925_inset1, adch101947925_inset2, adch74401003, adch101948129, adch101948132, adch101948135, adch101948138, adch101948141, adch101948132_inset, adch101948135_inset, adch101948138_inset, adch101948141_inset, adch74401004, adch101948144, adch101948147, adch101948150, adch101948153, adch101948225, adch101948228, adch101948234, adch101948237, adch101948240, adch101948243, adch101948246, adch101948249, adch101948252, adch101948276, adch101948285, adch74412387, adch101948291, adch101948294, adch101948297, adch101948300, adch101948303, adch101948306, adch101948279, adch74400302, adch101948390, adch74401005, adch101948420_inset, adch101948420, adch101948423_inset, adch101948423, adch101948426_inset, adch101948426, adch101948429_inset, adch101948429, adch101948432_inset, adch101948432, adch101948435_inset, adch101948435, adch101948438_inset, adch101948438, adch101948441_inset, adch101948441, adch101948444_inset, adch101948444, adch101948504, adch101948507, adch101948510, adch101948513, adch101948516, adch101948510_inset, adch101948513_inset, adch101948516_inset, adch74412388, adch74412388_inset, adch101948543, adch74412457, adch74412457_inset, adch74413949, adch74412463, adch74401006_oban, adch74401006_troon, adch74401007, adch74401008, adch74401009, adch74401010, adch74401011, adch74401012, adch74401060, adch74401014, adch74401015, adch74401016, adch74401017, adch74412462, adch74400305, adch74412454, adch74401019, adch74401019_inset, adch74401020, adch74401022, adch74401023, adch74400296, adch74400296_inset1, adch74400296_inset2, adch74400296_inset3, adch74401025, adch74401026, adch74401027, adch74401028, adch74401029, adch74401030, adch74401031, adch74401032, adch74401033, adch74401034, adch74401035, adch74401036, adch74401037, adch74401000, adch74401000_inset, adch74412461, adch74401038, adch74401039, adch74400294, adch74401040, adch74401041, adch74401042, adch74401043, adch74401044, adch74401045, adch74401046, adch74401047, adch74401048, adch74401048_inset, adch74401049, adch74401052, adch74401053, adch74401053_inset, adch74401054, adch74401051, adch74401055, adch74401056, adch74412460, adch74401057, adch101961533, bathlochawenorth, bathlochawesouth, bathlochcluanie, bathlochdoon, bathlochduntelchaig, bathlochearn, bathlocherichtlower, bathlocherichtupper, bathlochfannich, bathlochgarryness, bathlochgarrytay, bathlochglass, bathlochharray, bathlochlaidon, bathlochleven, bathlochlomondnorth, bathlochlomondsouth, bathlochloyne, bathlochluichart, bathlochlyon, bathlochmhor, bathlochmonar, bathlochmullardoch, bathlochquoich, bathlochrannoch, bathlochshiellower, bathlochshielupper, bathlochshinlower, bathlochshinupper, bathlochtayeast, bathlochtaywest, bathlochtreig, bathlochtummel, county74400288, county119952600, county74400145, county135908105, county74400334, estate121129476,  estate121129386, estate121129410, estate121129416, estate121129419, estate132293752, estate129392884, estate132293758, estate121129389, estate121129413, estate129393076, estate129393010, estate129393148, estate114473788, estate114473785, estate103427429, estate129392971, estate129393253,  estate125491577, estate121129473, estate121129458, estate110069086, estate132293749, estate132293755, estate129392983, estate129392986, estate129392989, estate129392992, estate129392995, estate129392911, estate121129434, estate129392908, estate114473773, estate110069083, estate129393019, estate129393103, estate129393049, estate110323727, estate132293842, estate121129461, estate110069080, estate103427459, estate103427450, estate103427447, estate129392893, estate129393328, estate129393580, estate121129443, estate121129392, estate129393397, estate129392887, estate121129464, estate132293743, estate129392947, estate129392950, estate106697318, estate129392935, estate132293857, estate106697324, estate129392887t, estate129393172, estate_balmaclellan, estate129393712, estate129393715, estate129393718, estate129393721, estate129393724, estate129393676, estate129393709, estate129393706, estate129393763, estate_earlstoun, estate125491588, estate129393664, estate132293782, estate129393778, estate129393754, estate129393745, estate125491585, estate129393751, estate125491597, estate129393583, estate129393661, estate106697330, estate106697333, estate106697336, estate106697339, estate125491591, estate125491601, estate114473887, estate106697342, estate129393769, estate125491594, estate114473800, estate114473809, estate114473806, estate114473794, estate114473797, estate114473815, estate125491581, estate114473830, estate114473845, estate114473854, estate114473824, estate114473836, estate114473842, estate114473848, estate114473851, estate114473839, estate114473827, estate129393667, estate129393016, estate129393076l, estate129393016c, estate74436591, aberdeen, aberdeen1879, aberdeen1883, aberdeen1895, aberdeen1902, aberdeen1905, aberdeen1915, airdrie, alexandria, alloa, annan, arbroath, ardhallow, ayr, barry, berwick, braefoot, brechin, burntisland, burntisland1824, campbeltown, campbeltown_goad, cloch, coatbridge, cramond, cupar1854, cupar1893, dalkeith1852, dalkeith1893, dreghorn, dumbarton, dumfries1850, dumfries1893, dundee_goad, dundee1857, dundee1870, dundee1882, dundee1888, dundee1891, dundee1892, dundee1893, dundee1897, dundee1900, dundee1903, dundee1906, dundee1908, dundee1910, dundee1911, dunfermline1854, dunfermline1893, edin_newington_1826, edin1765, edin1784, edin1804, edin1817, edin1819, edin1821, edin1822, edin1831, edin1832, edin1849, edin1865, edin1876, edin1882, edin1885, edin1888, edin1891, edin1892, edin1892b, edin1893, edin1902, edin1905, edin1907, edin1910, edin1912, edin1917, edin1918, edin1919, edin1932, edin1939, edin1944_1963, edinburgh_castle, edinburgh_goad, elgin, falkirk, forfar, forres, galashiels, girvan, glas1778, glas1807, glas1857, glas1882, glas1888, glas1891, glas1894, glas1895, glas1900, glas1905, glas1910, glas1914, glas1920, glas1925, glasgow_goad, glasgow1930, glasgow1936, greenock, greenock_goad, greenock1861, greenock1879, greenock1887, greenock1895, greenock1915, haddington1853, haddington1893, hamilton, hawick, inchcolm, inchkeith_2500, inchkeith_500, inchmickery, inverness, irvine, jedburgh, kelso, kilmarnock, kirkcaldy1855, kirkcaldy1894, kirkcudbright1850, kirkcudbright1893, kirkintilloch, kirriemuir, lanark, leith_goad, linlithgow, maybole, montrose, musselburgh1853, musselburgh1893, nairn, oban, osoneincholdseries, ossixinchfirstengland, sixinchenglandwales, oneinchrevisedcolouredengland, oneinchthirdengwalcolour, OS25inchGloucester3rdengland, OS25inchGuildford, bartholomew_half_1919, twentyfivethousandengwal, oneinchpopular_england, oneinchpopular_outline_england, oneinchnewpop, landutilisationsurveyengwal25k, landutilisationsurveyengwalscapes, landutilisationsurveyengwalwildscapeveg, landutilisationsurveyengwalwildscapehab,  oneinchseventhengwal, OStownsALL, OStownsALL1056, OSTownsAberdare, OSTownsAbergavenny, OSTownsAberystwyth, OSTownsAbingdon, OStownsAccrington, OSTownsAccrington, OSTownsAldershot, OSTownsAlnwick, OStownsAlnwick2640, OSTownsAltrincham, OSTownsAndover, OSTownsAppleby, OSTownsAshford, OStownsAshton, OStownsAshton2, OSTownsAtherstone, OSTownsAylesbury, OStownsBacup, OSTownsBacup, OSTownsBanbury, OSTownsBangor, OStownsBarnsley, OSTownsBarnsley, OSTownsBarnstaple, OSTownsBarrowinFurness, OSTownsBasingstoke, OSTownsBath, OSTownsBatley, OSTownsBeccles, OSTownsBedford, OSTownsBelper, OSTownsBerkhamstead, OStownsBeverley, OSTownsBeverley, OSTownsBideford, OSTownsBiggleswade, OStownsBingley, OSTownsBingley, OSTownsBirkenhead, TownsBirmimgham1855, OSTownsBirmingham, OSTownsBirstal, OSTownsBishopAuckland, OSTownsBishopsStortford, OStownsBlackburn, OSTownsBlackburn, OSTownsBlackpool, OStownsBlyth, OSTownsBlyth, OSTownsBodmin, OStownsBolton, OSTownsBolton, OSTownsBoston, OSTownsBournemouth, OStownsBradford, OSTownsBradford, OSTownsBradfordonAvon, OSTownsBraintree, OSTownsBrentwood, OSTownsBridgnorth, OSTownsBridgwater, OStownsBridlington, OSTownsBridlington, OSTownsBridport, OSTownsBrierleyHill, OSTownsBrighouse, OSTownsBrighton, OSTownsBristol, OSTownsBrixham, OSTownsBromsgrove, OSTownsBuckingham, OStownsBurnley, OSTownsBurnley, OSTownsBurslem, OSTownsBurtonuponTrent, OStownsBury, OSTownsBury, OSTownsBuryStEdmunds, OSTownsBuxton, OSTownsCamborne, OSTownsCambridge, OSTownsCanterbury, OSTownsCardiff, OSTownsCarmarthen, OSTownsCarnarvon, OSTownsCastleford, OSTownsCheltenham, OSTownsChertsey, OSTownsChester, OSTownsChesterfield, OSTownsChesterton, OSTownsChichester, OSTownsChippenham, OStownsChorley, OSTownsChorley, OSTownsChowbent, OSTownsChristchurch, OSTownsCirencester, OSTownsClaytonleMoors, OSTownsCleckheaton, OSTownsClevedon, OStownsClitheroe, OSTownsCockermouth, OSTownsColchester, OStownsColne, OSTownsColne, OSTownsCongleton, OSTownsCoventry, OSTownsCrediton, OSTownsCrewe, OSTownsCrewkerne, OSTownsCroydon, OSTownsDaltoninFurness, OSTownsDarlaston, OStownsDarlington, OSTownsDartford, OSTownsDartmouth, OSTownsDarwen, OSTownsDawlish, OSTownsDeal, OSTownsDenbigh, OSTownsDerby, OSTownsDevizes, OStownsDewsbury, OStownsDoncaster, OSTownsDoncaster, OSTownsDorchester, OSTownsDorking, OSTownsDouglas, OSTownsDover, OSTownsDroitwich, OSTownsDudley, OSTownsDunstable, OSTownsDurham, OSTownsEastbourne, OSTownsEastDereham, OSTownsEastRetford, OSTownsEccles, OSTownsElland, OSTownsEly, OSTownsEvesham, OSTownsExeter, OSTownsExmouth, OSTownsFalmouth, OSTownsFarnham, OSTownsFarnworth, OSTownsFarsley, OSTownsFaversham, OStownsFleetwood, OSTownsFleetwood, OSTownsFolkestone, OSTownsFrome, OSTownsGainsborough, OSTownsGarston, OSTownsGlossop, OSTownsGloucester, OSTownsGodmanchester, OSTownsGoole, OSTownsGosport, OSTownsGrantham, OSTownsGravesend, OSTownsGreatDriffield, OSTownsGreatGrimsby, OSTownsGreatHarwood, OSTownsGreatMalvern, OSTownsGreatMarlow, OSTownsGreatYarmouth, OSTownsGuildford, OStownsHalifax, OSTownsHalifax, OSTownsHalstead, OSTownsHarrogate, OSTownsHartlepool, OSTownsHarwich, OStownsHaslingden, OSTownsHaslingden, OSTownsHastings, OSTownsHaverfordwest, OSTownsHebdenBridge, OSTownsHeckmondwike, OSTownsHemelHempstead, OSTownsHenleyonThames, OSTownsHereford, OSTownsHertford, OSTownsHexham, OStownsHeywood, OSTownsHeywood, OSTownsHighWycombe, OSTownsHinckley, OSTownsHindley, OSTownsHolyhead, OSTownsHolywell, OSTownsHorncastle, OSTownsHorsham, OSTownsHorwich, OStownsHowden, OSTownsHucknallTorkard, OStownsHuddersfield, OSTownsHuddersfield, OSTownsHuntingdon, OSTownsHyde, OSTownsIdle, OSTownsIlfracombe, OSTownsIlkeston, OSTownsIlkley, OSTownsIpswich, OStownsKeighley, OSTownsKeighley, OSTownsKendal, OSTownsKettering, OSTownsKidderminster, OSTownsKidsgrove, OSTownsKingsLynn, OStownsKingstonuponHull, OSTownsKingstonuponHull, OStownsKingstonuponThames, OStownsKnaresborough, OSTownsKnaresborough, OSTownsKnottingley, OSTownsLancaster, OStownsLancaster1056, OSTownsLeeds, OStownsLeeds1056, OSTownsLeek, OSTownsLeicester, OSTownsLeigh, OSTownsLeightonBuzzard, OSTownsLeominster, OSTownsLewes, OSTownsLichfield, OSTownsLincoln, OSTownsLiskeard, OSTownsLittleborough, OStownsLiverpool, OSTownsLiverpool, OSTownsLlandudno, OSTownsLlanelly, OStownsLondon5280, OStownsLondon1056, OStownsLondon, OSTownsLongEaton, OSTownsLoughborough, OSTownsLouth, OSTownsLowestoft, OSTownsLudlow, OSTownsLuton, OSTownsLymington, OSTownsLytham, OSTownsMacclesfield, OSTownsMaidenhead, OSTownsMaidstone, OSTownsMaldon, OStownsMalton, OStownsManchester, OSTownsManchesterandSalford, OSTownsMansfield, OSTownsMarch, OSTownsMargate, OSTownsMaryport, OSTownsMelcombeRegis, OSTownsMeltonMowbray, OSTownsMerthyrTydfil, OStownsMiddlesbrough, OSTownsMiddlesbrough, OStownsMiddleton, OSTownsMiddleton, OSTownsMirfield, OSTownsMold, OSTownsMonmouth, OSTownsMorecambe, OSTownsMorley, OSTownsMorpeth, OSTownsMossley, OSTownsNantwich, OSTownsNeath, OSTownsNelson, OSTownsNewark, OSTownsNewbury, OSTownsNewcastle1894, OSTownsNewcastle1900s, OSTownsNewMalton, OSTownsNewmarket, OSTownsNewport, OSTownsNewportIsleofWight, OSTownsNewtonAbbot, OSTownsNewtown, OSTownsNorthampton, OSTownsNorthwich, OSTownsNorwich, OSTownsNottingham, OSTownsNuneaton, OSTownsOldbury, OSTownsOldham, OStownsOrmskirk, OSTownsOrmskirk, OSTownsOswestry, OSTownsOtley, OSTownsOxford, OSTownsPadiham, OSTownsPembroke, OSTownsPembrokeDock, OSTownsPenrith, OSTownsPenzance, OSTownsPeterborough, OSTownsPetersfield, OSTownsPetworth, OSTownsPlumstead, OStownsPlymouth1850s, OStownsPontefract, OSTownsPontefract, OSTownsPontypool, OSTownsPoole, OSTownsPortsmouth, OStownsPrescot, OSTownsPrescot, OStownsPreston, OSTownsPreston, OSTownsRamsbottom, OSTownsRamsey, OSTownsRamsgate, OSTownsRavensthorpe, OSTownsRawtenstall, OSTownsReading, OSTownsRedditch, OSTownsRedhill, OSTownsRedruth, OSTownsReigate, OSTownsRhyl, OStownsRichmond, OSTownsRichmond, OStownsRipon, OSTownsRipon, OSTownsRishton, OStownsRochdale, OSTownsRochdale, OSTownsRochester, OSTownsRomford, OSTownsRomsey, OStownsRotherham, OSTownsRotherham, OSTownsRoyalLemingtonSpa, OSTownsRoyton, OSTownsRugby, OSTownsRuncorn, OSTownsRyde, OSTownsRye, OSTownsSaffronWalden, OSTownsSalisbury, OSTownsSandwich, OStownsScarborough, OSTownsScarborough, OStownsSelby, OSTownsSelby, OSTownsSevenoaks, OStownsSheffield, OSTownsSheffield, OSTownsSheptonMallet, OSTownsSherborne, OSTownsShipley, OSTownsShrewsbury, OStownsSkipton, OSTownsSkipton, OSTownsSleaford, OSTownsSlough, OSTownsSouthampton, OSTownsSouthport, OSTownsSowerbyBridge, OSTownsSpalding, OStownsSt_Helens, OSTownsStafford, OSTownsStamford, OSTownsStAustell, OSTownsStHelens, OSTownsStIves, OStownsStockport, OStownsStockport2, OSTownsStocktonuponTees, OStownsStockton1890s, OSTownsStone, OSTownsStourbridge, OSTownsStowmarket, OSTownsStratfordonAvon, OSTownsStroud, OSTownsSudbury, OSTownsSuttoninAshfield, OSTownsSwansea, OSTownsSwindon, OSTownsSwinton, OSTownsTamworth, OSTownsTaunton, OSTownsTavistock, OSTownsTenby, OSTownsTewkesbury, OSTownsThetford, OSTownsTiverton, OStownsTodmorden, OSTownsTodmorden, OSTownsTonbridge, OSTownsTorquay, OSTownsTotnes, OSTownsTring, OSTownsTrowbridge, OSTownsTruro, OSTownsTunbridgeWells, OSTownsTyldesley, OSTownsTyneside, OStownsTyneside1890s, OStownsUlverston, OSTownsUlverston, OStownsWakefield, OSTownsWakefield, OSTownsWallsend, OSTownsWalsall, OSTownsWalthamAbbey, OSTownsWare, OSTownsWarminster, OStownsWarrington, OSTownsWarrington, OSTownsWarwick, OSTownsWatford, OSTownsWednesbury, OSTownsWellingborough, OSTownsWellington, OSTownsWells, OSTownsWelshpool, OSTownsWestBromwich, OSTownsWestCowes, OSTownsWestonsuperMare, OSTownsWeymouth, OStownsWhitby, OSTownsWhitby, OSTownsWhitchurch, OSTownsWhitehaven, OSTownsWidnes, OStownsWigan, OSTownsWigan, OSTownsWinchester, OStownsWindsor, OSTownsWisbech, OSTownsWithington, OSTownsWokingham, OSTownsWolverhampton, OSTownsWorcester, OSTownsWorksop, OSTownsWorthing, OSTownsYeovil, OStownsYork, OSTownsYork, paisley, paisley_goad, peebles, perth1716, perth1783, perth1823, perth1827, perth1832, perth1860, perth1860b, perth1893, perth1895, perth1901, perth1902, perth1907, perth1912, perth1933, peterhead, portglasgow, portkil, portobello, rothesay, selkirk, standrews1854, standrews1893, stirling, stonehaven, stranraer1847, stranraer1867, stranraer1893, strathaven, wick, wigtown1848, wigtown1894, county_chester_1794, county_cumberland_1823, county_durham_1819, county_lancashire_1828, county_lincolnshire_1828, county_westmorland_1823, county_yorkshire_1828, london_gsgs4157, greatbritain50k, irelandbart, irelandgsgs, channel_islands_town_plans, os2500_group_great_britain_channel_islands, sixinch2_channel_islands, channel_islands_six_inch_1960s, channel_islands_two_inch, channel_islands_three_inch, trench101723168, trench101723205, trench101723208, trench101723211, trench101723214, trench101724055, trench101723220, trench101723223, trench101723229, trench101724060, trench101723232, trench101724050, trench101724027, trench101724030, trench101723171, trench101723174, trench101723196, trench101723217, trench101723199, trench101724033, trench101724036, trench101464585, trench101464588, trench101464591, trench101464594, trench101464609, trench101464612, trench101464615, trench101464618, trench101464630, trench101464627, trench101464639, trench101464642, trench101464645, trench101464636, trench101464681, trench101464684, trench101464687, trench101464648, trench101464651, trench101464654, trench101464657, trench101464660, trench101464663, trench101464666, trench101464669, trench101464672, trench101464675, trench101464693, trench101464696, trench101464705, trench101464708, trench101464711, trench101464714, trench101464699, trench101464702, trench101464726, trench101464729, trench101464732, trench101464735, trench101464738, trench101464741, trench101464744, trench101464747, trench101464750, trench101464753, trench101464756, trench101464759, trench101464762, trench101464765, trench101464768, trench101464765, trench101464774, trench101464777, trench101464780, trench101464783, trench101464771, trench101464786, trench101464789, trench101464792, trench101464795, trench101464798, trench101464801, trench101464804, trench101464807, trench101464810, trench101464813, trench101464816, trench101464822, trench101464825, trench101464828, trench101464831, trench101724021, trench101723247, trench101723250, trench101723253, trench101464837, trench101464834, trench101464840, trench101464846, trench101464843, trench101464849, trench101464855, trench101464858, trench101464867, trench101464864, trench101464861, trench101464873, trench101464870, trench101464876, trench101464879, trench101464882, trench101464885, trench101464897, trench101464903, trench101464900, trench101464918, trench101464915, trench101464912, trench101464909, trench101464939, trench101464936, trench101464933, trench101464930, trench101464927, trench101464924, trench101464921, trench101464948, trench101464945, trench101464942, trench101464951, trench101464954, trench101464957, trench101464960, trench101464966, trench101464963, trench101464969, trench101464978, trench101464975, trench101464987, trench101464984, trench101464981, trench101464990, trench101464999, trench101464996, trench101464993, trench101465002, trench101465011, trench101465008, trench101465005, trench101465020, trench101465017, trench101465023, trench101465029, trench101465032, trench101465035, trench101465050, trench101465047, trench101465044, trench101465071, trench101465068, trench101465065, trench101465062, trench101465059, trench101465056, trench101465053, trench101465095, trench101465092, trench101465089, trench101465086, trench101465083, trench101465080, trench101465077, trench101465074, trench101465098, trench101465104, trench101465101, trench101465107, trench101465119, trench101465116, trench101465122, trench101465137, trench101465134, trench101465131, trench101465128, trench101465140, trench101465161, trench101465158, trench101465155, trench101465152, trench101465149, trench101465146, trench101465164, trench101465167, trench101465194, trench101465191, trench101465188, trench101465185, trench101465182, trench101465176, trench101465170, trench101465209, trench101465206, trench101465203, trench101465200, trench101465197, trench101465224, trench101465221, trench101465218, trench101465215, trench101465251, trench101465248, trench101465245, trench101465242, trench101465239, trench101465236, trench101465233, trench101465230, trench101465227, trench101465257, trench101465254, trench101465263, trench101465260, trench101465269, trench101465266, trench101465275, trench101465272, trench101465287, trench101465284, trench101465281, trench101465278, trench101465293, trench101465290, trench101465302, trench101465296, trench101465308, trench101465305, trench101465311, trench101465323, trench101465320, trench101465317, trench101465314, trench101465329, trench101465326, trench101465332, trench101465368, trench101465365, trench101465341, trench101465344, trench101465338, trench101465335, trench101465347, trench101465350, trench101465353, trench101465356, trench101465359, trench101465371, trench101465362, trench101465377, trench101465374, trench101465380, trench101465383, trench101465386, trench101465389, trench101465392, trench101465395, trench101465398, trench101723235, trench101723238, trench101723833, trench101723202, trench101724065, trench101724042, trench101724045, trench101724024, trench101724039, trench101723830, trench101723165, belgiumgsgs4042, belgiumgsgs4336, belgiumgsgs4040, cyprus_kitchener, jamaica, india_half_first_ed, india_half_second_ed, india_one_first_ed, india_one_second_ed, hongkongcollinson, world_arrowsmith, world_bartholomew, tsa_ALL, R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_maptiler_hillshade, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM];




    	overlayLayers =  [osoneinchfirstgb, ossixinchfirstgreatbritain, oneinchgeology, twentyfive_inch_gloucester_wiltshire_somerset_britain, oneinch2nd, one_inch_2nd_hills,  sixinch2, ostwentyfiveinchGreatBritain, bartgreatbritain, quarterinchfirsthills, quarterinchfirstoutline, OS1900sGB, os1900s_all_scales, sixinchgeology, oneinchthirdgbcolour, OS25inchEdinburgh1914, OS25inchGloucester3rd, quarterinch, quarterinchcivilair, quarterinchfourth, twentyfivethousand,  twentyfivethousandoutline, oneinchpopular_britain, halfinchmot, nls, halfinchoutlineblue, oneinchlanduse, landutilisationsurveygb, landutilisationsurveyengwal25kpub, bartgreatbritain1940s, airphotos1250, airphotos, scot1944_1966_group_great_britain, os1250_group_great_britain, os1250_scot_b, os1250_scot_c, os2500_group_great_britain, os2500_scot_b, os2500_scot_c, OS10knatgridgreat_britain, oneinchseventh, admin, coal_iron, farming, general, geological, iron_steel, land_classification, land_utilisation, limestone,  physical, population_change_1921, population_change_1931, population_change_1939, population_density_1931, population_density_1951, railways, rainfall, roads_46, roads_56, royhighlands, roylowlands, hole1607, dorret1750, arrowsmith1807, sixinch, oneinchscotlandfirstcol,  oneinch2ndscot, one_inch_2nd_hills_scot, sixinch2scot_api, os25inch1890s, os25inchblueandblacks, os25inchblueandblacksOS, oneinchthirdcolour, bartsurveyatlas, oneinchpopular, oneinchpopular_outline, barthalfinch,  twentyfivethousandscot, gsgs3906, oneinchgsgs3908, scot1944_1966_group, os1250_group_great_britain_scot, os1250_scot_b_scot, os1250_scot_c_scot, os2500_group_great_britain_scot, os2500_scot_b_scot, os2500_scot_c_scot, oneinchnatgrid, oneinchnatgridoutline, oneinchgsgs4639, quarterinchadmin1950, oneinchsoils,  OS10knatgridscot, oneinchseventhscot, quarterinchadmin1960, secondlandusescot, ch00000529, ch00000541, ch74400306, ch85449271, ch85449274, ch85449277, ch85449280, ch85449283, ch85449286, ch85449289, ch85449292, adch101942045, adch101942048, adch101942078, adch101942108, adch101942111, adch101942114, adch101942117, adch101942630, adch74412450, adch101942603, adch101942606, adch101942612, adch101942615, adch101942618, adch101942621, adch101942624, adch101942627, adch101942633, adch101942687, adch101942690, adch101942693, adch101942696, adch101942699, adch101942702, adch101942705, adch101942708, adch101942711, adch101942714, adch101942669, adch101942672, adch101942675, adch101942678, adch101942681, adch101942735, adch101942726, adch101942729, adch101942732, adch101942741, adch101942738, adch101942759, adch101942762, adch101943347, adch101942906_inset2, adch101942909_inset2, adch101942912_inset2, adch101942915_inset2, adch101942915_inset4, adch101942906_inset3, adch101942909_inset3, adch101942912_inset3, adch101942915_inset3, adch101942906_inset1, adch101942909_inset1, adch101942912_inset1, adch101942915_inset1, adch101942975, adch101942981, adch101942984, adch101942987, adch101942993, adch101942996, adch101943350, adch101943353, adch101943356, adch101943491, adch101943494, adch101943500, adch101943503, adch101943506, adch101943509, adch101943512, adch101944457, adch101944460, adch101944463, adch74401001, adch101944847_inset3, adch101944847_inset4, adch101944847_inset2, adch101944847_inset1, adch101944847_inset5, adch101944847_inset6, adch101944847_inset7, adch101944850_inset3, adch101944850_inset4, adch101944850_inset2, adch101944850_inset1, adch101944850_inset5, adch101944850_inset6, adch101944850_inset7, adch101944853_inset3, adch101944853_inset4, adch101944853_inset2, adch101944853_inset1, adch101944853_inset5, adch101944853_inset6, adch101944853_inset7, adch101944856_inset3, adch101944856_inset4, adch101944856_inset2, adch101944856_inset1, adch101944856_inset5, adch101944856_inset6, adch101944883, adch101944865, adch101944874, adch101944886, adch101944889, adch101944892, adch101944895, adch101945726, adch101945729, adch74400307, adch74400307_inset1, adch74400307_inset2, adch74400307_inset3, adch74400307_inset4, adch101946716, adch101946716_inset2, adch101946716_inset3, adch101946716_inset4, adch101946716_inset1, adch101946695_inset, adch101946695, adch101946698_inset, adch101946698, adch74401002, adch101947403_dunvegan, adch101947403_snizort, adch101947406, adch101947409, adch101947898, adch101947901, adch101947907, adch101947910, adch101947916, adch101947919, adch101947922, adch101947925, adch101947919_inset1, adch101947922_inset1, adch101947922_inset2, adch101947925_inset1, adch101947925_inset2, adch74401003, adch101948129, adch101948132, adch101948135, adch101948138, adch101948141, adch101948132_inset, adch101948135_inset, adch101948138_inset, adch101948141_inset, adch74401004, adch101948144, adch101948147, adch101948150, adch101948153, adch101948225, adch101948228, adch101948234, adch101948237, adch101948240, adch101948243, adch101948246, adch101948249, adch101948252, adch101948276, adch101948285, adch74412387, adch101948291, adch101948294, adch101948297, adch101948300, adch101948303, adch101948306, adch101948279, adch74400302, adch101948390, adch74401005, adch101948420_inset, adch101948420, adch101948423_inset, adch101948423, adch101948426_inset, adch101948426, adch101948429_inset, adch101948429, adch101948432_inset, adch101948432, adch101948435_inset, adch101948435, adch101948438_inset, adch101948438, adch101948441_inset, adch101948441, adch101948444_inset, adch101948444, adch101948504, adch101948507, adch101948510, adch101948513, adch101948516, adch101948510_inset, adch101948513_inset, adch101948516_inset, adch74412388, adch74412388_inset, adch101948543, adch74412457, adch74412457_inset, adch74413949, adch74412463, adch74401006_oban, adch74401006_troon, adch74401007, adch74401008, adch74401009, adch74401010, adch74401011, adch74401012, adch74401060, adch74401014, adch74401015, adch74401016, adch74401017, adch74412462, adch74400305, adch74412454, adch74401019, adch74401019_inset, adch74401020, adch74401022, adch74401023, adch74400296, adch74400296_inset1, adch74400296_inset2, adch74400296_inset3, adch74401025, adch74401026, adch74401027, adch74401028, adch74401029, adch74401030, adch74401031, adch74401032, adch74401033, adch74401034, adch74401035, adch74401036, adch74401037, adch74401000, adch74401000_inset, adch74412461, adch74401038, adch74401039, adch74400294, adch74401040, adch74401041, adch74401042, adch74401043, adch74401044, adch74401045, adch74401046, adch74401047, adch74401048, adch74401048_inset, adch74401049, adch74401052, adch74401053, adch74401053_inset, adch74401054, adch74401051, adch74401055, adch74401056, adch74412460, adch74401057, adch101961533, bathlochawenorth, bathlochawesouth, bathlochcluanie, bathlochdoon, bathlochduntelchaig, bathlochearn, bathlocherichtlower, bathlocherichtupper, bathlochfannich, bathlochgarryness, bathlochgarrytay, bathlochglass, bathlochharray, bathlochlaidon, bathlochleven, bathlochlomondnorth, bathlochlomondsouth, bathlochloyne, bathlochluichart, bathlochlyon, bathlochmhor, bathlochmonar, bathlochmullardoch, bathlochquoich, bathlochrannoch, bathlochshiellower, bathlochshielupper, bathlochshinlower, bathlochshinupper, bathlochtayeast, bathlochtaywest, bathlochtreig, bathlochtummel, county74400288, county119952600, county74400145, county135908105, county74400334, estate121129476,  estate121129386, estate121129410, estate121129416, estate121129419, estate132293752, estate129392884, estate132293758, estate121129389, estate121129413, estate129393076, estate129393010, estate129393148, estate114473788, estate114473785, estate103427429, estate129392971, estate129393253,  estate125491577, estate121129473, estate121129458, estate110069086, estate132293749, estate132293755, estate129392983, estate129392986, estate129392989, estate129392992, estate129392995, estate129392911, estate121129434, estate129392908, estate114473773, estate110069083, estate129393019, estate129393103, estate129393049, estate110323727, estate132293842, estate121129461, estate110069080, estate103427459, estate103427450, estate103427447, estate129392893, estate129393328, estate129393580, estate121129443, estate121129392, estate129393397, estate129392887, estate121129464, estate132293743, estate129392947, estate129392950, estate106697318, estate129392935, estate132293857, estate106697324, estate129392887t, estate129393172, estate_balmaclellan, estate129393712, estate129393715, estate129393718, estate129393721, estate129393724, estate129393676, estate129393709, estate129393706, estate129393763, estate_earlstoun, estate125491588, estate129393664, estate132293782, estate129393778, estate129393754, estate129393745, estate125491585, estate129393751, estate125491597, estate129393583, estate129393661, estate106697330, estate106697333, estate106697336, estate106697339, estate125491591, estate125491601, estate114473887, estate106697342, estate129393769, estate125491594, estate114473800, estate114473809, estate114473806, estate114473794, estate114473797, estate114473815, estate125491581, estate114473830, estate114473845, estate114473854, estate114473824, estate114473836, estate114473842, estate114473848, estate114473851, estate114473839, estate114473827, estate129393667, estate129393016, estate129393076l, estate129393016c, estate74436591, aberdeen, aberdeen1879, aberdeen1883, aberdeen1895, aberdeen1902, aberdeen1905, aberdeen1915, airdrie, alexandria, alloa, annan, arbroath, ardhallow, ayr, barry, berwick, braefoot, brechin, burntisland, burntisland1824, campbeltown, campbeltown_goad, cloch, coatbridge, cramond, cupar1854, cupar1893, dalkeith1852, dalkeith1893, dreghorn, dumbarton, dumfries1850, dumfries1893, dundee_goad, dundee1857, dundee1870, dundee1882, dundee1888, dundee1891, dundee1892, dundee1893, dundee1897, dundee1900, dundee1903, dundee1906, dundee1908, dundee1910, dundee1911, dunfermline1854, dunfermline1893, edin_newington_1826, edin1765, edin1784, edin1804, edin1817, edin1819, edin1821, edin1822, edin1831, edin1832, edin1849, edin1865, edin1876, edin1882, edin1885, edin1888, edin1891, edin1892, edin1892b, edin1893, edin1902, edin1905, edin1907, edin1910, edin1912, edin1917, edin1918, edin1919, edin1932, edin1939, edin1944_1963, edinburgh_castle, edinburgh_goad, elgin, falkirk, forfar, forres, galashiels, girvan, glas1778, glas1807, glas1857, glas1882, glas1888, glas1891, glas1894, glas1895, glas1900, glas1905, glas1910, glas1914, glas1920, glas1925, glasgow_goad, glasgow1930, glasgow1936, greenock, greenock_goad, greenock1861, greenock1879, greenock1887, greenock1895, greenock1915, haddington1853, haddington1893, hamilton, hawick, inchcolm, inchkeith_2500, inchkeith_500, inchmickery, inverness, irvine, jedburgh, kelso, kilmarnock, kirkcaldy1855, kirkcaldy1894, kirkcudbright1850, kirkcudbright1893, kirkintilloch, kirriemuir, lanark, leith_goad, linlithgow, maybole, montrose, musselburgh1853, musselburgh1893, nairn, oban, osoneincholdseries, ossixinchfirstengland, sixinchenglandwales, oneinchrevisedcolouredengland, oneinchthirdengwalcolour, OS25inchGloucester3rdengland, OS25inchGuildford, bartholomew_half_1919, twentyfivethousandengwal, oneinchpopular_england, oneinchpopular_outline_england, oneinchnewpop, landutilisationsurveyengwal25k, landutilisationsurveyengwalscapes, landutilisationsurveyengwalwildscapeveg, landutilisationsurveyengwalwildscapehab,  oneinchseventhengwal, OStownsALL, OStownsALL1056, OSTownsAberdare, OSTownsAbergavenny, OSTownsAberystwyth, OSTownsAbingdon, OStownsAccrington, OSTownsAccrington, OSTownsAldershot, OSTownsAlnwick, OStownsAlnwick2640, OSTownsAltrincham, OSTownsAndover, OSTownsAppleby, OSTownsAshford, OStownsAshton, OStownsAshton2, OSTownsAtherstone, OSTownsAylesbury, OStownsBacup, OSTownsBacup, OSTownsBanbury, OSTownsBangor, OStownsBarnsley, OSTownsBarnsley, OSTownsBarnstaple, OSTownsBarrowinFurness, OSTownsBasingstoke, OSTownsBath, OSTownsBatley, OSTownsBeccles, OSTownsBedford, OSTownsBelper, OSTownsBerkhamstead, OStownsBeverley, OSTownsBeverley, OSTownsBideford, OSTownsBiggleswade, OStownsBingley, OSTownsBingley, OSTownsBirkenhead, TownsBirmimgham1855, OSTownsBirmingham, OSTownsBirstal, OSTownsBishopAuckland, OSTownsBishopsStortford, OStownsBlackburn, OSTownsBlackburn, OSTownsBlackpool, OStownsBlyth, OSTownsBlyth, OSTownsBodmin, OStownsBolton, OSTownsBolton, OSTownsBoston, OSTownsBournemouth, OStownsBradford, OSTownsBradford, OSTownsBradfordonAvon, OSTownsBraintree, OSTownsBrentwood, OSTownsBridgnorth, OSTownsBridgwater, OStownsBridlington, OSTownsBridlington, OSTownsBridport, OSTownsBrierleyHill, OSTownsBrighouse, OSTownsBrighton, OSTownsBristol, OSTownsBrixham, OSTownsBromsgrove, OSTownsBuckingham, OStownsBurnley, OSTownsBurnley, OSTownsBurslem, OSTownsBurtonuponTrent, OStownsBury, OSTownsBury, OSTownsBuryStEdmunds, OSTownsBuxton, OSTownsCamborne, OSTownsCambridge, OSTownsCanterbury, OSTownsCardiff, OSTownsCarmarthen, OSTownsCarnarvon, OSTownsCastleford, OSTownsCheltenham, OSTownsChertsey, OSTownsChester, OSTownsChesterfield, OSTownsChesterton, OSTownsChichester, OSTownsChippenham, OStownsChorley, OSTownsChorley, OSTownsChowbent, OSTownsChristchurch, OSTownsCirencester, OSTownsClaytonleMoors, OSTownsCleckheaton, OSTownsClevedon, OStownsClitheroe, OSTownsCockermouth, OSTownsColchester, OStownsColne, OSTownsColne, OSTownsCongleton, OSTownsCoventry, OSTownsCrediton, OSTownsCrewe, OSTownsCrewkerne, OSTownsCroydon, OSTownsDaltoninFurness, OSTownsDarlaston, OStownsDarlington, OSTownsDartford, OSTownsDartmouth, OSTownsDarwen, OSTownsDawlish, OSTownsDeal, OSTownsDenbigh, OSTownsDerby, OSTownsDevizes, OStownsDewsbury, OStownsDoncaster, OSTownsDoncaster, OSTownsDorchester, OSTownsDorking, OSTownsDouglas, OSTownsDover, OSTownsDroitwich, OSTownsDudley, OSTownsDunstable, OSTownsDurham, OSTownsEastbourne, OSTownsEastDereham, OSTownsEastRetford, OSTownsEccles, OSTownsElland, OSTownsEly, OSTownsEvesham, OSTownsExeter, OSTownsExmouth, OSTownsFalmouth, OSTownsFarnham, OSTownsFarnworth, OSTownsFarsley, OSTownsFaversham, OStownsFleetwood, OSTownsFleetwood, OSTownsFolkestone, OSTownsFrome, OSTownsGainsborough, OSTownsGarston, OSTownsGlossop, OSTownsGloucester, OSTownsGodmanchester, OSTownsGoole, OSTownsGosport, OSTownsGrantham, OSTownsGravesend, OSTownsGreatDriffield, OSTownsGreatGrimsby, OSTownsGreatHarwood, OSTownsGreatMalvern, OSTownsGreatMarlow, OSTownsGreatYarmouth, OSTownsGuildford, OStownsHalifax, OSTownsHalifax, OSTownsHalstead, OSTownsHarrogate, OSTownsHartlepool, OSTownsHarwich, OStownsHaslingden, OSTownsHaslingden, OSTownsHastings, OSTownsHaverfordwest, OSTownsHebdenBridge, OSTownsHeckmondwike, OSTownsHemelHempstead, OSTownsHenleyonThames, OSTownsHereford, OSTownsHertford, OSTownsHexham, OStownsHeywood, OSTownsHeywood, OSTownsHighWycombe, OSTownsHinckley, OSTownsHindley, OSTownsHolyhead, OSTownsHolywell, OSTownsHorncastle, OSTownsHorsham, OSTownsHorwich, OStownsHowden, OSTownsHucknallTorkard, OStownsHuddersfield, OSTownsHuddersfield, OSTownsHuntingdon, OSTownsHyde, OSTownsIdle, OSTownsIlfracombe, OSTownsIlkeston, OSTownsIlkley, OSTownsIpswich, OStownsKeighley, OSTownsKeighley, OSTownsKendal, OSTownsKettering, OSTownsKidderminster, OSTownsKidsgrove, OSTownsKingsLynn, OStownsKingstonuponHull, OSTownsKingstonuponHull, OStownsKingstonuponThames, OStownsKnaresborough, OSTownsKnaresborough, OSTownsKnottingley, OSTownsLancaster, OStownsLancaster1056, OSTownsLeeds, OStownsLeeds1056, OSTownsLeek, OSTownsLeicester, OSTownsLeigh, OSTownsLeightonBuzzard, OSTownsLeominster, OSTownsLewes, OSTownsLichfield, OSTownsLincoln, OSTownsLiskeard, OSTownsLittleborough, OStownsLiverpool, OSTownsLiverpool, OSTownsLlandudno, OSTownsLlanelly, OStownsLondon5280, OStownsLondon1056, OStownsLondon, OSTownsLongEaton, OSTownsLoughborough, OSTownsLouth, OSTownsLowestoft, OSTownsLudlow, OSTownsLuton, OSTownsLymington, OSTownsLytham, OSTownsMacclesfield, OSTownsMaidenhead, OSTownsMaidstone, OSTownsMaldon, OStownsMalton, OStownsManchester, OSTownsManchesterandSalford, OSTownsMansfield, OSTownsMarch, OSTownsMargate, OSTownsMaryport, OSTownsMelcombeRegis, OSTownsMeltonMowbray, OSTownsMerthyrTydfil, OStownsMiddlesbrough, OSTownsMiddlesbrough, OStownsMiddleton, OSTownsMiddleton, OSTownsMirfield, OSTownsMold, OSTownsMonmouth, OSTownsMorecambe, OSTownsMorley, OSTownsMorpeth, OSTownsMossley, OSTownsNantwich, OSTownsNeath, OSTownsNelson, OSTownsNewark, OSTownsNewbury, OSTownsNewcastle1894, OSTownsNewcastle1900s, OSTownsNewMalton, OSTownsNewmarket, OSTownsNewport, OSTownsNewportIsleofWight, OSTownsNewtonAbbot, OSTownsNewtown, OSTownsNorthampton, OSTownsNorthwich, OSTownsNorwich, OSTownsNottingham, OSTownsNuneaton, OSTownsOldbury, OSTownsOldham, OStownsOrmskirk, OSTownsOrmskirk, OSTownsOswestry, OSTownsOtley, OSTownsOxford, OSTownsPadiham, OSTownsPembroke, OSTownsPembrokeDock, OSTownsPenrith, OSTownsPenzance, OSTownsPeterborough, OSTownsPetersfield, OSTownsPetworth, OSTownsPlumstead, OStownsPlymouth1850s, OStownsPontefract, OSTownsPontefract, OSTownsPontypool, OSTownsPoole, OSTownsPortsmouth, OStownsPrescot, OSTownsPrescot, OStownsPreston, OSTownsPreston, OSTownsRamsbottom, OSTownsRamsey, OSTownsRamsgate, OSTownsRavensthorpe, OSTownsRawtenstall, OSTownsReading, OSTownsRedditch, OSTownsRedhill, OSTownsRedruth, OSTownsReigate, OSTownsRhyl, OStownsRichmond, OSTownsRichmond, OStownsRipon, OSTownsRipon, OSTownsRishton, OStownsRochdale, OSTownsRochdale, OSTownsRochester, OSTownsRomford, OSTownsRomsey, OStownsRotherham, OSTownsRotherham, OSTownsRoyalLemingtonSpa, OSTownsRoyton, OSTownsRugby, OSTownsRuncorn, OSTownsRyde, OSTownsRye, OSTownsSaffronWalden, OSTownsSalisbury, OSTownsSandwich, OStownsScarborough, OSTownsScarborough, OStownsSelby, OSTownsSelby, OSTownsSevenoaks, OStownsSheffield, OSTownsSheffield, OSTownsSheptonMallet, OSTownsSherborne, OSTownsShipley, OSTownsShrewsbury, OStownsSkipton, OSTownsSkipton, OSTownsSleaford, OSTownsSlough, OSTownsSouthampton, OSTownsSouthport, OSTownsSowerbyBridge, OSTownsSpalding, OStownsSt_Helens, OSTownsStafford, OSTownsStamford, OSTownsStAustell, OSTownsStHelens, OSTownsStIves, OStownsStockport, OStownsStockport2, OSTownsStocktonuponTees, OStownsStockton1890s, OStownsStockton1890s, OSTownsStone, OSTownsStourbridge, OSTownsStowmarket, OSTownsStratfordonAvon, OSTownsStroud, OSTownsSudbury, OSTownsSuttoninAshfield, OSTownsSwansea, OSTownsSwindon, OSTownsSwinton, OSTownsTamworth, OSTownsTaunton, OSTownsTavistock, OSTownsTenby, OSTownsTewkesbury, OSTownsThetford, OSTownsTiverton, OStownsTodmorden, OSTownsTodmorden, OSTownsTonbridge, OSTownsTorquay, OSTownsTotnes, OSTownsTring, OSTownsTrowbridge, OSTownsTruro, OSTownsTunbridgeWells, OSTownsTyldesley, OSTownsTyneside, OStownsTyneside1890s, OStownsUlverston, OSTownsUlverston, OStownsWakefield, OSTownsWakefield, OSTownsWallsend, OSTownsWalsall, OSTownsWalthamAbbey, OSTownsWare, OSTownsWarminster, OStownsWarrington, OSTownsWarrington, OSTownsWarwick, OSTownsWatford, OSTownsWednesbury, OSTownsWellingborough, OSTownsWellington, OSTownsWells, OSTownsWelshpool, OSTownsWestBromwich, OSTownsWestCowes, OSTownsWestonsuperMare, OSTownsWeymouth, OStownsWhitby, OSTownsWhitby, OSTownsWhitchurch, OSTownsWhitehaven, OSTownsWidnes, OStownsWigan, OSTownsWigan, OSTownsWinchester, OStownsWindsor, OSTownsWisbech, OSTownsWithington, OSTownsWokingham, OSTownsWolverhampton, OSTownsWorcester, OSTownsWorksop, OSTownsWorthing, OSTownsYeovil, OStownsYork, OSTownsYork, paisley, paisley_goad, peebles, perth1716, perth1783, perth1823, perth1827, perth1832, perth1860, perth1860b, perth1893, perth1895, perth1901, perth1902, perth1907, perth1912, perth1933, peterhead, portglasgow, portkil, portobello, rothesay, selkirk, standrews1854, standrews1893, stirling, stonehaven, stranraer1847, stranraer1867, stranraer1893, strathaven, wick, wigtown1848, wigtown1894, county_chester_1794, county_cumberland_1823, county_durham_1819, county_lancashire_1828, county_lincolnshire_1828, county_westmorland_1823, county_yorkshire_1828, london_gsgs4157, greatbritain50k, irelandbart, irelandgsgs, channel_islands_town_plans, os2500_group_great_britain_channel_islands, sixinch2_channel_islands, channel_islands_six_inch_1960s, channel_islands_two_inch, channel_islands_three_inch, trench101723168, trench101723205, trench101723208, trench101723211, trench101723214, trench101724055, trench101723220, trench101723223, trench101723229, trench101724060, trench101723232, trench101724050, trench101724027, trench101724030, trench101723171, trench101723174, trench101723196, trench101723217, trench101723199, trench101724033, trench101724036, trench101464585, trench101464588, trench101464591, trench101464594, trench101464609, trench101464612, trench101464615, trench101464618, trench101464630, trench101464627, trench101464639, trench101464642, trench101464645, trench101464636, trench101464681, trench101464684, trench101464687, trench101464648, trench101464651, trench101464654, trench101464657, trench101464660, trench101464663, trench101464666, trench101464669, trench101464672, trench101464675, trench101464693, trench101464696, trench101464705, trench101464708, trench101464711, trench101464714, trench101464699, trench101464702, trench101464726, trench101464729, trench101464732, trench101464735, trench101464738, trench101464741, trench101464744, trench101464747, trench101464750, trench101464753, trench101464756, trench101464759, trench101464762, trench101464765, trench101464768, trench101464765, trench101464774, trench101464777, trench101464780, trench101464783, trench101464771, trench101464786, trench101464789, trench101464792, trench101464795, trench101464798, trench101464801, trench101464804, trench101464807, trench101464810, trench101464813, trench101464816, trench101464822, trench101464825, trench101464828, trench101464831, trench101724021, trench101723247, trench101723250, trench101723253, trench101464837, trench101464834, trench101464840, trench101464846, trench101464843, trench101464849, trench101464855, trench101464858, trench101464867, trench101464864, trench101464861, trench101464873, trench101464870, trench101464876, trench101464879, trench101464882, trench101464885, trench101464897, trench101464903, trench101464900, trench101464918, trench101464915, trench101464912, trench101464909, trench101464939, trench101464936, trench101464933, trench101464930, trench101464927, trench101464924, trench101464921, trench101464948, trench101464945, trench101464942, trench101464951, trench101464954, trench101464957, trench101464960, trench101464966, trench101464963, trench101464969, trench101464978, trench101464975, trench101464987, trench101464984, trench101464981, trench101464990, trench101464999, trench101464996, trench101464993, trench101465002, trench101465011, trench101465008, trench101465005, trench101465020, trench101465017, trench101465023, trench101465029, trench101465032, trench101465035, trench101465050, trench101465047, trench101465044, trench101465071, trench101465068, trench101465065, trench101465062, trench101465059, trench101465056, trench101465053, trench101465095, trench101465092, trench101465089, trench101465086, trench101465083, trench101465080, trench101465077, trench101465074, trench101465098, trench101465104, trench101465101, trench101465107, trench101465119, trench101465116, trench101465122, trench101465137, trench101465134, trench101465131, trench101465128, trench101465140, trench101465161, trench101465158, trench101465155, trench101465152, trench101465149, trench101465146, trench101465164, trench101465167, trench101465194, trench101465191, trench101465188, trench101465185, trench101465182, trench101465176, trench101465170, trench101465209, trench101465206, trench101465203, trench101465200, trench101465197, trench101465224, trench101465221, trench101465218, trench101465215, trench101465251, trench101465248, trench101465245, trench101465242, trench101465239, trench101465236, trench101465233, trench101465230, trench101465227, trench101465257, trench101465254, trench101465263, trench101465260, trench101465269, trench101465266, trench101465275, trench101465272, trench101465287, trench101465284, trench101465281, trench101465278, trench101465293, trench101465290, trench101465302, trench101465296, trench101465308, trench101465305, trench101465311, trench101465323, trench101465320, trench101465317, trench101465314, trench101465329, trench101465326, trench101465332, trench101465368, trench101465365, trench101465341, trench101465344, trench101465338, trench101465335, trench101465347, trench101465350, trench101465353, trench101465356, trench101465359, trench101465371, trench101465362, trench101465377, trench101465374, trench101465380, trench101465383, trench101465386, trench101465389, trench101465392, trench101465395, trench101465398, trench101723235, trench101723238, trench101723833, trench101723202, trench101724065, trench101724042, trench101724045, trench101724024, trench101724039, trench101723830, trench101723165, belgiumgsgs4042, belgiumgsgs4336, belgiumgsgs4040, cyprus_kitchener, jamaica, india_half_first_ed, india_half_second_ed, india_one_first_ed, india_one_second_ed, hongkongcollinson, world_arrowsmith, world_bartholomew, tsa_ALL, R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_maptiler_hillshade, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM]; 
		
		}
		
	else
		
		{
			
			
		var overlayLayersRightAll = [R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM, R_blank_layer, R_ossixinchfirstgreatbritain, R_oneinchgeology, R_twentyfive_inch_gloucester_wiltshire_somerset_britain, R_oneinch2nd, R_one_inch_2nd_hills, R_sixinch2, R_ostwentyfiveinchGreatBritain, R_bartgreatbritain, R_quarterinchfirsthills, R_quarterinchfirstoutline, R_OS1900sGB, R_os1900s_all_scales, R_sixinchgeology, R_oneinchthirdgbcolour,  R_OS25inchEdinburgh1914, R_OS25inchGloucester3rd, R_quarterinch, R_quarterinchcivilair, R_quarterinchfourth, R_twentyfivethousand, R_twentyfivethousandoutline, R_oneinchpopular_britain, R_halfinchmot, R_nls, R_halfinchoutlineblue, R_oneinchlanduse, R_landutilisationsurveygb, R_landutilisationsurveyengwal25kpub, R_bartgreatbritain1940s, R_airphotos1250, R_airphotos, R_scot1944_1966_group_great_britain, R_os1250_group_great_britain, R_os1250_scot_b, R_os1250_scot_c, R_os2500_group_great_britain, R_os2500_scot_b, R_os2500_scot_c, R_OS10knatgridgreat_britain, R_oneinchseventh, R_admin, R_coal_iron, R_farming, R_general, R_geological, R_iron_steel, R_land_classification, R_land_utilisation, R_limestone, R_physical, R_population_change_1921, R_population_change_1931, R_population_change_1939, R_population_density_1931, R_population_density_1951, R_railways, R_rainfall, R_roads_46, R_roads_56, R_royhighlands, R_roylowlands, R_hole1607, R_dorret1750, R_arrowsmith1807, R_sixinch, R_oneinchscotlandfirstcol, R_oneinch2ndscot, R_one_inch_2nd_hills_scot, R_sixinch2scot_api, R_os25inch1890s, R_os25inchblueandblacks, R_os25inchblueandblacksOS, R_oneinchthirdcolour, R_bartsurveyatlas, R_oneinchpopular, R_oneinchpopular_outline, R_barthalfinch, R_twentyfivethousandscot, R_gsgs3906, R_oneinchgsgs3908, R_scot1944_1966_group, R_os1250_group_great_britain_scot, R_os1250_scot_b_scot, R_os1250_scot_c_scot, R_os2500_group_great_britain_scot, R_os2500_scot_b_scot, R_os2500_scot_c_scot, R_oneinchnatgrid, R_oneinchnatgridoutline, R_oneinchgsgs4639, R_quarterinchadmin1950, R_oneinchsoils, R_OS10knatgridscot, R_oneinchseventhscot, R_quarterinchadmin1960, R_secondlandusescot, R_ch00000529, R_ch00000541, R_ch74400306, R_ch85449271, R_ch85449274, R_ch85449277, R_ch85449280, R_ch85449283, R_ch85449286, R_ch85449289, R_ch85449292, R_adch101942045, R_adch101942048, R_adch101942078, R_adch101942108, R_adch101942111, R_adch101942114, R_adch101942117, R_adch101942630, R_adch74412450, R_adch101942603, R_adch101942606, R_adch101942612, R_adch101942615, R_adch101942618, R_adch101942621, R_adch101942624, R_adch101942627, R_adch101942633, R_adch101942687, R_adch101942690, R_adch101942693, R_adch101942696, R_adch101942699, R_adch101942702, R_adch101942705, R_adch101942708, R_adch101942711, R_adch101942714, R_adch101942669, R_adch101942672, R_adch101942675, R_adch101942678, R_adch101942681, R_adch101942735, R_adch101942726, R_adch101942729, R_adch101942732, R_adch101942741, R_adch101942738, R_adch101942759, R_adch101942762, R_adch101943347, R_adch101942906_inset2, R_adch101942909_inset2, R_adch101942912_inset2, R_adch101942915_inset2, R_adch101942915_inset4, R_adch101942906_inset3, R_adch101942909_inset3, R_adch101942912_inset3, R_adch101942915_inset3, R_adch101942906_inset1, R_adch101942909_inset1, R_adch101942912_inset1, R_adch101942915_inset1, R_adch101942975, R_adch101942981, R_adch101942984, R_adch101942987, R_adch101942993, R_adch101942996, R_adch101943350, R_adch101943353, R_adch101943356, R_adch101943491, R_adch101943494, R_adch101943500, R_adch101943503, R_adch101943506, R_adch101943509, R_adch101943512, R_adch101944457, R_adch101944460, R_adch101944463, R_adch74401001, R_adch101944847_inset3, R_adch101944847_inset4, R_adch101944847_inset2, R_adch101944847_inset1, R_adch101944847_inset5, R_adch101944847_inset6, R_adch101944847_inset7, R_adch101944850_inset3, R_adch101944850_inset4, R_adch101944850_inset2, R_adch101944850_inset1, R_adch101944850_inset5, R_adch101944850_inset6, R_adch101944850_inset7, R_adch101944853_inset3, R_adch101944853_inset4, R_adch101944853_inset2, R_adch101944853_inset1, R_adch101944853_inset5, R_adch101944853_inset6, R_adch101944853_inset7, R_adch101944856_inset3, R_adch101944856_inset4, R_adch101944856_inset2, R_adch101944856_inset1, R_adch101944856_inset5, R_adch101944856_inset6, R_adch101944883, R_adch101944865, R_adch101944874, R_adch101944886, R_adch101944889, R_adch101944892, R_adch101944895, R_adch101945726, R_adch101945729, R_adch74400307, R_adch74400307_inset1, R_adch74400307_inset2, R_adch74400307_inset3, R_adch74400307_inset4, R_adch101946716, R_adch101946716_inset2, R_adch101946716_inset3, R_adch101946716_inset4, R_adch101946716_inset1, R_adch101946695_inset, R_adch101946695, R_adch101946698_inset, R_adch101946698, R_adch74401002, R_adch101947403_dunvegan, R_adch101947403_snizort, R_adch101947406, R_adch101947409, R_adch101947898, R_adch101947901, R_adch101947907, R_adch101947910, R_adch101947916, R_adch101947919, R_adch101947922, R_adch101947925, R_adch101947919_inset1, R_adch101947922_inset1, R_adch101947922_inset2, R_adch101947925_inset1, R_adch101947925_inset2, R_adch74401003, R_adch101948129, R_adch101948132, R_adch101948135, R_adch101948138, R_adch101948141, R_adch101948132_inset, R_adch101948135_inset, R_adch101948138_inset, R_adch101948141_inset, R_adch74401004, R_adch101948144, R_adch101948147, R_adch101948150, R_adch101948153, R_adch101948225, R_adch101948228, R_adch101948234, R_adch101948237, R_adch101948240, R_adch101948243, R_adch101948246, R_adch101948249, R_adch101948252, R_adch101948276, R_adch101948285, R_adch74412387, R_adch101948291, R_adch101948294, R_adch101948297, R_adch101948300, R_adch101948303, R_adch101948306, R_adch101948279, R_adch74400302, R_adch101948390, R_adch74401005, R_adch101948420_inset, R_adch101948420, R_adch101948423_inset, R_adch101948423, R_adch101948426_inset, R_adch101948426, R_adch101948429_inset, R_adch101948429, R_adch101948432_inset, R_adch101948432, R_adch101948435_inset, R_adch101948435, R_adch101948438_inset, R_adch101948438, R_adch101948441_inset, R_adch101948441, R_adch101948444_inset, R_adch101948444, R_adch101948504, R_adch101948507, R_adch101948510, R_adch101948513, R_adch101948516, R_adch101948510_inset, R_adch101948513_inset, R_adch101948516_inset, R_adch74412388, R_adch74412388_inset, R_adch101948543, R_adch74412457, R_adch74412457_inset, R_adch74413949, R_adch74412463, R_adch74401006_oban, R_adch74401006_troon, R_adch74401007, R_adch74401008, R_adch74401009, R_adch74401010, R_adch74401011, R_adch74401012, R_adch74401060, R_adch74401014, R_adch74401015, R_adch74401016, R_adch74401017, R_adch74412462, R_adch74400305, R_adch74412454, R_adch74401019, R_adch74401019_inset, R_adch74401020, R_adch74401022, R_adch74401023, R_adch74400296, R_adch74400296_inset1, R_adch74400296_inset2, R_adch74400296_inset3, R_adch74401025, R_adch74401026, R_adch74401027, R_adch74401028, R_adch74401029, R_adch74401030, R_adch74401031, R_adch74401032, R_adch74401033, R_adch74401034, R_adch74401035, R_adch74401036, R_adch74401037, R_adch74401000, R_adch74401000_inset, R_adch74412461, R_adch74401038, R_adch74401039, R_adch74400294, R_adch74401040, R_adch74401041, R_adch74401042, R_adch74401043, R_adch74401044, R_adch74401045, R_adch74401046, R_adch74401047, R_adch74401048, R_adch74401048_inset, R_adch74401049, R_adch74401052, R_adch74401053, R_adch74401053_inset, R_adch74401054, R_adch74401051, R_adch74401055, R_adch74401056, R_adch74412460, R_adch74401057, R_adch101961533, R_bathlochawenorth, R_bathlochawesouth, R_bathlochcluanie, R_bathlochdoon, R_bathlochduntelchaig, R_bathlochearn, R_bathlocherichtlower, R_bathlocherichtupper, R_bathlochfannich, R_bathlochgarryness, R_bathlochgarrytay, R_bathlochglass, R_bathlochharray, R_bathlochlaidon, R_bathlochleven, R_bathlochlomondnorth, R_bathlochlomondsouth, R_bathlochloyne, R_bathlochluichart, R_bathlochlyon, R_bathlochmhor, R_bathlochmonar, R_bathlochmullardoch, R_bathlochquoich, R_bathlochrannoch, R_bathlochshiellower, R_bathlochshielupper, R_bathlochshinlower, R_bathlochshinupper, R_bathlochtayeast, R_bathlochtaywest, R_bathlochtreig, R_bathlochtummel, R_county119952600, R_county74400145, R_county135908105, R_county74400334, R_estate121129476, R_estate121129386, R_estate121129410, R_estate121129416, R_estate121129419, R_estate132293752, R_estate129392884, R_estate132293758, R_estate121129389, R_estate121129413, R_estate129393076, R_estate129393010, R_estate129393148, R_estate114473788, R_estate114473785, R_estate103427429, R_estate129392971, R_estate129393253, R_estate125491577, R_estate121129473, R_estate121129458, R_estate110069086, R_estate132293749, R_estate132293755, R_estate129392983, R_estate129392986, R_estate129392989, R_estate129392992, R_estate129392995, R_estate129392911, R_estate121129434, R_estate129392908, R_estate114473773, R_estate110069083, R_estate129393019, R_estate129393103, R_estate129393049, R_estate110323727, R_estate132293842, R_estate121129461, R_estate110069080, R_estate103427459, R_estate103427450, R_estate103427447, R_estate129392893, R_estate129393328, R_estate129393580, R_estate121129443, R_estate121129392, R_estate129393397, R_estate129392887, R_estate121129464, R_estate132293743, R_estate129392947, R_estate129392950, R_estate106697318, R_estate129392935, R_estate132293857, R_estate106697324, R_estate129392887t, R_estate129393172, R_estate_balmaclellan, R_estate129393712, R_estate129393715, R_estate129393718, R_estate129393721, R_estate129393724, R_estate129393676, R_estate129393709, R_estate129393706, R_estate129393763, R_estate_earlstoun, R_estate125491588, R_estate129393664, R_estate132293782, R_estate129393778, R_estate129393754, R_estate129393745, R_estate125491585, R_estate129393751, R_estate125491597, R_estate129393583, R_estate129393661, R_estate106697330, R_estate106697333, R_estate106697336, R_estate106697339, R_estate125491591, R_estate125491601, R_estate114473887, R_estate106697342, R_estate129393769, R_estate125491594, R_estate114473800, R_estate114473809, R_estate114473806, R_estate114473794, R_estate114473797, R_estate114473815, R_estate125491581, R_estate114473830, R_estate114473845, R_estate114473854, R_estate114473824, R_estate114473836, R_estate114473842, R_estate114473848, R_estate114473851, R_estate114473839, R_estate114473827, R_estate129393667, R_estate129393016, R_estate129393076l, R_estate129393016c, R_estate74436591, R_aberdeen, R_aberdeen1879, R_aberdeen1883, R_aberdeen1895, R_aberdeen1902, R_aberdeen1905, R_aberdeen1915, R_airdrie, R_alexandria, R_alloa, R_annan, R_arbroath, R_ardhallow, R_ayr, R_barry, R_berwick, R_braefoot, R_brechin, R_burntisland, R_burntisland1824, R_campbeltown, R_campbeltown_goad, R_cloch, R_coatbridge, R_cramond, R_cupar1854, R_cupar1893, R_dalkeith1852, R_dalkeith1893, R_dreghorn, R_dumbarton, R_dumfries1850, R_dumfries1893, R_dundee_goad, R_dundee1857, R_dundee1870, R_dundee1882, R_dundee1888, R_dundee1891, R_dundee1892, R_dundee1893, R_dundee1897, R_dundee1900, R_dundee1903, R_dundee1906, R_dundee1908, R_dundee1910, R_dundee1911, R_dunfermline1854, R_dunfermline1893, R_edin_newington_1826, R_edin1765, R_edin1784, R_edin1804, R_edin1817, R_edin1819, R_edin1821, R_edin1822, R_edin1831, R_edin1832, R_edin1849, R_edin1865, R_edin1876, R_edin1882, R_edin1885, R_edin1888, R_edin1891, R_edin1892, R_edin1892b, R_edin1893, R_edin1902, R_edin1905, R_edin1907, R_edin1910, R_edin1912, R_edin1917, R_edin1918, R_edin1919, R_edin1932, R_edin1939, R_edin1944_1963, R_edinburgh_castle, R_edinburgh_goad, R_elgin, R_falkirk, R_forfar, R_forres, R_galashiels, R_girvan, R_glas1778, R_glas1807, R_glas1857, R_glas1882, R_glas1888, R_glas1891, R_glas1894, R_glas1895, R_glas1900, R_glas1905, R_glas1910, R_glas1914, R_glas1920, R_glas1925, R_glasgow_goad, R_glasgow1930, R_glasgow1936, R_greenock, R_greenock_goad, R_greenock1861, R_greenock1879, R_greenock1887, R_greenock1895, R_greenock1915, R_haddington1853, R_haddington1893, R_hamilton, R_hawick, R_inchcolm, R_inchkeith_2500, R_inchkeith_500, R_inchmickery, R_inverness, R_irvine, R_jedburgh, R_kelso, R_kilmarnock, R_kirkcaldy1855, R_kirkcaldy1894, R_kirkcudbright1850, R_kirkcudbright1893, R_kirkintilloch, R_kirriemuir, R_lanark, R_leith_goad, R_linlithgow, R_maybole, R_montrose, R_musselburgh1853, R_musselburgh1893, R_nairn, R_oban, R_ossixinchfirstengland, R_sixinchenglandwales, R_oneinchrevisedcolouredengland, R_oneinchthirdengwalcolour, R_OS25inchGloucester3rdengland, R_OS25inchGuildford, R_bartholomew_half_1919, R_twentyfivethousandengwal, R_oneinchpopular_england, R_oneinchpopular_outline_england, R_oneinchnewpop, R_landutilisationsurveyengwal25k, R_landutilisationsurveyengwalscapes, R_landutilisationsurveyengwalwildscapeveg, R_landutilisationsurveyengwalwildscapehab,  R_oneinchseventhengwal, R_OStownsALL, R_OStownsALL1056, R_OSTownsAberdare, R_OSTownsAbergavenny, R_OSTownsAberystwyth, R_OSTownsAbingdon, R_OStownsAccrington, R_OSTownsAccrington, R_OSTownsAldershot, R_OSTownsAlnwick, R_OStownsAlnwick2640, R_OSTownsAltrincham, R_OSTownsAndover, R_OSTownsAppleby, R_OSTownsAshford, R_OStownsAshton, R_OStownsAshton2, R_OSTownsAtherstone, R_OSTownsAylesbury, R_OStownsBacup, R_OSTownsBacup, R_OSTownsBanbury, R_OSTownsBangor, R_OStownsBarnsley, R_OSTownsBarnsley, R_OSTownsBarnstaple, R_OSTownsBarrowinFurness, R_OSTownsBasingstoke, R_OSTownsBath, R_OSTownsBatley, R_OSTownsBeccles, R_OSTownsBedford, R_OSTownsBelper, R_OSTownsBerkhamstead, R_OStownsBeverley, R_OSTownsBeverley, R_OSTownsBideford, R_OSTownsBiggleswade, R_OStownsBingley, R_OSTownsBingley, R_OSTownsBirkenhead, R_TownsBirmimgham1855, R_OSTownsBirmingham, R_OSTownsBirstal, R_OSTownsBishopAuckland, R_OSTownsBishopsStortford, R_OStownsBlackburn, R_OSTownsBlackburn, R_OSTownsBlackpool, R_OStownsBlyth, R_OSTownsBlyth, R_OSTownsBodmin, R_OStownsBolton, R_OSTownsBolton, R_OSTownsBoston, R_OSTownsBournemouth, R_OStownsBradford, R_OSTownsBradford, R_OSTownsBradfordonAvon, R_OSTownsBraintree, R_OSTownsBrentwood, R_OSTownsBridgnorth, R_OSTownsBridgwater, R_OStownsBridlington, R_OSTownsBridlington, R_OSTownsBridport, R_OSTownsBrierleyHill, R_OSTownsBrighouse, R_OSTownsBrighton, R_OSTownsBristol, R_OSTownsBrixham, R_OSTownsBromsgrove, R_OSTownsBuckingham, R_OStownsBurnley, R_OSTownsBurnley, R_OSTownsBurslem, R_OSTownsBurtonuponTrent, R_OStownsBury, R_OSTownsBury, R_OSTownsBuryStEdmunds, R_OSTownsBuxton, R_OSTownsCamborne, R_OSTownsCambridge, R_OSTownsCanterbury, R_OSTownsCardiff, R_OSTownsCarmarthen, R_OSTownsCarnarvon, R_OSTownsCastleford, R_OSTownsCheltenham, R_OSTownsChertsey, R_OSTownsChester, R_OSTownsChesterfield, R_OSTownsChesterton, R_OSTownsChichester, R_OSTownsChippenham, R_OStownsChorley, R_OSTownsChorley, R_OSTownsChowbent, R_OSTownsChristchurch, R_OSTownsCirencester, R_OSTownsClaytonleMoors, R_OSTownsCleckheaton, R_OSTownsClevedon, R_OStownsClitheroe, R_OSTownsCockermouth, R_OSTownsColchester, R_OStownsColne, R_OSTownsColne, R_OSTownsCongleton, R_OSTownsCoventry, R_OSTownsCrediton, R_OSTownsCrewe, R_OSTownsCrewkerne, R_OSTownsCroydon, R_OSTownsDaltoninFurness, R_OSTownsDarlaston, R_OStownsDarlington, R_OSTownsDartford, R_OSTownsDartmouth, R_OSTownsDarwen, R_OSTownsDawlish, R_OSTownsDeal, R_OSTownsDenbigh, R_OSTownsDerby, R_OSTownsDevizes, R_OStownsDewsbury, R_OStownsDoncaster, R_OSTownsDoncaster, R_OSTownsDorchester, R_OSTownsDorking, R_OSTownsDouglas, R_OSTownsDover, R_OSTownsDroitwich, R_OSTownsDudley, R_OSTownsDunstable, R_OSTownsDurham, R_OSTownsEastbourne, R_OSTownsEastDereham, R_OSTownsEastRetford, R_OSTownsEccles, R_OSTownsElland, R_OSTownsEly, R_OSTownsEvesham, R_OSTownsExeter, R_OSTownsExmouth, R_OSTownsFalmouth, R_OSTownsFarnham, R_OSTownsFarnworth, R_OSTownsFarsley, R_OSTownsFaversham, R_OStownsFleetwood, R_OSTownsFleetwood, R_OSTownsFolkestone, R_OSTownsFrome, R_OSTownsGainsborough, R_OSTownsGarston, R_OSTownsGlossop, R_OSTownsGloucester, R_OSTownsGodmanchester, R_OSTownsGoole, R_OSTownsGosport, R_OSTownsGrantham, R_OSTownsGravesend, R_OSTownsGreatDriffield, R_OSTownsGreatGrimsby, R_OSTownsGreatHarwood, R_OSTownsGreatMalvern, R_OSTownsGreatMarlow, R_OSTownsGreatYarmouth, R_OSTownsGuildford, R_OStownsHalifax, R_OSTownsHalifax, R_OSTownsHalstead, R_OSTownsHarrogate, R_OSTownsHartlepool, R_OSTownsHarwich, R_OStownsHaslingden, R_OSTownsHaslingden, R_OSTownsHastings, R_OSTownsHaverfordwest, R_OSTownsHebdenBridge, R_OSTownsHeckmondwike, R_OSTownsHemelHempstead, R_OSTownsHenleyonThames, R_OSTownsHereford, R_OSTownsHertford, R_OSTownsHexham, R_OStownsHeywood, R_OSTownsHeywood, R_OSTownsHighWycombe, R_OSTownsHinckley, R_OSTownsHindley, R_OSTownsHolyhead, R_OSTownsHolywell, R_OSTownsHorncastle, R_OSTownsHorsham, R_OSTownsHorwich, R_OStownsHowden, R_OSTownsHucknallTorkard, R_OStownsHuddersfield, R_OSTownsHuddersfield, R_OSTownsHuntingdon, R_OSTownsHyde, R_OSTownsIdle, R_OSTownsIlfracombe, R_OSTownsIlkeston, R_OSTownsIlkley, R_OSTownsIpswich, R_OStownsKeighley, R_OSTownsKeighley, R_OSTownsKendal, R_OSTownsKettering, R_OSTownsKidderminster, R_OSTownsKidsgrove, R_OSTownsKingsLynn, R_OStownsKingstonuponHull, R_OSTownsKingstonuponHull, R_OStownsKingstonuponThames, R_OStownsKnaresborough, R_OSTownsKnaresborough, R_OSTownsKnottingley, R_OSTownsLancaster, R_OStownsLancaster1056, R_OSTownsLeeds, R_OStownsLeeds1056, R_OSTownsLeek, R_OSTownsLeicester, R_OSTownsLeigh, R_OSTownsLeightonBuzzard, R_OSTownsLeominster, R_OSTownsLewes, R_OSTownsLichfield, R_OSTownsLincoln, R_OSTownsLiskeard, R_OSTownsLittleborough, R_OStownsLiverpool, R_OSTownsLiverpool, R_OSTownsLlandudno, R_OSTownsLlanelly, R_OStownsLondon5280, R_OStownsLondon, R_OStownsLondon1056, R_OSTownsLongEaton, R_OSTownsLoughborough, R_OSTownsLouth, R_OSTownsLowestoft, R_OSTownsLudlow, R_OSTownsLuton, R_OSTownsLymington, R_OSTownsLytham, R_OSTownsMacclesfield, R_OSTownsMaidenhead, R_OSTownsMaidstone, R_OSTownsMaldon, R_OStownsMalton, R_OStownsManchester, R_OSTownsManchesterandSalford, R_OSTownsMansfield, R_OSTownsMarch, R_OSTownsMargate, R_OSTownsMaryport, R_OSTownsMelcombeRegis, R_OSTownsMeltonMowbray, R_OSTownsMerthyrTydfil, R_OStownsMiddlesbrough, R_OSTownsMiddlesbrough, R_OStownsMiddleton, R_OSTownsMiddleton, R_OSTownsMirfield, R_OSTownsMold, R_OSTownsMonmouth, R_OSTownsMorecambe, R_OSTownsMorley, R_OSTownsMorpeth, R_OSTownsMossley, R_OSTownsNantwich, R_OSTownsNeath, R_OSTownsNelson, R_OSTownsNewark, R_OSTownsNewbury, R_OSTownsNewcastle1894, R_OSTownsNewcastle1900s, R_OSTownsNewMalton, R_OSTownsNewmarket, R_OSTownsNewport, R_OSTownsNewportIsleofWight, R_OSTownsNewtonAbbot, R_OSTownsNewtown, R_OSTownsNorthampton, R_OSTownsNorthwich, R_OSTownsNorwich, R_OSTownsNottingham, R_OSTownsNuneaton, R_OSTownsOldbury, R_OSTownsOldham, R_OStownsOrmskirk, R_OSTownsOrmskirk, R_OSTownsOswestry, R_OSTownsOtley, R_OSTownsOxford, R_OSTownsPadiham, R_OSTownsPembroke, R_OSTownsPembrokeDock, R_OSTownsPenrith, R_OSTownsPenzance, R_OSTownsPeterborough, R_OSTownsPetersfield, R_OSTownsPetworth, R_OSTownsPlumstead, R_OStownsPlymouth1850s, R_OStownsPontefract, R_OSTownsPontefract, R_OSTownsPontypool, R_OSTownsPoole, R_OSTownsPortsmouth, R_OStownsPrescot, R_OSTownsPrescot, R_OStownsPreston, R_OSTownsPreston, R_OSTownsRamsbottom, R_OSTownsRamsey, R_OSTownsRamsgate, R_OSTownsRavensthorpe, R_OSTownsRawtenstall, R_OSTownsReading, R_OSTownsRedditch, R_OSTownsRedhill, R_OSTownsRedruth, R_OSTownsReigate, R_OSTownsRhyl, R_OStownsRichmond, R_OSTownsRichmond, R_OStownsRipon, R_OSTownsRipon, R_OSTownsRishton, R_OStownsRochdale, R_OSTownsRochdale, R_OSTownsRochester, R_OSTownsRomford, R_OSTownsRomsey, R_OStownsRotherham, R_OSTownsRotherham, R_OSTownsRoyalLemingtonSpa, R_OSTownsRoyton, R_OSTownsRugby, R_OSTownsRuncorn, R_OSTownsRyde, R_OSTownsRye, R_OSTownsSaffronWalden, R_OSTownsSalisbury, R_OSTownsSandwich, R_OStownsScarborough, R_OSTownsScarborough, R_OStownsSelby, R_OSTownsSelby, R_OSTownsSevenoaks, R_OStownsSheffield, R_OSTownsSheffield, R_OSTownsSheptonMallet, R_OSTownsSherborne, R_OSTownsShipley, R_OSTownsShrewsbury, R_OStownsSkipton, R_OSTownsSkipton, R_OSTownsSleaford, R_OSTownsSlough, R_OSTownsSouthampton, R_OSTownsSouthport, R_OSTownsSowerbyBridge, R_OSTownsSpalding, R_OStownsSt_Helens, R_OSTownsStafford, R_OSTownsStamford, R_OSTownsStAustell, R_OSTownsStHelens, R_OSTownsStIves, R_OStownsStockport, R_OStownsStockport2, R_OSTownsStocktonuponTees, R_OStownsStockton1890s, R_OSTownsStone, R_OSTownsStourbridge, R_OSTownsStowmarket, R_OSTownsStratfordonAvon, R_OSTownsStroud, R_OSTownsSudbury, R_OSTownsSuttoninAshfield, R_OSTownsSwansea, R_OSTownsSwindon, R_OSTownsSwinton, R_OSTownsTamworth, R_OSTownsTaunton, R_OSTownsTavistock, R_OSTownsTenby, R_OSTownsTewkesbury, R_OSTownsThetford, R_OSTownsTiverton, R_OStownsTodmorden, R_OSTownsTodmorden, R_OSTownsTonbridge, R_OSTownsTorquay, R_OSTownsTotnes, R_OSTownsTring, R_OSTownsTrowbridge, R_OSTownsTruro, R_OSTownsTunbridgeWells, R_OSTownsTyldesley, R_OSTownsTyneside, R_OStownsTyneside1890s, R_OStownsUlverston, R_OSTownsUlverston, R_OStownsWakefield, R_OSTownsWakefield, R_OSTownsWallsend, R_OSTownsWalsall, R_OSTownsWalthamAbbey, R_OSTownsWare, R_OSTownsWarminster, R_OStownsWarrington, R_OSTownsWarrington, R_OSTownsWarwick, R_OSTownsWatford, R_OSTownsWednesbury, R_OSTownsWellingborough, R_OSTownsWellington, R_OSTownsWells, R_OSTownsWelshpool, R_OSTownsWestBromwich, R_OSTownsWestCowes, R_OSTownsWestonsuperMare, R_OSTownsWeymouth, R_OStownsWhitby, R_OSTownsWhitby, R_OSTownsWhitchurch, R_OSTownsWhitehaven, R_OSTownsWidnes, R_OStownsWigan, R_OSTownsWigan, R_OSTownsWinchester, R_OStownsWindsor, R_OSTownsWisbech, R_OSTownsWithington, R_OSTownsWokingham, R_OSTownsWolverhampton, R_OSTownsWorcester, R_OSTownsWorksop, R_OSTownsWorthing, R_OSTownsYeovil, R_OStownsYork, R_OSTownsYork, R_paisley, R_paisley_goad, R_peebles, R_perth1716, R_perth1783, R_perth1823, R_perth1827, R_perth1832, R_perth1860, R_perth1860b, R_perth1893, R_perth1895, R_perth1901, R_perth1902, R_perth1907, R_perth1912, R_perth1933, R_peterhead, R_portglasgow, R_portkil, R_portobello, R_rothesay, R_selkirk, R_standrews1854, R_standrews1893, R_stirling, R_stonehaven, R_stranraer1847, R_stranraer1867, R_stranraer1893, R_strathaven, R_wick, R_wigtown1848, R_wigtown1894, R_county_chester_1794, R_county_cumberland_1823, R_county_durham_1819, R_county_lancashire_1828, R_county_lincolnshire_1828, R_county_westmorland_1823, R_county_yorkshire_1828, R_london_gsgs4157, R_greatbritain50k, R_irelandbart, R_irelandgsgs, R_channel_islands_town_plans, R_os2500_group_great_britain_channel_islands, R_sixinch2_channel_islands, R_channel_islands_six_inch_1960s, R_channel_islands_two_inch, R_channel_islands_three_inch, R_trench101723168, R_trench101723205, R_trench101723208, R_trench101723211, R_trench101723214, R_trench101724055, R_trench101723220, R_trench101723223, R_trench101723229, R_trench101724060, R_trench101723232, R_trench101724050, R_trench101724027, R_trench101724030, R_trench101723171, R_trench101723174, R_trench101723196, R_trench101723217, R_trench101723199, R_trench101724033, R_trench101724036, R_trench101464585, R_trench101464588, R_trench101464591, R_trench101464594, R_trench101464609, R_trench101464612, R_trench101464615, R_trench101464618, R_trench101464630, R_trench101464627, R_trench101464639, R_trench101464642, R_trench101464645, R_trench101464636, R_trench101464681, R_trench101464684, R_trench101464687, R_trench101464648, R_trench101464651, R_trench101464654, R_trench101464657, R_trench101464660, R_trench101464663, R_trench101464666, R_trench101464669, R_trench101464672, R_trench101464675, R_trench101464693, R_trench101464696, R_trench101464705, R_trench101464708, R_trench101464711, R_trench101464714, R_trench101464699, R_trench101464702, R_trench101464726, R_trench101464729, R_trench101464732, R_trench101464735, R_trench101464738, R_trench101464741, R_trench101464744, R_trench101464747, R_trench101464750, R_trench101464753, R_trench101464756, R_trench101464759, R_trench101464762, R_trench101464765, R_trench101464768, R_trench101464765, R_trench101464774, R_trench101464777, R_trench101464780, R_trench101464783, R_trench101464771, R_trench101464786, R_trench101464789, R_trench101464792, R_trench101464795, R_trench101464798, R_trench101464801, R_trench101464804, R_trench101464807, R_trench101464810, R_trench101464813, R_trench101464816, R_trench101464822, R_trench101464825, R_trench101464828, R_trench101464831, R_trench101724021, R_trench101723247, R_trench101723250, R_trench101723253, R_trench101464837, R_trench101464834, R_trench101464840, R_trench101464846, R_trench101464843, R_trench101464849, R_trench101464855, R_trench101464858, R_trench101464867, R_trench101464864, R_trench101464861, R_trench101464873, R_trench101464870, R_trench101464876, R_trench101464879, R_trench101464882, R_trench101464885, R_trench101464897, R_trench101464903, R_trench101464900, R_trench101464918, R_trench101464915, R_trench101464912, R_trench101464909, R_trench101464939, R_trench101464936, R_trench101464933, R_trench101464930, R_trench101464927, R_trench101464924, R_trench101464921, R_trench101464948, R_trench101464945, R_trench101464942, R_trench101464951, R_trench101464954, R_trench101464957, R_trench101464960, R_trench101464966, R_trench101464963, R_trench101464969, R_trench101464978, R_trench101464975, R_trench101464987, R_trench101464984, R_trench101464981, R_trench101464990, R_trench101464999, R_trench101464996, R_trench101464993, R_trench101465002, R_trench101465011, R_trench101465008, R_trench101465005, R_trench101465020, R_trench101465017, R_trench101465023, R_trench101465029, R_trench101465032, R_trench101465035, R_trench101465050, R_trench101465047, R_trench101465044, R_trench101465071, R_trench101465068, R_trench101465065, R_trench101465062, R_trench101465059, R_trench101465056, R_trench101465053, R_trench101465095, R_trench101465092, R_trench101465089, R_trench101465086, R_trench101465083, R_trench101465080, R_trench101465077, R_trench101465074, R_trench101465098, R_trench101465104, R_trench101465101, R_trench101465107, R_trench101465119, R_trench101465116, R_trench101465122, R_trench101465137, R_trench101465134, R_trench101465131, R_trench101465128, R_trench101465140, R_trench101465161, R_trench101465158, R_trench101465155, R_trench101465152, R_trench101465149, R_trench101465146, R_trench101465164, R_trench101465167, R_trench101465194, R_trench101465191, R_trench101465188, R_trench101465185, R_trench101465182, R_trench101465176, R_trench101465170, R_trench101465209, R_trench101465206, R_trench101465203, R_trench101465200, R_trench101465197, R_trench101465224, R_trench101465221, R_trench101465218, R_trench101465215, R_trench101465251, R_trench101465248, R_trench101465245, R_trench101465242, R_trench101465239, R_trench101465236, R_trench101465233, R_trench101465230, R_trench101465227, R_trench101465257, R_trench101465254, R_trench101465263, R_trench101465260, R_trench101465269, R_trench101465266, R_trench101465275, R_trench101465272, R_trench101465287, R_trench101465284, R_trench101465281, R_trench101465278, R_trench101465293, R_trench101465290, R_trench101465302, R_trench101465296, R_trench101465308, R_trench101465305, R_trench101465311, R_trench101465323, R_trench101465320, R_trench101465317, R_trench101465314, R_trench101465329, R_trench101465326, R_trench101465332, R_trench101465368, R_trench101465365, R_trench101465341, R_trench101465344, R_trench101465338, R_trench101465335, R_trench101465347, R_trench101465350, R_trench101465353, R_trench101465356, R_trench101465359, R_trench101465371, R_trench101465362, R_trench101465377, R_trench101465374, R_trench101465380, R_trench101465383, R_trench101465386, R_trench101465389, R_trench101465392, R_trench101465395, R_trench101465398, R_trench101723235, R_trench101723238, R_trench101723833, R_trench101723202, R_trench101724065, R_trench101724042, R_trench101724045, R_trench101724024, R_trench101724039, R_trench101723830, R_trench101723165, R_belgiumgsgs4042, R_belgiumgsgs4336, R_belgiumgsgs4040, R_cyprus_kitchener, R_jamaica, R_india_half_first_ed, R_india_half_second_ed, R_india_one_first_ed, R_india_one_second_ed, R_hongkongcollinson, R_world_arrowsmith, R_world_bartholomew, R_tsa_ALL ]; 

	var overlayLayersRight = [R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM, R_blank_layer, R_ossixinchfirstgreatbritain, R_oneinchgeology, R_twentyfive_inch_gloucester_wiltshire_somerset_britain, R_oneinch2nd, R_one_inch_2nd_hills, R_sixinch2, R_ostwentyfiveinchGreatBritain, R_bartgreatbritain, R_quarterinchfirsthills, R_quarterinchfirstoutline, R_OS1900sGB, R_os1900s_all_scales, R_sixinchgeology, R_oneinchthirdgbcolour,  R_OS25inchEdinburgh1914, R_OS25inchGloucester3rd, R_quarterinch, R_quarterinchcivilair, R_quarterinchfourth, R_twentyfivethousand, R_twentyfivethousandoutline, R_oneinchpopular_britain, R_halfinchmot, R_nls, R_halfinchoutlineblue, R_oneinchlanduse, R_landutilisationsurveygb,, R_landutilisationsurveyengwal25kpub, R_bartgreatbritain1940s, R_airphotos1250, R_airphotos, R_scot1944_1966_group_great_britain, R_os1250_group_great_britain, R_os1250_scot_b, R_os1250_scot_c, R_os2500_group_great_britain, R_os2500_scot_b, R_os2500_scot_c, R_OS10knatgridgreat_britain, R_oneinchseventh, R_admin, R_coal_iron, R_farming, R_general, R_geological, R_iron_steel, R_land_classification, R_land_utilisation, R_limestone, R_physical, R_population_change_1921, R_population_change_1931, R_population_change_1939, R_population_density_1931, R_population_density_1951, R_railways, R_rainfall, R_roads_46, R_roads_56, R_royhighlands, R_roylowlands, R_hole1607, R_dorret1750, R_arrowsmith1807, R_sixinch, R_oneinchscotlandfirstcol, R_oneinch2ndscot, R_one_inch_2nd_hills_scot, R_sixinch2scot_api, R_os25inch1890s, R_os25inchblueandblacks, R_os25inchblueandblacksOS, R_oneinchthirdcolour, R_bartsurveyatlas, R_oneinchpopular, R_oneinchpopular_outline, R_barthalfinch, R_twentyfivethousandscot, R_gsgs3906, R_oneinchgsgs3908, R_scot1944_1966_group, R_os1250_group_great_britain_scot, R_os1250_scot_b_scot, R_os1250_scot_c_scot, R_os2500_group_great_britain_scot, R_os2500_scot_b_scot, R_os2500_scot_c_scot, R_oneinchnatgrid, R_oneinchnatgridoutline, R_oneinchgsgs4639, R_quarterinchadmin1950, R_oneinchsoils, R_OS10knatgridscot, R_oneinchseventhscot, R_quarterinchadmin1960, R_secondlandusescot, R_ch00000529, R_ch00000541, R_ch74400306, R_ch85449271, R_ch85449274, R_ch85449277, R_ch85449280, R_ch85449283, R_ch85449286, R_ch85449289, R_ch85449292, R_adch101942045, R_adch101942048, R_adch101942078, R_adch101942108, R_adch101942111, R_adch101942114, R_adch101942117, R_adch101942630, R_adch74412450, R_adch101942603, R_adch101942606, R_adch101942612, R_adch101942615, R_adch101942618, R_adch101942621, R_adch101942624, R_adch101942627, R_adch101942633, R_adch101942687, R_adch101942690, R_adch101942693, R_adch101942696, R_adch101942699, R_adch101942702, R_adch101942705, R_adch101942708, R_adch101942711, R_adch101942714, R_adch101942669, R_adch101942672, R_adch101942675, R_adch101942678, R_adch101942681, R_adch101942735, R_adch101942726, R_adch101942729, R_adch101942732, R_adch101942741, R_adch101942738, R_adch101942759, R_adch101942762, R_adch101943347, R_adch101942906_inset2, R_adch101942909_inset2, R_adch101942912_inset2, R_adch101942915_inset2, R_adch101942915_inset4, R_adch101942906_inset3, R_adch101942909_inset3, R_adch101942912_inset3, R_adch101942915_inset3, R_adch101942906_inset1, R_adch101942909_inset1, R_adch101942912_inset1, R_adch101942915_inset1, R_adch101942975, R_adch101942981, R_adch101942984, R_adch101942987, R_adch101942993, R_adch101942996, R_adch101943350, R_adch101943353, R_adch101943356, R_adch101943491, R_adch101943494, R_adch101943500, R_adch101943503, R_adch101943506, R_adch101943509, R_adch101943512, R_adch101944457, R_adch101944460, R_adch101944463, R_adch74401001, R_adch101944847_inset3, R_adch101944847_inset4, R_adch101944847_inset2, R_adch101944847_inset1, R_adch101944847_inset5, R_adch101944847_inset6, R_adch101944847_inset7, R_adch101944850_inset3, R_adch101944850_inset4, R_adch101944850_inset2, R_adch101944850_inset1, R_adch101944850_inset5, R_adch101944850_inset6, R_adch101944850_inset7, R_adch101944853_inset3, R_adch101944853_inset4, R_adch101944853_inset2, R_adch101944853_inset1, R_adch101944853_inset5, R_adch101944853_inset6, R_adch101944853_inset7, R_adch101944856_inset3, R_adch101944856_inset4, R_adch101944856_inset2, R_adch101944856_inset1, R_adch101944856_inset5, R_adch101944856_inset6, R_adch101944883, R_adch101944865, R_adch101944874, R_adch101944886, R_adch101944889, R_adch101944892, R_adch101944895, R_adch101945726, R_adch101945729, R_adch74400307, R_adch74400307_inset1, R_adch74400307_inset2, R_adch74400307_inset3, R_adch74400307_inset4, R_adch101946716, R_adch101946716_inset2, R_adch101946716_inset3, R_adch101946716_inset4, R_adch101946716_inset1, R_adch101946695_inset, R_adch101946695, R_adch101946698_inset, R_adch101946698, R_adch74401002, R_adch101947403_dunvegan, R_adch101947403_snizort, R_adch101947406, R_adch101947409, R_adch101947898, R_adch101947901, R_adch101947907, R_adch101947910, R_adch101947916, R_adch101947919, R_adch101947922, R_adch101947925, R_adch101947919_inset1, R_adch101947922_inset1, R_adch101947922_inset2, R_adch101947925_inset1, R_adch101947925_inset2, R_adch74401003, R_adch101948129, R_adch101948132, R_adch101948135, R_adch101948138, R_adch101948141, R_adch101948132_inset, R_adch101948135_inset, R_adch101948138_inset, R_adch101948141_inset, R_adch74401004, R_adch101948144, R_adch101948147, R_adch101948150, R_adch101948153, R_adch101948225, R_adch101948228, R_adch101948234, R_adch101948237, R_adch101948240, R_adch101948243, R_adch101948246, R_adch101948249, R_adch101948252, R_adch101948276, R_adch101948285, R_adch74412387, R_adch101948291, R_adch101948294, R_adch101948297, R_adch101948300, R_adch101948303, R_adch101948306, R_adch101948279, R_adch74400302, R_adch101948390, R_adch74401005, R_adch101948420_inset, R_adch101948420, R_adch101948423_inset, R_adch101948423, R_adch101948426_inset, R_adch101948426, R_adch101948429_inset, R_adch101948429, R_adch101948432_inset, R_adch101948432, R_adch101948435_inset, R_adch101948435, R_adch101948438_inset, R_adch101948438, R_adch101948441_inset, R_adch101948441, R_adch101948444_inset, R_adch101948444, R_adch101948504, R_adch101948507, R_adch101948510, R_adch101948513, R_adch101948516, R_adch101948510_inset, R_adch101948513_inset, R_adch101948516_inset, R_adch74412388, R_adch74412388_inset, R_adch101948543, R_adch74412457, R_adch74412457_inset, R_adch74413949, R_adch74412463, R_adch74401006_oban, R_adch74401006_troon, R_adch74401007, R_adch74401008, R_adch74401009, R_adch74401010, R_adch74401011, R_adch74401012, R_adch74401060, R_adch74401014, R_adch74401015, R_adch74401016, R_adch74401017, R_adch74412462, R_adch74400305, R_adch74412454, R_adch74401019, R_adch74401019_inset, R_adch74401020, R_adch74401022, R_adch74401023, R_adch74400296, R_adch74400296_inset1, R_adch74400296_inset2, R_adch74400296_inset3, R_adch74401025, R_adch74401026, R_adch74401027, R_adch74401028, R_adch74401029, R_adch74401030, R_adch74401031, R_adch74401032, R_adch74401033, R_adch74401034, R_adch74401035, R_adch74401036, R_adch74401037, R_adch74401000, R_adch74401000_inset, R_adch74412461, R_adch74401038, R_adch74401039, R_adch74400294, R_adch74401040, R_adch74401041, R_adch74401042, R_adch74401043, R_adch74401044, R_adch74401045, R_adch74401046, R_adch74401047, R_adch74401048, R_adch74401048_inset, R_adch74401049, R_adch74401052, R_adch74401053, R_adch74401053_inset, R_adch74401054, R_adch74401051, R_adch74401055, R_adch74401056, R_adch74412460, R_adch74401057, R_adch101961533, R_bathlochawenorth, R_bathlochawesouth, R_bathlochcluanie, R_bathlochdoon, R_bathlochduntelchaig, R_bathlochearn, R_bathlocherichtlower, R_bathlocherichtupper, R_bathlochfannich, R_bathlochgarryness, R_bathlochgarrytay, R_bathlochglass, R_bathlochharray, R_bathlochlaidon, R_bathlochleven, R_bathlochlomondnorth, R_bathlochlomondsouth, R_bathlochloyne, R_bathlochluichart, R_bathlochlyon, R_bathlochmhor, R_bathlochmonar, R_bathlochmullardoch, R_bathlochquoich, R_bathlochrannoch, R_bathlochshiellower, R_bathlochshielupper, R_bathlochshinlower, R_bathlochshinupper, R_bathlochtayeast, R_bathlochtaywest, R_bathlochtreig, R_bathlochtummel, R_county119952600, R_county74400145, R_county135908105, R_county74400334, R_estate121129476, R_estate121129386, R_estate121129410, R_estate121129416, R_estate121129419, R_estate132293752, R_estate129392884, R_estate132293758, R_estate121129389, R_estate121129413, R_estate129393076, R_estate129393010, R_estate129393148, R_estate114473788, R_estate114473785, R_estate103427429, R_estate129392971, R_estate129393253, R_estate125491577, R_estate121129473, R_estate121129458, R_estate110069086, R_estate132293749, R_estate132293755, R_estate129392983, R_estate129392986, R_estate129392989, R_estate129392992, R_estate129392995, R_estate129392911, R_estate121129434, R_estate129392908, R_estate114473773, R_estate110069083, R_estate129393019, R_estate129393103, R_estate129393049, R_estate110323727, R_estate132293842, R_estate121129461, R_estate110069080, R_estate103427459, R_estate103427450, R_estate103427447, R_estate129392893, R_estate129393328, R_estate129393580, R_estate121129443, R_estate121129392, R_estate129393397, R_estate129392887, R_estate121129464, R_estate132293743, R_estate129392947, R_estate129392950, R_estate106697318, R_estate129392935, R_estate132293857, R_estate106697324, R_estate129392887t, R_estate129393172, R_estate_balmaclellan, R_estate129393712, R_estate129393715, R_estate129393718, R_estate129393721, R_estate129393724, R_estate129393676, R_estate129393709, R_estate129393706, R_estate129393763, R_estate_earlstoun, R_estate125491588, R_estate129393664, R_estate132293782, R_estate129393778, R_estate129393754, R_estate129393745, R_estate125491585, R_estate129393751, R_estate125491597, R_estate129393583, R_estate129393661, R_estate106697330, R_estate106697333, R_estate106697336, R_estate106697339, R_estate125491591, R_estate125491601, R_estate114473887, R_estate106697342, R_estate129393769, R_estate125491594, R_estate114473800, R_estate114473809, R_estate114473806, R_estate114473794, R_estate114473797, R_estate114473815, R_estate125491581, R_estate114473830, R_estate114473845, R_estate114473854, R_estate114473824, R_estate114473836, R_estate114473842, R_estate114473848, R_estate114473851, R_estate114473839, R_estate114473827, R_estate129393667, R_estate129393016, R_estate129393076l, R_estate129393016c, R_estate74436591, R_aberdeen, R_aberdeen1879, R_aberdeen1883, R_aberdeen1895, R_aberdeen1902, R_aberdeen1905, R_aberdeen1915, R_airdrie, R_alexandria, R_alloa, R_annan, R_arbroath, R_ardhallow, R_ayr, R_barry, R_berwick, R_braefoot, R_brechin, R_burntisland, R_burntisland1824, R_campbeltown, R_campbeltown_goad, R_cloch, R_coatbridge, R_cramond, R_cupar1854, R_cupar1893, R_dalkeith1852, R_dalkeith1893, R_dreghorn, R_dumbarton, R_dumfries1850, R_dumfries1893, R_dundee_goad, R_dundee1857, R_dundee1870, R_dundee1882, R_dundee1888, R_dundee1891, R_dundee1892, R_dundee1893, R_dundee1897, R_dundee1900, R_dundee1903, R_dundee1906, R_dundee1908, R_dundee1910, R_dundee1911, R_dunfermline1854, R_dunfermline1893, R_edin_newington_1826, R_edin1765, R_edin1784, R_edin1804, R_edin1817, R_edin1819, R_edin1821, R_edin1822, R_edin1831, R_edin1832, R_edin1849, R_edin1865, R_edin1876, R_edin1882, R_edin1885, R_edin1888, R_edin1891, R_edin1892, R_edin1892b, R_edin1893, R_edin1902, R_edin1905, R_edin1907, R_edin1910, R_edin1912, R_edin1917, R_edin1918, R_edin1919, R_edin1932, R_edin1939, R_edin1944_1963, R_edinburgh_castle, R_edinburgh_goad, R_elgin, R_falkirk, R_forfar, R_forres, R_galashiels, R_girvan, R_glas1778, R_glas1807, R_glas1857, R_glas1882, R_glas1888, R_glas1891, R_glas1894, R_glas1895, R_glas1900, R_glas1905, R_glas1910, R_glas1914, R_glas1920, R_glas1925, R_glasgow_goad, R_glasgow1930, R_glasgow1936, R_greenock, R_greenock_goad, R_greenock1861, R_greenock1879, R_greenock1887, R_greenock1895, R_greenock1915, R_haddington1853, R_haddington1893, R_hamilton, R_hawick, R_inchcolm, R_inchkeith_2500, R_inchkeith_500, R_inchmickery, R_inverness, R_irvine, R_jedburgh, R_kelso, R_kilmarnock, R_kirkcaldy1855, R_kirkcaldy1894, R_kirkcudbright1850, R_kirkcudbright1893, R_kirkintilloch, R_kirriemuir, R_lanark, R_leith_goad, R_linlithgow, R_maybole, R_montrose, R_musselburgh1853, R_musselburgh1893, R_nairn, R_oban, R_ossixinchfirstengland, R_sixinchenglandwales, R_oneinchrevisedcolouredengland, R_oneinchthirdengwalcolour, R_OS25inchGloucester3rdengland, R_OS25inchGuildford, R_bartholomew_half_1919, R_twentyfivethousandengwal, R_oneinchpopular_england, R_oneinchpopular_outline_england, R_oneinchnewpop, R_landutilisationsurveyengwal25k, R_landutilisationsurveyengwalscapes, R_landutilisationsurveyengwalwildscapeveg, R_landutilisationsurveyengwalwildscapehab,  R_oneinchseventhengwal, R_OStownsALL, R_OStownsALL1056, R_OSTownsAberdare, R_OSTownsAbergavenny, R_OSTownsAberystwyth, R_OSTownsAbingdon, R_OStownsAccrington, R_OSTownsAccrington, R_OSTownsAldershot, R_OSTownsAlnwick, R_OStownsAlnwick2640, R_OSTownsAltrincham, R_OSTownsAndover, R_OSTownsAppleby, R_OSTownsAshford, R_OStownsAshton, R_OStownsAshton2, R_OSTownsAtherstone, R_OSTownsAylesbury, R_OStownsBacup, R_OSTownsBacup, R_OSTownsBanbury, R_OSTownsBangor, R_OStownsBarnsley, R_OSTownsBarnsley, R_OSTownsBarnstaple, R_OSTownsBarrowinFurness, R_OSTownsBasingstoke, R_OSTownsBath, R_OSTownsBatley, R_OSTownsBeccles, R_OSTownsBedford, R_OSTownsBelper, R_OSTownsBerkhamstead, R_OStownsBeverley, R_OSTownsBeverley, R_OSTownsBideford, R_OSTownsBiggleswade, R_OStownsBingley, R_OSTownsBingley, R_OSTownsBirkenhead, R_TownsBirmimgham1855, R_OSTownsBirmingham, R_OSTownsBirstal, R_OSTownsBishopAuckland, R_OSTownsBishopsStortford, R_OStownsBlackburn, R_OSTownsBlackburn, R_OSTownsBlackpool, R_OStownsBlyth, R_OSTownsBlyth, R_OSTownsBodmin, R_OStownsBolton, R_OSTownsBolton, R_OSTownsBoston, R_OSTownsBournemouth, R_OStownsBradford, R_OSTownsBradford, R_OSTownsBradfordonAvon, R_OSTownsBraintree, R_OSTownsBrentwood, R_OSTownsBridgnorth, R_OSTownsBridgwater, R_OStownsBridlington, R_OSTownsBridlington, R_OSTownsBridport, R_OSTownsBrierleyHill, R_OSTownsBrighouse, R_OSTownsBrighton, R_OSTownsBristol, R_OSTownsBrixham, R_OSTownsBromsgrove, R_OSTownsBuckingham, R_OStownsBurnley, R_OSTownsBurnley, R_OSTownsBurslem, R_OSTownsBurtonuponTrent, R_OStownsBury, R_OSTownsBury, R_OSTownsBuryStEdmunds, R_OSTownsBuxton, R_OSTownsCamborne, R_OSTownsCambridge, R_OSTownsCanterbury, R_OSTownsCardiff, R_OSTownsCarmarthen, R_OSTownsCarnarvon, R_OSTownsCastleford, R_OSTownsCheltenham, R_OSTownsChertsey, R_OSTownsChester, R_OSTownsChesterfield, R_OSTownsChesterton, R_OSTownsChichester, R_OSTownsChippenham, R_OStownsChorley, R_OSTownsChorley, R_OSTownsChowbent, R_OSTownsChristchurch, R_OSTownsCirencester, R_OSTownsClaytonleMoors, R_OSTownsCleckheaton, R_OSTownsClevedon, R_OStownsClitheroe, R_OSTownsCockermouth, R_OSTownsColchester, R_OStownsColne, R_OSTownsColne, R_OSTownsCongleton, R_OSTownsCoventry, R_OSTownsCrediton, R_OSTownsCrewe, R_OSTownsCrewkerne, R_OSTownsCroydon, R_OSTownsDaltoninFurness, R_OSTownsDarlaston, R_OStownsDarlington, R_OSTownsDartford, R_OSTownsDartmouth, R_OSTownsDarwen, R_OSTownsDawlish, R_OSTownsDeal, R_OSTownsDenbigh, R_OSTownsDerby, R_OSTownsDevizes, R_OStownsDewsbury, R_OStownsDoncaster, R_OSTownsDoncaster, R_OSTownsDorchester, R_OSTownsDorking, R_OSTownsDouglas, R_OSTownsDover, R_OSTownsDroitwich, R_OSTownsDudley, R_OSTownsDunstable, R_OSTownsDurham, R_OSTownsEastbourne, R_OSTownsEastDereham, R_OSTownsEastRetford, R_OSTownsEccles, R_OSTownsElland, R_OSTownsEly, R_OSTownsEvesham, R_OSTownsExeter, R_OSTownsExmouth, R_OSTownsFalmouth, R_OSTownsFarnham, R_OSTownsFarnworth, R_OSTownsFarsley, R_OSTownsFaversham, R_OStownsFleetwood, R_OSTownsFleetwood, R_OSTownsFolkestone, R_OSTownsFrome, R_OSTownsGainsborough, R_OSTownsGarston, R_OSTownsGlossop, R_OSTownsGloucester, R_OSTownsGodmanchester, R_OSTownsGoole, R_OSTownsGosport, R_OSTownsGrantham, R_OSTownsGravesend, R_OSTownsGreatDriffield, R_OSTownsGreatGrimsby, R_OSTownsGreatHarwood, R_OSTownsGreatMalvern, R_OSTownsGreatMarlow, R_OSTownsGreatYarmouth, R_OSTownsGuildford, R_OStownsHalifax, R_OSTownsHalifax, R_OSTownsHalstead, R_OSTownsHarrogate, R_OSTownsHartlepool, R_OSTownsHarwich, R_OStownsHaslingden, R_OSTownsHaslingden, R_OSTownsHastings, R_OSTownsHaverfordwest, R_OSTownsHebdenBridge, R_OSTownsHeckmondwike, R_OSTownsHemelHempstead, R_OSTownsHenleyonThames, R_OSTownsHereford, R_OSTownsHertford, R_OSTownsHexham, R_OStownsHeywood, R_OSTownsHeywood, R_OSTownsHighWycombe, R_OSTownsHinckley, R_OSTownsHindley, R_OSTownsHolyhead, R_OSTownsHolywell, R_OSTownsHorncastle, R_OSTownsHorsham, R_OSTownsHorwich, R_OStownsHowden, R_OSTownsHucknallTorkard, R_OStownsHuddersfield, R_OSTownsHuddersfield, R_OSTownsHuntingdon, R_OSTownsHyde, R_OSTownsIdle, R_OSTownsIlfracombe, R_OSTownsIlkeston, R_OSTownsIlkley, R_OSTownsIpswich, R_OStownsKeighley, R_OSTownsKeighley, R_OSTownsKendal, R_OSTownsKettering, R_OSTownsKidderminster, R_OSTownsKidsgrove, R_OSTownsKingsLynn, R_OStownsKingstonuponHull, R_OSTownsKingstonuponHull, R_OStownsKingstonuponThames, R_OStownsKnaresborough, R_OSTownsKnaresborough, R_OSTownsKnottingley, R_OSTownsLancaster, R_OStownsLancaster1056, R_OSTownsLeeds, R_OStownsLeeds1056, R_OSTownsLeek, R_OSTownsLeicester, R_OSTownsLeigh, R_OSTownsLeightonBuzzard, R_OSTownsLeominster, R_OSTownsLewes, R_OSTownsLichfield, R_OSTownsLincoln, R_OSTownsLiskeard, R_OSTownsLittleborough, R_OStownsLiverpool, R_OSTownsLiverpool, R_OSTownsLlandudno, R_OSTownsLlanelly, R_OStownsLondon5280, R_OStownsLondon, R_OStownsLondon1056, R_OSTownsLongEaton, R_OSTownsLoughborough, R_OSTownsLouth, R_OSTownsLowestoft, R_OSTownsLudlow, R_OSTownsLuton, R_OSTownsLymington, R_OSTownsLytham, R_OSTownsMacclesfield, R_OSTownsMaidenhead, R_OSTownsMaidstone, R_OSTownsMaldon, R_OStownsMalton, R_OStownsManchester, R_OSTownsManchesterandSalford, R_OSTownsMansfield, R_OSTownsMarch, R_OSTownsMargate, R_OSTownsMaryport, R_OSTownsMelcombeRegis, R_OSTownsMeltonMowbray, R_OSTownsMerthyrTydfil, R_OStownsMiddlesbrough, R_OSTownsMiddlesbrough, R_OStownsMiddleton, R_OSTownsMiddleton, R_OSTownsMirfield, R_OSTownsMold, R_OSTownsMonmouth, R_OSTownsMorecambe, R_OSTownsMorley, R_OSTownsMorpeth, R_OSTownsMossley, R_OSTownsNantwich, R_OSTownsNeath, R_OSTownsNelson, R_OSTownsNewark, R_OSTownsNewbury, R_OSTownsNewcastle1894, R_OSTownsNewcastle1900s, R_OSTownsNewMalton, R_OSTownsNewmarket, R_OSTownsNewport, R_OSTownsNewportIsleofWight, R_OSTownsNewtonAbbot, R_OSTownsNewtown, R_OSTownsNorthampton, R_OSTownsNorthwich, R_OSTownsNorwich, R_OSTownsNottingham, R_OSTownsNuneaton, R_OSTownsOldbury, R_OSTownsOldham, R_OStownsOrmskirk, R_OSTownsOrmskirk, R_OSTownsOswestry, R_OSTownsOtley, R_OSTownsOxford, R_OSTownsPadiham, R_OSTownsPembroke, R_OSTownsPembrokeDock, R_OSTownsPenrith, R_OSTownsPenzance, R_OSTownsPeterborough, R_OSTownsPetersfield, R_OSTownsPetworth, R_OSTownsPlumstead, R_OStownsPlymouth1850s, R_OStownsPontefract, R_OSTownsPontefract, R_OSTownsPontypool, R_OSTownsPoole, R_OSTownsPortsmouth, R_OStownsPrescot, R_OSTownsPrescot, R_OStownsPreston, R_OSTownsPreston, R_OSTownsRamsbottom, R_OSTownsRamsey, R_OSTownsRamsgate, R_OSTownsRavensthorpe, R_OSTownsRawtenstall, R_OSTownsReading, R_OSTownsRedditch, R_OSTownsRedhill, R_OSTownsRedruth, R_OSTownsReigate, R_OSTownsRhyl, R_OStownsRichmond, R_OSTownsRichmond, R_OStownsRipon, R_OSTownsRipon, R_OSTownsRishton, R_OStownsRochdale, R_OSTownsRochdale, R_OSTownsRochester, R_OSTownsRomford, R_OSTownsRomsey, R_OStownsRotherham, R_OSTownsRotherham, R_OSTownsRoyalLemingtonSpa, R_OSTownsRoyton, R_OSTownsRugby, R_OSTownsRuncorn, R_OSTownsRyde, R_OSTownsRye, R_OSTownsSaffronWalden, R_OSTownsSalisbury, R_OSTownsSandwich, R_OStownsScarborough, R_OSTownsScarborough, R_OStownsSelby, R_OSTownsSelby, R_OSTownsSevenoaks, R_OStownsSheffield, R_OSTownsSheffield, R_OSTownsSheptonMallet, R_OSTownsSherborne, R_OSTownsShipley, R_OSTownsShrewsbury, R_OStownsSkipton, R_OSTownsSkipton, R_OSTownsSleaford, R_OSTownsSlough, R_OSTownsSouthampton, R_OSTownsSouthport, R_OSTownsSowerbyBridge, R_OSTownsSpalding, R_OStownsSt_Helens, R_OSTownsStafford, R_OSTownsStamford, R_OSTownsStAustell, R_OSTownsStHelens, R_OSTownsStIves, R_OStownsStockport, R_OStownsStockport2, R_OSTownsStocktonuponTees, R_OStownsStockton1890s, R_OSTownsStone, R_OSTownsStourbridge, R_OSTownsStowmarket, R_OSTownsStratfordonAvon, R_OSTownsStroud, R_OSTownsSudbury, R_OSTownsSuttoninAshfield, R_OSTownsSwansea, R_OSTownsSwindon, R_OSTownsSwinton, R_OSTownsTamworth, R_OSTownsTaunton, R_OSTownsTavistock, R_OSTownsTenby, R_OSTownsTewkesbury, R_OSTownsThetford, R_OSTownsTiverton, R_OStownsTodmorden, R_OSTownsTodmorden, R_OSTownsTonbridge, R_OSTownsTorquay, R_OSTownsTotnes, R_OSTownsTring, R_OSTownsTrowbridge, R_OSTownsTruro, R_OSTownsTunbridgeWells, R_OSTownsTyldesley, R_OSTownsTyneside, R_OStownsTyneside1890s, R_OStownsUlverston, R_OSTownsUlverston, R_OStownsWakefield, R_OSTownsWakefield, R_OSTownsWallsend, R_OSTownsWalsall, R_OSTownsWalthamAbbey, R_OSTownsWare, R_OSTownsWarminster, R_OStownsWarrington, R_OSTownsWarrington, R_OSTownsWarwick, R_OSTownsWatford, R_OSTownsWednesbury, R_OSTownsWellingborough, R_OSTownsWellington, R_OSTownsWells, R_OSTownsWelshpool, R_OSTownsWestBromwich, R_OSTownsWestCowes, R_OSTownsWestonsuperMare, R_OSTownsWeymouth, R_OStownsWhitby, R_OSTownsWhitby, R_OSTownsWhitchurch, R_OSTownsWhitehaven, R_OSTownsWidnes, R_OStownsWigan, R_OSTownsWigan, R_OSTownsWinchester, R_OStownsWindsor, R_OSTownsWisbech, R_OSTownsWithington, R_OSTownsWokingham, R_OSTownsWolverhampton, R_OSTownsWorcester, R_OSTownsWorksop, R_OSTownsWorthing, R_OSTownsYeovil, R_OStownsYork, R_OSTownsYork, R_paisley, R_paisley_goad, R_peebles, R_perth1716, R_perth1783, R_perth1823, R_perth1827, R_perth1832, R_perth1860, R_perth1860b, R_perth1893, R_perth1895, R_perth1901, R_perth1902, R_perth1907, R_perth1912, R_perth1933, R_peterhead, R_portglasgow, R_portkil, R_portobello, R_rothesay, R_selkirk, R_standrews1854, R_standrews1893, R_stirling, R_stonehaven, R_stranraer1847, R_stranraer1867, R_stranraer1893, R_strathaven, R_wick, R_wigtown1848, R_wigtown1894, R_county_chester_1794, R_county_cumberland_1823, R_county_durham_1819, R_county_lancashire_1828, R_county_lincolnshire_1828, R_county_westmorland_1823, R_county_yorkshire_1828, R_london_gsgs4157, R_greatbritain50k, R_irelandbart, R_irelandgsgs, R_channel_islands_town_plans, R_os2500_group_great_britain_channel_islands, R_sixinch2_channel_islands, R_channel_islands_six_inch_1960s, R_channel_islands_two_inch, R_channel_islands_three_inch, R_trench101723168, R_trench101723205, R_trench101723208, R_trench101723211, R_trench101723214, R_trench101724055, R_trench101723220, R_trench101723223, R_trench101723229, R_trench101724060, R_trench101723232, R_trench101724050, R_trench101724027, R_trench101724030, R_trench101723171, R_trench101723174, R_trench101723196, R_trench101723217, R_trench101723199, R_trench101724033, R_trench101724036, R_trench101464585, R_trench101464588, R_trench101464591, R_trench101464594, R_trench101464609, R_trench101464612, R_trench101464615, R_trench101464618, R_trench101464630, R_trench101464627, R_trench101464639, R_trench101464642, R_trench101464645, R_trench101464636, R_trench101464681, R_trench101464684, R_trench101464687, R_trench101464648, R_trench101464651, R_trench101464654, R_trench101464657, R_trench101464660, R_trench101464663, R_trench101464666, R_trench101464669, R_trench101464672, R_trench101464675, R_trench101464693, R_trench101464696, R_trench101464705, R_trench101464708, R_trench101464711, R_trench101464714, R_trench101464699, R_trench101464702, R_trench101464726, R_trench101464729, R_trench101464732, R_trench101464735, R_trench101464738, R_trench101464741, R_trench101464744, R_trench101464747, R_trench101464750, R_trench101464753, R_trench101464756, R_trench101464759, R_trench101464762, R_trench101464765, R_trench101464768, R_trench101464765, R_trench101464774, R_trench101464777, R_trench101464780, R_trench101464783, R_trench101464771, R_trench101464786, R_trench101464789, R_trench101464792, R_trench101464795, R_trench101464798, R_trench101464801, R_trench101464804, R_trench101464807, R_trench101464810, R_trench101464813, R_trench101464816, R_trench101464822, R_trench101464825, R_trench101464828, R_trench101464831, R_trench101724021, R_trench101723247, R_trench101723250, R_trench101723253, R_trench101464837, R_trench101464834, R_trench101464840, R_trench101464846, R_trench101464843, R_trench101464849, R_trench101464855, R_trench101464858, R_trench101464867, R_trench101464864, R_trench101464861, R_trench101464873, R_trench101464870, R_trench101464876, R_trench101464879, R_trench101464882, R_trench101464885, R_trench101464897, R_trench101464903, R_trench101464900, R_trench101464918, R_trench101464915, R_trench101464912, R_trench101464909, R_trench101464939, R_trench101464936, R_trench101464933, R_trench101464930, R_trench101464927, R_trench101464924, R_trench101464921, R_trench101464948, R_trench101464945, R_trench101464942, R_trench101464951, R_trench101464954, R_trench101464957, R_trench101464960, R_trench101464966, R_trench101464963, R_trench101464969, R_trench101464978, R_trench101464975, R_trench101464987, R_trench101464984, R_trench101464981, R_trench101464990, R_trench101464999, R_trench101464996, R_trench101464993, R_trench101465002, R_trench101465011, R_trench101465008, R_trench101465005, R_trench101465020, R_trench101465017, R_trench101465023, R_trench101465029, R_trench101465032, R_trench101465035, R_trench101465050, R_trench101465047, R_trench101465044, R_trench101465071, R_trench101465068, R_trench101465065, R_trench101465062, R_trench101465059, R_trench101465056, R_trench101465053, R_trench101465095, R_trench101465092, R_trench101465089, R_trench101465086, R_trench101465083, R_trench101465080, R_trench101465077, R_trench101465074, R_trench101465098, R_trench101465104, R_trench101465101, R_trench101465107, R_trench101465119, R_trench101465116, R_trench101465122, R_trench101465137, R_trench101465134, R_trench101465131, R_trench101465128, R_trench101465140, R_trench101465161, R_trench101465158, R_trench101465155, R_trench101465152, R_trench101465149, R_trench101465146, R_trench101465164, R_trench101465167, R_trench101465194, R_trench101465191, R_trench101465188, R_trench101465185, R_trench101465182, R_trench101465176, R_trench101465170, R_trench101465209, R_trench101465206, R_trench101465203, R_trench101465200, R_trench101465197, R_trench101465224, R_trench101465221, R_trench101465218, R_trench101465215, R_trench101465251, R_trench101465248, R_trench101465245, R_trench101465242, R_trench101465239, R_trench101465236, R_trench101465233, R_trench101465230, R_trench101465227, R_trench101465257, R_trench101465254, R_trench101465263, R_trench101465260, R_trench101465269, R_trench101465266, R_trench101465275, R_trench101465272, R_trench101465287, R_trench101465284, R_trench101465281, R_trench101465278, R_trench101465293, R_trench101465290, R_trench101465302, R_trench101465296, R_trench101465308, R_trench101465305, R_trench101465311, R_trench101465323, R_trench101465320, R_trench101465317, R_trench101465314, R_trench101465329, R_trench101465326, R_trench101465332, R_trench101465368, R_trench101465365, R_trench101465341, R_trench101465344, R_trench101465338, R_trench101465335, R_trench101465347, R_trench101465350, R_trench101465353, R_trench101465356, R_trench101465359, R_trench101465371, R_trench101465362, R_trench101465377, R_trench101465374, R_trench101465380, R_trench101465383, R_trench101465386, R_trench101465389, R_trench101465392, R_trench101465395, R_trench101465398, R_trench101723235, R_trench101723238, R_trench101723833, R_trench101723202, R_trench101724065, R_trench101724042, R_trench101724045, R_trench101724024, R_trench101724039, R_trench101723830, R_trench101723165, R_belgiumgsgs4042, R_belgiumgsgs4336, R_belgiumgsgs4040, R_cyprus_kitchener, R_jamaica, R_india_half_first_ed, R_india_half_second_ed, R_india_one_first_ed, R_india_one_second_ed, R_hongkongcollinson, R_world_arrowsmith, R_world_bartholomew, R_tsa_ALL ]; 

	
	var overlayLayersAll = [ossixinchfirstgreatbritain, oneinchgeology, twentyfive_inch_gloucester_wiltshire_somerset_britain, oneinch2nd, one_inch_2nd_hills,  sixinch2, ostwentyfiveinchGreatBritain, bartgreatbritain, quarterinchfirsthills, quarterinchfirstoutline, OS1900sGB, os1900s_all_scales, sixinchgeology, oneinchthirdgbcolour, OS25inchEdinburgh1914, OS25inchGloucester3rd, quarterinch, quarterinchcivilair, quarterinchfourth, twentyfivethousand,  twentyfivethousandoutline,  oneinchpopular_britain, halfinchmot, nls, halfinchoutlineblue, oneinchlanduse, landutilisationsurveygb, landutilisationsurveyengwal25kpub, bartgreatbritain1940s, airphotos1250, airphotos, scot1944_1966_group_great_britain, os1250_group_great_britain, os1250_scot_b, os1250_scot_c, os2500_group_great_britain, os2500_scot_b, os2500_scot_c, OS10knatgridgreat_britain, oneinchseventh, admin, coal_iron, farming, general, geological, iron_steel, land_classification, land_utilisation, limestone,  physical, population_change_1921, population_change_1931, population_change_1939, population_density_1931, population_density_1951, railways, rainfall, roads_46, roads_56, royhighlands, roylowlands, hole1607, dorret1750, arrowsmith1807, sixinch, oneinchscotlandfirstcol,  oneinch2ndscot, one_inch_2nd_hills_scot, sixinch2scot_api, os25inch1890s, os25inchblueandblacks, os25inchblueandblacksOS, oneinchthirdcolour, bartsurveyatlas, oneinchpopular, oneinchpopular_outline, barthalfinch,  twentyfivethousandscot, gsgs3906, oneinchgsgs3908, scot1944_1966_group, os1250_group_great_britain_scot, os1250_scot_b_scot, os1250_scot_c_scot, os2500_group_great_britain_scot, os2500_scot_b_scot, os2500_scot_c_scot, oneinchnatgrid, oneinchnatgridoutline, oneinchgsgs4639, quarterinchadmin1950, oneinchsoils,  OS10knatgridscot, oneinchseventhscot, quarterinchadmin1960, secondlandusescot, ch00000529, ch00000541, ch74400306, ch85449271, ch85449274, ch85449277, ch85449280, ch85449283, ch85449286, ch85449289, ch85449292, adch101942045, adch101942048, adch101942078, adch101942108, adch101942111, adch101942114, adch101942117, adch101942630, adch74412450, adch101942603, adch101942606, adch101942612, adch101942615, adch101942618, adch101942621, adch101942624, adch101942627, adch101942633, adch101942687, adch101942690, adch101942693, adch101942696, adch101942699, adch101942702, adch101942705, adch101942708, adch101942711, adch101942714, adch101942669, adch101942672, adch101942675, adch101942678, adch101942681, adch101942735, adch101942726, adch101942729, adch101942732, adch101942741, adch101942738, adch101942759, adch101942762, adch101943347, adch101942906_inset2, adch101942909_inset2, adch101942912_inset2, adch101942915_inset2, adch101942915_inset4, adch101942906_inset3, adch101942909_inset3, adch101942912_inset3, adch101942915_inset3, adch101942906_inset1, adch101942909_inset1, adch101942912_inset1, adch101942915_inset1, adch101942975, adch101942981, adch101942984, adch101942987, adch101942993, adch101942996, adch101943350, adch101943353, adch101943356, adch101943491, adch101943494, adch101943500, adch101943503, adch101943506, adch101943509, adch101943512, adch101944457, adch101944460, adch101944463, adch74401001, adch101944847_inset3, adch101944847_inset4, adch101944847_inset2, adch101944847_inset1, adch101944847_inset5, adch101944847_inset6, adch101944847_inset7, adch101944850_inset3, adch101944850_inset4, adch101944850_inset2, adch101944850_inset1, adch101944850_inset5, adch101944850_inset6, adch101944850_inset7, adch101944853_inset3, adch101944853_inset4, adch101944853_inset2, adch101944853_inset1, adch101944853_inset5, adch101944853_inset6, adch101944853_inset7, adch101944856_inset3, adch101944856_inset4, adch101944856_inset2, adch101944856_inset1, adch101944856_inset5, adch101944856_inset6, adch101944883, adch101944865, adch101944874, adch101944886, adch101944889, adch101944892, adch101944895, adch101945726, adch101945729, adch74400307, adch74400307_inset1, adch74400307_inset2, adch74400307_inset3, adch74400307_inset4, adch101946716, adch101946716_inset2, adch101946716_inset3, adch101946716_inset4, adch101946716_inset1, adch101946695_inset, adch101946695, adch101946698_inset, adch101946698, adch74401002, adch101947403_dunvegan, adch101947403_snizort, adch101947406, adch101947409, adch101947898, adch101947901, adch101947907, adch101947910, adch101947916, adch101947919, adch101947922, adch101947925, adch101947919_inset1, adch101947922_inset1, adch101947922_inset2, adch101947925_inset1, adch101947925_inset2, adch74401003, adch101948129, adch101948132, adch101948135, adch101948138, adch101948141, adch101948132_inset, adch101948135_inset, adch101948138_inset, adch101948141_inset, adch74401004, adch101948144, adch101948147, adch101948150, adch101948153, adch101948225, adch101948228, adch101948234, adch101948237, adch101948240, adch101948243, adch101948246, adch101948249, adch101948252, adch101948276, adch101948285, adch74412387, adch101948291, adch101948294, adch101948297, adch101948300, adch101948303, adch101948306, adch101948279, adch74400302, adch101948390, adch74401005, adch101948420_inset, adch101948420, adch101948423_inset, adch101948423, adch101948426_inset, adch101948426, adch101948429_inset, adch101948429, adch101948432_inset, adch101948432, adch101948435_inset, adch101948435, adch101948438_inset, adch101948438, adch101948441_inset, adch101948441, adch101948444_inset, adch101948444, adch101948504, adch101948507, adch101948510, adch101948513, adch101948516, adch101948510_inset, adch101948513_inset, adch101948516_inset, adch74412388, adch74412388_inset, adch101948543, adch74412457, adch74412457_inset, adch74413949, adch74412463, adch74401006_oban, adch74401006_troon, adch74401007, adch74401008, adch74401009, adch74401010, adch74401011, adch74401012, adch74401060, adch74401014, adch74401015, adch74401016, adch74401017, adch74412462, adch74400305, adch74412454, adch74401019, adch74401019_inset, adch74401020, adch74401022, adch74401023, adch74400296, adch74400296_inset1, adch74400296_inset2, adch74400296_inset3, adch74401025, adch74401026, adch74401027, adch74401028, adch74401029, adch74401030, adch74401031, adch74401032, adch74401033, adch74401034, adch74401035, adch74401036, adch74401037, adch74401000, adch74401000_inset, adch74412461, adch74401038, adch74401039, adch74400294, adch74401040, adch74401041, adch74401042, adch74401043, adch74401044, adch74401045, adch74401046, adch74401047, adch74401048, adch74401048_inset, adch74401049, adch74401052, adch74401053, adch74401053_inset, adch74401054, adch74401051, adch74401055, adch74401056, adch74412460, adch74401057, adch101961533, bathlochawenorth, bathlochawesouth, bathlochcluanie, bathlochdoon, bathlochduntelchaig, bathlochearn, bathlocherichtlower, bathlocherichtupper, bathlochfannich, bathlochgarryness, bathlochgarrytay, bathlochglass, bathlochharray, bathlochlaidon, bathlochleven, bathlochlomondnorth, bathlochlomondsouth, bathlochloyne, bathlochluichart, bathlochlyon, bathlochmhor, bathlochmonar, bathlochmullardoch, bathlochquoich, bathlochrannoch, bathlochshiellower, bathlochshielupper, bathlochshinlower, bathlochshinupper, bathlochtayeast, bathlochtaywest, bathlochtreig, bathlochtummel, county74400288, county119952600, county74400145, county135908105, county74400334, estate121129476,  estate121129386, estate121129410, estate121129416, estate121129419, estate132293752, estate129392884, estate132293758, estate121129389, estate121129413, estate129393076, estate129393010, estate129393148, estate114473788, estate114473785, estate103427429, estate129392971, estate129393253,  estate125491577, estate121129473, estate121129458, estate110069086, estate132293749, estate132293755, estate129392983, estate129392986, estate129392989, estate129392992, estate129392995, estate129392911, estate121129434, estate129392908, estate114473773, estate110069083, estate129393019, estate129393103, estate129393049, estate110323727, estate132293842, estate121129461, estate110069080, estate103427459, estate103427450, estate103427447, estate129392893, estate129393328, estate129393580, estate121129443, estate121129392, estate129393397, estate129392887, estate121129464, estate132293743, estate129392947, estate129392950, estate106697318, estate129392935, estate132293857, estate106697324, estate129392887t, estate129393172, estate_balmaclellan, estate129393712, estate129393715, estate129393718, estate129393721, estate129393724, estate129393676, estate129393709, estate129393706, estate129393763, estate_earlstoun, estate125491588, estate129393664, estate132293782, estate129393778, estate129393754, estate129393745, estate125491585, estate129393751, estate125491597, estate129393583, estate129393661, estate106697330, estate106697333, estate106697336, estate106697339, estate125491591, estate125491601, estate114473887, estate106697342, estate129393769, estate125491594, estate114473800, estate114473809, estate114473806, estate114473794, estate114473797, estate114473815, estate125491581, estate114473830, estate114473845, estate114473854, estate114473824, estate114473836, estate114473842, estate114473848, estate114473851, estate114473839, estate114473827, estate129393667, estate129393016, estate129393076l, estate129393016c, estate74436591, aberdeen, aberdeen1879, aberdeen1883, aberdeen1895, aberdeen1902, aberdeen1905, aberdeen1915, airdrie, alexandria, alloa, annan, arbroath, ardhallow, ayr, barry, berwick, braefoot, brechin, burntisland, burntisland1824, campbeltown, campbeltown_goad, cloch, coatbridge, cramond, cupar1854, cupar1893, dalkeith1852, dalkeith1893, dreghorn, dumbarton, dumfries1850, dumfries1893, dundee_goad, dundee1857, dundee1870, dundee1882, dundee1888, dundee1891, dundee1892, dundee1893, dundee1897, dundee1900, dundee1903, dundee1906, dundee1908, dundee1910, dundee1911, dunfermline1854, dunfermline1893, edin_newington_1826, edin1765, edin1784, edin1804, edin1817, edin1819, edin1821, edin1822, edin1831, edin1832, edin1849, edin1865, edin1876, edin1882, edin1885, edin1888, edin1891, edin1892, edin1892b, edin1893, edin1902, edin1905, edin1907, edin1910, edin1912, edin1917, edin1918, edin1919, edin1932, edin1939, edin1944_1963, edinburgh_castle, edinburgh_goad, elgin, falkirk, forfar, forres, galashiels, girvan, glas1778, glas1807, glas1857, glas1882, glas1888, glas1891, glas1894, glas1895, glas1900, glas1905, glas1910, glas1914, glas1920, glas1925, glasgow_goad, glasgow1930, glasgow1936, greenock, greenock_goad, greenock1861, greenock1879, greenock1887, greenock1895, greenock1915, haddington1853, haddington1893, hamilton, hawick, inchcolm, inchkeith_2500, inchkeith_500, inchmickery, inverness, irvine, jedburgh, kelso, kilmarnock, kirkcaldy1855, kirkcaldy1894, kirkcudbright1850, kirkcudbright1893, kirkintilloch, kirriemuir, lanark, leith_goad, linlithgow, maybole, montrose, musselburgh1853, musselburgh1893, nairn, oban, ossixinchfirstengland, sixinchenglandwales, oneinchrevisedcolouredengland, oneinchthirdengwalcolour, OS25inchGloucester3rdengland, OS25inchGuildford, bartholomew_half_1919, twentyfivethousandengwal, oneinchpopular_england, oneinchpopular_outline_england, oneinchnewpop, landutilisationsurveyengwal25k, landutilisationsurveyengwalscapes, landutilisationsurveyengwalwildscapeveg, landutilisationsurveyengwalwildscapehab,  oneinchseventhengwal, OStownsALL, OStownsALL1056, OSTownsAberdare, OSTownsAbergavenny, OSTownsAberystwyth, OSTownsAbingdon, OStownsAccrington, OSTownsAccrington, OSTownsAldershot, OSTownsAlnwick, OStownsAlnwick2640, OSTownsAltrincham, OSTownsAndover, OSTownsAppleby, OSTownsAshford, OStownsAshton, OStownsAshton2, OSTownsAtherstone, OSTownsAylesbury, OStownsBacup, OSTownsBacup, OSTownsBanbury, OSTownsBangor, OStownsBarnsley, OSTownsBarnsley, OSTownsBarnstaple, OSTownsBarrowinFurness, OSTownsBasingstoke, OSTownsBath, OSTownsBatley, OSTownsBeccles, OSTownsBedford, OSTownsBelper, OSTownsBerkhamstead, OStownsBeverley, OSTownsBeverley, OSTownsBideford, OSTownsBiggleswade, OStownsBingley, OSTownsBingley, OSTownsBirkenhead, TownsBirmimgham1855, OSTownsBirmingham, OSTownsBirstal, OSTownsBishopAuckland, OSTownsBishopsStortford, OStownsBlackburn, OSTownsBlackburn, OSTownsBlackpool, OStownsBlyth, OSTownsBlyth, OSTownsBodmin, OStownsBolton, OSTownsBolton, OSTownsBoston, OSTownsBournemouth, OStownsBradford, OSTownsBradford, OSTownsBradfordonAvon, OSTownsBraintree, OSTownsBrentwood, OSTownsBridgnorth, OSTownsBridgwater, OStownsBridlington, OSTownsBridlington, OSTownsBridport, OSTownsBrierleyHill, OSTownsBrighouse, OSTownsBrighton, OSTownsBristol, OSTownsBrixham, OSTownsBromsgrove, OSTownsBuckingham, OStownsBurnley, OSTownsBurnley, OSTownsBurslem, OSTownsBurtonuponTrent, OStownsBury, OSTownsBury, OSTownsBuryStEdmunds, OSTownsBuxton, OSTownsCamborne, OSTownsCambridge, OSTownsCanterbury, OSTownsCardiff, OSTownsCarmarthen, OSTownsCarnarvon, OSTownsCastleford, OSTownsCheltenham, OSTownsChertsey, OSTownsChester, OSTownsChesterfield, OSTownsChesterton, OSTownsChichester, OSTownsChippenham, OStownsChorley, OSTownsChorley, OSTownsChowbent, OSTownsChristchurch, OSTownsCirencester, OSTownsClaytonleMoors, OSTownsCleckheaton, OSTownsClevedon, OStownsClitheroe, OSTownsCockermouth, OSTownsColchester, OStownsColne, OSTownsColne, OSTownsCongleton, OSTownsCoventry, OSTownsCrediton, OSTownsCrewe, OSTownsCrewkerne, OSTownsCroydon, OSTownsDaltoninFurness, OSTownsDarlaston, OStownsDarlington, OSTownsDartford, OSTownsDartmouth, OSTownsDarwen, OSTownsDawlish, OSTownsDeal, OSTownsDenbigh, OSTownsDerby, OSTownsDevizes, OStownsDewsbury, OStownsDoncaster, OSTownsDoncaster, OSTownsDorchester, OSTownsDorking, OSTownsDouglas, OSTownsDover, OSTownsDroitwich, OSTownsDudley, OSTownsDunstable, OSTownsDurham, OSTownsEastbourne, OSTownsEastDereham, OSTownsEastRetford, OSTownsEccles, OSTownsElland, OSTownsEly, OSTownsEvesham, OSTownsExeter, OSTownsExmouth, OSTownsFalmouth, OSTownsFarnham, OSTownsFarnworth, OSTownsFarsley, OSTownsFaversham, OStownsFleetwood, OSTownsFleetwood, OSTownsFolkestone, OSTownsFrome, OSTownsGainsborough, OSTownsGarston, OSTownsGlossop, OSTownsGloucester, OSTownsGodmanchester, OSTownsGoole, OSTownsGosport, OSTownsGrantham, OSTownsGravesend, OSTownsGreatDriffield, OSTownsGreatGrimsby, OSTownsGreatHarwood, OSTownsGreatMalvern, OSTownsGreatMarlow, OSTownsGreatYarmouth, OSTownsGuildford, OStownsHalifax, OSTownsHalifax, OSTownsHalstead, OSTownsHarrogate, OSTownsHartlepool, OSTownsHarwich, OStownsHaslingden, OSTownsHaslingden, OSTownsHastings, OSTownsHaverfordwest, OSTownsHebdenBridge, OSTownsHeckmondwike, OSTownsHemelHempstead, OSTownsHenleyonThames, OSTownsHereford, OSTownsHertford, OSTownsHexham, OStownsHeywood, OSTownsHeywood, OSTownsHighWycombe, OSTownsHinckley, OSTownsHindley, OSTownsHolyhead, OSTownsHolywell, OSTownsHorncastle, OSTownsHorsham, OSTownsHorwich, OStownsHowden, OSTownsHucknallTorkard, OStownsHuddersfield, OSTownsHuddersfield, OSTownsHuntingdon, OSTownsHyde, OSTownsIdle, OSTownsIlfracombe, OSTownsIlkeston, OSTownsIlkley, OSTownsIpswich, OStownsKeighley, OSTownsKeighley, OSTownsKendal, OSTownsKettering, OSTownsKidderminster, OSTownsKidsgrove, OSTownsKingsLynn, OStownsKingstonuponHull, OSTownsKingstonuponHull, OStownsKingstonuponThames, OStownsKnaresborough, OSTownsKnaresborough, OSTownsKnottingley, OSTownsLancaster, OStownsLancaster1056, OSTownsLeeds, OStownsLeeds1056, OSTownsLeek, OSTownsLeicester, OSTownsLeigh, OSTownsLeightonBuzzard, OSTownsLeominster, OSTownsLewes, OSTownsLichfield, OSTownsLincoln, OSTownsLiskeard, OSTownsLittleborough, OStownsLiverpool, OSTownsLiverpool, OSTownsLlandudno, OSTownsLlanelly, OStownsLondon5280, OStownsLondon1056, OStownsLondon, OSTownsLongEaton, OSTownsLoughborough, OSTownsLouth, OSTownsLowestoft, OSTownsLudlow, OSTownsLuton, OSTownsLymington, OSTownsLytham, OSTownsMacclesfield, OSTownsMaidenhead, OSTownsMaidstone, OSTownsMaldon, OStownsMalton, OStownsManchester, OSTownsManchesterandSalford, OSTownsMansfield, OSTownsMarch, OSTownsMargate, OSTownsMaryport, OSTownsMelcombeRegis, OSTownsMeltonMowbray, OSTownsMerthyrTydfil, OStownsMiddlesbrough, OSTownsMiddlesbrough, OStownsMiddleton, OSTownsMiddleton, OSTownsMirfield, OSTownsMold, OSTownsMonmouth, OSTownsMorecambe, OSTownsMorley, OSTownsMorpeth, OSTownsMossley, OSTownsNantwich, OSTownsNeath, OSTownsNelson, OSTownsNewark, OSTownsNewbury, OSTownsNewcastle1894, OSTownsNewcastle1900s, OSTownsNewMalton, OSTownsNewmarket, OSTownsNewport, OSTownsNewportIsleofWight, OSTownsNewtonAbbot, OSTownsNewtown, OSTownsNorthampton, OSTownsNorthwich, OSTownsNorwich, OSTownsNottingham, OSTownsNuneaton, OSTownsOldbury, OSTownsOldham, OStownsOrmskirk, OSTownsOrmskirk, OSTownsOswestry, OSTownsOtley, OSTownsOxford, OSTownsPadiham, OSTownsPembroke, OSTownsPembrokeDock, OSTownsPenrith, OSTownsPenzance, OSTownsPeterborough, OSTownsPetersfield, OSTownsPetworth, OSTownsPlumstead, OStownsPlymouth1850s, OStownsPontefract, OSTownsPontefract, OSTownsPontypool, OSTownsPoole, OSTownsPortsmouth, OStownsPrescot, OSTownsPrescot, OStownsPreston, OSTownsPreston, OSTownsRamsbottom, OSTownsRamsey, OSTownsRamsgate, OSTownsRavensthorpe, OSTownsRawtenstall, OSTownsReading, OSTownsRedditch, OSTownsRedhill, OSTownsRedruth, OSTownsReigate, OSTownsRhyl, OStownsRichmond, OSTownsRichmond, OStownsRipon, OSTownsRipon, OSTownsRishton, OStownsRochdale, OSTownsRochdale, OSTownsRochester, OSTownsRomford, OSTownsRomsey, OStownsRotherham, OSTownsRotherham, OSTownsRoyalLemingtonSpa, OSTownsRoyton, OSTownsRugby, OSTownsRuncorn, OSTownsRyde, OSTownsRye, OSTownsSaffronWalden, OSTownsSalisbury, OSTownsSandwich, OStownsScarborough, OSTownsScarborough, OStownsSelby, OSTownsSelby, OSTownsSevenoaks, OStownsSheffield, OSTownsSheffield, OSTownsSheptonMallet, OSTownsSherborne, OSTownsShipley, OSTownsShrewsbury, OStownsSkipton, OSTownsSkipton, OSTownsSleaford, OSTownsSlough, OSTownsSouthampton, OSTownsSouthport, OSTownsSowerbyBridge, OSTownsSpalding, OStownsSt_Helens, OSTownsStafford, OSTownsStamford, OSTownsStAustell, OSTownsStHelens, OSTownsStIves, OStownsStockport, OStownsStockport2, OSTownsStocktonuponTees, OStownsStockton1890s, OSTownsStone, OSTownsStourbridge, OSTownsStowmarket, OSTownsStratfordonAvon, OSTownsStroud, OSTownsSudbury, OSTownsSuttoninAshfield, OSTownsSwansea, OSTownsSwindon, OSTownsSwinton, OSTownsTamworth, OSTownsTaunton, OSTownsTavistock, OSTownsTenby, OSTownsTewkesbury, OSTownsThetford, OSTownsTiverton, OStownsTodmorden, OSTownsTodmorden, OSTownsTonbridge, OSTownsTorquay, OSTownsTotnes, OSTownsTring, OSTownsTrowbridge, OSTownsTruro, OSTownsTunbridgeWells, OSTownsTyldesley, OSTownsTyneside, OStownsTyneside1890s, OStownsUlverston, OSTownsUlverston, OStownsWakefield, OSTownsWakefield, OSTownsWallsend, OSTownsWalsall, OSTownsWalthamAbbey, OSTownsWare, OSTownsWarminster, OStownsWarrington, OSTownsWarrington, OSTownsWarwick, OSTownsWatford, OSTownsWednesbury, OSTownsWellingborough, OSTownsWellington, OSTownsWells, OSTownsWelshpool, OSTownsWestBromwich, OSTownsWestCowes, OSTownsWestonsuperMare, OSTownsWeymouth, OStownsWhitby, OSTownsWhitby, OSTownsWhitchurch, OSTownsWhitehaven, OSTownsWidnes, OStownsWigan, OSTownsWigan, OSTownsWinchester, OStownsWindsor, OSTownsWisbech, OSTownsWithington, OSTownsWokingham, OSTownsWolverhampton, OSTownsWorcester, OSTownsWorksop, OSTownsWorthing, OSTownsYeovil, OStownsYork, OSTownsYork, paisley, paisley_goad, peebles, perth1716, perth1783, perth1823, perth1827, perth1832, perth1860, perth1860b, perth1893, perth1895, perth1901, perth1902, perth1907, perth1912, perth1933, peterhead, portglasgow, portkil, portobello, rothesay, selkirk, standrews1854, standrews1893, stirling, stonehaven, stranraer1847, stranraer1867, stranraer1893, strathaven, wick, wigtown1848, wigtown1894, county_chester_1794, county_cumberland_1823, county_durham_1819, county_lancashire_1828, county_lincolnshire_1828, county_westmorland_1823, county_yorkshire_1828, london_gsgs4157, greatbritain50k, irelandbart, irelandgsgs, channel_islands_town_plans, os2500_group_great_britain_channel_islands, sixinch2_channel_islands, channel_islands_six_inch_1960s, channel_islands_two_inch, channel_islands_three_inch, trench101723168, trench101723205, trench101723208, trench101723211, trench101723214, trench101724055, trench101723220, trench101723223, trench101723229, trench101724060, trench101723232, trench101724050, trench101724027, trench101724030, trench101723171, trench101723174, trench101723196, trench101723217, trench101723199, trench101724033, trench101724036, trench101464585, trench101464588, trench101464591, trench101464594, trench101464609, trench101464612, trench101464615, trench101464618, trench101464630, trench101464627, trench101464639, trench101464642, trench101464645, trench101464636, trench101464681, trench101464684, trench101464687, trench101464648, trench101464651, trench101464654, trench101464657, trench101464660, trench101464663, trench101464666, trench101464669, trench101464672, trench101464675, trench101464693, trench101464696, trench101464705, trench101464708, trench101464711, trench101464714, trench101464699, trench101464702, trench101464726, trench101464729, trench101464732, trench101464735, trench101464738, trench101464741, trench101464744, trench101464747, trench101464750, trench101464753, trench101464756, trench101464759, trench101464762, trench101464765, trench101464768, trench101464765, trench101464774, trench101464777, trench101464780, trench101464783, trench101464771, trench101464786, trench101464789, trench101464792, trench101464795, trench101464798, trench101464801, trench101464804, trench101464807, trench101464810, trench101464813, trench101464816, trench101464822, trench101464825, trench101464828, trench101464831, trench101724021, trench101723247, trench101723250, trench101723253, trench101464837, trench101464834, trench101464840, trench101464846, trench101464843, trench101464849, trench101464855, trench101464858, trench101464867, trench101464864, trench101464861, trench101464873, trench101464870, trench101464876, trench101464879, trench101464882, trench101464885, trench101464897, trench101464903, trench101464900, trench101464918, trench101464915, trench101464912, trench101464909, trench101464939, trench101464936, trench101464933, trench101464930, trench101464927, trench101464924, trench101464921, trench101464948, trench101464945, trench101464942, trench101464951, trench101464954, trench101464957, trench101464960, trench101464966, trench101464963, trench101464969, trench101464978, trench101464975, trench101464987, trench101464984, trench101464981, trench101464990, trench101464999, trench101464996, trench101464993, trench101465002, trench101465011, trench101465008, trench101465005, trench101465020, trench101465017, trench101465023, trench101465029, trench101465032, trench101465035, trench101465050, trench101465047, trench101465044, trench101465071, trench101465068, trench101465065, trench101465062, trench101465059, trench101465056, trench101465053, trench101465095, trench101465092, trench101465089, trench101465086, trench101465083, trench101465080, trench101465077, trench101465074, trench101465098, trench101465104, trench101465101, trench101465107, trench101465119, trench101465116, trench101465122, trench101465137, trench101465134, trench101465131, trench101465128, trench101465140, trench101465161, trench101465158, trench101465155, trench101465152, trench101465149, trench101465146, trench101465164, trench101465167, trench101465194, trench101465191, trench101465188, trench101465185, trench101465182, trench101465176, trench101465170, trench101465209, trench101465206, trench101465203, trench101465200, trench101465197, trench101465224, trench101465221, trench101465218, trench101465215, trench101465251, trench101465248, trench101465245, trench101465242, trench101465239, trench101465236, trench101465233, trench101465230, trench101465227, trench101465257, trench101465254, trench101465263, trench101465260, trench101465269, trench101465266, trench101465275, trench101465272, trench101465287, trench101465284, trench101465281, trench101465278, trench101465293, trench101465290, trench101465302, trench101465296, trench101465308, trench101465305, trench101465311, trench101465323, trench101465320, trench101465317, trench101465314, trench101465329, trench101465326, trench101465332, trench101465368, trench101465365, trench101465341, trench101465344, trench101465338, trench101465335, trench101465347, trench101465350, trench101465353, trench101465356, trench101465359, trench101465371, trench101465362, trench101465377, trench101465374, trench101465380, trench101465383, trench101465386, trench101465389, trench101465392, trench101465395, trench101465398, trench101723235, trench101723238, trench101723833, trench101723202, trench101724065, trench101724042, trench101724045, trench101724024, trench101724039, trench101723830, trench101723165, belgiumgsgs4042, belgiumgsgs4336, belgiumgsgs4040, cyprus_kitchener, jamaica, india_half_first_ed, india_half_second_ed, india_one_first_ed, india_one_second_ed, hongkongcollinson, world_arrowsmith, world_bartholomew, tsa_ALL, R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_maptiler_hillshade, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM, R_blank_layer];




    	overlayLayers =  [ossixinchfirstgreatbritain, oneinchgeology, twentyfive_inch_gloucester_wiltshire_somerset_britain, oneinch2nd, one_inch_2nd_hills,  sixinch2, ostwentyfiveinchGreatBritain, bartgreatbritain, quarterinchfirsthills, quarterinchfirstoutline, OS1900sGB, os1900s_all_scales, sixinchgeology, oneinchthirdgbcolour, OS25inchEdinburgh1914, OS25inchGloucester3rd, quarterinch, quarterinchcivilair, quarterinchfourth, twentyfivethousand,  twentyfivethousandoutline, oneinchpopular_britain, halfinchmot, nls, halfinchoutlineblue, oneinchlanduse, landutilisationsurveygb, landutilisationsurveyengwal25kpub, bartgreatbritain1940s, airphotos1250, airphotos, scot1944_1966_group_great_britain, os1250_group_great_britain, os1250_scot_b, os1250_scot_c, os2500_group_great_britain, os2500_scot_b, os2500_scot_c, OS10knatgridgreat_britain, oneinchseventh, admin, coal_iron, farming, general, geological, iron_steel, land_classification, land_utilisation, limestone,  physical, population_change_1921, population_change_1931, population_change_1939, population_density_1931, population_density_1951, railways, rainfall, roads_46, roads_56, royhighlands, roylowlands, hole1607, dorret1750, arrowsmith1807, sixinch, oneinchscotlandfirstcol,  oneinch2ndscot, one_inch_2nd_hills_scot, sixinch2scot_api, os25inch1890s, os25inchblueandblacks, os25inchblueandblacksOS, oneinchthirdcolour, bartsurveyatlas, oneinchpopular, oneinchpopular_outline, barthalfinch,  twentyfivethousandscot, gsgs3906, oneinchgsgs3908, scot1944_1966_group, os1250_group_great_britain_scot, os1250_scot_b_scot, os1250_scot_c_scot, os2500_group_great_britain_scot, os2500_scot_b_scot, os2500_scot_c_scot, oneinchnatgrid, oneinchnatgridoutline, oneinchgsgs4639, quarterinchadmin1950, oneinchsoils,  OS10knatgridscot, oneinchseventhscot, quarterinchadmin1960, secondlandusescot, ch00000529, ch00000541, ch74400306, ch85449271, ch85449274, ch85449277, ch85449280, ch85449283, ch85449286, ch85449289, ch85449292, adch101942045, adch101942048, adch101942078, adch101942108, adch101942111, adch101942114, adch101942117, adch101942630, adch74412450, adch101942603, adch101942606, adch101942612, adch101942615, adch101942618, adch101942621, adch101942624, adch101942627, adch101942633, adch101942687, adch101942690, adch101942693, adch101942696, adch101942699, adch101942702, adch101942705, adch101942708, adch101942711, adch101942714, adch101942669, adch101942672, adch101942675, adch101942678, adch101942681, adch101942735, adch101942726, adch101942729, adch101942732, adch101942741, adch101942738, adch101942759, adch101942762, adch101943347, adch101942906_inset2, adch101942909_inset2, adch101942912_inset2, adch101942915_inset2, adch101942915_inset4, adch101942906_inset3, adch101942909_inset3, adch101942912_inset3, adch101942915_inset3, adch101942906_inset1, adch101942909_inset1, adch101942912_inset1, adch101942915_inset1, adch101942975, adch101942981, adch101942984, adch101942987, adch101942993, adch101942996, adch101943350, adch101943353, adch101943356, adch101943491, adch101943494, adch101943500, adch101943503, adch101943506, adch101943509, adch101943512, adch101944457, adch101944460, adch101944463, adch74401001, adch101944847_inset3, adch101944847_inset4, adch101944847_inset2, adch101944847_inset1, adch101944847_inset5, adch101944847_inset6, adch101944847_inset7, adch101944850_inset3, adch101944850_inset4, adch101944850_inset2, adch101944850_inset1, adch101944850_inset5, adch101944850_inset6, adch101944850_inset7, adch101944853_inset3, adch101944853_inset4, adch101944853_inset2, adch101944853_inset1, adch101944853_inset5, adch101944853_inset6, adch101944853_inset7, adch101944856_inset3, adch101944856_inset4, adch101944856_inset2, adch101944856_inset1, adch101944856_inset5, adch101944856_inset6, adch101944883, adch101944865, adch101944874, adch101944886, adch101944889, adch101944892, adch101944895, adch101945726, adch101945729, adch74400307, adch74400307_inset1, adch74400307_inset2, adch74400307_inset3, adch74400307_inset4, adch101946716, adch101946716_inset2, adch101946716_inset3, adch101946716_inset4, adch101946716_inset1, adch101946695_inset, adch101946695, adch101946698_inset, adch101946698, adch74401002, adch101947403_dunvegan, adch101947403_snizort, adch101947406, adch101947409, adch101947898, adch101947901, adch101947907, adch101947910, adch101947916, adch101947919, adch101947922, adch101947925, adch101947919_inset1, adch101947922_inset1, adch101947922_inset2, adch101947925_inset1, adch101947925_inset2, adch74401003, adch101948129, adch101948132, adch101948135, adch101948138, adch101948141, adch101948132_inset, adch101948135_inset, adch101948138_inset, adch101948141_inset, adch74401004, adch101948144, adch101948147, adch101948150, adch101948153, adch101948225, adch101948228, adch101948234, adch101948237, adch101948240, adch101948243, adch101948246, adch101948249, adch101948252, adch101948276, adch101948285, adch74412387, adch101948291, adch101948294, adch101948297, adch101948300, adch101948303, adch101948306, adch101948279, adch74400302, adch101948390, adch74401005, adch101948420_inset, adch101948420, adch101948423_inset, adch101948423, adch101948426_inset, adch101948426, adch101948429_inset, adch101948429, adch101948432_inset, adch101948432, adch101948435_inset, adch101948435, adch101948438_inset, adch101948438, adch101948441_inset, adch101948441, adch101948444_inset, adch101948444, adch101948504, adch101948507, adch101948510, adch101948513, adch101948516, adch101948510_inset, adch101948513_inset, adch101948516_inset, adch74412388, adch74412388_inset, adch101948543, adch74412457, adch74412457_inset, adch74413949, adch74412463, adch74401006_oban, adch74401006_troon, adch74401007, adch74401008, adch74401009, adch74401010, adch74401011, adch74401012, adch74401060, adch74401014, adch74401015, adch74401016, adch74401017, adch74412462, adch74400305, adch74412454, adch74401019, adch74401019_inset, adch74401020, adch74401022, adch74401023, adch74400296, adch74400296_inset1, adch74400296_inset2, adch74400296_inset3, adch74401025, adch74401026, adch74401027, adch74401028, adch74401029, adch74401030, adch74401031, adch74401032, adch74401033, adch74401034, adch74401035, adch74401036, adch74401037, adch74401000, adch74401000_inset, adch74412461, adch74401038, adch74401039, adch74400294, adch74401040, adch74401041, adch74401042, adch74401043, adch74401044, adch74401045, adch74401046, adch74401047, adch74401048, adch74401048_inset, adch74401049, adch74401052, adch74401053, adch74401053_inset, adch74401054, adch74401051, adch74401055, adch74401056, adch74412460, adch74401057, adch101961533, bathlochawenorth, bathlochawesouth, bathlochcluanie, bathlochdoon, bathlochduntelchaig, bathlochearn, bathlocherichtlower, bathlocherichtupper, bathlochfannich, bathlochgarryness, bathlochgarrytay, bathlochglass, bathlochharray, bathlochlaidon, bathlochleven, bathlochlomondnorth, bathlochlomondsouth, bathlochloyne, bathlochluichart, bathlochlyon, bathlochmhor, bathlochmonar, bathlochmullardoch, bathlochquoich, bathlochrannoch, bathlochshiellower, bathlochshielupper, bathlochshinlower, bathlochshinupper, bathlochtayeast, bathlochtaywest, bathlochtreig, bathlochtummel, county74400288, county119952600, county74400145, county135908105, county74400334, estate121129476,  estate121129386, estate121129410, estate121129416, estate121129419, estate132293752, estate129392884, estate132293758, estate121129389, estate121129413, estate129393076, estate129393010, estate129393148, estate114473788, estate114473785, estate103427429, estate129392971, estate129393253,  estate125491577, estate121129473, estate121129458, estate110069086, estate132293749, estate132293755, estate129392983, estate129392986, estate129392989, estate129392992, estate129392995, estate129392911, estate121129434, estate129392908, estate114473773, estate110069083, estate129393019, estate129393103, estate129393049, estate110323727, estate132293842, estate121129461, estate110069080, estate103427459, estate103427450, estate103427447, estate129392893, estate129393328, estate129393580, estate121129443, estate121129392, estate129393397, estate129392887, estate121129464, estate132293743, estate129392947, estate129392950, estate106697318, estate129392935, estate132293857, estate106697324, estate129392887t, estate129393172, estate_balmaclellan, estate129393712, estate129393715, estate129393718, estate129393721, estate129393724, estate129393676, estate129393709, estate129393706, estate129393763, estate_earlstoun, estate125491588, estate129393664, estate132293782, estate129393778, estate129393754, estate129393745, estate125491585, estate129393751, estate125491597, estate129393583, estate129393661, estate106697330, estate106697333, estate106697336, estate106697339, estate125491591, estate125491601, estate114473887, estate106697342, estate129393769, estate125491594, estate114473800, estate114473809, estate114473806, estate114473794, estate114473797, estate114473815, estate125491581, estate114473830, estate114473845, estate114473854, estate114473824, estate114473836, estate114473842, estate114473848, estate114473851, estate114473839, estate114473827, estate129393667, estate129393016, estate129393076l, estate129393016c, estate74436591, aberdeen, aberdeen1879, aberdeen1883, aberdeen1895, aberdeen1902, aberdeen1905, aberdeen1915, airdrie, alexandria, alloa, annan, arbroath, ardhallow, ayr, barry, berwick, braefoot, brechin, burntisland, burntisland1824, campbeltown, campbeltown_goad, cloch, coatbridge, cramond, cupar1854, cupar1893, dalkeith1852, dalkeith1893, dreghorn, dumbarton, dumfries1850, dumfries1893, dundee_goad, dundee1857, dundee1870, dundee1882, dundee1888, dundee1891, dundee1892, dundee1893, dundee1897, dundee1900, dundee1903, dundee1906, dundee1908, dundee1910, dundee1911, dunfermline1854, dunfermline1893, edin_newington_1826, edin1765, edin1784, edin1804, edin1817, edin1819, edin1821, edin1822, edin1831, edin1832, edin1849, edin1865, edin1876, edin1882, edin1885, edin1888, edin1891, edin1892, edin1892b, edin1893, edin1902, edin1905, edin1907, edin1910, edin1912, edin1917, edin1918, edin1919, edin1932, edin1939, edin1944_1963, edinburgh_castle, edinburgh_goad, elgin, falkirk, forfar, forres, galashiels, girvan, glas1778, glas1807, glas1857, glas1882, glas1888, glas1891, glas1894, glas1895, glas1900, glas1905, glas1910, glas1914, glas1920, glas1925, glasgow_goad, glasgow1930, glasgow1936, greenock, greenock_goad, greenock1861, greenock1879, greenock1887, greenock1895, greenock1915, haddington1853, haddington1893, hamilton, hawick, inchcolm, inchkeith_2500, inchkeith_500, inchmickery, inverness, irvine, jedburgh, kelso, kilmarnock, kirkcaldy1855, kirkcaldy1894, kirkcudbright1850, kirkcudbright1893, kirkintilloch, kirriemuir, lanark, leith_goad, linlithgow, maybole, montrose, musselburgh1853, musselburgh1893, nairn, oban,ossixinchfirstengland, sixinchenglandwales, oneinchrevisedcolouredengland, oneinchthirdengwalcolour, OS25inchGloucester3rdengland, OS25inchGuildford, bartholomew_half_1919, twentyfivethousandengwal, oneinchpopular_england, oneinchpopular_outline_england, oneinchnewpop, landutilisationsurveyengwal25k, landutilisationsurveyengwalscapes, landutilisationsurveyengwalwildscapeveg, landutilisationsurveyengwalwildscapehab,  oneinchseventhengwal, OStownsALL, OStownsALL1056, OSTownsAberdare, OSTownsAbergavenny, OSTownsAberystwyth, OSTownsAbingdon, OStownsAccrington, OSTownsAccrington, OSTownsAldershot, OSTownsAlnwick, OStownsAlnwick2640, OSTownsAltrincham, OSTownsAndover, OSTownsAppleby, OSTownsAshford, OStownsAshton, OStownsAshton2, OSTownsAtherstone, OSTownsAylesbury, OStownsBacup, OSTownsBacup, OSTownsBanbury, OSTownsBangor, OStownsBarnsley, OSTownsBarnsley, OSTownsBarnstaple, OSTownsBarrowinFurness, OSTownsBasingstoke, OSTownsBath, OSTownsBatley, OSTownsBeccles, OSTownsBedford, OSTownsBelper, OSTownsBerkhamstead, OStownsBeverley, OSTownsBeverley, OSTownsBideford, OSTownsBiggleswade, OStownsBingley, OSTownsBingley, OSTownsBirkenhead, TownsBirmimgham1855, OSTownsBirmingham, OSTownsBirstal, OSTownsBishopAuckland, OSTownsBishopsStortford, OStownsBlackburn, OSTownsBlackburn, OSTownsBlackpool, OStownsBlyth, OSTownsBlyth, OSTownsBodmin, OStownsBolton, OSTownsBolton, OSTownsBoston, OSTownsBournemouth, OStownsBradford, OSTownsBradford, OSTownsBradfordonAvon, OSTownsBraintree, OSTownsBrentwood, OSTownsBridgnorth, OSTownsBridgwater, OStownsBridlington, OSTownsBridlington, OSTownsBridport, OSTownsBrierleyHill, OSTownsBrighouse, OSTownsBrighton, OSTownsBristol, OSTownsBrixham, OSTownsBromsgrove, OSTownsBuckingham, OStownsBurnley, OSTownsBurnley, OSTownsBurslem, OSTownsBurtonuponTrent, OStownsBury, OSTownsBury, OSTownsBuryStEdmunds, OSTownsBuxton, OSTownsCamborne, OSTownsCambridge, OSTownsCanterbury, OSTownsCardiff, OSTownsCarmarthen, OSTownsCarnarvon, OSTownsCastleford, OSTownsCheltenham, OSTownsChertsey, OSTownsChester, OSTownsChesterfield, OSTownsChesterton, OSTownsChichester, OSTownsChippenham, OStownsChorley, OSTownsChorley, OSTownsChowbent, OSTownsChristchurch, OSTownsCirencester, OSTownsClaytonleMoors, OSTownsCleckheaton, OSTownsClevedon, OStownsClitheroe, OSTownsCockermouth, OSTownsColchester, OStownsColne, OSTownsColne, OSTownsCongleton, OSTownsCoventry, OSTownsCrediton, OSTownsCrewe, OSTownsCrewkerne, OSTownsCroydon, OSTownsDaltoninFurness, OSTownsDarlaston, OStownsDarlington, OSTownsDartford, OSTownsDartmouth, OSTownsDarwen, OSTownsDawlish, OSTownsDeal, OSTownsDenbigh, OSTownsDerby, OSTownsDevizes, OStownsDewsbury, OStownsDoncaster, OSTownsDoncaster, OSTownsDorchester, OSTownsDorking, OSTownsDouglas, OSTownsDover, OSTownsDroitwich, OSTownsDudley, OSTownsDunstable, OSTownsDurham, OSTownsEastbourne, OSTownsEastDereham, OSTownsEastRetford, OSTownsEccles, OSTownsElland, OSTownsEly, OSTownsEvesham, OSTownsExeter, OSTownsExmouth, OSTownsFalmouth, OSTownsFarnham, OSTownsFarnworth, OSTownsFarsley, OSTownsFaversham, OStownsFleetwood, OSTownsFleetwood, OSTownsFolkestone, OSTownsFrome, OSTownsGainsborough, OSTownsGarston, OSTownsGlossop, OSTownsGloucester, OSTownsGodmanchester, OSTownsGoole, OSTownsGosport, OSTownsGrantham, OSTownsGravesend, OSTownsGreatDriffield, OSTownsGreatGrimsby, OSTownsGreatHarwood, OSTownsGreatMalvern, OSTownsGreatMarlow, OSTownsGreatYarmouth, OSTownsGuildford, OStownsHalifax, OSTownsHalifax, OSTownsHalstead, OSTownsHarrogate, OSTownsHartlepool, OSTownsHarwich, OStownsHaslingden, OSTownsHaslingden, OSTownsHastings, OSTownsHaverfordwest, OSTownsHebdenBridge, OSTownsHeckmondwike, OSTownsHemelHempstead, OSTownsHenleyonThames, OSTownsHereford, OSTownsHertford, OSTownsHexham, OStownsHeywood, OSTownsHeywood, OSTownsHighWycombe, OSTownsHinckley, OSTownsHindley, OSTownsHolyhead, OSTownsHolywell, OSTownsHorncastle, OSTownsHorsham, OSTownsHorwich, OStownsHowden, OSTownsHucknallTorkard, OStownsHuddersfield, OSTownsHuddersfield, OSTownsHuntingdon, OSTownsHyde, OSTownsIdle, OSTownsIlfracombe, OSTownsIlkeston, OSTownsIlkley, OSTownsIpswich, OStownsKeighley, OSTownsKeighley, OSTownsKendal, OSTownsKettering, OSTownsKidderminster, OSTownsKidsgrove, OSTownsKingsLynn, OStownsKingstonuponHull, OSTownsKingstonuponHull, OStownsKingstonuponThames, OStownsKnaresborough, OSTownsKnaresborough, OSTownsKnottingley, OSTownsLancaster, OStownsLancaster1056, OSTownsLeeds, OStownsLeeds1056, OSTownsLeek, OSTownsLeicester, OSTownsLeigh, OSTownsLeightonBuzzard, OSTownsLeominster, OSTownsLewes, OSTownsLichfield, OSTownsLincoln, OSTownsLiskeard, OSTownsLittleborough, OStownsLiverpool, OSTownsLiverpool, OSTownsLlandudno, OSTownsLlanelly, OStownsLondon5280, OStownsLondon1056, OStownsLondon, OSTownsLongEaton, OSTownsLoughborough, OSTownsLouth, OSTownsLowestoft, OSTownsLudlow, OSTownsLuton, OSTownsLymington, OSTownsLytham, OSTownsMacclesfield, OSTownsMaidenhead, OSTownsMaidstone, OSTownsMaldon, OStownsMalton, OStownsManchester, OSTownsManchesterandSalford, OSTownsMansfield, OSTownsMarch, OSTownsMargate, OSTownsMaryport, OSTownsMelcombeRegis, OSTownsMeltonMowbray, OSTownsMerthyrTydfil, OStownsMiddlesbrough, OSTownsMiddlesbrough, OStownsMiddleton, OSTownsMiddleton, OSTownsMirfield, OSTownsMold, OSTownsMonmouth, OSTownsMorecambe, OSTownsMorley, OSTownsMorpeth, OSTownsMossley, OSTownsNantwich, OSTownsNeath, OSTownsNelson, OSTownsNewark, OSTownsNewbury, OSTownsNewcastle1894, OSTownsNewcastle1900s, OSTownsNewMalton, OSTownsNewmarket, OSTownsNewport, OSTownsNewportIsleofWight, OSTownsNewtonAbbot, OSTownsNewtown, OSTownsNorthampton, OSTownsNorthwich, OSTownsNorwich, OSTownsNottingham, OSTownsNuneaton, OSTownsOldbury, OSTownsOldham, OStownsOrmskirk, OSTownsOrmskirk, OSTownsOswestry, OSTownsOtley, OSTownsOxford, OSTownsPadiham, OSTownsPembroke, OSTownsPembrokeDock, OSTownsPenrith, OSTownsPenzance, OSTownsPeterborough, OSTownsPetersfield, OSTownsPetworth, OSTownsPlumstead, OStownsPlymouth1850s, OStownsPontefract, OSTownsPontefract, OSTownsPontypool, OSTownsPoole, OSTownsPortsmouth, OStownsPrescot, OSTownsPrescot, OStownsPreston, OSTownsPreston, OSTownsRamsbottom, OSTownsRamsey, OSTownsRamsgate, OSTownsRavensthorpe, OSTownsRawtenstall, OSTownsReading, OSTownsRedditch, OSTownsRedhill, OSTownsRedruth, OSTownsReigate, OSTownsRhyl, OStownsRichmond, OSTownsRichmond, OStownsRipon, OSTownsRipon, OSTownsRishton, OStownsRochdale, OSTownsRochdale, OSTownsRochester, OSTownsRomford, OSTownsRomsey, OStownsRotherham, OSTownsRotherham, OSTownsRoyalLemingtonSpa, OSTownsRoyton, OSTownsRugby, OSTownsRuncorn, OSTownsRyde, OSTownsRye, OSTownsSaffronWalden, OSTownsSalisbury, OSTownsSandwich, OStownsScarborough, OSTownsScarborough, OStownsSelby, OSTownsSelby, OSTownsSevenoaks, OStownsSheffield, OSTownsSheffield, OSTownsSheptonMallet, OSTownsSherborne, OSTownsShipley, OSTownsShrewsbury, OStownsSkipton, OSTownsSkipton, OSTownsSleaford, OSTownsSlough, OSTownsSouthampton, OSTownsSouthport, OSTownsSowerbyBridge, OSTownsSpalding, OStownsSt_Helens, OSTownsStafford, OSTownsStamford, OSTownsStAustell, OSTownsStHelens, OSTownsStIves, OStownsStockport, OStownsStockport2, OSTownsStocktonuponTees, OStownsStockton1890s, OStownsStockton1890s, OSTownsStone, OSTownsStourbridge, OSTownsStowmarket, OSTownsStratfordonAvon, OSTownsStroud, OSTownsSudbury, OSTownsSuttoninAshfield, OSTownsSwansea, OSTownsSwindon, OSTownsSwinton, OSTownsTamworth, OSTownsTaunton, OSTownsTavistock, OSTownsTenby, OSTownsTewkesbury, OSTownsThetford, OSTownsTiverton, OStownsTodmorden, OSTownsTodmorden, OSTownsTonbridge, OSTownsTorquay, OSTownsTotnes, OSTownsTring, OSTownsTrowbridge, OSTownsTruro, OSTownsTunbridgeWells, OSTownsTyldesley, OSTownsTyneside, OStownsTyneside1890s, OStownsUlverston, OSTownsUlverston, OStownsWakefield, OSTownsWakefield, OSTownsWallsend, OSTownsWalsall, OSTownsWalthamAbbey, OSTownsWare, OSTownsWarminster, OStownsWarrington, OSTownsWarrington, OSTownsWarwick, OSTownsWatford, OSTownsWednesbury, OSTownsWellingborough, OSTownsWellington, OSTownsWells, OSTownsWelshpool, OSTownsWestBromwich, OSTownsWestCowes, OSTownsWestonsuperMare, OSTownsWeymouth, OStownsWhitby, OSTownsWhitby, OSTownsWhitchurch, OSTownsWhitehaven, OSTownsWidnes, OStownsWigan, OSTownsWigan, OSTownsWinchester, OStownsWindsor, OSTownsWisbech, OSTownsWithington, OSTownsWokingham, OSTownsWolverhampton, OSTownsWorcester, OSTownsWorksop, OSTownsWorthing, OSTownsYeovil, OStownsYork, OSTownsYork, paisley, paisley_goad, peebles, perth1716, perth1783, perth1823, perth1827, perth1832, perth1860, perth1860b, perth1893, perth1895, perth1901, perth1902, perth1907, perth1912, perth1933, peterhead, portglasgow, portkil, portobello, rothesay, selkirk, standrews1854, standrews1893, stirling, stonehaven, stranraer1847, stranraer1867, stranraer1893, strathaven, wick, wigtown1848, wigtown1894, county_chester_1794, county_cumberland_1823, county_durham_1819, county_lancashire_1828, county_lincolnshire_1828, county_westmorland_1823, county_yorkshire_1828, london_gsgs4157, greatbritain50k, irelandbart, irelandgsgs, channel_islands_town_plans, os2500_group_great_britain_channel_islands, sixinch2_channel_islands, channel_islands_six_inch_1960s, channel_islands_two_inch, channel_islands_three_inch, trench101723168, trench101723205, trench101723208, trench101723211, trench101723214, trench101724055, trench101723220, trench101723223, trench101723229, trench101724060, trench101723232, trench101724050, trench101724027, trench101724030, trench101723171, trench101723174, trench101723196, trench101723217, trench101723199, trench101724033, trench101724036, trench101464585, trench101464588, trench101464591, trench101464594, trench101464609, trench101464612, trench101464615, trench101464618, trench101464630, trench101464627, trench101464639, trench101464642, trench101464645, trench101464636, trench101464681, trench101464684, trench101464687, trench101464648, trench101464651, trench101464654, trench101464657, trench101464660, trench101464663, trench101464666, trench101464669, trench101464672, trench101464675, trench101464693, trench101464696, trench101464705, trench101464708, trench101464711, trench101464714, trench101464699, trench101464702, trench101464726, trench101464729, trench101464732, trench101464735, trench101464738, trench101464741, trench101464744, trench101464747, trench101464750, trench101464753, trench101464756, trench101464759, trench101464762, trench101464765, trench101464768, trench101464765, trench101464774, trench101464777, trench101464780, trench101464783, trench101464771, trench101464786, trench101464789, trench101464792, trench101464795, trench101464798, trench101464801, trench101464804, trench101464807, trench101464810, trench101464813, trench101464816, trench101464822, trench101464825, trench101464828, trench101464831, trench101724021, trench101723247, trench101723250, trench101723253, trench101464837, trench101464834, trench101464840, trench101464846, trench101464843, trench101464849, trench101464855, trench101464858, trench101464867, trench101464864, trench101464861, trench101464873, trench101464870, trench101464876, trench101464879, trench101464882, trench101464885, trench101464897, trench101464903, trench101464900, trench101464918, trench101464915, trench101464912, trench101464909, trench101464939, trench101464936, trench101464933, trench101464930, trench101464927, trench101464924, trench101464921, trench101464948, trench101464945, trench101464942, trench101464951, trench101464954, trench101464957, trench101464960, trench101464966, trench101464963, trench101464969, trench101464978, trench101464975, trench101464987, trench101464984, trench101464981, trench101464990, trench101464999, trench101464996, trench101464993, trench101465002, trench101465011, trench101465008, trench101465005, trench101465020, trench101465017, trench101465023, trench101465029, trench101465032, trench101465035, trench101465050, trench101465047, trench101465044, trench101465071, trench101465068, trench101465065, trench101465062, trench101465059, trench101465056, trench101465053, trench101465095, trench101465092, trench101465089, trench101465086, trench101465083, trench101465080, trench101465077, trench101465074, trench101465098, trench101465104, trench101465101, trench101465107, trench101465119, trench101465116, trench101465122, trench101465137, trench101465134, trench101465131, trench101465128, trench101465140, trench101465161, trench101465158, trench101465155, trench101465152, trench101465149, trench101465146, trench101465164, trench101465167, trench101465194, trench101465191, trench101465188, trench101465185, trench101465182, trench101465176, trench101465170, trench101465209, trench101465206, trench101465203, trench101465200, trench101465197, trench101465224, trench101465221, trench101465218, trench101465215, trench101465251, trench101465248, trench101465245, trench101465242, trench101465239, trench101465236, trench101465233, trench101465230, trench101465227, trench101465257, trench101465254, trench101465263, trench101465260, trench101465269, trench101465266, trench101465275, trench101465272, trench101465287, trench101465284, trench101465281, trench101465278, trench101465293, trench101465290, trench101465302, trench101465296, trench101465308, trench101465305, trench101465311, trench101465323, trench101465320, trench101465317, trench101465314, trench101465329, trench101465326, trench101465332, trench101465368, trench101465365, trench101465341, trench101465344, trench101465338, trench101465335, trench101465347, trench101465350, trench101465353, trench101465356, trench101465359, trench101465371, trench101465362, trench101465377, trench101465374, trench101465380, trench101465383, trench101465386, trench101465389, trench101465392, trench101465395, trench101465398, trench101723235, trench101723238, trench101723833, trench101723202, trench101724065, trench101724042, trench101724045, trench101724024, trench101724039, trench101723830, trench101723165, belgiumgsgs4042, belgiumgsgs4336, belgiumgsgs4040, cyprus_kitchener, jamaica, india_half_first_ed, india_half_second_ed, india_one_first_ed, india_one_second_ed, hongkongcollinson, world_arrowsmith, world_bartholomew, tsa_ALL, R_esri_world_imagery, R_esri_world_topo, /* R_BingAerialWithLabels, R_BingSatellite, R_BingRoad, */ R_maptiler_basic, R_maptiler_satellite, R_maptiler_elevation, R_maptiler_hillshade, R_google_satellite, R_google_satellite_hybrid, R_osm, R_OSMapsLeisure, R_OSOpendata, R_OSMapsAPI, R_opentopomap, R_darkskiessource, R_landcovermap, R_LIDAR_1m_DTM, R_LIDAR_Comp_DTM_1m_2020, R_LIDAR_PhaseIDSM_DTM_1m, R_LIDAR_PhaseIIDSM_DTM_1m, R_LIDAR_PhaseIIIDSM_DTM_1m, R_LIDAR_PhaseIVDSM_DTM_1m, R_LIDAR_PhaseVDSM_DTM_1m, R_LIDAR_PhaseVIDSM_DTM_1m, R_LIDAR_Hebrides_DTM_1m, R_LIDAR_2m_DTM, R_LIDAR_1m, R_LIDAR_PhaseIDSM_1m, R_LIDAR_PhaseIIDSM_1m, R_LIDAR_PhaseIIIDSM_1m, R_LIDAR_PhaseIVDSM_1m, R_LIDAR_2m, R_LIDAR_Sherwood_DTM, R_LIDAR_Sherwood_DSM, R_blank_layer]; 
		
		}

//	var baseLayers = [ esri_world_imagery, esri_world_topo, maptiler_basic, maptiler_satellite, maptiler_elevation, osm, OSMapsLeisure, OSMapsAPI, OSOpendata, OS1920s, OS1900sGBback, opentopomap, darkskiessource, landcovermap, LIDAR_1m_DTM, LIDAR_2m_DTM, LIDAR_1m,  LIDAR_2m];


 function checkWidth() {
    var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var hasFocus = $('#nlsgaz').is(':focus');
	var hasFocus1 = $('#ngrgaz').is(':focus');
	var hasFocus2 = $('#searchgb1900').is(':focus');

	
	var headerHeight;

    if ((windowWidth >= 850) && (windowHeight >= 300)) {
		
		
	     if ($("#fullscreen-img") != null )    { jQuery("#fullscreen-img").hide();  }
			 
		 if ($("#exitfullscreen-img") != null )   { jQuery("#exitfullscreen-img").hide();  } 
		 
			jQuery("#searchSideBar").show(); 
         if ($("#layersSideBarOutlines") != null )  { jQuery("#layersSideBarOutlines").show(); }
		 
		 
         if ($("#layersSideBarOutlinesExplore") != null )  { jQuery("#layersSideBarOutlinesExplore").hide(); }
         if ($("#trackgeolocation") != null )  {jQuery("#trackgeolocation").show(); }
         if ($("#showlayers") != null ) { jQuery("#showlayers").hide(); }
         if ($("#searchSideBar") != null )  { jQuery("#searchSideBar").show(); }
         if ($("#showlayersOutlinesExplore") != null ) { jQuery("#showlayersOutlinesExplore").hide(); }
         if ($("#exploreslideroverlay") != null ) { jQuery("#exploreslideroverlay").show(); }
         if ($("#exploreslideroverlaymobile") != null ) { jQuery("#exploreslideroverlaymobile").hide(); }
		 if ($("#footermobile") != null ) { jQuery("#footermobile").hide(); }

		 
		if ($(".ol-zoomslider") != null )    { jQuery(".ol-zoomslider").hide();  }

		jQuery(".ol-zoom").css({ 'bottom': '.4em'});
		jQuery(".ol-zoom").css({ 'top': 'auto'});
		
		jQuery(".ol-attribution").css({ 'bottom': '35px'});		

		jQuery("#layerSelectchange").removeClass('hidden');
		
		jQuery("#layerSelectBackground").css({ 'top': '121px'  });

		jQuery("#layerSelectchange").show();

		jQuery("#layerSelectDiv").css({ 'top': '121px' });		
		jQuery("#layerSelectDiv").css({ 'left': '350px' });
		
		if ($("div[id^=\"GPimport-\"]") != null )  { jQuery("div[id^=\"GPimport-\"]").show(); }

		jQuery("div[id^=\"GPimport-\"]").css({ 'bottom': '165px' });	

		jQuery("div[id^=\"GPdrawing\"]").css({ 'top': '120px' });
		jQuery("div[id^=\"GPdrawing\"]").css({ 'right': '10px' });
		jQuery("div[id^=\"GPdrawingPanelClose\"]").css({ 'top': '5px' });
		jQuery("div[id^=\"GPdrawingPanelClose\"]").css({ 'right': '5px' });
		
		jQuery("div[id^=\"GPtoolbox-measure-main\"]").css({ 'right': '45px' });

    } else {
		
		  $("#footer").click(function() {
			 window.location = "https://maps.nls.uk";
			});
			
		var hasFocus3 = $('#overlaySelectNode').is(':focus');	
		var hasFocus4 = $("input#track").is(':checked');		
		
		console.log("hasFocus2: " + hasFocus4);


			if (((hasFocus) || (hasFocus1) || (hasFocus2)))
				
			{
				if ($("#searchSideBar") != null )  { jQuery("#searchSideBar").show(); }
			    if ($("#show") != null ) { jQuery("#show").hide(); }
			}
			else
			{
				if ($("#searchSideBar") != null )  { jQuery("#searchSideBar").hide(); }
				if ($("#show") != null ) { jQuery("#show").show(); }
			}


         if ($("#layersSideBarOutlines") != null )  
			{ if (hasFocus3) 
				{ jQuery("#layersSideBarOutlines").show();  jQuery("#showlayersOutlinesExplore").hide(); } 
				else 
				{ jQuery("#layersSideBarOutlines").hide();  jQuery("#showlayersOutlinesExplore").show(); } 
			}

			if ($("#showCoordinatesinfo") != null )  { jQuery("#showCoordinatesinfo").hide(); }

         if ($("#trackgeolocation") != null )  {jQuery("#trackgeolocation").show(); }
         if ($("#show") != null ) { jQuery("#show").show(); }
         if ($("#showlayersOutlinesExplore") != null ) { jQuery("#showlayersOutlinesExplore").show(); }
         if ($("#exploreslideroverlay") != null ) { jQuery("#exploreslideroverlay").show(); }
         if ($("#exploreslideroverlaymobile") != null ) { jQuery("#exploreslideroverlaymobile").show(); }
		 if ($("#footermobile") != null ) { jQuery("#footermobile").show(); }
		 

		 
		if ($(".ol-zoomslider") != null )    { jQuery(".ol-zoomslider").show();  } 
		
        if ($("#fullscreen-img") != null )    { jQuery("#fullscreen-img").show();  }
		
		if ($("#header").is(":visible"))
		{
		headerHeight = jQuery("#header").css( "height" );
		var headerHeightPx = headerHeight.substring(0, 3);
		
		console.log("headerHeight: " + headerHeight);
		}
		else
		{
		var headerHeightPx = 0;
				jQuery("#fullscreen-img").hide();
				jQuery("#exitfullscreen-img").show();
		}
		

		const layerSelectHeight = (Math.round(headerHeightPx) + 5);
		const layerSelectPx = (layerSelectHeight + 'px');
		const mapControlsHeight = (Math.round(headerHeightPx) + 34);
		const mapControlsHeightPx = (mapControlsHeight + 'px');

		const mapControlsNewHeight = (Math.round(headerHeightPx) - 15);
		const mapControlsNewHeightPx = (mapControlsNewHeight + 'px');
	
		console.log("mapControlsHeightPx: " + mapControlsHeightPx);
	
		const maplayerSelectBackground = (Math.round(headerHeightPx) + 70);
		const maplayerSelectBackgroundPx = (maplayerSelectBackground  + 'px');		
		
		const showHeight = (Math.round(headerHeightPx) + 34);
		const showHeightPx = (showHeight + 'px');
		const geolocationHeight = (Math.round(headerHeightPx) + 110);
		const geolocationHeightPx = (geolocationHeight + 'px');
		const searchSideBarHeight = (Math.round(headerHeightPx) + 120);
		const searchSideBarHeightPx = (searchSideBarHeight + 'px');
		const mapControlsMeasureHeight = (Math.round(headerHeightPx) + 34);
		const mapControlsMeasureHeightPx = (mapControlsHeight + 'px');

		const mapControlsZoomSliderHeight = (Math.round(headerHeightPx) + 110);
		const mapControlsZoomSliderHeightPx = (mapControlsZoomSliderHeight + 'px');
		
		if (urlLayerName.includes('allmaps'))
			
			{
				
			jQuery(".ol-zoom").css({ 'position': 'absolute' });
			jQuery("div[id^=\"GPdrawing\"]").css({ 'position': 'absolute' });
			jQuery("div[id^=\"GPtoolbox-measure-main\"]").css({ 'position': 'absolute' });
			console.log("mapControlsNewHeightPx: " + mapControlsNewHeightPx);			

			jQuery(".ol-zoom").css({ 'top': mapControlsNewHeightPx });
			jQuery("div[id^=\"GPdrawing\"]").css({ 'top': mapControlsNewHeightPx });
			jQuery("div[id^=\"GPtoolbox-measure-main\"]").css({ 'top': mapControlsNewHeightPx });
			
			}
			else
			{

			jQuery(".ol-zoom").css({ 'top': mapControlsHeightPx });
			jQuery("div[id^=\"GPdrawing\"]").css({ 'top': mapControlsHeightPx });
			jQuery("div[id^=\"GPtoolbox-measure-main\"]").css({ 'top': mapControlsHeightPx });
		
			}

        var windowWidth = $(window).width();
		
		jQuery("#layerSelectchange").hide();
		
		jQuery("#layerSelectDiv").css({ 'top': layerSelectPx });
		jQuery("#layerSelectDiv").css({ 'left': '5px' });

		jQuery(".ol-zoom").css({ 'bottom': 'auto' });
		jQuery(".ol-zoomslider").css({ 'top': mapControlsZoomSliderHeightPx });
		jQuery(".ol-rotate").css({ 'top': mapControlsHeightPx });
		jQuery("#show").css({ 'top': showHeightPx });
		jQuery("#geolocation-img").css({ 'top': mapControlsHeightPx });
		jQuery("#fullscreen-img").css({ 'top': mapControlsHeightPx });
		
		jQuery("#layerSelectBackground").css({ 'top': maplayerSelectBackgroundPx  });
		
		jQuery(".ol-attribution").css({ 'bottom': '0px'});		
		
		jQuery("#exitfullscreen-img").css({ 'top': mapControlsHeightPx });	


		
		jQuery("div[id^=\"GPtoolbox-measure-main\"]").css({ 'right': '45px' });

		
		
		jQuery("div[id^=\"GPimport-\"]").css( {    'z-index': 200002 } );
		
		jQuery("div[id^=\"GPimport-\"]").css({ 'bottom': '80px' });	


		

		jQuery("div[id^=\"GPdrawing\"]").css({ 'right': '10px' });
		
		
		if ($("div[id^=\"GPimport-\"]") != null )  { jQuery("div[id^=\"GPimport-\"]").show(); }
		
		if ($("div[id^=\"GPgetFeatureInfo\"]") != null ) { jQuery("div[id^=\"GPgetFeatureInfo\"]").hide(); }

		jQuery("div[id^=\"GPdrawingPanelClose\"]").css({ 'top': '5px' });
		jQuery("div[id^=\"GPdrawingPanelClose\"]").css({ 'right': '5px' });
		

		 
    }
	

 }

$(document).ready(function() {


	checkWidth();
	

			$(window).resize(function() 
			{
					checkWidth();

			});
			

});

if (document.getElementById("fullscreen-img") != null) {

	document.getElementById("fullscreen-img")
	    .addEventListener("click", function(event) {
	    event.preventDefault();
		jQuery("#header").hide();
		jQuery("#footer").hide();

		checkWidth();
		$('#map').focus();
	  	});

}

if (document.getElementById("exitfullscreen-img") != null) {

	document.getElementById("exitfullscreen-img")
	    .addEventListener("click", function(event) {
	    event.preventDefault();
		jQuery("#header").show();
		jQuery("#footer").show();

		checkWidth();
	  $('#map').focus();
	  	});

}


	loadOptions();

		var currentZoom = DEFAULT_ZOOM;
		var currentLat = DEFAULT_LAT;
		var currentLon = DEFAULT_LON;
		mapslidervalue = DEFAULT_MAPSLIDERVALUE;
		if (args['zoom'])
		{
			currentZoom = args['zoom'];
		}
		if (args['lat'] && args['lon'])
		{
			currentLat = parseFloat(args['lat']); 
			currentLon = parseFloat(args['lon']);		
		}
		if (args['zoom'] && args['lat'] && args['lon'])
		{
			defaultLLZ = false;	
		}
		if (args['layers'])
		{
			urlLayerName = args['layers'];
		}
		if (args['b'])
		{
			baseLayerName = args['b'];
		}
		if (args['o'])
		{
			mapslidervalue = args['o'];
		}
		if (args['marker'])
		{
		pointClicked = args['marker'];
		}

	      var attribution = new ol.control.Attribution({
	        collapsible: false
	      });




		var map = new ol.Map({

		  target: document.getElementById('map'),
		  target: 'map',
		  layers: [],
//		  controls: ol.control.defaults({attribution: false}).extend([attribution]),
		    controls: ol.control.defaults({ "attribution": false }),
		  logo: false,
		  overlays: [overlaylayer],
		  pixelRatio: 1,
		  view: new ol.View({
		    constrainRotation: false,
		    constrainResolution: false,
//	    smoothResolutionConstraint: false,
		    center: ol.proj.transform([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857'),
		    zoom: currentZoom

		  })
		});



	      function checkSize() {
	        var small = map.getSize()[0] < 800;
	        attribution.setCollapsible(small);
	        attribution.setCollapsed(small);
	      }checkSize
	
	      window.addEventListener('resize', checkSize);
	      checkSize();


	function switchtosinglelayers()  {
	
	        jQuery("#layerSelectBackground").hide();
	        jQuery("#layerSelectDiv").show();
			
	
	}

		function switchtoalllayers() {
	
            if ($("#layerSelectDiv") != null ) { jQuery("#layerSelectDiv").hide(); }	
			$("#layerSelectBackground").removeClass("hidden");	
			$("#layerSelectBackground").show();	
			

			overlaySelectedRight = getOverlayRight(baseLayerName);

	    map.getLayers().removeAt(2);
		

 	
        overlayLayersRight = [];
        var extent = map.getView().calculateExtent(map.getSize());
      	var Rbounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
		for (var i = 0; i < overlayLayersRightAll.length; i++) {
		var layerOL = overlayLayersRightAll[i];
		

		
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
			// if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 
			if(ol.extent.intersects(overlayBounds, bounds)) overlayLayersRight.push(layerOL);
		
	}

		updateOverlaySwitcherRight();
        	loadOverlayNodeRight();
		switchOverlayinitialRight();
		
//		updateUrl();
		}


	// A set of elevation layers - from https://github.com/Viglino/ol-ext/blob/master/examples/layer/map.layer.altitude.html
	

	var layers = [
		{
			title: 'MNT SRTM3',
			url: 'https://data.geopf.fr/wms-r/wms',
			layer: 'ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3',
			//extent: [ -20037554.725947514, -8625918.87376409, 20037554.725947514, 8625918.87376409 ]
		  },{
			title: 'MNS',
			url: 'https://data.geopf.fr/wms-r/wms',
			layer: 'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES.MNS',
			extent: [ -578959.605490584, 5203133.393641367, 921974.2487313666, 6643289.75487211 ]
		  }, {
			title: 'MNT-RGE-Alti',
			url: 'https://data.geopf.fr/wms-r/wms',
			layer: 'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES',
			extent: [ -7007874.496280316, -1460624.494037931, 5043253.3127169, 6639937.650114076 ]
		  }, {
			title: 'MNT BDAlti V1',
			url: 'https://data.geopf.fr/wms-r/wms',
			layer: 'ELEVATION.ELEVATIONGRIDCOVERAGE',
			extent: [ -7007874.496280316, -1460624.494037931, 5043253.3127169, 6639937.650114076 ]
		  }
	];

	// Add tile layer
	var layer = layers[0]


	var elev = new ol.layer.Tile ({
	  title: layer.title,
	  displayInLayerSwitcher: false,
	  extent: layer.extent,
	  minResolution: 0,
	  maxResolution: 197231.79878968254,
	  source: new ol.source.TileWMS({
	    url: layer.url,
	    projection: 'EPSG:3857',
	    attributions: [ 'Geoservices-IGN' ],
	    crossOrigin: 'anonymous',
	    params: {
	      LAYERS: layer.layer,
	      FORMAT: 'image/x-bil;bits=32',
	      VERSION: '1.3.0'
	    }
	  })
	});


	// Tile load function to convert elevation
	var alti = ol.ext.imageLoader.elevationMap();
	elev.getSource().setTileLoadFunction(alti);
	
	// Hide the layer (but keep it on the map)
	var hide = new ol.filter.CSS({ display: false });
	elev.addFilter(hide);
	
	// Prevent layer smoothing
	elev.once('prerender', function(evt) {
	  evt.context.imageSmoothingEnabled = false;
	  evt.context.webkitImageSmoothingEnabled = false;
	  evt.context.mozImageSmoothingEnabled = false;
	  evt.context.msImageSmoothingEnabled = false;
	});


	    var layerSelect = document.getElementById('layerSelectdropdown');
	    for (var x = 0; x < baseLayers.length; x++) {
	        // if (!baseLayers[x].displayInLayerSwitcher) continue;
	        var option = document.createElement('option');
		option.appendChild(document.createTextNode(baseLayers[x].get('title')));
	        option.setAttribute('value', x);
	        option.setAttribute('id', baseLayers[x].get('mosaic_id'));
	        layerSelect.appendChild(option);
	    }

	map.getLayers().insertAt(0,scotland_layer2);
	map.getLayers().insertAt(1,scotland_layer3);

	if (baseLayerName == undefined) {
			var baseSelected = baseLayers[0];
		}

	else    {
		

		
			var baseSelected = getbaseLayer(baseLayerName);
		}
		


	if (baseSelected)
		
		{
			
//		if (parseInt(baseLayerName) > 22) { console.log("yes") ; baseLayerName == '1';  }			


		map.getLayers().insertAt(2,baseSelected);
		
		var baseLayerTitle = map.getLayers().getArray()[2].get('title');
		


			if (baseLayerTitle.includes("Google"))  {

				jQuery("#googleexplore").removeClass('hidden');
				jQuery("#googleexplore").show();
			}
			else
			{ 
				jQuery("#googleexplore").hide();
			}


		var baseLayerName = map.getLayers().getArray()[2].get('mosaic_id');

//	document.getElementById("layerSelect").selectedIndex = baseLayerName - 1;
	
	var sel = document.getElementById('layerSelectdropdown');
	var val = Math.round(baseLayerName);
						
		for(var i = 0, j = sel.options.length; i < j; ++i) {
				if(sel.options[i].id === baseLayerName) {
					sel.selectedIndex = i;
					break;
				}
		}	
		

		getbaseLayer(baseLayerName).setVisible(true);

		}
	
	else
		
		{
			
			
				
            if ($("#layerSelectDiv") != null ) { jQuery("#layerSelectDiv").hide(); }	
			$("#layerSelectBackground").removeClass("hidden");	
			$("#layerSelectBackground").show();	
			

			overlaySelectedRight = R_esri_world_imagery;


			
			if ($("#layerSelectDiv") != null ) { jQuery("#layerSelectDiv").hide(); }	
			$("#layerSelectBackground").removeClass("hidden");	
			$("#layerSelectBackground").show();	
			

			if (getOverlayRight(baseLayerName) == undefined) {
				overlaySelectedRight = overlayLayersRight[0];
			}
			else
			{
			var overlaySelectedRight = getOverlayRight(baseLayerName);
			}

//			console.log("baseLayerName: " + baseLayerName);

			console.log("overlaySelectedRight.get('title'): " + overlaySelectedRight.get('title'));


			if (overlaySelectedRight) { overlaySelectedRight.setVisible(true); }

		overlayOldNameRight = overlaySelectedRight.get('title');
		
		overlaySelectedRight.setVisible(true);

//		map.getLayers().insertAt(2,overlaySelectedRight);
		
		baseLayerName = overlaySelectedRight;
	
		console.log("overlayLayersRight.length: " + overlayLayersRight.length);


		updateOverlaySwitcherRight();
			loadOverlayNodeRight();
			

		switchOverlayinitialRight();
//		updateUrl();

/*
		var overlaycurrentRight = map.getLayers().getArray()[2];
		var e1RightMap = document.getElementById('overlaySelectNodeRight');
            var selNode1IndexRightMap = e1RightMap.options[e1RightMap.selectedIndex].value;
            var node1RightMap = overlayTreeRight.subnodes[selNode1IndexRightMap];
            var e2RightMap = document.getElementById('overlaySelectLayerRight');
            var selNode2IndexRightMap = e2RightMap.options[e2RightMap.selectedIndex].value;
            var selOverlayRightMap = node1RightMap.subnodes[selNode2IndexRightMap];
            //set switchers to permalink overlay
            if(selOverlayRightMap.layer!==overlaycurrentRight) {
                e1RightMap.options[overlaycurrentRight.overlayNodePath[0]].selected = true;
                loadOverlayNodeRight();
                e2RightMap.options[overlaycurrentRight.overlayNodePath[1]].selected = true;
  //              switchOverlayRight();
            } 
			
//			console.log("baseLayerName: " + baseLayerName);
//		updateUrl();
			*/		

		}
		


	map.getLayers().insertAt(3,trench_maps); 




	// map.on("moveend", setPanEnd);

	// Change historical map
	var changemap = function(index) {
		
	
		if (baseLayers[index].get('mosaic_id') == 23)
		{ switchtoalllayers(); return; }
		

		
	  map.getLayers().removeAt(2);
	  map.getLayers().insertAt(2,baseLayers[index]);
	  // map.getLayers().getArray()[1].setOpacity(opacity);
	  updateUrl();
	  getbaseLayer(baseLayerName).setVisible(true);
	  

		var baseLayerTitle = map.getLayers().getArray()[2].get('title');
	


			if (baseLayerTitle.includes("Google"))  {
				jQuery("#googleexplore").removeClass('hidden');
				jQuery("#googleexplore").show();
			}
			else
			{ 
				jQuery("#googleexplore").hide();
			}
	


			if (baseLayerTitle.includes("Google"))  {

				jQuery("#googleexplore").removeClass('hidden');
				jQuery("#googleexplore").show();
			}
			else
			{ 
				jQuery("#googleexplore").hide();
			}

	}

//    var zoomslider = new ol.control.ZoomSlider();
//    map.addControl(zoomslider);
//    var scaleline = new ol.control.ScaleLine();
//    map.addControl(scaleline);

    var mouseposition = new ol.control.MousePosition({
            projection: 'EPSG:4326',
            coordinateFormat: function(coordinate) {
	    // BNG: ol.extent.applyTransform([x, y], ol.proj.getTransform("EPSG:4326", "EPSG:27700"), 

		var str = map.getLayers().getArray()[4].get('group_no');

		var coord27700 = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:27700');
		var templatex = '{x}';
		var outx = ol.coordinate.format(coord27700, templatex, 0);
		var templatey = '{y}';
		var outy = ol.coordinate.format(coord27700, templatey, 0);
		NGR = gridrefNumToLet(outx, outy, 10);
		var coord29902 = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:29902');
		var trench = forwardProject2(coordinate[0], coordinate[1]);
		var irishgrid = latLonToIrishGrid(coordinate[0], coordinate[1]);
		var irishgridref = irishGridRef(Math.round(coord29902[0]), Math.round(coord29902[1]), 8);
		var trench2 = forwardConvertMapSheet();
		var hdms = ol.coordinate.toStringHDMS(coordinate);
		

		if ((coordinate[0] > -10.56)  && (coordinate[0] < -5.34) && (coordinate[1] > 51.39)  && (coordinate[1] < 55.43))
		
			{
			
			if ((coordinate[0] > -5.90)  && (coordinate[0] < -5.34) && (coordinate[1] > 55.22)  && (coordinate[1] < 55.43))
			
				{
				return '<strong>' + NGR + '</strong>&nbsp; <br/>' + ol.coordinate.format(coord27700, '{x}, {y}', 0) + 
				'&nbsp; <br/>' + ol.coordinate.format(coordinate, '{y}, {x}', 5) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; 
				}
				else
				{
				return '<strong>' +  irishgridref + '</strong>  &nbsp;<br/>'  +  Math.round(coord29902[0]) + ', ' + Math.round(coord29902[1]) + ' &nbsp;</br/>' +
					 ol.coordinate.format(coordinate, '{y}, {x}', 5) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; 	
				}
			}
		if ((outx  < 0) || (outx > 700000 ) || (outy < 0) || (outy > 1300000 )) {
			if ((trench2 !== 'error') && (str == 60))
			{
		        return '<strong>' + ol.coordinate.format(coordinate, '{y}, {x}', 5) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;<br/>&nbsp;Trench Map Coordinates: '  + trench2 + ' &nbsp;'; 
			}
			else
			{
		        return '<strong>' + ol.coordinate.format(coordinate, '{y}, {x}', 5) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; 
		        
		        // <br/>' + Math.round(coord29902[0]) + ', ' + Math.round(coord29902[1]) + '<br/>' +         irishgridref ; 
				
				//  +  ${irishgrid.E},  ${irishgrid.N}
			}
		}
		else 
                { return '<strong>' + NGR + '</strong>&nbsp; <br/>' + ol.coordinate.format(coord27700, '{x}, {y}', 0) + 
			'&nbsp; <br/>' + ol.coordinate.format(coordinate, '{y}, {x}', 5) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; }
            	}
    });

    map.addControl(mouseposition);


	


	
//	map.addControl(new ol.control.CanvasAttribution({ canvas: true }));
	// Add a title control
//	map.addControl(new ol.control.CanvasTitle({ 
//	  title: 'my title', 
//	  visible: false,
//	  style: new ol.style.Style({ text: new ol.style.Text({ font: '20px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif'}) })
//	}));


	// Print control
	var printControl = new ol.control.PrintDialog();
	printControl.setSize('A4');
	map.addControl(printControl);

	map.addControl(new ol.control.CanvasAttribution({ canvas: true }));
	
	map.addControl(new ol.control.CanvasScaleLine());



	printControl.on(['print', 'error'], function(e) {
		

	jQuery(".ol-attribution").hide();
		
	  // Print success
	  if (e.image) {
		if (e.pdf) {
		  // Export pdf using the print info
		  var pdf = new jsPDF({
			orientation: e.print.orientation,
			unit: e.print.unit,
			format: e.print.size
		  });
		  pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
		  
//		  console.log("e.print.imageHeight: " + e.print.imageHeight);
		  pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
		} else  {
		  // Save image as file
		  e.canvas.toBlob(function(blob) {
			var name = (e.print.legend ? 'legend.' : 'map.')+e.imageType.replace('image/','');
			saveAs(blob, name);
		  }, e.imageType, e.quality);
		}
	  } else {
		console.warn('No canvas to export');
	  }
	  

	});


console.log("urlLayerName: " + urlLayerName);


	if (getOverlay(urlLayerName) == undefined) {


		overlaySelected = sixinch2;
	}
	else if (urlLayerName.includes('allmaps')) {
		console.log("allmaps");
	}
	else
	{
		overlaySelected = getOverlay(urlLayerName);
	}
	

		


	if ((!map.getView().getCenter()) && (overlaySelected)) {
		var extent = [overlaySelected.get('minx'), overlaySelected.get('miny'), overlaySelected.get('maxx'), overlaySelected.get('maxy')];
	        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
	        map.getView().fit(extent, map.getSize());
	  }






//	updateOverlaySwitcher();
//       loadOverlayNode();


	if (overlaySelected.get('mosaic_id') == '117746211')  
		
		{ 
		
		console.log("117746211");
		
			var zoom = map.getView().getZoom();
			var zoom1 = zoom + 4;

			{ 
			map.getView().setZoom(Math.round(zoom1)); 
			
		console.log("zoom = " + map.getView().getZoom());
			}
		}

/*
	overlayOldName = overlaySelected.get('title');
        overlayLayersInitial = [];
        overlayLayers = [];
        var extent = map.getView().calculateExtent(map.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
		for (var i = 0; i < overlayLayersAll.length; i++) {
		var layerOL = overlayLayersAll[i];
	
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
			// if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 
			if(ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL);
		
	}
	
*/
		setTimeout( function(){	
			
			if (overlaySelected.get('mosaic_id') == '117746211')  
				
				{ 
					var zoom = map.getView().getZoom();
					var zoom2 = zoom - 4;

					{ 
					map.getView().setZoom(Math.round(zoom2)); 

					}
					 $('#map').focus();
				}
		}, 200); // delay 50 ms



	jQuery('#scaleslider').slider({
	   min: 12,
	   max: 20,
    	   ticks: [12, 13, 14, 15, 16, 17, 18, 19, 20],
	   ticks_positions: [0, 12, 24, 36, 48, 60, 72, 86, 100], 
//	   value: parseInt(slidervalue),
//   	   ticks_labels: ['<1:250,000','','','','','','','', '>1:500'],
//		data-slider-tooltip: 'hide', 
           ticks_snap_bounds: 1,
		lock_to_ticks: true,
	   setValue: [12,20],
	   tooltip: 'hide',
	   formatter: function(value) {

		  },
	   lock_to_ticks: true,
//	   step: 40,
	});



	$( "#scaleslider" ).on( "slide", function( event, ui ) 
		{ 	

		
		scales = $( "#scaleslider" ).slider('getValue');
		
			if (scales[0] == 12) { var scale1 = '<1:250,000'; }
			else if (scales[0] == 13) { var scale1 = '<1:150,000'; }
			else if (scales[0] == 14) { var scale1 = '1:70,000'; }
			else if (scales[0] == 15) { var scale1 = '1:35,000'; }
			else if (scales[0] == 16) { var scale1 = '1:15,000'; }
			else if (scales[0] == 17) { var scale1 = '1:8,000'; }
			else if (scales[0] == 18) { var scale1 = '1:4,000'; }
			else if (scales[0] == 19) { var scale1 = '1:2,000'; }
			else if (scales[0] == 20) { var scale1 = '>1:1,000'; }



			if (scales[1] == 12) { var scale2 = '<1:250,000'; }
			else if (scales[1] == 13) { var scale2 = '<1:150,000'; }
			else if (scales[1] == 14) { var scale2 = '1:70,000'; }
			else if (scales[1] == 15) { var scale2 = '1:35,000'; }
			else if (scales[1] == 16) { var scale2 = '1:15,000'; }
			else if (scales[1] == 17) { var scale2 = '1:8,000'; }
			else if (scales[1] == 18) { var scale2 = '1:4,000'; }
			else if (scales[1] == 19) { var scale2 = '1:2,000'; }
			else if (scales[1] == 20) { var scale2 = '>1:1,000'; }



	document.getElementById('scalerange').innerHTML =  scale1 + " - " + scale2;


		} 
	);	


	$( "#scaleslider" ).on( "slideStop", function( event, ui ) 
		{ 	
			$( "#layerfiltercheckbox" ).prop( "checked", false );
			zoomInOut();
		} 
	);	


function clearfilters()  {
	
	document.getElementById( "slider" ).noUiSlider.set([1745,1990]);
	jQuery( "#scaleslider" ).slider('setValue',[12,20]);
	document.getElementById('keywordsearch').value = 'Type keyword...';	
	document.getElementById('filteroverlaysinput').value = 'Type keyword...';	
	
	 zoomInOut();
}


function setOverlayLayerscoverage(overlayLayersLength) {


	var layers = "";
	
	
	   jQuery( document ).ready(function() {
		   
				if ( document.getElementById('slider').noUiSlider )
					
					{
		   
					dates = document.getElementById('slider').noUiSlider.get('range');
			
					minyear = dates[0];
					maxyear = dates[1];
				
					}
					
					else
					{
					minyear = 1740;
					maxyear = 2025;					
					}
					
					console.log("minyear: " + minyear);
					console.log("maxyear: " + maxyear);
	
			if (((((( ( $( "#scaleslider" ).slider('getValue')[0] == 12 ) &&  ( $( "#scaleslider" ).slider('getValue')[1] == 20 ) &&  ( minyear < 1746 ) && ( maxyear > 1979 ) && ( document.getElementById('keywordsearch').value == 'Type keyword...' ) && ( document.getElementById('filteroverlaysinput').value == 'Type keyword...') ))))))


		
		{ 
			 var nofilters = true; 
			 console.log("nofilters; " + nofilters);


				if (overlayLayersLength == 1) 
				{
				layers += '&nbsp;No filters - 1 map layer covers this area';
				}

				else 
				{
					layers += '&nbsp;No filters - ' + overlayLayersLength + ' map layers cover this area';
				}
			
							jQuery('#clearfilters').hide();
							
				jQuery('#layerinfo').css({ 'background-color' : 'rgba(0,0,153,0.1)' });
			
		}
		
		else



			{

				if (overlayLayersLength == 1) 
				{
				layers += '&nbsp;<strong>Filters applied</strong> - 1 map layer covers this area';
				}

				else 
				{
					layers += '&nbsp;<strong>Filters applied</strong> - ' + overlayLayersLength + ' map layers cover this area';
				}
				
				 
				jQuery('#clearfilters').removeClass('hidden');
				jQuery('#clearfilters').show();

				jQuery('#layerinfo').css({ 'background-color' : 'rgba(255,121,0,0.1)' });

			}
			
	   });

	setLayers(layers);
	
	}


	function filterlist() {

			  // Declare variables
			  var input, filter, ul, opt, i, txtValue;
			  input = document.getElementById('filteroverlaysinput'); 
			  filter = input.value.toUpperCase().trim();
			  ul = document.getElementById("overlaySelectdropdown"); 
			  opt = ul.getElementsByTagName("option");

			  
			  console.log(" opt.length: " +  opt.length);
			  console.log("filter: " +  filter);

				  // Loop through all option rows, and hide those who don't match the search query
				  for (i = 0; i < opt.length; i++) {
					id = opt[i].id;
//					opt[i].style.display = "";
					if (id) {
//					  txtValue = id.textContent || id.innerText;
//					  console.log("id: " + id);
					  if (id.toUpperCase().search(filter) > -1) {
						opt[i].style.display = "";
					  } else {
						opt[i].style.display = "none";
//						opt[i].remove();
					  }
					}
				  }

				setTimeout( function() {
					
				overlayOldName = map.getLayers().getArray()[4].get('title');
					
					var sel = document.getElementById('overlaySelectdropdown');

					
					if (opt[0].style.display = "none")
						
						{
							
					var selectedIndexNo;
					
						  if (opt[0].id.toUpperCase().search(filter) > -1) {
									opt[0].style.display = "";
								  } else {
									opt[0].style.display = "none";
								  }					
						
					
						var sel = document.getElementById('overlaySelectdropdown');
						var val = $("#overlaySelectdropdown").find('option:not([style*="display: none"]):first').attr('id');
						
										console.log("val: " + val);
							for(var i = 0, j = sel.options.length; i < j; ++i) {
								if(sel.options[i].id === val) {
								   sel.selectedIndex = i;
								   
								   selectedIndexNo =  sel.selectedIndex;
									changeoverlay(selectedIndexNo);
								}
							}

							
						}
						

				},500);
				



	var numOverlaysLength = $("#overlaySelectdropdown").find('option:not([style*="display: none"])').length;

	setOverlayLayerscoverage(numOverlaysLength);

}




function scaleslidestop() {

	document.getElementById('filteroverlaysinput').value = 'Type keyword...';
	
//	urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
//	overlayOldName = map.getLayers().getArray()[4].get('title');
        overlayLayersInitial = [];
        overlayLayers = [];
        var extent = map.getView().calculateExtent(map.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
		for (var i = 0; i < overlayLayersAll.length; i++) {
			var layerOL = overlayLayersAll[i];
			
			  var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
				// if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 
				if(ol.extent.intersects(overlayBounds, bounds)) overlayLayersInitial.push(layerOL);
			
		}
		
	
   jQuery( document ).ready(function() {
	   
	     var zoom = map.getView().getZoom();
	   
	   	if ($('#layerfiltercheckbox').is(":checked")) {

			if (Math.round(zoom) < 9) 		
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,14]);
				}
	
			else if ((Math.round(zoom) > 8)  && (Math.round(zoom) < 10))	
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,14]);
				}
			else if ((Math.round(zoom) > 9)  && (Math.round(zoom) < 12))
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,16]);
				}
			else if ((Math.round(zoom) > 11)  && (Math.round(zoom) < 13))
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,16]);
				}
			else if ((Math.round(zoom) > 12)  && (Math.round(zoom) < 15))
				{
						jQuery( "#scaleslider" ).slider('setValue',[14,18]);
				}
			else if ((Math.round(zoom) > 14)  && (Math.round(zoom) < 16))
				{
						jQuery( "#scaleslider" ).slider('setValue',[14,18]);
				}
			else if ((Math.round(zoom) > 15)  && (Math.round(zoom) < 17))
				{
						jQuery( "#scaleslider" ).slider('setValue',[16,18]);
				}
			else if ((Math.round(zoom) > 16)  && (Math.round(zoom) < 18))
				{
						jQuery( "#scaleslider" ).slider('setValue',[16,20]);
				}
			else if (Math.round(zoom) > 17) 
				{
						jQuery( "#scaleslider" ).slider('setValue',[18,20]);
				}
				
		}
		else
		{
//			jQuery( "#scaleslider" ).slider('setValue',[16,20]);
			return;
		}
				
   });
	
	document.getElementById('scalerange').innerHTML = '';

		scales = $( "#scaleslider" ).slider('getValue');
			
		minscalesliderI = scales[0];
		maxscalesliderI = scales[1];
		
		minscaleslider = Math.round(minscalesliderI) - 1;
		maxscaleslider = Math.round(maxscalesliderI) + 2;
		
		dates = [];
		dates = document.getElementById('slider').noUiSlider.get('range');
			
		mindateI = dates[0];
		maxdateI = dates[1];
		
		mindate = Math.round(mindateI) - 1;
		maxdate = Math.round(maxdateI) + 1;

			if (scales[0] == 12) { var scale1 = '<1:250,000'; }
			else if (scales[0] == 13) { var scale1 = '<1:150,000'; }
			else if (scales[0] == 14) { var scale1 = '1:70,000'; }
			else if (scales[0] == 15) { var scale1 = '1:35,000'; }
			else if (scales[0] == 16) { var scale1 = '1:15,000'; }
			else if (scales[0] == 17) { var scale1 = '1:8,000'; }
			else if (scales[0] == 18) { var scale1 = '1:4,000'; }
			else if (scales[0] == 19) { var scale1 = '1:2,000'; }
			else if (scales[0] == 20) { var scale1 = '>1:1,000'; }



			if (scales[1] == 12) { var scale2 = '<1:250,000'; }
			else if (scales[1] == 13) { var scale2 = '<1:150,000'; }
			else if (scales[1] == 14) { var scale2 = '1:70,000'; }
			else if (scales[1] == 15) { var scale2 = '1:35,000'; }
			else if (scales[1] == 16) { var scale2 = '1:15,000'; }
			else if (scales[1] == 17) { var scale2 = '1:8,000'; }
			else if (scales[1] == 18) { var scale2 = '1:4,000'; }
			else if (scales[1] == 19) { var scale2 = '1:2,000'; }
			else if (scales[1] == 20) { var scale2 = '>1:1,000'; }



	document.getElementById('scalerange').innerHTML =  scale1 + " - " + scale2;


		urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
		overlayOldName = map.getLayers().getArray()[4].get('title');


		
//		console.log("minscaleslider: " + minscaleslider + " maxscaleslider: " + maxscaleslider);
		
//		console.log("mindate: " + mindate + " maxdate: " + maxdate);
		
//		console.log("overlayLayersInitial.length: " + overlayLayersInitial.length);

        overlayLayers = [];		
		var overlayLayersScale = [];
		var overlayLayersScaleOutput = [];

		for (var i = 0; i < overlayLayersInitial.length; i++) {
				var layerInitial = overlayLayersInitial[i];
				if (layerInitial.get('maxZ') > Math.round(minscaleslider))  overlayLayersScale.push(layerInitial);
				}
				
			for (var i = 0; i < overlayLayersScale.length; i++) {
					var layerInitialScale = overlayLayersScale[i];
						if (layerInitialScale.get('maxZ') < Math.round(maxscaleslider))  overlayLayersScaleOutput.push(layerInitialScale);
					}
					
//		console.log("overlayLayersScale.length: " + overlayLayersScale.length);
		
        overlayLayers = [];		
		var overlayLayersDate = [];
		var overlayLayersKeyword = [];

		for (var i = 0; i < overlayLayersScaleOutput.length; i++) {
				var layerInitial = overlayLayersScaleOutput[i];
				if (layerInitial.get('maxdate') > mindate)  overlayLayersDate.push(layerInitial);
				}
	
//		console.log("overlayLayersDate.length: " + overlayLayersDate.length);		
	
			for (var i = 0; i < overlayLayersDate.length; i++) {
					var layerInitialDate = overlayLayersDate[i];
						if (layerInitialDate.get('mindate') < maxdate)  overlayLayersKeyword.push(layerInitialDate);
					}
				
		

			if (overlayLayersKeyword.length < 1 )
					{
						overlaySelected = getOverlay(urlLayerName);
						overlayLayersKeyword.push(overlaySelected);
					}

					
					
        overlayLayers = [];		


		if (document.getElementById('keywordsearch').value !== 'Type keyword...')

			
			{
				
				for (var i = 0; i < overlayLayersKeyword.length; i++) {
						var layerInitial = overlayLayersKeyword[i];
						if (layerInitial.get('title').toUpperCase().indexOf(keywordsearchcontent) > -1)  overlayLayers.push(layerInitial);
						}
			
					if (overlayLayers.length < 1 )
							{
								overlaySelected = getOverlay(urlLayerName);
								overlayLayers.push(overlaySelected);
							}
			}
			
			else
			
			{
				overlayLayers = overlayLayersKeyword;
			}
							
//		console.log("overlayLayers.length: " + overlayLayers.length);
  
//		 overlayLayers = overlayLayersInitial;  


		if ($("#splitlist").is(":visible"))
		{

				updateOverlaySwitcher();
				loadOverlayNode();
				switchOverlayUpdateMode();
		}
		else
		{
				switchOverlayUpdateModeSingle();
		}


	var overlayLayersLength = overlayLayers.length;

	setOverlayLayerscoverage(overlayLayersLength);


console.log("urlLayerName: " + urlLayerName);

	if (getOverlay(urlLayerName) == undefined) {


		overlaySelected =  sixinch2;
		
//		console.log("6780 overlaySelected: " + overlaySelected.get('title').split(' - ')[1]);
	}
	else if (urlLayerName.includes('allmaps')) {
		console.log("allmaps");
	}
	else
	{
		overlaySelected = getOverlay(urlLayerName);
	}
	
	$('#map').focus();

}

function zoomInOut() {

	var zoom = map.getView().getZoom();
	var zoom1 = zoom + 0.5;

	{ 
	map.getView().setZoom(Math.round(zoom1)); 
		setTimeout( function(){
				map.getView().setZoom(zoom); 
			}, 20); // delay 50 ms
	}
//	  $('#map').focus();
}

	if ($(".sortlist").length > 0 )	
		{
		$(".sortlist input[name='sort']").click(function(){
			console.log("sortlist running");
			switchOverlayUpdateModeSingle();
			
			if (document.getElementById('filteroverlaysinput').value !== 'Type keyword...')

				{
					
					setTimeout( function(){
						filterlist();
					}, 250); // delay 50 ms
				}		
			
			
		});
	}

	if ($("#layerfiltercheckbox").length > 0 )

	{
		
		document.getElementById('layerfiltercheckbox').addEventListener('change', function(){

			if (this.checked) 
			{ 
				zoomInOut();
			}
			else
			{
				zoomInOut();
			}			
			
		});
		
	$( "#layerfiltercheckbox" ).prop( "checked", false );


//		document.getElementById('layerfiltercheckbox').addEventListener('change', function(){
//		        checkWFS();
//			overlayOldName = map.getLayers().getArray()[4].get('title');
//			urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
				overlayLayersInitial = [];
				overlayLayers = [];
				var extent = map.getView().calculateExtent(map.getSize());
				var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
				for (var i = 0; i < overlayLayersAll.length; i++) {
				var layerOL = overlayLayersAll[i];

				
				  var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
					// if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 
					if(ol.extent.intersects(overlayBounds, bounds)) overlayLayersInitial.push(layerOL);
				
			}
			
//		});
	
//		if ($('#layerfiltercheckbox').is(":checked")) {	
			

			scales = $( "#scaleslider" ).slider('getValue');
				
			minscalesliderI = scales[0];
			maxscalesliderI = scales[1];
			
			minscaleslider = Math.round(minscalesliderI) - 1;
			maxscaleslider = Math.round(maxscalesliderI) + 2;

//			overlayOldName = map.getLayers().getArray()[4].get('title');
//			urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');

			overlayLayersScale = [];

			for (var i = 0; i < overlayLayersInitial.length; i++) {
					var layerInitial = overlayLayersInitial[i];
						if (layerInitial.get('maxZ') > Math.round(minscaleslider))  overlayLayersScale.push(layerInitial);
					}
					
			for (var i = 0; i < overlayLayersScale.length; i++) {
					var layerInitialScale = overlayLayersScale[i];
						if (layerInitialScale.get('maxZ') < Math.round(maxscaleslider))  overlayLayers.push(layerInitialScale);
					}

					
				if (overlayLayers.length < 1 )
						{
						    if (overlaySelected)
							{
							overlaySelected = getOverlay(urlLayerName);
							overlayLayers.push(overlaySelected);
							}
							else
							{overlaySelected = sixinch2; }
						}
					

						
//			}
//			else
//			{
//			overlayLayers = overlayLayersInitial;
//			}
		


			
			var overlayLayersLength = overlayLayers.length;
				
			setOverlayLayerscoverage(overlayLayersLength);
	
	
//				console.log("6973 overlaySelectedTitle: " + overlaySelected.get('title').split(' - ')[1]);
	
				overlaySelected = sixinch2;
				
				if (map.getLayers().getLength() < 4)
					{
						map.getLayers().insertAt(4,overlaySelected);
					}
	
				if (overlaySelected) { overlaySelected.setVisible(true); }
				overlayOldName = 'Great Britain - OS Six Inch, 1888-1915';
	

				switchOverlayinitial();
		


				
//				updateUrl();


		};
		

		
	


//        map.getView().on('change:resolution', setZoomLimitCounty);
//        map.getView().on('change:resolution', setZoomLimit);

         map.getView().on('change:resolution', setZoomLayers);


//	setTimeout( function(){
//		setZoomLimit();
//	}, 250); // delay 50 ms

	checktrenchmap();
	checkroymap();
	checkedinburghmap();
	
	setZoomLayers();

	checkparishWFS();




//	map.addControl (new ol.control.LayerSwitcherImage());

	$(".onoffswitch-checkbox").on('change',  function (event) {

		if ($(".onoffswitch-checkbox").prop('checked')== false)


			{
	
	        	var value = 'Off';
	
			document.getElementById("elev-result").innerHTML = '';
	

			if (map.getLayers().getArray()[0].get('title') == 'MNT SRTM3')

				{ 

				map.getLayers().removeAt(0);   	
				map.getLayers().insertAt(0,osm2);
				map.getLayers().removeAt(1);
				map.getLayers().insertAt(1,scotland_layer3);

				}
	
			}

		else

		{

			map.getLayers().removeAt(0);
			map.getLayers().insertAt(0,plan);
			map.getLayers().removeAt(1);
			map.getLayers().insertAt(0,elev);


			map.on('pointermove', function(e) {

					e.preventDefault();

			
				  map.forEachLayerAtPixel(
				    e.pixel, 
				    function(layer, p) {
				      if (layer===elev) {
						  
						  var pix = elev.getData(e.pixel);
						if (pix) {
				        var h = ol.ext.getElevationFromPixel(p);

					if (h.length < 1)

						{
						document.getElementById("elev-result").innerHTML = 'fetching...';
						}

					else
						{
//						popup.setInfo(h>-5000 ? h.toFixed(0)+' m, ' + (3.28084 * h).toFixed(0) + ' ft' : '');

				        	document.getElementById("elev-result").innerHTML = h>-5000 ? h.toFixed(0)+' m., ' + (3.28084 * h).toFixed(0) + ' ft.<br/>(<a href="/geo/explore/help.html#height" target="remotes">further info</a>.)' : '';

						}
						}
				      }
				    }),{
				      layerFilter: function(l) {
				        return l===elev;
				      }
				    }
	
			});



		}

      });


	if (GPOpenLayers)
		{
		
		var azi = new ol.control.MeasureAzimuth({ 
		});       
		map.addControl(azi);


//			$("div[id^=\"GPshowMeasureAzimuth\"]").setAttribute('aria-labelledby', 'GPshowMeasureAzimuthPicto');		

//			$("div[id^=\"GPshowMeasureAzimuth\"]").setAttribute('aria-label', 'Measure bearing / azimuth');
			
//			$("div[id^=\"GPshowMeasureAzimuth\"]").setAttribute('aria-labelledby', 'GPshowMeasureAzimuthPicto');
			


		
		var area = new ol.control.MeasureArea({
		});
		map.addControl(area);
		
		var length = new ol.control.MeasureLength({
		});
		map.addControl(length);
		}
		
//		var lyrImport = new ol.control.LayerImport({ "draggable" : true, "layerTypes" : ["KML", "GPX", "GeoJSON", "WMS"], "webServicesOptions" : { "proxyUrl": "https://geoserver.nls.uk/geoserver/nls/wms?", "noProxyDomains": [] },

		
		var lyrImport = new ol.control.LayerImport({ "draggable" : true, "layerTypes" : ["KML", "GPX", "GeoJSON"],		
	
	
			"vectorStyleOptions" : {
					 "KML" : {
						 extractStyles : true,
						 defaultStyle : new ol.style.Style({
							 image : new ol.style.Icon({
								//  src : "https://maps.nls.uk/geo/img/orange-marker.png",
								//  size : [51, 51],
								  src : "https://maps.nls.uk/geo/img/circle-10.png",
								  size : [10, 10],
							 }),
							 stroke : new ol.style.Stroke({
								  color : "#ffffff",
								  width : 7
							 }),
							 fill : new ol.style.Fill({
								  color : "rgba(255, 183, 152, 0.2)"
							 }),
							 text : new ol.style.Text({
//								 text: feature.get('Place'),
								 font : "bold 20px Sans",
								 textAlign : "left",
								 fill : new ol.style.Fill({
									 color : "rgba(0, 0, 0, 1)"
								 }),
								 stroke : new ol.style.Stroke({
									 color : "rgba(255, 255, 255, 1)",
									 width : 2
								 })
							 })
						 })
					 },
					 "GPX" : {
				 					 
						 defaultStyle : new ol.style.Style({
							 image : new ol.style.Icon({
								  src : "https://maps.nls.uk/geo/img/orange-marker.png",
								  size : [51, 51],
							 }),
							 text : new ol.style.Text({
								 font : "bold 20px Sans",
								 textAlign : "left",
								 fill : new ol.style.Fill({
									 color : "rgba(0, 0, 0, 1)"
								 }),
								 stroke : new ol.style.Stroke({
									 color : "rgba(255, 255, 255, 1)",
									 width : 2
								 })
							 })


						 })

					 },
					 "GeoJSON" : {

						 extractStyles : true,
						 defaultStyle : new ol.style.Style({
							 image : new ol.style.Icon({
								  src : "https://maps.nls.uk/geo/img/orange-marker.png",
								  size : [51, 51],
							 }),
							 stroke : new ol.style.Stroke({
								  color : "#ffffff",
								  width : 7
							 }),
							 fill : new ol.style.Fill({
								  color : "rgba(255, 183, 152, 0.2)"
							 }),
							 text : new ol.style.Text({
								 font : "16px Sans",
								 textAlign : "left",
								 fill : new ol.style.Fill({
									 color : "rgba(255, 255, 255, 1)"
								 }),
								 stroke : new ol.style.Stroke({
									 color : "rgba(0, 0, 0, 1)",
									 width : 2
								 })
							 })
					
						 })
						 

					 }
			}

		});       
//		map.addControl(lyrImport);    

		var maplayerlength = map.getLayers().getLength();
		var toplayer = parseInt(maplayerlength - 1);
	
		var getFeatureInfo = new ol.control.GetFeatureInfo({ 
											options : {
												auto : true,
												active: true,
												defaultInfoFormat: "text/html",
												defaultEvent: "singleclick",
												cursorStyle: "pointer",
												autoPan: false
											}
									});

			
		
		draw = new ol.control.Drawing({
			id: "drawing",
			collapsed : true,
			draggable : true,
/*
			defaultStyles : { 
						image : new ol.style.Icon({
								  src : "https://maps.nls.uk/geo/img/orange-marker.png",
								  size : [51, 51],
						}),
						stroke : new ol.style.Stroke({
//								  color : "#ffa500",
								  color : "#274DF5",
								  width : 7
						}),
						fill : new ol.style.Fill({
								  color : "rgba(255, 183, 152, 0.2)"
						}),
						text : new ol.style.Text({
								 font : "16px Sans",
								 textAlign : "left",
								 fill : new ol.style.Fill({
									 color : "rgba(255, 255, 255, 1)"
								 }),
								 stroke : new ol.style.Stroke({
									 color : "rgba(0, 0, 0, 1)",
									 width : 2
								 })
						})
				  },
*/
			layer: vectorLayerFromImport,
			popup : {
				display : true,
			}
		});
		
//		var maplayerlength = map.getLayers().getLength();
//		const toplayer = parseInt(maplayerlength - 1);

		draw.setLayer( vectorLayerFromImport );

		map.addControl(draw); 
/*		
		var drawing = new ol.control.Drawing({
		  collapsed : false,
		  draggable : true,
		  layerswitcher : {
			 title : "Dessins",
			 description : "Mes dessins..."
		  },
		  markersList : [{
			 src : "http://api.ign.fr/api/images/api/markers/marker_01.png",
			 anchor : [0.5, 1]
		  }],
		  defaultStyles : {},
		  cursorStyle : {},
		  tools : {
			 points : true,
			 lines : true,
			 polygons :true,
			 holes : true,
			 text : false,
			 remove : true,
			 display : true,
			 tooltip : true,
			 export : true,
			 measure : true
		  },
		  popup : {
			 display : true,
			 function : function (params) {
				 var container = document.createElement("div");
				 // - params.geomType;
				 // - params.feature;
				 // Les 2 fonctions ferment la popup avec ou sans sauvegarde des informations
				 // dans les properties de la feature (key : description)
				 // - params.saveFunc(message);
				 // - params.closeFunc();
				 return container;
			 }
		});

	//	map.addControl(drawing);  
*/		

		

		
//	ol.interaction.MouseWheelZoom().setActive();


// Example: Use Ctrl instead of Alt+Shift to rotate
		const dragRotate = new ol.interaction.DragRotate({
		  condition: function(event) {
			// Only activate when Ctrl key is pressed
			return event.originalEvent && event.originalEvent.ctrlKey;
		  }
		});
	map.addInteraction(dragRotate);

	map.on('loadstart', function () {
		
		progress.show();
	

	
	
});
 map.on('loadend', function () {
  progress.hide();
 });



function sixinchenglandwalesfirstRight()   {
	
		if (map.getLayers().getArray()[2].get('mosaic_id') == '257')
			

			
			{


			if  (map.getView().getZoom() > 11)
				
				{


					
						if (map.getLayers().getArray().length > 13)					
						if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(13); }
					
						if (map.getLayers().getArray().length > 12)					
						if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCountRight')

						{ map.getLayers().removeAt(12); }

						if (map.getLayers().getArray().length > 11)					
						if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(11); }
					



					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
//					console.log("bboxextent: " + bboxextent );

					var geojsonFormat = new ol.format.GeoJSON();
					
					var urlgeoserverSixInchRight =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=nls:england_wales_ireland_counties' +
							'&PropertyName=(the_geom,COUNTY)&outputFormat=text/javascript&format_options=callback:loadFeaturesSixInchRight' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857&';
					

							
					var ajaxgeoserver = $.ajax({url: urlgeoserverSixInchRight, dataType: 'jsonp', cache: false })

					vectorSourceSixInchRight = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					window.loadFeaturesSixInchRight = function(response) {
						 vectorSourceSixInchRight.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					
//					console.log("featuresALL.length:" + featuresALL.length);
					
					if (featuresALL.length < 1)
								{	    
						
								return;
								}
							
							
							  else  {

								countynameRight = featuresALL[0].properties.COUNTY;
								const countynameTitle = toTitleCase(countynameRight);


								overlaySelectedRight = getOverlayRight(baseLayerName);  
								
								 overlaySelectedRight.getLayers().forEach(function(layer) {
									if (layer.get('title') === countynameRight) {
									  overlaySelectedSixInchLayerRight = layer;								  
									}								
								});
								

								

								if (countynameoldRight != countynameRight)
								
								{

									overlaySelectedRight.getLayers().getArray().push(overlaySelectedSixInchLayerRight);	
					
									var windowWidth = $(window).width();
									
									if  ( windowWidth >= 850)
										{
										$("#showCoordinatesinfo").removeClass("hidden");
										jQuery('#showCoordinatesinfo').show();
					
										$("#showCoordinatesinfo").css({ 'text-align': 'center' });
											$("#showCoordinatesinfo").css({ 'min-width': '250px' });

									document.getElementById('showCoordinatesinfo').innerHTML = 'The current layer on top is <strong>' + countynameTitle + '</strong>';
									
											if (map.getLayers().getArray().length > 13)	{									
												if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCount')
												{ map.getLayers().getArray()[13].setStyle(redvector); }
											}
									
										setTimeout( function(){
												document.getElementById('showCoordinatesinfo').innerHTML = '';
											jQuery('#showCoordinatesinfo').hide();
											if (map.getLayers().getArray().length > 13)	{											
												if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCount')
												{ map.getLayers().getArray()[13].setStyle(invisiblestyle); }
											}
										}, 5000); // delay 50 ms
									}
									else { return; }

								}

							  }
	


						var vectorLayerSixInchRight = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - SixInchCountRight",
							source: vectorSourceSixInchRight,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(250, 0, 0, 0.5)',
							  width: 1
								})
							})
						});
					


					if (map.getLayers().getArray().length > 13)					
					if (map.getLayers().getArray()[13].get('title') !== 'vectors - SixInchCountRight')	
					
						{					

						map.getLayers().insertAt(13,vectorLayerSixInchRight);
					
						}
					
					};
				}

				else
					
					{
						if (map.getLayers().getArray().length > 13)					
						if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(13); }
					
						if (map.getLayers().getArray().length > 12)					
						if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCountRight')

						{ map.getLayers().removeAt(12); }

						if (map.getLayers().getArray().length > 11)					
						if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(11); }


						
					}

			}
	
		else
			
			{
				
						if (map.getLayers().getArray().length > 13)					
						if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(13); }
					
						if (map.getLayers().getArray().length > 12)					
						if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCountRight')

						{ map.getLayers().removeAt(12); }

						if (map.getLayers().getArray().length > 11)					
						if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(11); }
						
			return;
			}
}



function sixinchenglandwalessecondRight()   {
	
		if (map.getLayers().getArray()[2].get('mosaic_id') == '6')
			

			
			{


			if  (map.getView().getZoom() > 11)
				
				{


					
						if (map.getLayers().getArray().length > 13)					
						if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(13); }
					
						if (map.getLayers().getArray().length > 12)					
						if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCountRight')

						{ map.getLayers().removeAt(12); }

						if (map.getLayers().getArray().length > 11)					
						if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(11); }
					



					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
//					console.log("bboxextent: " + bboxextent );

					var geojsonFormat = new ol.format.GeoJSON();
					
					var urlgeoserverSixInchRight =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=nls:ireland_counties' +
							'&PropertyName=(the_geom,COUNTY)&outputFormat=text/javascript&format_options=callback:loadFeaturesSixInchRight' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857&';
					

							
					var ajaxgeoserver = $.ajax({url: urlgeoserverSixInchRight, dataType: 'jsonp', cache: false })

					vectorSourceSixInchRight = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					window.loadFeaturesSixInchRight = function(response) {
						 vectorSourceSixInchRight.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					
//					console.log("featuresALL.length:" + featuresALL.length);
					
					if (featuresALL.length < 1)
								{	    
						
								return;
								}
							
							
							  else  {

								countynameRight = featuresALL[0].properties.COUNTY;
								const countynameTitle = toTitleCase(countynameRight);

								overlaySelectedRight = getOverlayRight(baseLayerName); 
								
								 overlaySelectedRight.getLayers().forEach(function(layer) {
									if (layer.get('title') === countynameRight) {
									  overlaySelectedSixInchLayerRight = layer;								  
									}								
								});
								

								

								if (countynameoldRight != countynameRight)
								
								{

									overlaySelectedRight.getLayers().getArray().push(overlaySelectedSixInchLayerRight);	
					
									var windowWidth = $(window).width();
									
									if  ( windowWidth >= 850)
										{
										$("#showCoordinatesinfo").removeClass("hidden");
										jQuery('#showCoordinatesinfo').show();
					
										$("#showCoordinatesinfo").css({ 'text-align': 'center' });
											$("#showCoordinatesinfo").css({ 'min-width': '250px' });

									document.getElementById('showCoordinatesinfo').innerHTML = 'The current layer on top is <strong>' + countynameTitle + '</strong>';
											if (map.getLayers().getArray().length > 2)	{											
												if (map.getLayers().getArray()[2].get('title') == 'vectors - SixInchCount')
												{ map.getLayers().getArray()[2].setStyle(redvector); }	
											}
								
										setTimeout( function(){
												document.getElementById('showCoordinatesinforight').innerHTML = '';
											jQuery('#showCoordinatesinforight').hide();
											if (map.getLayers().getArray().length > 2)	{	
												if (map.getLayers().getArray()[2].get('title') == 'vectors - SixInchCount')
												{ map.getLayers().getArray()[2].setStyle(invisiblestyle); }
											}

										}, 5000); // delay 50 ms
									}
									else { return; }

								}

							  }
	


						var vectorLayerSixInchRight = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - SixInchCountRight",
							source: vectorSourceSixInchRight,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(250, 0, 0, 0.5)',
							  width: 1
								})
							})
						});
					


					if (map.getLayers().getArray().length > 13)					
					if (map.getLayers().getArray()[13].get('title') !== 'vectors - SixInchCountRight')	
					
						{					

						map.getLayers().insertAt(13,vectorLayerSixInchRight);
					
						}
					
					};
				}

				else
					
					{
						if (map.getLayers().getArray().length > 13)					
						if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(13); }
					
						if (map.getLayers().getArray().length > 12)					
						if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCountRight')

						{ map.getLayers().removeAt(12); }

						if (map.getLayers().getArray().length > 11)					
						if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(11); }

						
					}

			}
	
		else
			
			{
				
						if (map.getLayers().getArray().length > 13)					
						if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(13); }
					
						if (map.getLayers().getArray().length > 12)					
						if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCountRight')

						{ map.getLayers().removeAt(12); }

						if (map.getLayers().getArray().length > 11)					
						if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCountRight')	

						{ map.getLayers().removeAt(11); }
						
			return;
			}
}


   jQuery( document ).ready(function() {
	   

	
	



	checkreuse();


    	});




    function onMoveEnd(evt) {
		
//			console.log("onMoveEndinprocess1: " + onMoveEndinprocess);
		
	if (!onMoveEndinprocess) {
		
			onMoveEndinprocess = true;
			
//			console.log("onMoveEndinprocess2: " + onMoveEndinprocess);

				


		//	setZoomLimitCounty();


	if ($(window).width() < 850)
	{
	checkWFSmobile();
	}
	else
	{
	checkWFS();
	}
	
	checkparishWFS();
	
	checknumWFSFeatures();

	checktrenchmap();
	checkroymap();
	checkedinburghmap();

//	checksketch();



        var map = evt.map; 
	urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
	overlayOldName = map.getLayers().getArray()[4].get('title');
        overlayLayersInitial = [];
        overlayLayers = [];
        var extent = map.getView().calculateExtent(map.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
		for (var i = 0; i < overlayLayersAll.length; i++) {
			var layerOL = overlayLayersAll[i];
			

			  var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
				// if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 
				if(ol.extent.intersects(overlayBounds, bounds)) overlayLayersInitial.push(layerOL);
			
		}


   jQuery( document ).ready(function() {
	   
	   	if ($('#layerfiltercheckbox').is(":checked")) {
			
			var zoom = map.getView().getZoom();

			if (Math.round(zoom) < 9) 		
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,14]);
				}
	
			else if ((Math.round(zoom) > 8)  && (Math.round(zoom) < 10))	
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,14]);
				}
			else if ((Math.round(zoom) > 9)  && (Math.round(zoom) < 12))
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,16]);
				}
			else if ((Math.round(zoom) > 11)  && (Math.round(zoom) < 13))
				{
						jQuery( "#scaleslider" ).slider('setValue',[12,16]);
				}
			else if ((Math.round(zoom) > 12)  && (Math.round(zoom) < 15))
				{
						jQuery( "#scaleslider" ).slider('setValue',[14,18]);
				}
			else if ((Math.round(zoom) > 14)  && (Math.round(zoom) < 16))
				{
						jQuery( "#scaleslider" ).slider('setValue',[14,18]);
				}
			else if ((Math.round(zoom) > 15)  && (Math.round(zoom) < 17))
				{
						jQuery( "#scaleslider" ).slider('setValue',[16,18]);
				}
			else if ((Math.round(zoom) > 16)  && (Math.round(zoom) < 18))
				{
						jQuery( "#scaleslider" ).slider('setValue',[16,20]);
				}
			else if (Math.round(zoom) > 17) 
				{
						jQuery( "#scaleslider" ).slider('setValue',[18,20]);
				}
				
		}
		else
		{
//			jQuery( "#scaleslider" ).slider('setValue',[16,20]);
		}
				
   });




	if ($("#layerfiltercheckbox").length > 0 )



		


		scales = $( "#scaleslider" ).slider('getValue');
			
		minscalesliderI = scales[0];
		maxscalesliderI = scales[1];
		
		minscaleslider = Math.round(minscalesliderI) - 1;
		maxscaleslider = Math.round(maxscalesliderI) + 2;


		urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
		overlayOldName = map.getLayers().getArray()[4].get('title');

		dates = [];
		dates = document.getElementById('slider').noUiSlider.get('range');
			
		mindateI = dates[0];
		maxdateI = dates[1];
		
		mindate = Math.round(mindateI) - 1;
		maxdate = Math.round(maxdateI) + 1;

		
//		console.log("minscaleslider: " + minscaleslider + " maxscaleslider: " + maxscaleslider);
		
//		console.log("mindate: " + mindate + " maxdate: " + maxdate);
		


        overlayLayers = [];		
		var overlayLayersScale = [];
		var overlayLayersScaleOutput = [];

		for (var i = 0; i < overlayLayersInitial.length; i++) {
				var layerInitial = overlayLayersInitial[i];
				if (layerInitial.get('maxZ') > Math.round(minscaleslider))  overlayLayersScale.push(layerInitial);
				}
				
			for (var i = 0; i < overlayLayersScale.length; i++) {
					var layerInitialScale = overlayLayersScale[i];
						if (layerInitialScale.get('maxZ') < Math.round(maxscaleslider))  overlayLayersScaleOutput.push(layerInitialScale);
					}
					
		
        overlayLayers = [];		
		var overlayLayersDate = [];
		var overlayLayersKeyword = [];

		for (var i = 0; i < overlayLayersScaleOutput.length; i++) {
				var layerInitial = overlayLayersScaleOutput[i];
				if (layerInitial.get('maxdate') > mindate)  overlayLayersDate.push(layerInitial);
				}
	
//		console.log("overlayLayersDate.length: " + overlayLayersDate.length);		
	
			for (var i = 0; i < overlayLayersDate.length; i++) {
					var layerInitialDate = overlayLayersDate[i];
						if (layerInitialDate.get('mindate') < maxdate)  overlayLayersKeyword.push(layerInitialDate);
					}
				
		

			if (overlayLayersKeyword.length < 1 )
					{
						overlaySelected = getOverlay(urlLayerName);
						overlayLayersKeyword.push(overlaySelected);
					}
					
					
        overlayLayers = [];		


		if (document.getElementById('keywordsearch').value !== 'Type keyword...')

			
			{
				
				for (var i = 0; i < overlayLayersKeyword.length; i++) {
						var layerInitial = overlayLayersKeyword[i];
						if (layerInitial.get('title').toUpperCase().indexOf(keywordsearchcontent) > -1)  overlayLayers.push(layerInitial);
						}
			
					if (overlayLayers.length < 1 )
							{
								overlaySelected = getOverlay(urlLayerName);
								overlayLayers.push(overlaySelected);
							}
			}
			
			else
			
			{
				overlayLayers = overlayLayersKeyword;
			}
//		 overlayLayers = overlayLayersInitial;  


/*
				if ($("#splitlist").is(":visible"))
				{

						updateOverlaySwitcher();
						loadOverlayNode();
						switchOverlayUpdateMode();
				}
				else
				{
						switchOverlayUpdateModeSingle();
						
						if (document.getElementById('filteroverlaysinput').value !== 'Type keyword...')

						{
							
							setTimeout( function(){
								filterlist();
							}, 250); // delay 50 ms
						}
				}
		
*/
	

		if ($("#splitlist").is(":visible"))
		{
			
				overlaySelected = map.getLayers().getArray()[4];
				overlayOldName = map.getLayers().getArray()[4].get('title');

				updateOverlaySwitcher();
				loadOverlayNode();
				switchOverlayUpdateMode();
		}
		else
		{
				overlaySelected = map.getLayers().getArray()[4];
				overlayOldName = map.getLayers().getArray()[4].get('title');
				switchOverlayUpdateModeSingle();
		}

	countynameold = countyname;
	sixinchenglandwalesfirst();		
	sixinchenglandwalessecond();



		if ($("#layerSelectBackground").is(":visible"))
			
			{
				
						countynameoldRight = countynameRight;
						sixinchenglandwalesfirstRight();	
						sixinchenglandwalessecondRight();	
	
					overlayOldNameRight = map.getLayers().getArray()[2].get('title');
			// overlayOldNameRight = overlaySelected.get('title');
				overlayLayersRight = [];
				overlayLayersInitialRight = [];
				var extent = map.getView().calculateExtent(map.getSize());
				var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
				for (var i = 0; i < overlayLayersRightAll.length; i++) {
				  var layerOL = overlayLayersRightAll[i];
				

				
				  var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];
					// if (ol.extent.intersects(overlayBounds, bounds)) overlayLayers.push(layerOL); 
					if(ol.extent.intersects(overlayBounds, bounds)) overlayLayersInitialRight.push(layerOL);
				
				
			overlayLayersRight = overlayLayersInitialRight;
			}
			


			if (getOverlayRight(baseLayerName) == undefined) {
				overlaySelectedRight = overlayLayersRight[0];
			}
			else
			{
			var overlaySelectedRight = getOverlayRight(baseLayerName);
			}




			if (overlaySelectedRight) { overlaySelectedRight.setVisible(true); }

		overlayOldNameRight = overlaySelectedRight.get('title');
		
		overlaySelectedRight.setVisible(true);



	updateOverlaySwitcherRight();
        loadOverlayNodeRight();
		var overlaycurrentRight = map.getLayers().getArray()[2];
		var e1RightMap = document.getElementById('overlaySelectNodeRight');
            var selNode1IndexRightMap = e1RightMap.options[e1RightMap.selectedIndex].value;
            var node1RightMap = overlayTreeRight.subnodes[selNode1IndexRightMap];
            var e2RightMap = document.getElementById('overlaySelectLayerRight');
            var selNode2IndexRightMap = e2RightMap.options[e2RightMap.selectedIndex].value;
            var selOverlayRightMap = node1RightMap.subnodes[selNode2IndexRightMap];
            //set switchers to permalink overlay
            if(selOverlayRightMap.layer!==overlaycurrentRight) {
                e1RightMap.options[overlaycurrentRight.overlayNodePath[0]].selected = true;
                loadOverlayNodeRight();
                e2RightMap.options[overlaycurrentRight.overlayNodePath[1]].selected = true;
     //           switchOverlayRight();
            } 
		}
	
	var overlayLayersLength = overlayLayers.length;

	setOverlayLayerscoverage(overlayLayersLength);
	
console.log("urlLayerName: " + urlLayerName);


	if (getOverlay(urlLayerName) == undefined) {


		urlLayerName = '6';
	}
	else
	{
		overlaySelected = getOverlay(urlLayerName);
	}

//			overlaySelected = overlayLayers[7];


			if (overlaySelected)
			if (overlaySelected.get('maxZ'))
			{
			var oSzoom = overlaySelected.get('maxZ');
			}
			else
			{
			var oSzoom = 16;
			}
/*		
			if (zoom > oSzoom)
		
			{ 
			map.getView().setZoom(Math.round(oSzoom)); 
				setTimeout( function(){
						map.getView().setZoom(zoom); 
					}, 2000); // delay 50 ms
			}
*/


			if (map.getLayers().getLength() < 4)
				{
					map.getLayers().insertAt(4,overlaySelected);
				}
			if (overlaySelected) { overlaySelected.setVisible(true); }
			overlayOldName = map.getLayers().getArray()[4].get('title');
	
	
				
//			if (overlayLayersLength > 1)
//			{

				// getWFS();
				// setHeader();
//			}



	setTimeout( function(){


			if (map.getLayers().getArray()[8].getSource().getFeatures().length > 0)
			{
		
				var centre = map.getView().getCenter();
				var scotlandgeom = map.getLayers().getArray()[8].getSource().getFeatures()[0].getGeometry();
			
				if (scotlandgeom.intersectsCoordinate(centre))
				{
				inScotland = true;
				}
				else
				{
				inScotland = false;
				}
			}
			checkreuse();
		
	/*	
			if (map.getLayers().getArray()[9].getSource().getFeatures().length > 0)
				{

			//		console.log("runningscotlandgeom");

					var centre = map.getView().getCenter();
					var francegeom = map.getLayers().getArray()[9].getSource().getFeatures()[0].getGeometry();
				
					if (francegeom.intersectsCoordinate(centre))
					{
					inFrance = true;
					}
					else
					{
					inFrance = false;
					}
				}
	*/
			if (map.getLayers().getArray()[9].getSource().getFeatures().length > 0)
				{

//					console.log("runningUKgeom");

					var centre = map.getView().getCenter();
					var united_kingdom_geom = map.getLayers().getArray()[9].getSource().getFeatures()[0].getGeometry();
				
					if (united_kingdom_geom.intersectsCoordinate(centre))
					{
					inUK = true;
					}
					else
					{
					inUK = false;
					}
					
//					console.log("inUK: " + inUK);
				}	
				

	if ( !$('#nlsgaz').is(':focus'))
		{	
			if ( !$('#ngrgaz').is(':focus'))
				{	
			
					if ( !$('#searchgb1900').is(':focus'))
						
						{
						checkgb();
						}
				}	
		}


		
	}, 500); // delay 50 ms
	
	 if ((overlaySelected) && ((!(overlaySelected.get('title').includes("Old Series")))))
		 
		 {
		 
		if ((overlaySelected) && ((!(overlaySelected.get('title').includes("Allmaps")))))
			
			{
		 
				if (overlaySelected instanceof ol.layer.Group)
				{
					

							overlaySelected.getLayers().forEach(function(layer){
									layer.getSource().on('tileloadstart', function () {
									  progress.addLoading();
									});
							});
							overlaySelected.getLayers().forEach(function(layer){			
									layer.getSource().on(['tileloadend', 'tileloaderror'], function () {
									  progress.addLoaded();
									});
							});
					
				}

			}
		 }

		else
		{
		
			overlaySelected.getSource().on('tileloadstart', function () {
			  progress.addLoading();
			});
			overlaySelected.getSource().on(['tileloadend', 'tileloaderror'], function () {
			  progress.addLoaded();
			});

		}

			var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");		
			if ( centre[1] > 60 )
			
			{
			jQuery("#drawControlFormElevation-div").hide();			
			}
			else
			{
			jQuery("#drawControlFormElevation-div").show();			
			}


	updateUrl();
	
	
				setTimeout( function(){
				   onMoveEndinprocess = false;
					console.log("onMoveEndinprocess: " + onMoveEndinprocess);
				}, 3000); // delay 50 ms
		}
     } 

   jQuery( document ).ready(function() {

		map.on('moveend', onMoveEnd);
		
   });
   
   function onMoveEndfunction() {
	   console.log("onMoveEndfunction");
	   console.log("onMoveEndinprocess: " + onMoveEndinprocess);
		if (onMoveEndinprocess = false)
		{ onMoveEnd; }	   
   }
   
   
   
     function onMoveStart(evt) {

        evt.preventDefault();
//		$("#map").focus();
		
	 }

//   map.on('movestart', onMoveStart);
   
   
   
function setLayers(str) {
    if (!str) str = "";
    if (document.getElementById('layerinfo') != null)
   {
    document.getElementById('layerinfo').innerHTML = str;

   }
}


// function to unselect previous selected features

            function unselectPreviousFeatures() {

		
                selectedFeatures = [];

            }


	var overlaySelectedBounds = [overlayLayers[0].get('minx'), overlayLayers[0].get('miny'), overlayLayers[0].get('maxx'), overlayLayers[0].get('maxy')];

	if ((noOverlaySelected) && (urlLayerName !== '1'))	

	{
         overlaySelectedBounds = ol.extent.applyTransform(overlaySelectedBounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));

		// map.getView().fit(overlaySelectedBounds, map.getSize());
		zoomtofeatureextent(overlaySelectedBounds);
	}	



	colorsource = new ol.source.Vector();

	vectorcolor = new ol.layer.Vector({
	  title: "vectorcolor",
	  source: colorsource,
	  style: new ol.style.Style({
	    fill: new ol.style.Fill({
	      color: 'rgba(255, 255, 255, 0.6)'
	    }),
	    stroke: new ol.style.Stroke({
	      width: 2,
	      color: 'rgba(' + rgb_r + ', ' + rgb_g + ', ' + rgb_b + ', 0.9)',
	    }),
	    image: new ol.style.Circle({
	      radius: 3,
	      fill: new ol.style.Fill({
	      color: 'rgba(' + rgb_r + ', ' + rgb_g + ', ' + rgb_b + ', 0.9)',
	      })

	    })
	  })
	});

 var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.IGC,
            ol.format.KML,
            ol.format.TopoJSON
        ]
    });




 map.addInteraction(dragAndDropInteraction);

    dragAndDropInteraction.on('addfeatures', function (event) {
 //       console.log("interaction")
          colorsource = new ol.source.Vector({
            features: event.features
        });
        window.dragSource = colorsource;

	vectorcolor = new ol.layer.Vector({
	  title: "vectorcolor",
	  source: colorsource,
	  style: new ol.style.Style({
	    fill: new ol.style.Fill({
	      color: 'rgba(255, 255, 255, 0.6)'
	    }),
	    stroke: new ol.style.Stroke({
	      width: 4,
	      color: 'rgba(' + rgb_r + ', ' + rgb_g + ', ' + rgb_b + ', 0.9)',
	    }),
	    image: new ol.style.Circle({
	      radius: 6,
	      fill: new ol.style.Fill({
	      color: 'rgba(' + rgb_r + ', ' + rgb_g + ', ' + rgb_b + ', 0.9)',
	      }),
		text : new ol.style.Text({
			font : "16px sans-serif",
			textAlign : "left",
			fill : new ol.style.Fill({
				color : "rgba(255, 255, 255, 1)"
			}),
			stroke : new ol.style.Stroke({
				color : "rgba(0, 0, 0, 1)",
				width : 2
			})
		})
	    })
	  })
	});


        window.dragLayer=vectorcolor;
 //       console.log(dragLayer);

        map.getLayers().push(vectorcolor);
        vectorcolor.setVisible(true);
		map.getView().fit(colorsource.getExtent());
		checksketch();
    });



		// jQuery(map.getViewport()).on('mousemove', mouseMoveHandler);


   var vectorSource_new = new ol.source.Vector();
   var vectorLayer_new = new ol.layer.Vector({
      name: "vectorLayer_new",
      source: vectorSource_new
    });

//	var maplayerlength = map.getLayers().getLength();

//	if (map.getLayers().getArray()[(maplayerlength - 1)].get("name") !== "vectorLayer_new")

//	{

	map.getLayers().insertAt(5,vectorLayer_new);

//	}

	var iconStyle = new ol.style.Style({
	    image: new ol.style.Icon({
	        anchor: [0.5, 40],
	        anchorXUnits: 'fraction',
	        anchorYUnits: 'pixels',
	        opacity: 0.75,
	        src: 'https://maps.nls.uk/img/marker-icon.png'
	    }),
//	    text: new ol.style.Text({
//	        font: '12px Calibri,sans-serif',
//	        fill: new ol.style.Fill({ color: '#000' }),
//	        stroke: new ol.style.Stroke({
//	            color: '#fff', width: 2
//	        }),
//	        text: 'Some text'
//	    })
	});



function geolinks()

	{
		
	$("#showCoordinatesinfo").removeClass("hidden");
	
			if ($("#morePanel") != null ) { jQuery("#morePanel").hide(); }
			if ($("#footermore") != null ) { jQuery("#footermore").show(); }
			
			
	$("#showCoordinatesinfo").css({ 'text-align': 'left' });
	$("#showCoordinatesinfo").css({ 'min-width': '250px' });

	var zoom = map.getView().getZoom();
	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
//     	else if (mapgroupno == 9) { window.location = "https://" + window.location.hostname + "/geo/find/#zoom=" + zoom + "&lat=" + centre[1].toFixed(5) + "&lon=" + centre[0].toFixed(5)

			jQuery('#showCoordinatesinfo').show();



       			document.getElementById('showCoordinatesinfo').innerHTML = '<button type="button" id="hideshowcoordinatesinfo" class="close"  aria-label="Close"><span aria-hidden="true" >&times;</span></button><p style="margin-bottom:18px;"></p>' +
				'<p><strong>Link to external map services from this location:</strong></p>' +
				'<ul>' +
				'<li><a href="http://www.google.com/maps/place/' + centre[1].toFixed(7) + ',' + centre[0].toFixed(7) + '/@' + centre[1].toFixed(7) + ',' + centre[0].toFixed(7) + ',' + Math.round(zoom) + 'z/data=!4m4!3m3">Google Maps</a></li>' +
				'<li><a href="http://www.google.com/maps/place/' + centre[1].toFixed(7) + ',' + centre[0].toFixed(7) + '/@' + centre[1].toFixed(7) + ',' + centre[0].toFixed(7) + ',' + Math.round(zoom) + 'z/data=!3m1!1e3">Google Satellite</a></li>' +
				'<li><a href="https://bing.com/maps/default.aspx?cp=' + centre[1].toFixed(6) + '~' + centre[0].toFixed(6) + '&lvl=' + zoom + '&style=r">Bing Maps</a></li>' +
				'<li><a href="https://bing.com/maps/default.aspx?cp=' + centre[1].toFixed(6) + '~' + centre[0].toFixed(6) + '&lvl=' + zoom + '&style=a">Bing Satellite</a></li>' +
				'<li><a href="https://www.openstreetmap.org/#map='+ zoom + '/' + centre[1].toFixed(6) + '/' + centre[0].toFixed(6) + '">OpenStreetMap</a></li>' +
				'<li><a href="https://wego.here.com/?map=' + centre[1].toFixed(6) + ',' + centre[0].toFixed(6) + ',' + zoom + '">HERE Maps</a></li></ul>';

	    jQuery("#hideshowcoordinatesinfo").click(function(){
			jQuery('#showCoordinatesinfo').hide();

			$('#map').focus();

	    });
	}


function copyURL() {
  /* Get the text field */
  var copyText = document.getElementById("url");

  /* Select the text field */
//  copyText.select();
//  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.innerHTML).then(function(x) {
  
  /* Alert the copied text */
//  alert("Copied to clipboard - Layer URL: " + copyText.innerHTML);



   jQuery("#clipboard-response").show();
   document.getElementById('clipboard-response').innerHTML = 'Tileset URL copied to clipboard!';

    });

	setTimeout( function(){
		jQuery('#clipboard-response').hide();
	}, 5000); // delay 50 ms
   
}


/*	
		var vectorSourceFeature = new ol.source.Vector({
		});
		
		var vectorLayerMouseCross = new ol.layer.Vector({
		  source: vectorSourceFeature,
		  title: 'vectorMouseCross'
		});

		var maplayerlength = map.getLayers().getLength();
	    	map.getLayers().insertAt(maplayerlength,vectorLayerMouseCross);

function clearcross() {

		if (map.getLayers().getArray()[3].getSource().getFeatures().length > 0) 
		{
		map.getLayers().getArray()[3].getSource().clear();
		}

}


		iconStyle = new ol.style.Style({
		  image: new ol.style.Icon( ({
		    anchor: [10, 10],
		    anchorXUnits: 'pixels',
		    anchorYUnits: 'pixels',
		    src: 'https://maps.nls.uk/geo/img/cross.png'
		  }))
		});

function addcrosswhereclicked(coordinate) {

		clearcross();

	//	console.log("coordinate: " + coordinate);

		iconFeature = new ol.Feature();

		iconFeature.setGeometry(null);
		

		
	
		iconFeature.setStyle(iconStyle);

		iconFeature.setGeometry( new ol.geom.Point(coordinate) );

		vectorSourceFeature.addFeature(iconFeature);
}

*/

function getmapsheetexplore()
		{
			
//			console.log("getmapsheetexplore");
			
			if ($("#morePanel") != null ) { jQuery("#morePanel").hide(); }
			if ($("#footermore") != null ) { jQuery("#footermore").show(); }
			
			addMarker = false;
			
			document.getElementById('showCoordinatesinfo').innerHTML = '';
			
			jQuery('#showCoordinatesinfo').show();
			
			
				$("#showCoordinatesinfo").css({ 'text-align': 'center' });
				$("#showCoordinatesinfo").css({ 'min-width': '250px' });
				
      			document.getElementById('showCoordinatesinfo').innerHTML = 'Fetching map...';
	
			setTimeout( function(){
       			document.getElementById('showCoordinatesinfo').innerHTML = '';
				jQuery('#showCoordinatesinfo').hide();
			}, 3000); // delay 50 ms



		var maplayerlength = map.getLayers().getLength();
		var toplayer = parseInt(maplayerlength - 1);

		if ((map.getLayers().getLength() > toplayer) && (map.getLayers().getArray()[toplayer].get("title") == "vectors - getmapsheetexplore")) map.getLayers().removeAt(toplayer); 
		

		var coord = map.getView().getCenter();
		var transformed_coordinate = ol.proj.transform(coord,"EPSG:3857", "EPSG:4326");
		var transformed_coordinate27700 = ol.proj.transform(coord,"EPSG:3857", "EPSG:27700");
		// pointClicked = transformed_coordinate;
		// pointClicked = transformed_coordinate[1].toFixed(5) + ',' + transformed_coordinate[0].toFixed(5);
		var lon = coord[0].toFixed(5);
		var lat = coord[1].toFixed(5);
		var left = (lon - 10);
		var right = (lon + 10);
		var bottom = (lat - 10);
		var top = (lat + 10);
		
		var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
//		console.log(left +',' + bottom + ',' + right + ',' + top );

//		addcrosswhereclicked(coord);
		
		
		var urlgeoserver =  'https://geoserver3.nls.uk/geoserver/wfs?service=WFS' + 
				'&version=1.1.0&request=GetFeature&typename=' + map.getLayers().getArray()[4].get('typename') +
				'&PropertyName=(the_geom,IMAGEURL)&outputFormat=text/javascript&format_options=callback:loadFeatures' +
				'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857';
				

		if (vectorSourceGMS) { vectorSourceGMS.clear(); }

		var geojsonFormat = new ol.format.GeoJSON();

		var url = urlgeoserver;

		var ajaxgeoserver1 = $.ajax({url: url, dataType: 'jsonp', cache: false, timeout: 8000})



		vectorSourceGMS = new ol.source.Vector({
		  loader: function(extent, resolution, projection) {
			ajaxgeoserver1;
		  },
		  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
		    maxZoom: 19
		  }))
		});
		
		window.loadFeatures = function(response) {
		  vectorSourceGMS.addFeatures(geojsonFormat.readFeatures(response));
		
		var featuresALL = response.features;
		
		if (featuresALL.length > 0)
		
			{
			var imageURL = featuresALL[0].properties.IMAGEURL;
			window.location.href = imageURL;
			}
		

		};

	            var vectorLayerGMS = new ol.layer.Vector({

	  		title: "vectors - getmapsheetexplore",
	                source: vectorSourceGMS,
	                style: vectorstyle 
	            });
	
				const maplayerlengthGMS = map.getLayers().getLength();
				
			    map.getLayers().insertAt(maplayerlengthGMS,vectorLayerGMS);
				
				
}

async function downloadGeoJSON(TypeName) {
	
	
			$("#showLayersInfo").removeClass("hidden");
				jQuery("#showLayersInfo").show();

				document.getElementById("showLayersInfo").innerHTML = '<p><img src=\"/img/loading-247px.gif\" width=\"20\"  style=\"vertical-align: middle\" alt=\"Loading gif\" /> Downloading GeoJSON - please wait...</p>';

	
//	var TypeName = 'nls:One_Inch_Land_Utilisation_Britain';
	
	const response = await fetch('https://geoserver3.nls.uk/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=' + TypeName + '&PropertyName=(the_geom,IMAGE,IMAGEURL,WFS_TITLE)&outputFormat=application/json&srsname=EPSG:4326&bbox=-8,49,3,61,EPSG:4326');
	
	const geojson = await response.json();

			if (geojson)

				{
				processResponse(geojson);
				}
				
			else
				
				{
					
						document.getElementById("showLayersInfo").innerHTML = '';
						$("#showLayersInfo").removeClass("hidden");
						jQuery("#showLayersInfo").show();

						document.getElementById("showLayersInfo").innerHTML = '<p>Sorry, an error has occurred<br/>Please contact <strong>maps@nls.uk</strong> for this metadata</p>';

						setTimeout( function(){
						document.getElementById("showLayersInfo").innerHTML = '';

						jQuery("#showLayersInfo").hide();

									
				}, 5000); // delay 50 ms
				
				}
	
}

processResponse = async (geojson) => { 



 
		const geojson_response = JSON.stringify(geojson);
	
  		var filename = 'data:text/json;charset=utf-8,' + geojson_response;

			function download(filename, text) {
				
						document.getElementById("showLayersInfo").innerHTML = '';

						jQuery("#showLayersInfo").hide();
			
			  var element = document.createElement('a');
			  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + geojson_response);
			  element.setAttribute('download', filename);
			
			  element.style.display = 'none';
			  document.body.appendChild(element);
			
			  element.click();
			
			  document.body.removeChild(element);
			
			}

 		download("metadata.geojson",filename);	
		
}

function showoverlay()

	{


	var overlayTitle = map.getLayers().getArray()[4].get('title');
	
	const TypeNameWFS = map.getLayers().getArray()[4].get('typename');
	if (TypeNameWFS) {
	var TypeName_WFS = TypeNameWFS.replace("nls:", "");
	}

	var reusetext = document.getElementById('re-use').innerHTML;

	if (overlayTitle.includes("OS 1:500"))

	{

		var overlayline = 'The town plans are available for specific towns in England and Wales:<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Alnwick/index.html">Alnwick</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Ashby/index.html">Ashby de la Zouch</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Barnard-Castle/index.html">Barnard Castle</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Bishop-Auckland/index.html">Bishop Auckland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Chelmsford/index.html">Chelmsford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Guildford/index.html">Guildford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Hitchin/index.html">Hitchin</a>, ' + 
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Newcastle/index.html">Newcastle</a> (1890s), ' + 
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Newcastle-1900s/index.html">Newcastle</a> (1900s), ' + 
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Plymouth-1850s/index.html">Plymouth</a> (1850s), ' + 
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Sheerness/index.html">Sheerness</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Stockton-upon-Tees/index.html">Stockton-on-Tees</a> (1855), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Stockton-upon-Tees-1890s/index.html">Stockton-on-Tees</a> (1895), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Sunderland/index.html">Sunderland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Tyneside1855/index.html">Tynemouth</a> (1855-57), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Tyneside1896/index.html">Tyneside</a> (1896), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Uxbridge/index.html">Uxbridge</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Wallsend/index.html">Wallsend</a>, <br/>' +
		'The town plans are also available across regions of England and Wales:<br/><a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Cornwall/index.html">Cornwall</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/town_england/devon_towns/index.html">Devon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/IsleofMan/index.html">Isle of Man</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Midlands_East/index.html">Midlands - East</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Midlands_West/index.html">Midlands - West</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/North/index.html">Northern England</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/South/index.html">South-Eastern England</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Wales/index.html">Wales</a>,<br/>' +
		'Please <a href="mailto:maps@nls.uk">contact us</a> for URLs of Scottish town plans.<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 21 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
				reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/index.html">Help on how to use these layers</a>.</p>';
	
	}

	else if (overlayTitle.includes("OS 1:1,056"))

	{
		var overlayline = 'This layer is available under specific towns:<br/><a href="https://mapseries-tilesets.s3.amazonaws.com/town_england/Accrington/index.html">Accrington</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Alnwick2640/index.html">Alnwick (environs)</a> (1851), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Ashton/index.html">Ashton under Lyne</a> (1849-50), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Ashton2/index.html">Ashton under Lyne</a> (1891-92), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/town_england/Bacup/index.html">Bacup</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Barnsley/index.html">Barnsley</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Beverley/index.html">Beverley</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Bingley/index.html">Bingley</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Blackburn/index.html">Blackburn</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Blyth/index.html">Blyth</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Bolton/index.html">Bolton</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Bradford/index.html">Bradford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Bridlington/index.html">Bridlington</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Burnley/index.html">Burnley</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Bury/index.html">Bury</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Chorley/index.html">Chorley</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Clitheroe/index.html">Clitheroe</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Colne/index.html">Colne</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Darlington/index.html">Darlington</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Dewsbury/index.html">Dewsbury</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Doncaster/index.html">Doncaster</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Fleetwood/index.html">Fleetwood</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Halifax/index.html">Halifax</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Haslingden/index.html">Haslingden</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Heywood/index.html">Heywood</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Howden/index.html">Howden</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Huddersfield/index.html">Huddersfield</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Keighley/index.html">Keighley</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Kingston-upon-Hull/index.html">Kingston upon Hull</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Kingston-upon-Thames/index.html">Kingston upon Thames</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Knaresborough/index.html">Knaresborough</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Lancaster-1056/index.html">Lancaster</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Leeds_1056/index.html">Leeds</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Liverpool-1056/index.html">Liverpool</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/london_1890s/index.html">London</a> (1890s), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Malton/index.html">Malton</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Manchester/index.html">Manchester</a> (1848-50), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Middlesbrough/index.html">Middlesbrough</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Middleton/index.html">Middleton</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Nantwich/index.html">Nantwich</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Ormskirk/index.html">Ormskirk</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Pontefract/index.html">Pontefract</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Prescot/index.html">Prescot</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Preston/index.html">Preston</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Richmond/index.html">Richmond</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Ripon/index.html">Ripon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Rochdale/index.html">Rochdale</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Rotherham/index.html">Rotherham</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Scarborough/index.html">Scarborough</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Selby/index.html">Selby</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Sheffield/index.html">Sheffield</a> (1849-51), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Skipton/index.html">Skipton</a> (1850), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/St_Helens/index.html">St Helens</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Stockport-1873/index.html">Stockport</a> (1873), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Stockport-1895/index.html">Stockport</a> (1895), ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Todmorden/index.html">Todmorden</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Ulverston/index.html">Ulverston</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Wakefield/index.html">Wakefield</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Warrington/index.html">Warrington</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Whitby/index.html">Whitby</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Wigan/index.html">Wigan</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/Windsor/index.html">Windsor</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/town-england/York/index.html">York</a>.<br/>' +
		'Please <a href="mailto:maps@nls.uk">contact us</a> for URLs of Scottish town plans.<br/>' +
			'<br/><strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 20 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
				reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/index.html">Help on how to use these layers</a>.</p>';

	}

	else if (overlayTitle.includes("OS 25 Inch, 1873"))
	{
		var overlayline = 'This layer is available under specific counties:<br/><a href="https://geo.nls.uk/mapdata2/os/25_inch/cornwall_1st/index.html">Cornwall</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/devon/index.html">Devon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/gloucester/index.html">Gloucester</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/somerset1/index.html">Somerset</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/wiltshire/index.html">Wiltshire</a>,<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
				reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/index.html">Help on how to use these layers</a>.</p>';
	}
	

	else if (overlayTitle.includes("OS 25 Inch, 1892"))
	{
		var overlayline = 'This layer is available under specific counties:<br/><a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/scotland_1/index.html">Scotland - South</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/scotland_2/index.html">Scotland - North</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/bedfordshire/index.html">Bedfordshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/berkshire/index.html">Berkshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/buckingham/index.html">Buckinghamshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cambridge/index.html">Cambridgeshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cheshire/index.html">Cheshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cornwall/index.html">Cornwall</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cumberland/index.html">Cumberland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/devon2nd/index.html">Devon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/dorset/index.html">Dorset</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/durham/index.html">Durham</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/essex/index.html">Essex</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/gloucester2nd/index.html">Gloucestershire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hampshire/index.html">Hampshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/herefordshire/index.html">Herefordshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hertfordshire/index.html">Hertfordshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/huntingdon/index.html">Huntingdon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/kent/index.html">Kent</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/lancashire/index.html">Lancashire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/leicestershire/index.html">Leicestershire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/lincolnshire/index.html">Lincolnshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/london/index.html">London</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/middlesex/index.html">Middlesex</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/norfolk/index.html">Norfolk</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/northampton/index.html">Northamptonshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/northumberland/index.html">Northumberland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/nottinghamshire/index.html">Nottinghamshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/oxford/index.html">Oxford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/rutland/index.html">Rutland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/Shrop_Derby/index.html">Shropshire / Derbyshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/somerset/index.html">Somerset</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/stafford/index.html">Stafford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/suffolk/index.html">Suffolk</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/surrey/index.html">Surrey</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/sussex/index.html">Sussex</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/wales/index.html">Wales</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/warwick/index.html">Warwick</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/westmorland/index.html">Westmorland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/wiltshire2nd/index.html">Wiltshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/worcestershire/index.html">Worcestershire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/yorkshire/index.html">Yorkshire</a>.<br/>' +
		'We also have a layer which fills gaps in coverage using later 25 inch maps: "<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/25_inch_holes_england/index.html">Holes</a>".<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
			reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/index.html">Help on how to use these layers</a>.</p>';
	}


	else if (overlayTitle.includes("OS Six Inch, 1830s-1880s"))
	{
		var overlayline = 'The OS Six Inch, 1830s-1880s layer is available for: ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/6inchfirst/index.html">Scotland</a> ' +
				' and under specific counties of England and Wales: ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-anglesey/index.html">Anglesey</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-bedfordshire/index.html">Bedfordshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-berkshire/index.html">Berkshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-brecknockshire/index.html">Brecknockshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-buckinghamshire/index.html">Buckinghamshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-caernarvonshire/index.html">Carnarvonshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-cambridgeshire/index.html">Cambridgeshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-cardiganshire/index.html">Cardiganshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-carmarthenshire/index.html">Carmarthenshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-cheshire/index.html">Cheshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-cornwall/index.html">Cornwall</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-cumberland/index.html">Cumberland</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-denbighshire/index.html">Denbighshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-derbyshire/index.html">Derbyshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-devonshire/index.html">Devonshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-dorset/index.html">Dorset</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-durham/index.html">Durham</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-essex/index.html">Essex</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-flintshire/index.html">Flintshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-glamorgan/index.html">Glamorgan</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-gloucestershire/index.html">Gloucestershire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-hampshire/index.html">Hampshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-herefordshire/index.html">Herefordshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-hertfordshire/index.html">Hertfordshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-huntingdonshire/index.html">Huntingdonshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-kent/index.html">Kent</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-lancashire/index.html">Lancashire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-leicestershire/index.html">Leicestershire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-lincolnshire/index.html">Lincolnshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-merionethshire/index.html">Merionethshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-middlesex/index.html">Middlesex</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-monmouthshire/index.html">Monmouthshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-montgomeryshire/index.html">Montgomeryshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-norfolk/index.html">Norfolk</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-northamptonshire/index.html">Northamptonshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-northumberland/index.html">Northumberland</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-nottinghamshire/index.html">Nottinghamshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-oxfordshire/index.html">Oxfordshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-pembrokeshire/index.html">Pembrokeshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-radnorshire/index.html">Radnorshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-rutland/index.html">Rutland</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-shropshire/index.html">Shropshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-somerset/index.html">Somerset</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-staffordshire/index.html">Staffordshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-suffolk/index.html">Suffolk</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-surrey/index.html">Surrey</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-sussex/index.html">Sussex</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-warwickshire/index.html">Warwickshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-westmorland/index.html">Westmorland</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-wiltshire/index.html">Wiltshire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-worcestershire/index.html">Worcestershire</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/six-inch-yorkshire/index.html">Yorkshire</a> <br/>' +
				
				
					'It is available under specific counties of Ireland: ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/armagh/index.html">Armagh</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/antrim/index.html">Antrim</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/carlow/index.html">Carlow</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/cavan/index.html">Cavan</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/clare/index.html">Clare</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/cork/index.html">Cork</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/donegal/index.html">Donegal</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/down/index.html">Down</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/dublin/index.html">Dublin</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/fermanagh/index.html">Fermanagh</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/galway/index.html">Galway</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kerry/index.html">Kerry</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kildare/index.html">Kildare</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kilkenny/index.html">Kilkenny</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kings/index.html">Kings County (Offaly)</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/leitrim/index.html">Leitrim</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/limerick/index.html">Limerick</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/londonderry/index.html">Londonderry</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/longford/index.html">Longford</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/louth/index.html">Louth</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/mayo/index.html">Mayo</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/meath/index.html">Meath</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/monaghan/index.html">Monaghan</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/queens/index.html">Queen\'s County (Laois)</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/roscommon/index.html">Roscommon</a>, ' +
				'<a href="https://geo.nls.uk/mapdata3/os/sligo/index.html">Sligo</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/tipperary/index.html">Tipperary</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/tyrone/index.html">Tyrone</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/waterford/index.html">Waterford</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/westmeath/index.html">Westmeath</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/wexford/index.html">Wexford</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/wicklow/index.html">Wicklow</a>.<br/>' +
			    '<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 17 <br/>' +
				'<strong>Layer WFS Metadata:</strong> nls:6in_Eng_Scot_Wal_1st<br/>' +
				'<a href="javascript:downloadGeoJSON(\'nls:6in_Eng_Scot_Wal_1st\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '. ' +
					
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS Six Inch, 1888-1915"))
	{

		var overlayline = 'The OS Six Inch, 1888-1915 layer is available for England, Scotland and Wales on <a href="https://cloud.maptiler.com/tiles/uk-osgb10k1888/">MapTiler Cloud</a>.<br/>' +

				'Read further details on our <a href="https://maps.nls.uk/projects/api/">Historic Maps API</a> page.<br/>' +
				
				'It is available under each specific county in Ireland:<br/>' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/armagh_2nd/index.html">Armagh</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/antrim_2nd/index.html">Antrim</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/carlow_2nd/index.html">Carlow</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/cavan_2nd/index.html">Cavan</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/clare_2nd/index.html">Clare</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/cork_2nd/index.html">Cork</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/donegal_2nd/index.html">Donegal</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/down_2nd/index.html">Down</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/dublin_2nd/index.html">Dublin</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/fermanagh_2nd/index.html">Fermanagh</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/galway_2nd/index.html">Galway</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kerry_2nd/index.html">Kerry</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kildare_2nd/index.html">Kildare</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kilkenny_2nd/index.html">Kilkenny</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/kings_2nd/index.html">Kings County (Offaly)</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/leitrim_2nd/index.html">Leitrim</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/limerick_2nd/index.html">Limerick</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/londonderry_2nd/index.html">Londonderry</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/longford_2nd/index.html">Longford</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/louth_2nd/index.html">Louth</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/mayo_2nd/index.html">Mayo</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/meath_2nd/index.html">Meath</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/monaghan_2nd/index.html">Monaghan</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/queens_2nd/index.html">Queen\'s County (Laois)</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/roscommon_2nd/index.html">Roscommon</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/sligo_2nd/index.html">Sligo</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/tipperary_2nd/index.html">Tipperary</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/tyrone_2nd/index.html">Tyrone</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/waterford_2nd/index.html">Waterford</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/westmeath_2nd/index.html">Westmeath</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/wexford_2nd/index.html">Wexford</a>, ' +
				'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/wicklow_2nd/index.html">Wicklow</a>.<br/>' +
			    '<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 17 <br/>' +				
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
					
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS 1:10,000/1:10,560, 1949"))
	{
		var overlayline = '<a href="https://geo.nls.uk/mapdata3/os/britain10knationalgridnew/index.html">OS 1:10,000/1:10,560, Great Britain, 1949-1972</a>, ' +
				'<a href="https://geo.nls.uk/mapdata2/os/10k_1973/index.html">1973</a>, ' +
				'<a href="https://geo.nls.uk/mapdata3/os/10k_1974/index.html">1974</a>.<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong>16<br/>' +
				'<strong>Layer WFS Metadata:</strong> nls:National_Grid_10k <br/>' +
				'<a href="javascript:downloadGeoJSON(\'nls:National_Grid_10k\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS 1:1 million-1:10K, 1900s"))
	{
		var overlayline = '1:1 million to 1:10,560 is available on <a href="https://cloud.maptiler.com/tiles/uk-osgb1888/index.html">MapTiler Cloud</a>.<br/>' +

				'Read further details on our <a href="https://maps.nls.uk/projects/api/">Historic Maps API</a> page.<br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';

	}

	else if (overlayTitle.includes("OS One-Inch, 1885-1903 - Hills"))
	{
		var overlayline = 'The OS One-Inch, 1885-1903 "Hills" layer is available on <a href="https://cloud.maptiler.com/tiles/uk-osgb63k1885/index.html">MapTiler Cloud</a>.<br/>' +
				'Read further details on our <a href="https://maps.nls.uk/projects/api/">Historic Maps API</a> page.<br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';

	}
	
	else if (overlayTitle.includes("OS One-Inch 3rd"))
	{
		var overlayline = 'The OS One-Inch, 3rd ed (coloured) layer is available as two layers:<br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/1inch_3rd_col/index.html">Scotland</a>.<br/>' +
		'<a href="https://geo.nls.uk/mapdata3/os/1inch_3rd_col/index.html">England and Wales</a>.<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
//				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
//				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';

	}

	else if (overlayTitle.includes("OS 1:25,000, 1937-61"))
	{
		var overlayline = 'The OS 1:25,000, 1937-61 layer is available on <a href="https://cloud.maptiler.com/tiles/uk-osgb25k1937/">MapTiler Cloud</a>.<br/>' +

				'Read further details on our <a href="https://maps.nls.uk/projects/api/">Historic Maps API</a> page.<br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';

	}
	else if (overlayTitle.includes("OS One Inch 7th series, 1955-61"))
	{
		var overlayline = 'The OS One Inch 7th series, 1955-61 layer is available on <a href="https://cloud.maptiler.com/tiles/uk-osgb63k1955/">MapTiler Cloud</a>.<br/>' +

				'Read further details on our <a href="https://maps.nls.uk/projects/api/">Historic Maps API</a> page.<br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';

	}

	else if (overlayTitle.includes("1st Land Utilisation Survey"))
	{
		var overlayline = 'The 1st Land Utilisation Survey layer is available at:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/land_uti/index.html">Scotland</a>.<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/land_uti_eng/index.html">England and Wales</a>.<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	
	else if (overlayTitle.includes("2nd Land Utilisation Svy"))
	{
		var overlayline = 'The 2nd Land Utilisation Survey layer is available at:</br/>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/land_uti2_scot/index.html">Scotland</a>.<br/>' +
		'<a href="https://geo.nls.uk/mapdata2/lus_10k/index.html">England and Wales</a>.<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
				// '<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				// '<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}

	else if (overlayTitle.includes("OS 1:1 million-1:2.5K, 1900s"))
	{
		var overlayline = '1:1 million to 1:10,560 is available at <a href="https://cloud.maptiler.com/tiles/uk-osgb1888/">Great Britain - 1:1 million to 1:10,560</a>.<br/>' +
		'The largest scale 25 inch / 1:2,500 layers are available under specific counties:<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/scotland_2/index.html">Scotland - North</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/bedfordshire/index.html">Bedfordshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/berkshire/index.html">Berkshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/buckingham/index.html">Buckinghamshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cambridge/index.html">Cambridgeshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cheshire/index.html">Cheshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cornwall/index.html">Cornwall</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/cumberland/index.html">Cumberland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/devon2nd/index.html">Devon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/dorset/index.html">Dorset</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/durham/index.html">Durham</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/essex/index.html">Essex</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/gloucester2nd/index.html">Gloucestershire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hampshire/index.html">Hampshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/herefordshire/index.html">Herefordshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/hertfordshire/index.html">Hertfordshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/huntingdon/index.html">Huntingdon</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/kent/index.html">Kent</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/lancashire/index.html">Lancashire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/leicestershire/index.html">Leicestershire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/lincolnshire/index.html">Lincolnshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/london/index.html">London</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/middlesex/index.html">Middlesex</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/norfolk/index.html">Norfolk</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/northampton/index.html">Northamptonshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/northumberland/index.html">Northumberland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/nottinghamshire/index.html">Nottinghamshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/oxford/index.html">Oxford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/rutland/index.html">Rutland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/Shrop_Derby/index.html">Shropshire / Derbyshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/somerset/index.html">Somerset</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/stafford/index.html">Stafford</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/suffolk/index.html">Suffolk</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/surrey/index.html">Surrey</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/sussex/index.html">Sussex</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/wales/index.html">Wales</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/warwick/index.html">Warwick</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/westmorland/index.html">Westmorland</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/wiltshire2nd/index.html">Wiltshire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/worcestershire/index.html">Worcestershire</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/25_inch/yorkshire/index.html">Yorkshire</a>.<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18 <br/>' +
					reusetext + '</p>';
	}
	else if (overlayTitle.includes("Half-Inch (MOT)"))
	{
		var overlayline = 'OS Half-Inch (MOT), 1923 layer is available as:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/mot/index.html">Scotland</a>.<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/half-inch-mot/index.html">England and Wales</a>.<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 13 <br/>' +
		'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +

					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("Half-Inch (Outline)"))
	{
		var overlayline = 'OS Half-Inch (Outline), layer is available as:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/half-inch-outline-blue/index.html">Scotland</a>.<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/half-inch-outline/index.html">England and Wales</a>.<br/>' +
						'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 13 <br/>' +
		'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}	
	else if (overlayTitle.includes("OS Half-Inch (hills)"))
	{
		var overlayline = 'OS Half-Inch (hills), layer is available as:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/half-inch-hills/index.html">Scotland</a>.<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/half-inch-eng-large-sheet-hills/index.html">England and Wales</a>.<br/>' +
						'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 13 <br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}	
	else if (overlayTitle.includes("OS Half-Inch (layers)"))
	{
		var overlayline = 'OS Half-Inch (layers), layer is available as:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/half-inch-layers/index.html">Scotland</a>.<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/half-inch-eng-large-sheet-layers/index.html">England and Wales</a>.<br/>' +
						'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 13 <br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}	
	else if (overlayTitle.includes("Great Britain - OS Quarter Inch, 3rd ed., 1919-1923"))
	{
		var overlayline = 'Great Britain - OS Quarter Inch, 3rd ed., 1919-1923 is available as:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/quarter/index.html">Scotland</a>.<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/quarter-inch-third-colour-eng/index.html">England and Wales</a>.<br/>' +
						'<strong>Layer WFS Metadata:</strong> nls:os_quarter_inch_thirdcolWFS<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 12 <br/>' +
		'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}	
	else if (overlayTitle.includes("Scotland - OS Six Inch, 1843-1882"))
	{
		var overlayline = 'OS six-inch, 1843-1882 layer is available as:</br/>' +
		
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/6inchfirst/index.html">Google Spherical Mercator projection tileset (EPSG:3857)</a>.<br/>' +
		'<a href="https://geo.nls.uk/mapdata3/os/6inchfirstBNG/openlayers.html">British National Grid projection tileset (EPSG:27700)</a>.<br/>' +
						'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
		'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS 25 Inch drawings, 1890s-1940s"))
	{
		var overlayline = '<a href="https://geo.nls.uk/mapdata3/os/25_inch/blue-and-blacks/index.html">' + map.getLayers().getArray()[4].get("title") + '</a>.<br/>' +
		'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18 <br/>' +
		'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
		'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}

	else if (overlayTitle.includes("OS 1:1,250 A"))
	{
		var overlayline = 'OS 1:1,250 "A" edition, Edinburgh / Scotland:<br/> ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/edinburgh_1250/index.html">Edinburgh, 1944-1963</a><br/>' +
			'OS 1:1,250 "A" edition, Scotland:<br/> ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/scotland_1250_country/index.html">1944-1966</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_1967/index.html">1967</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_1968/index.html">1968</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_1969/index.html">1969</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_1970/index.html">1970</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_1971/index.html">1971</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_1972-4/index.html">1972-74</a>.<br/>' +

			'OS 1:1,250 "A" edition, England / Wales:<br/>' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_1/index.html">NY-SJ</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_2/index.html">SJ-SP</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_3/index.html">SH-TL</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_A_4/index.html">TL-TR</a>, ' +			
			'<a href="https://geo.nls.uk/mapdata3/os/london_1250/index.html">1940s-1950s London</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_1974/index.html">1974</a>.<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 20 <br/>' +
							'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +


			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	
	else if (overlayTitle.includes("OS 1:1,250 B"))
	{
		var overlayline = 'OS 1:1,250 "B" edition, Scotland:<br/> ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_B/index.html">ND-NZ</a><br/>' +

			'OS 1:1,250 "B" edition, England and Wales:<br/>' +
			'<a href="https://geo.nls.uk/maps/os/1250_B_1eng/index.html">SJ-TR</a>. ' +
			'<a href="https://geo.nls.uk/maps/os/1250_B_1eng/index.html">TQ</a>.<br/>' +


			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 20 <br/>' +
							'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +


			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS 1:1,250 C"))
	{
		var overlayline = 'OS 1:1,250 "C" edition<br/> ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/1250_C/index.html">Scotland</a><br/>' +
			'<a href="https://geo.nls.uk/maps/os/1250_C/index.html">Great Britain</a>.<br/>' +
//			'<a href="https://geo.nls.uk/maps/os/1250_B_1eng/index.html">TQ</a>.<br/>' +


			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 20 <br/>' +
							'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +


			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS 1:2,500 A"))
	{
		var overlayline = 'OS 1:2,500 "A" edition Scotland:<br/><a href="https://mapseries-tilesets.s3.amazonaws.com/scotland_2500_singles/index.html">1944-1966 (1 x 1 km sheets)</a>,<br/>' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/scotland_2500_doubles/index.html">1944-1966 (1 x 2 km sheets)</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1967/index.html">1967</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/2500_1968/index.html">1968</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/2500_1969/index.html">1969</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_1970/index.html">1970</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_1971/index.html">1971</a>. ' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1972/index.html">1972</a>. ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_1973/index.html">1973</a>. ' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1974/index.html">1974</a>.<br/>' +
			'OS 1:2,500 "A" edition England / Wales, 1 x 2 km sheets, 1944-1973<br/>' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_1D/index.html">NU-SD</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_2D/index.html">SD-SJ</a>, ' +
			'<a href="https://geo.nls.uk/maps/os/2500_A_3D/index.html">SJ-SK</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_4D/index.html">SO-SO</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_5D/index.html">SP-ST</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_6D/index.html">TA-SZ</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_7D/index.html">TF-TV</a>.<br/>' +

			'OS 1:2,500 "A" edition England / Wales, 1 x 1 km sheets, 1944-1973<br/>' +			
			'<a href="https://geo.nls.uk/maps/os/2500_A_1S/index.html">NU-SJ</a>, ' +			
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_2S/index.html">SS-SO</a>, ' +	
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_3S/index.html">SX-TL</a>, ' +	
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_4S/index.html">TL-TV</a>, ' +				
			'<a href="https://geo.nls.uk/mapdata3/os/london_2500/index.html">1940s-1950s London / S.E. England</a>.<br/>' +
			'OS 1:2,500 "A" edition England, Scotland and Wales, all sheets, 1974<br/>' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1974/index.html">1974</a>.<br/>' +

			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("OS 1:2,500 B"))
	{
		var overlayline = 'OS 1:2,500 "B" edition Scotland, England and Wales:<br/>' +
		
		'<a href="https://geo.nls.uk/mapdata2/os/2500_B/index.html">HU-TV</a>,<br/>' +

			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	
	else if (overlayTitle.includes("1:1,250/1:2,500"))
	{
		var overlayline = 'OS 1:1,250 "A" ed., Edinburgh / Scotland:<br/> ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/edinburgh_1250/index.html">Edinburgh, 1944-1963</a><br/>' +
			'OS 1:1,250 "A" edition, Scotland:<br/> ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/scotland_1250_country/index.html">1944-1966</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_1967/index.html">1967</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_1968/index.html">1968</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_1969/index.html">1969</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_1970/index.html">1970</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_1971/index.html">1971</a>.<br/>' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_1972-4/index.html">1972-74</a>.<br/>' +


			'OS 1:1,250 "A" ed., England / Wales:<br/>' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_1/index.html">NY-SJ</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_2/index.html">SJ-SP</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_3/index.html">SH-TL</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/1250_A_4/index.html">TL-TR</a>, ' +			
			'<a href="https://geo.nls.uk/mapdata3/os/london_1250/index.html">1940s-1950s London</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/1250_A_1974/index.html">1971</a>.<br/>' +

			'OS 1:2,500 "A" ed. Scotland:<br/><a href="https://mapseries-tilesets.s3.amazonaws.com/scotland_2500_singles/index.html">1944-1966 (1 x 1 km sheets)</a>,<br/>' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/scotland_2500_doubles/index.html">1944-66 (1 x 2 km sheets)</a>, ' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1967/index.html">1967</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/2500_1968/index.html">1968</a>, ' +
			'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/2500_1969/index.html">1969</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_1970/index.html">1970</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_1971/index.html">1971</a>. ' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1972/index.html">1972</a>. ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_1973/index.html">1973</a>. ' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1974/index.html">1974</a>.<br/>' +
			
			
			'OS 1:2,500 "A" ed. England / Wales, 1 x 2 km sheets, 1944-74<br/>' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_1D/index.html">NU-SD</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_2D/index.html">SD-SJ</a>, ' +
			'<a href="https://geo.nls.uk/maps/os/2500_A_3D/index.html">SJ-SK</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_4D/index.html">SO-SO</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_5D/index.html">SP-ST</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_6D/index.html">TA-SZ</a>, ' +
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_7D/index.html">TF-TV</a>.<br/>' +
			'OS 1:2,500 "A" edition England and Wales, 1 x 1 km sheets, 1944-74<br/>' +			
			'<a href="https://geo.nls.uk/maps/os/2500_A_1S/index.html">NU-SJ</a>, ' +			
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_2S/index.html">SS-SO</a>, ' +	
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_3S/index.html">SX-TL</a>, ' +	
			'<a href="https://geo.nls.uk/mapdata2/os/2500_A_4S/index.html">TL-TV</a>, ' +				
			'<a href="https://geo.nls.uk/mapdata3/os/london_2500/index.html">1940s-1950s London / S.E. England</a>.<br/>' +

			'OS 1:2,500 "A" ed. England, Scotland, Wales, 1974<br/>' +
			'<a href="https://geo.nls.uk/mapdata3/os/2500_1974/index.html">1974</a>.<br/>' +

			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 18-20 <br/>' +

					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
	}
	else if (overlayTitle.includes("Times Survey"))

	{
		var overlayline = '<strong>Times Survey Atlas</strong> is available as separate layers for particular zoom levels:</p>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/tsa/layer_01/index.html">Times Survey Atlas - Layer 1</a>. <strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 7 <br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/tsa/layer_02/index.html">Times Survey Atlas - Layer 2</a>. <strong>Minimum Zoom:</strong> 2, <strong>Maximum Zoom:</strong> 8 <br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/tsa/layer_03/index.html">Times Survey Atlas - Layer 3</a>. <strong>Minimum Zoom:</strong> 3, <strong>Maximum Zoom:</strong> 9 <br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/tsa/layer_04/index.html">Times Survey Atlas - Layer 4</a>. <strong>Minimum Zoom:</strong> 4, <strong>Maximum Zoom:</strong> 10 <br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/tsa/layer_05/index.html">Times Survey Atlas - Layer 5</a>. <strong>Minimum Zoom:</strong> 5, <strong>Maximum Zoom:</strong> 12 <br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use these layers</a>.</p>';
	}
	else if (overlayTitle.includes("Trench"))

	{

		var overlaySource = map.getLayers().getArray()[4].getSource().urls[0];
		var overlayminZoom = map.getLayers().getArray()[4].getSource().getTileGrid().minZoom;
			if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
			{
			var overlayMaxZoom = map.getLayers().getArray()[4].get("maxZ");
			}

		var overlayline = '<strong>Trench maps</strong><br/>The <strong>' + map.getLayers().getArray()[4].get("title") + '</strong> layer<br/> is only available as an XYZ/TMS layer:<br/>' +
			'<div id="url">' +  overlaySource + '</div>&nbsp;&nbsp;<button id="copytilesetbutton" onclick="copyURL()">Copy</button>&nbsp;&nbsp;<div id="clipboard-response"></div><br/>'+
			'<strong>Minimum Zoom:</strong> ' + overlayminZoom  + ', <strong>Maximum Zoom:</strong> ' + overlaymaxZoom  + '<br/>' +


					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';

	}

	else if (overlayTitle.includes("India"))

	{
		var overlayline = '<strong>Survey of India maps</strong><br/>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/half1/index.html">Half-inch, 1st edition, west</a>,' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/half1_new/index.html">Half-inch, 1st edition, east</a><br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/half2/index.html">Half-inch, 2nd edition, west</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/half2_new/index.html">Half-inch, 2nd edition, east</a><br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/one1/index.html">One-inch, 1st edition, west</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/one1_new/index.html">One-inch, 1st edition, east</a><br/> ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/one2/index.html">One-inch, 2nd edition, west</a>, ' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/india/one2_new/index.html">One-inch, 2nd edition, east</a>.<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use these layers</a>.</p>';
	}
	
		else if (overlayTitle.includes("Photos"))

	{
		var overlayline = '<strong>Air Photo Mosaics, 1944-50</strong><br/>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/air-photos-1250/index.html">England and Wales - 1:1,250</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/air-photos-10560/index.html">England and Wales - 1:10,560</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/air-photo/index.html">Scotland - 1:10,560</a>.<br/> ' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
			'<strong>1:10,560 layer WFS Metadata:</strong>nls:catalog_air_photos_10560_WFS<br/>' +
			'<strong>1:10,560:</strong> <a href="javascript:downloadGeoJSON(\'nls:catalog_air_photos_10560_WFS\')">Download GeoJSON file of metadata</a><br/>' +
			'<strong>1:1,250 layer WFS Metadata:</strong>nls:catalog_air_photos__1250_WFS<br/>' +
			'<strong>1:1,250:</strong> <a href="javascript:downloadGeoJSON(\'nls:catalog_air_photos__1250_WFS\')">Download GeoJSON file of metadata</a><br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use these layers</a>.</p>';
	}
	
			else if (overlayTitle.includes("Geology Six Inch"))

	{
		var overlayline = '<strong>Geology Six Inch, 1900s-1940s</strong><br/>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/geological/sixincheng/index.html">England and Wales</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/geological/sixinchscot/index.html">Scotland</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/geological/sixinch2025/index.html">1950-55 updates</a>,<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use these layers</a>.</p>';
	}

	
			else if (overlayTitle.includes("OS One Inch, 1919-1930"))	
	
	{
		var overlayline = '<strong>Ordnance Survey One Inch, Popular 1919-1930</strong><br/>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/os/popular-england/index.html">England and Wales</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/popular/index.html">Scotland</a>,<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use these layers</a>.</p>';
	}


			else if (overlayTitle.includes("One Inch 1st"))	
	
	{
		var overlayline = '<strong>Ordnance Survey One Inch Old Series, 1800s-1860s</strong><br/>' +

		'This layer is currently only available as an <a href="https://allmaps.org/">Allmaps</a> annotation - see the <a href="https://dev.viewer.allmaps.org/?url=https%3A%2F%2Fmaps.nls.uk%2Fgeo%2Fallmaps%2Fold-series.json">OS Old Series in the Allmaps viewer</a>.</br>' +
		'It is not possible to bring this into a GIS as an XYZ or WMTS service, but it can be brought into <em>Maplibre</em>, <em>OpenLayers</em> or <em>Leaflet</em> using the <a href="https://allmaps.org/#plugins">Allmaps plugins</a>.<br/>' + 
		'Please also read our <a href="https://maps.nls.uk/os/one-inch-old-series/info.html#accuracy">Notes on the geodetic accuracy of the Old Series</a>, and why it should be used with caution as a georeferenced layer.</p>';
	}

			else if (overlayTitle.includes("Old Series"))	
	
	{
		var overlayline = '<strong>Ordnance Survey One Inch Old Series, 1800s-1860s</strong><br/>' +

		'This layer is currently only available as an <a href="https://allmaps.org/">Allmaps</a> annotation - see the <a href="https://dev.viewer.allmaps.org/?url=https%3A%2F%2Fmaps.nls.uk%2Fgeo%2Fallmaps%2Fold-series.json">OS Old Series in the Allmaps viewer</a>.</br>' +
		'It is not possible to bring this into a GIS as an XYZ or WMTS service, but it can be brought into <em>Maplibre</em>, <em>OpenLayers</em> or <em>Leaflet</em> using the <a href="https://allmaps.org/#plugins">AllMaps plugins</a>.<br/>' + 
		'Please also read our <a href="https://maps.nls.uk/os/one-inch-old-series/info.html#accuracy">Notes on the geodetic accuracy of the Old Series</a>, and why it should be used with caution as a georeferenced layer.</p>';
	}

	
			else if (overlayTitle.includes("Geology One Inch"))

	{
		var overlayline = '<strong>Geology One Inch, 1860s-1940s</strong><br/>' +

		'<a href="https://mapseries-tilesets.s3.amazonaws.com/geological/oneincheng/index.html">England and Wales</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/geological/oneinchscot/index.html">Scotland</a>,<br/>' +
		'<a href="https://mapseries-tilesets.s3.amazonaws.com/geological/oneinch2025/index.html">1950-55 updates</a>,<br/>' +
			'<strong>Minimum Zoom:</strong> 1, <strong>Maximum Zoom:</strong> 16 <br/>' +
			'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
			'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use these layers</a>.</p>';
	}

	else

	{

		var overlaySource = map.getLayers().getArray()[4].getSource().urls[0];
		var UrlEncodeOverlaySource = decodeURI(overlaySource);
		var overlayminZoom = map.getLayers().getArray()[4].getSource().getTileGrid().minZoom;
			if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
			{
			var overlaymaxZoom = map.getLayers().getArray()[4].get("maxZ");
			}
			
		if (overlaySource.includes("ad_chart") &&    !overlaySource.includes("tileserver"))
		{
		var overlaySource = map.getLayers().getArray()[4].getSource().urls[0];
		var overlayline =  map.getLayers().getArray()[4].get("title") + '</a><br/>' +
			'<strong>XYZ URL:</strong> ' + overlaySource  + '<br/>' +
			'<strong>Minimum Zoom:</strong> ' + overlayminZoom  + ', <strong>Maximum Zoom:</strong> ' + overlaymaxZoom  + '<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
		}
	
		else if (overlaySource.includes(".jpg") && !overlaySource.includes("tileserver"))
		{
		var file = overlaySource.replace('{z}/{x}/{y}.jpg','index.html');
		var overlayline = '<a href="' + file + '">' + map.getLayers().getArray()[4].get("title") + '</a><br/>' +
			'<strong>Minimum Zoom:</strong> ' + overlayminZoom  + ', <strong>Maximum Zoom:</strong> ' + overlaymaxZoom  + '<br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
		}

		else if (overlaySource.includes("allmaps") && overlaySource.includes("{y}.png"))
		{
		var overlayline = 'The <strong>' + map.getLayers().getArray()[4].get("title") + '</strong> layer<br/> is only available as an XYZ/TMS layer:<br/>' +
			'<div id="url">' +  overlaySource + '</div>&nbsp;&nbsp;<button id="copytilesetbutton" onclick="copyURL()">Copy</button>&nbsp;&nbsp;<div id="clipboard-response"></div><br/>'+
			'<strong>Minimum Zoom:</strong> ' + overlayminZoom  + ', <strong>Maximum Zoom:</strong> ' + overlaymaxZoom  + '<br/>' +
				'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +

					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';



		}
	
		else if (overlaySource.includes("{y}.png") &&    !overlaySource.includes("tileserver"))
	
		{
		var file = overlaySource.replace('{z}/{x}/{y}.png','index.html');
		var overlayline = '<a href="' + file + '">' + map.getLayers().getArray()[4].get("title") + '</a><br/>' +
			'<strong>Minimum Zoom:</strong> ' + overlayminZoom  + ', <strong>Maximum Zoom:</strong> ' + overlaymaxZoom  + '<br/>' +
							'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
		}
	
		else if ( overlaySource.includes("tileserver") &&  overlaySource.includes("{y}.png"))
	
		{
		var file = overlaySource.replace('{z}/{x}/{y}.png','');
		var overlayline = '<a href="' + file + '">' + map.getLayers().getArray()[4].get("title") + '</a><br/>' +

				'Read about other availability through our <a href="https://maps.nls.uk/projects/api/">Historic Maps API</a>.<br/>' +
								'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
		}


	
		else if ( overlaySource.includes("tileserver") &&  overlaySource.includes("{y}.jpg"))
	
		{
		var file = overlaySource.replace('{z}/{x}/{y}.jpg','');
		var overlayline = '<a href="' + file + '">' + map.getLayers().getArray()[4].get("title") + '</a><br/>' +
				'<strong>This layer is only available for non-commercial purposes only.</strong><br/>' +
				'Read about other availability through our <a href="https://maps.nls.uk/projects/subscription-api/">Historic Maps Subscription API</a>.<br/>' +
								'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +
					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';
		}



	
		else if (overlaySource.includes("{-y}.png"))
		{
		var overlayline = 'The <strong>' + map.getLayers().getArray()[4].get("title") + '</strong> layer<br/> is only available as an XYZ/TMS layer:<br/>' +
			'<div id="url">' +  overlaySource + '</div>&nbsp;&nbsp;<button id="copytilesetbutton" onclick="copyURL()">Copy</button>&nbsp;&nbsp;<div id="clipboard-response"></div><br/>'+
			'<strong>Minimum Zoom:</strong> ' + overlayminZoom  + ', <strong>Maximum Zoom:</strong> ' + overlaymaxZoom  + '<br/>' +
							'<strong>Layer WFS Metadata:</strong> ' + TypeName_WFS + '<br/>' +
				'<a href="javascript:downloadGeoJSON(\'' + TypeNameWFS + '\')">Download GeoJSON file of metadata</a> relating to these maps<br/>' +

					reusetext + '<br/>' +
			'<a href="https://maps.nls.uk/guides/georeferencing/">Help on how to use this layer</a>.</p>';



		}
		else
		{
		var overlayline = '<p>Please contact us at <a href=mailto:maps@nls.uk>maps.nls.uk</a> for the tileset URL.</p>';
		}			
	}

	$("#showCoordinatesinfo").removeClass("hidden");

	jQuery('#showCoordinatesinfo').show();
	
				$("#showCoordinatesinfo").css({ 'text-align': 'left' });
				$("#showCoordinatesinfo").css({ 'min-width': '300px' });

       			document.getElementById('showCoordinatesinfo').innerHTML = '<button type="button" id="hideshowcoordinatesinfo" class="close"  aria-label="Close"><span aria-hidden="true" >&times;</span></button><p style="margin-bottom:18px;"></p>' +
				'<p><strong>Current map overlay</strong><br/>' +

			overlayline;

	    jQuery("#hideshowcoordinatesinfo").click(function(){
			jQuery('#showCoordinatesinfo').hide();

//			$('#map').focus();

	    });
	}
	


	// Get the modal
	var WMTSmodal = document.getElementById("WMTSModal");
	
	// Get the <span> element that closes the modal
	var WMTSspan = document.getElementsByClassName("WMTSclose")[0];
	
	WMTSspan.onclick = function() {
	  WMTSmodal.style.display = "none";
	}
		
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == WMTSmodal) {
	    WMTSmodal.style.display = "none";
	  }
	}


	function displayWMTS()  {

			  WMTSmodal.style.display = "block";
			  WMTScontent.innerHTML =  window.location.href;

	}
	

	
function addlinkmobile()

		{	
		var WMTSmodal = document.getElementById("WMTSModal");
	
		WMTSmodal.style.display = "block";
		WMTScontent.innerHTML =  window.location.href;
		
		}

function addmarker() 

	{
	addMarker = true;
	
		$("#showCoordinatesinfo").removeClass("hidden");
	
			if ($("#morePanel") != null ) { jQuery("#morePanel").hide(); }
			if ($("#footermore") != null ) { jQuery("#footermore").show(); }

				$("#showCoordinatesinfo").css({ 'text-align': 'center' });
				$("#showCoordinatesinfo").css({ 'min-width': '250px' });

			jQuery('#showCoordinatesinfo').show();
       			document.getElementById('showCoordinatesinfo').innerHTML = 'Click/tap on the map to add a Marker';
	
		setTimeout( function(){
       			document.getElementById('showCoordinatesinfo').innerHTML = '';
			jQuery('#showCoordinatesinfo').hide();
			}, 3000); // delay 50 ms

	}


function remove_marker()
	{
		pointClicked = '0,0';
	    if (map.getLayers().getArray()[5].getSource().getFeatures().length > 0)
			{map.getLayers().getArray()[5].getSource().clear(); }

	    updateUrl();
            document.getElementById('stopmeasuringmessage').innerHTML = '';
			addMarker = false;

			$('#map').focus();

	}


	map.on('click', function(evt){

		evt.preventDefault();


	if ((evt.originalEvent.shiftKey) || (addMarker))

	{

		if (addMarker)
		{
	          document.getElementById('stopmeasuringmessage').innerHTML = 'Click/tap on map to move marker, or <a href="javascript:remove_marker()">Remove Marker</a>';
		}
		else
		{
	          document.getElementById('stopmeasuringmessage').innerHTML = 'SHIFT+click/tap on map to move marker, or <a href="javascript:remove_marker()">Remove Marker</a>';
		}

	    if (map.getLayers().getArray()[5].getSource().getFeatures().length > 0)
			{map.getLayers().getArray()[5].getSource().clear(); }

	    var feature = new ol.Feature(
	        new ol.geom.Point(evt.coordinate)
	    );
	    feature.setStyle(iconStyle);

		var coords = feature.getGeometry().getCoordinates();
		
	        var coordinate = evt.coordinate;

		espg3587 = [];
		espg3587 = ol.proj.transform(coordinate,"EPSG:3857", "EPSG:4326");
		
	//	console.log(coordinate);
		
		pointClicked = [];
		pointClicked.push(espg3587[1].toFixed(6), espg3587[0].toFixed(6));
		updateUrl();

	    vectorSource_new.addFeature(feature);

	}
	else
	{

	evt.preventDefault();
	document.getElementById('map').focus();
	
	
	
	var windowWidth = $(window).width();
	if (windowWidth <= 500) 
		{
		setTimeout( function(){
	        jQuery("#searchSideBar").hide();
		}, 1000); // delay 50 ms
		jQuery("#layersSideBarOutlines").hide();
		jQuery("#showlayersOutlinesExplore").show();

		jQuery("#exploreslideroverlay").show();
		jQuery("#exploreslideroverlaymobile").show();
		}

	}
	});


function zoomtofeatureextent(extent) {

//		if ((urlLayerName == 24) ||  (urlLayerName == 68) ||  (urlLayerName == 77) ||  (urlLayerName == 78) ||  (urlLayerName == 82) )  { return; } 

//       map.getView().fit(extent, map.getSize());


	 var y = extent[1] + (extent[3] - extent[1]) / 2; 
         var x = extent[0] + (extent[2] - extent[0]) / 2; 

	
  	 var resolution = map.getView().getResolutionForExtent(extent, map.getSize());
	 var zoom1 = map.getView().getZoomForResolution(resolution);

	 if (map.getSize()[0] < 600 ) 

	{
	 var zoom = Math.round(zoom1 - 2);
	}
	else
	{
	 var zoom = Math.round(zoom1 - 1);
	}

     
	 if ((zoom > 16 ) || (zoom < 3) || (isNaN(zoom)))
		{ zoom = 16; }


	      function flyTo(location, done) {
	        var duration = 3000;
	      //  var zoom = map.getView().getZoom();
	        var parts = 2;
	        var called = false;
	        function callback(complete) {
	          --parts;
	          if (called) {
	            return;
	          }
	          if (parts === 0 || !complete) {
	            called = true;
	            done(complete);
	          }
	        }
	        map.getView().animate({
	          center: location,
	          duration: duration
	        }, callback);
	        map.getView().animate({
	          zoom: zoom - 1,
	          duration: duration / 2
	        }, {
	          zoom: zoom,
	          duration: duration / 2
	        }, callback);
	      }

//		map.getView().animate({
//			center: [x , y ],
//			zoom: zoom,
//			duration: 1000
//		});

		map.getView().setCenter([x,y]);
		map.getView().setZoom(zoom);

}



function pointClick(pointClicked)  {
		pointClicked2 = pointClicked.split(",");
		        pointClicked4 = [];
		pointClicked4.push(parseFloat(pointClicked2[1]),parseFloat(pointClicked2[0]));
		
		coordinate_new = [];
		coordinate_new = ol.proj.transform(pointClicked4,"EPSG:4326", "EPSG:3857");

		coordinate_parsed = [];

		coordinate_parsed.push(parseFloat(coordinate_new[0]),parseFloat(coordinate_new[1]));
//		console.log(coordinate_parsed);

	    var feature = new ol.Feature(
	        new ol.geom.Point(coordinate_parsed)
	    );
	    feature.setStyle(iconStyle);
	    vectorSource_new.addFeature(feature);
          document.getElementById('stopmeasuringmessage').innerHTML = 'SHIFT+click on map to move marker, or <a href="javascript:remove_marker()">Remove Marker</a>';
		updateUrl();
}





      var view = new ol.View({
		    center: ol.proj.transform([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857'),
		    zoom: currentZoom
      });

/*

$('#nlsgaz').bind('input keyup', function(e){
    var searchValue = $(this).val();
    nlsgaz(searchValue);
});

*/

if (document.getElementById("nlsgaz") != null) {

         // Initialize the Gazetteer with autocomplete and County+Parish selector
     nlsgaz(function(minx,miny,maxx,maxy){
		 
	jQuery( "#scaleslider" ).slider('setValue',[12,20]);
	
      // alert(minx + ' ' + miny + ' ' + maxx + ' ' + maxy);

      // zoom to gridref

      // zoom to bbox

	 var currentZoom = map.getView().getZoom();
         var extent = [minx, miny, maxx, maxy];



         extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));

//       map.getView().fit(extent, map.getSize());

	 var y = extent[1] + (extent[3] - extent[1]) / 2; 
         var x = extent[0] + (extent[2] - extent[0]) / 2; 
	
  	 var resolution = map.getView().getResolutionForExtent(extent, map.getSize());
	 var zoom1 = map.getView().getZoomForResolution(resolution);

	 if (map.getSize()[0] < 600 ) 

	{
	 var zoom = Math.round(zoom1 - 1);
	}
	else
	{
	 var zoom = Math.round(zoom1);
	}

	if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
	{
	var overlayMaxZoom = map.getLayers().getArray()[4].get("maxZ");
	MaxZoom = Math.round(overlayMaxZoom - 1);
	}
	else
	{
	console.log("no max zoom");
	MaxZoom = 16;
	}

	var windowWidth = $(window).width();
    	if ((windowWidth <= 600) && (document.getElementById("parish").selectedIndex != 0)) {
		setTimeout( function(){
	        jQuery("#searchSideBar").hide();
	        jQuery("#show").show();
		}, 1000); // delay 50 ms
	jQuery("#layersSideBarOutlines").hide();
	jQuery("#showlayersOutlinesExplore").show();

	jQuery("#exploreslideroverlay").show();
	jQuery("#exploreslideroverlaymobile").show();
	}

     
	 if ((zoom < 3) || (isNaN(zoom)) || (zoom > MaxZoom))
		{ zoom = MaxZoom; }

	 if ((map.getLayers().getLength() > 6) && (map.getLayers().getArray()[6].getSource() != null)) {map.getLayers().getArray()[6].getSource().clear();  document.getElementById('wfsResults').innerHTML = ""; }
	 if ((map.getLayers().getLength() > 7) && (map.getLayers().getArray()[7].getSource() != null)) {map.getLayers().getArray()[7].getSource().clear();  document.getElementById('wfsParishCountyResults').innerHTML = ""; }

	      function flyTo(location, done) {
	        var duration = 3000;
	      //  var zoom = map.getView().getZoom();
	        var parts = 2;
	        var called = false;
	        function callback(complete) {
	          --parts;
	          if (called) {
	            return;
	          }
	          if (parts === 0 || !complete) {
	            called = true;
	            done(complete);
	          }
	        }
	        map.getView().animate({
	          center: location,
	          duration: duration
	        }, callback);
	        map.getView().animate({
	          zoom: zoom - 1,
	          duration: duration / 2
	        }, {
	          zoom: zoom,
	          duration: duration / 2
	        }, callback);
	      }

//	if (parseInt(currentZoom) > 8)
//		{
//		flyTo([x, y], function() {});
//		}
//	else
//		{

		//	 alert("x: " + x + ", y: " + y + ", res: " + resolution + ", zoom: " + zoom);
			
//			map.getView().animate({
//				center: [x , y ],
//				zoom: zoom,
//			        duration: 500
//			});

			map.getView().setCenter([x , y ]);
			map.getView().setZoom(zoom);



//			setTimeout( function(){


//			$( "#layerfiltercheckbox" ).prop( "checked", true );
//			zoomInOut();

			$('#map').focus();

		
//			}, 200); // delay 50 ms

	}




    );

}


if (document.getElementById("nlsgaz") != null) {

      var autocomplete = new kt.OsmNamesAutocomplete('searchgb1900', 'https://nlsgb1900.klokantech.com/');
      autocomplete.registerCallback(function(item) {
       (JSON.stringify(item, ' ', 2));


		if (jQuery('#layerfiltercheckbox').is(":checked")) 

		{
			$( "#layerfiltercheckbox" ).prop( "checked", false );
		}

		var mapgroupno = map.getLayers().getArray()[4].get('group_no');
	
		if (mapgroupno !== '36')
		
		{ 
	
		map.getLayers().removeAt(4);
		overlaySelected = getOverlay(6);
	        switchOverlayinitial();
	
		}


	lonlat_3857 = [];
	lonlat_3857 = ol.proj.transform([item.lat, item.lon], 'EPSG:4326','EPSG:3857');

	zoom = 16;

        // alert(lonlat_3857[0] + ' ' + lonlat_3857[1] + ' ');

	 if ((map.getLayers().getLength() > 6) && (map.getLayers().getArray()[6].getSource() != null)) {map.getLayers().getArray()[6].getSource().clear();  document.getElementById('wfsResults').innerHTML = ""; }
	 if ((map.getLayers().getLength() > 7) && (map.getLayers().getArray()[7].getSource() != null)) {map.getLayers().getArray()[7].getSource().clear();  document.getElementById('wfsParishCountyResults').innerHTML = ""; }



	function flyTo(location, done) {
	        var duration = 3000;
	      //  var zoom = map.getView().getZoom();
	        var parts = 2;
	        var called = false;
	        function callback(complete) {
	          --parts;
	          if (called) {
	            return;
	          }
	          if (parts === 0 || !complete) {
	            called = true;
	            done(complete);
	          }
	        }
	        map.getView().animate({
	          center: location,
	          duration: duration
	        }, callback);
	        map.getView().animate({
	          zoom: zoom - 1,
	          duration: duration / 2
	        }, {
	          zoom: zoom,
	          duration: duration / 2
	        }, callback);
	      }



			map.getView().setCenter([lonlat_3857[0] , lonlat_3857[1]]);
			map.getView().setZoom(zoom);


			setTimeout( function(){


				map.dispatchEvent({    //        
				  type: 'singleclick',
		//		  type: 'dblclick',
				  pixel: [100, 100],
				});
		
		

			$('#map').focus();

		
			}, 200); // delay 50 ms

	var windowWidth = $(window).width();
    	if (windowWidth <= 600) {
		setTimeout( function(){
	        jQuery("#searchSideBar").hide();
	        jQuery("#show").show();
		}, 1000); // delay 50 ms
	jQuery("#layersSideBarOutlines").hide();
	jQuery("#showlayersOutlinesExplore").show();
	jQuery("#exploreslideroverlay").show();
	jQuery("#exploreslideroverlaymobile").show();
	}

	}

    );


}

if (document.getElementById("nlsgaz") != null) {


	userInput.addEventListener('input', function(event) {

	   if (this.value.length > 2)

		{
			
			   if (this.value.length < 4)
			   {zoom = 13;}
			   else if ((this.value.length > 3) && (this.value.length < 5))
			   {zoom = 14;}
			   else if ((this.value.length > 4) && (this.value.length < 6))
			   {zoom = 15;}
			   else if (this.value.length > 5) 
			   {zoom = 16;}

		currentConversion.name = userInput.value;
		  if (tokeniseConversion(currentConversion)) {
//		    document.getElementById("parse").innerHTML = `&bull; Parsed ${currentConversion.name} to&emsp;${currentConversion.sheet}&emsp;|&emsp;${currentConversion.letter}&emsp;|&emsp;${currentConversion.number}&emsp;|&emsp;${currentConversion.grid}&emsp;|&emsp;${Math.round(100 * currentConversion.xOrdinate)}&emsp;|&emsp;${(Math.round(100 * currentConversion.yOrdinate))}`;
		    setEastingNorthing(currentConversion);
//		    document.getElementById("distance").innerHTML = `&bull; Determined ${currentConversion.name} to be x: ${currentConversion.easting.toFixed(0)},  y: ${currentConversion.northing.toFixed(0)} metres from Bonne origin`;
		    inverseProject(currentConversion);
//		    document.getElementById("conversion").innerHTML = `&bull; Converted [${currentConversion.easting.toFixed(0)}, ${currentConversion.northing.toFixed(0)}] to ${currentConversion.latitude.toFixed(6)}, ${currentConversion.longitude.toFixed(6)}`;
//		    document.getElementById("quadrant").innerHTML = `&bull; Identified the quadrant as ${currentConversion.quadrant}`;
//		    forwardConvertMapSheet();
//		    document.getElementById("forward").innerHTML = `&bull; Forward projected ${currentConversion.latitude.toFixed(6)}, ${currentConversion.longitude.toFixed(6)} to ${currentConversion.easting.toFixed(0)}, ${currentConversion.northing.toFixed(0)}`;

//		    document.getElementById("forlat").innerHTML = `&bull; Converted [${currentConversion.easting.toFixed(0)}, ${currentConversion.northing.toFixed(0)}] to <strong>${currentConversion.name}</strong>`;
//		    document.getElementById("header").innerText += ` for Sheet ${userInput.value}`;
//		    updateMap(currentConversion.latitude, currentConversion.longitude);

//			console.log("forward: " + forwardConvertMapSheet());

			if (isNum(currentConversion.latitude)) {
	
			    lonlat_3857 = [];
			    lonlat_3857 = ol.proj.transform([currentConversion.longitude, currentConversion.latitude], 'EPSG:4326','EPSG:3857');
	
//			    console.log("currentConversion.latitude, etc : " +  currentConversion.latitude + " , " + currentConversion.longitude);
	
//			    console.log("lonlat : " +  lonlat_3857[0] + " , " +  lonlat_3857[1]);


	
//					map.getView().animate({
//						center: [lonlat_3857[0] , lonlat_3857[1] ],
//						zoom: 16,
//						duration: 1000
//					});

			map.getView().setCenter([lonlat_3857[0] , lonlat_3857[1] ]);
			map.getView().setZoom(zoom);

			}

		  }

		}

	});

}


		
	


			var vector = new ol.layer.Vector({
			  name: 'vector',
			  source: vectorSource,
			  style: new ol.style.Style({
			    fill: new ol.style.Fill({
			      color: 'rgba(0, 0, 0, 0)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: 'rgba(0, 0, 0, 0)',
			      width: 0
			    })
			  })
			});

		// if (map.getLayers().getLength() > 3) 
		map.getLayers().insertAt(6,vector);




			var vectorParish = new ol.layer.Vector({
			  name: 'vectorParish',
			  source: vectorSourceParish,
			  style: new ol.style.Style({
			    fill: new ol.style.Fill({
			      color: 'rgba(0, 0, 0, 0)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: 'rgba(0, 0, 0, 0)',
			      width: 0
			    })
			  }),
			className: 'vectorParish'
			});


			map.getLayers().insertAt(7,vectorParish);
			



	var mapZoom = map.getView().getZoom();
	
		if ((mapZoom < 13) || (wfsparishOFF == true))

		{

			vectorSourceParish = new ol.source.Vector();


 	  		var geojsonFormat = new ol.format.GeoJSON();

			var loadFeaturesParish = function(WFS_Feature) {
			     vectorSourceParish.addFeatures(geojsonFormat.readFeatures(WFS_Feature));
			};


		}

		else 


		{

	    var geojsonFormat = new ol.format.GeoJSON();

		const geometryName = 'the_geom';
		var extent = map.getView().calculateExtent(map.getSize());
		const srsName = 'EPSG:3857';

		const bboxFilter = new ol.format.filter.Bbox(geometryName, extent, srsName);

				var featureRequestParish = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['Scot_Eng_Wales_Ireland_1950s_parish'],
				  propertyNames: ['the_geom','COUNTY','PARISH','TYPE'],
				  outputFormat: 'application/json',
				  filter: bboxFilter
					
				  });					
		



// then post the request and add the received features to a layer
		fetch('https://geoserver3.nls.uk/geoserver/wfs', {

		  method: 'POST',

		  body: new XMLSerializer().serializeToString(featureRequestParish)
		}).then(function(response) {

		  return response.json();
		}).then(function(json) {


        vectorSourceParish.clear(true);
	

				
		  var features = new ol.format.GeoJSON().readFeatures(json);
		  vectorSourceParish.addFeatures(features);


            })
			.catch(error => {
				
			    console.error("Fetch error:", error.message);
				return;
			})



		}


	if ((mapZoom  < 13) || (wfsOFF == true))

		{

			vectorSource = new ol.source.Vector();

	  		var geojsonFormat = new ol.format.GeoJSON();
		
			var loadFeatures = function(WFS_Feature) {
  			     vectorSource.addFeatures(geojsonFormat.readFeatures(WFS_Feature));
			};

		}



	else if      (mapZoom  > 12) 

		{
		
		
			    var geojsonFormat = new ol.format.GeoJSON();

		const geometryName = 'the_geom';
		var extent = map.getView().calculateExtent(map.getSize());
		const srsName = 'EPSG:3857';

		const bboxFilter = new ol.format.filter.Bbox(geometryName, extent, srsName);
		
		var TypeName = map.getLayers().getArray()[4].get('typename');
		TypeName2 = TypeName.replace("nls:", "");

				var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: [TypeName2],
				  propertyNames: ['the_geom','IMAGEURL','WFS_TITLE'],
				  outputFormat: 'application/json',
				  filter: bboxFilter
					
				  });					


		// then post the request and add the received features to a layer
				fetch('https://geoserver.nls.uk/geoserver/wfs', {

				  method: 'POST',

				  body: new XMLSerializer().serializeToString(featureRequest)
				}).then(function(response) {

				  return response.json();
				}).then(function(json) {


				vectorSource.clear(true);
			
		
		
		




//		setTimeout( function(){
//			window_width_centre = Math.round($(window).width() / 2);
//			window_height_centre = Math.round($(window).height() / 2);

//			displayFeatureInfo([window_width_centre,window_height_centre]);

//		    }, 500); // delay 50 ms

			
				var displayFeatureInfo = function(pixel) {

				selectedFeatures = [];
				
				  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				        // return feature;

					selectedFeatures.push(feature);
				    }, {
				        layerFilter: function(layer) {
				            return layer === vector;
				        }
				
				    });

				  var info = document.getElementById('wfsResults');

				if ( map.getLayers().getArray()[4].get('group_no') == '173')
				{
					selectedFeatures.sort(function(a, b){
				   var nameA=a.get('SCALE'), nameB=b.get('SCALE')
					   if (nameA < nameB) //sort string ascending
					       return -1 
					   if (nameA > nameB)
					       return 1
					   return 0 //default return value (no sorting)
			
					})
					
				}

				  var selectedFeaturesLength = selectedFeatures.length;
				  var selectedFeaturesLengthMinusOne = (selectedFeatures.length - 1);
			
//					  if (selectedFeaturesLength == '0')
						  
//						  {
//							  info.innerHTML = '';
//						  }
			
			          if (selectedFeaturesLength > 0)

				  {


			          if (selectedFeaturesLength == '1') 

				  {

					if (selectedFeatures[0].get('WFS_TITLE').length < 2) { return; }
					else
					{
					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;';  
					}
				  }

			          else if (selectedFeaturesLength == '2') 

				  {
					  
					  if  ( map.getLayers().getArray()[4].get('group_no') == '173')
						  
						  {
							  info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;'
						  }
						  else
						  {

					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;<br/>' +
					'&nbsp;' + selectedFeatures[1].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[1].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
					
						  }
              				 
				  }

			          else if (selectedFeaturesLength == '3')

				  {

					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;<br/>' +
					'&nbsp;' + selectedFeatures[1].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[1].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
              				'&nbsp;' + selectedFeatures[2].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[2].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
   
				  }

			          else if (selectedFeaturesLength == '4')

				  {

					info.innerHTML = '&nbsp;' + selectedFeatures[0].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[0].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<a href="javascript:switchWFSOFF();"><span class="WFSclose">&times;</span></a>&nbsp;<br/>' +
					'&nbsp;' + selectedFeatures[1].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[1].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
              				'&nbsp;' + selectedFeatures[2].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[2].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;<br/>';  
                 			'&nbsp;' + selectedFeatures[3].get('WFS_TITLE') + '&nbsp; - <a href="' + selectedFeatures[3].get('IMAGEURL') + '" alt="View specific map listed"  title="View specific map listed">View or order this map</a>&nbsp;';  
   
				  }

				  }


			
				};





			var vectorParish = new ol.layer.Vector({
			  name: 'vectorParish',
			  source: vectorSourceParish,
			  style: new ol.style.Style({
			    fill: new ol.style.Fill({
			      color: 'rgba(0, 0, 0, 0)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: 'rgba(0, 0, 0, 0)',
			      width: 0
			    })
			  })
			});

			map.getLayers().insertAt(7,vectorParish);

// setTimeout( function(){
//	console.log("vectorsource_length: " + map.getLayers().getArray()[5].getSource().getFeatures().length );
//    }, 2500); // delay 50 ms
	
			
				var displayFeatureInfoParish = function(pixel) {

				selectedFeaturesParish = [];
				
				  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				        // return feature;

					selectedFeaturesParish.push(feature);
				    }, {
				        layerFilter: function(layer) {
				            return layer === vectorParish;
				        }
				
				    });


				  var infoCounty = document.getElementById('wfsParishCountyResults');

				  var selectedFeaturesParishLength = selectedFeaturesParish.length;


//				  if ((map.getView().getZoom() > 12) && (selectedFeaturesLength == '0'))

//				  {
//				    infoCounty.innerHTML = '&nbsp;<a href="javascript:checkparishWFS();" alt="View parish" title="View parish" >Show parish?</a>';
//				  }

			          if (selectedFeaturesParishLength == '0')
						  
						  {
							  infoCounty.innerHTML = '';
						  }


			          if (selectedFeaturesParishLength > 0)

				  {

				  if (selectedFeaturesParish[0].get('COUNTY').length > 0) 
					{infoCounty.innerHTML = '&nbsp;' + selectedFeaturesParish[0].get('PARISH') + '&nbsp;parish, '  + selectedFeaturesParish[0].get('COUNTY') + ' (1950s)&nbsp;<a href="javascript:switchparishWFSOFF();" alt="Turn off parish details" title="Turn off parish details"><span class="WFSclose">&times;</span></a>&nbsp;';   } 
				  if (selectedFeaturesParish[0].get('TYPE').length > 0) 
//					if (inScotland = true)
					{infoCounty.innerHTML = '&nbsp;' + selectedFeaturesParish[0].get('PARISH') + '&nbsp;parish, '  + selectedFeaturesParish[0].get('COUNTY') + ' (1950s) - <a href="javascript:showthisparish();" alt="View this parish in Boundaries Viewer" title="View this parish in Boundaries Viewer" >View parish</a> &nbsp; (1950s)&nbsp;<a href="javascript:switchparishWFSOFF();" alt="Turn off parish details" title="Turn off parish details"><span class="WFSclose">&times;</span></a>&nbsp;';    } 
						
				  }
				 


	};



				map.on('pointermove', function(evt) {

				  evt.preventDefault();

				  var center = [];
				  center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");

				  if ((Math.round(center[0])  < 0) || (Math.round(center[0]) > 700000 ) || (Math.round(center[1]) < 0) || (Math.round(center[1]) > 1300000 )) 
					{ return; }
				else
				{
				  if ( document.getElementById('type' ) == null) 
						{ return; }
				  else if (document.getElementById('type').value != 'none') 
					{ document.getElementById('wfsResults').innerHTML = ''; return; }
				  var pixel = map.getEventPixel(evt.originalEvent);
				  displayFeatureInfo(pixel);

				  displayFeatureInfoParish(pixel);
				}
				});
		

            })
			.catch(error => {
				
			    console.error("Fetch error:", error.message);
				return;
			})
		}

	function selectText(containerid) {
	    if (document.selection) {
	        var range = document.body.createTextRange();
	        range.moveToElementText(document.getElementById(containerid));
	        range.select();
	    } else if (window.getSelection) {
	        var range = document.createRange();
	        range.selectNode(document.getElementById(containerid));
	        window.getSelection().addRange(range);
	    }
	}


	function clearSelection()
	{
	 if (window.getSelection) {window.getSelection().removeAllRanges();}
	 else if (document.selection) {document.selection.empty();}
	}

	function getcoordinates()
	{
		getCoordinates = true;
					
			$("#showCoordinatesinfo").removeClass("hidden");
			if ($("#morePanel") != null ) { jQuery("#morePanel").hide(); }
			if ($("#footermore") != null ) { jQuery("#footermore").show(); }
			
			$("#showCoordinatesinfo").css({ 'text-align': 'center' });
				$("#showCoordinatesinfo").css({ 'min-width': '250px' });

			jQuery('#showCoordinatesinfo').show();
       			document.getElementById('showCoordinatesinfo').innerHTML = 'Click/tap on the map to show <br/>coordinates for that location.';
	
		setTimeout( function(){
       			document.getElementById('showCoordinatesinfo').innerHTML = '';
			jQuery('#showCoordinatesinfo').hide();
			}, 3000); // delay 50 ms


	
		/**
		 * Handle pointer move.
		 * @param {ol.MapBrowserEvent} evt
		 */
		var pointerMoveHandlerCoord = function(evt) {
		  if (evt.dragging) {
		    return;
		  }
		 
		var helpMsg = 'Click/tap on the map to show <br/>coordinates for that location.';
	
		  /** @type {ol.Coordinate|undefined} */
		  var tooltipCoord = evt.coordinate;
		
		 		  if (helpTooltipElement) 
		  helpTooltipElement.innerHTML = helpMsg;
		  helpTooltip.setPosition(evt.coordinate);
		
		};

			/**
			 * Creates a new help tooltip for getCoord
			 */
			function createHelpTooltipCoord() {
			  if (helpTooltipElement) {
			    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
			  }
			  helpTooltipElement = document.createElement('div');
			  helpTooltipElement.className = 'tooltip1';
			  helpTooltip = new ol.Overlay({
			    element: helpTooltipElement,
			    offset: [35, 0],
			    positioning: 'center-left'
			  });
			  map.addOverlay(helpTooltip);
			}
			

//		createHelpTooltipCoord();
//		map.on('pointermove', pointerMoveHandlerCoord);

	}

	function remove_getCoordinates()
	
	{
	getCoordinates = false;
//	map.removeOverlay(helpTooltip);
//	var overlayslength = map.getOverlays().getLength();
//	if (overlayslength > 0) {map.getOverlays().clear();}

	if (overlaylayer.getPosition() !== undefined)
	{ overlaylayer.setPosition(undefined); }

        document.getElementById('showCoordinatesinfo').innerHTML = '';
	jQuery('#showCoordinatesinfo').hide();
	}


	window.onkeydown = function( event ) {
	    if ( event.keyCode == 27 ) {
		if (overlaylayer.getPosition() !== undefined)

		{ overlaylayer.setPosition(undefined); }
	    }
	};


   map.on('click', function(event) {

		event.preventDefault();
		

                var coordinate = event.coordinate;

		if (overlaylayer.getPosition() !== undefined)

		{ overlaylayer.setPosition(undefined); }


		if ((event.originalEvent.altKey) || (getCoordinates)) {

				clearSelection();

				// alert(coordinate);
					var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));

				var coord27700 = ol.coordinate.toStringXY(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:27700'), 0);
				pointClicked2 = coord27700.split(",");
				var outx = pointClicked2[0];
				var outy = pointClicked2[1];
				var NGR = gridrefNumToLet(outx, outy, 10);
				var latlon = ol.coordinate.toStringXY(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'), 6);
				latlon2 = latlon.split(",");
				var lat = latlon2[1];
				var lon = latlon2[0];
				
				var mapextent = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), "EPSG:3857", "EPSG:4326");
				var mapextent0 = parseFloat(mapextent[0].toPrecision(7));
				var mapextent1 = parseFloat(mapextent[1].toPrecision(7));
				var mapextent2 = parseFloat(mapextent[2].toPrecision(7));
				var mapextent3 = parseFloat(mapextent[3].toPrecision(7));

				var str = "";

					str += 'You have clicked on: <div id = "popup-copy-All" >';

				var center = [];
				center = ol.proj.transform(coordinate, "EPSG:3857", "EPSG:27700");

				var trench = forwardProject2(lon, lat);
				var trench2 = forwardConvertMapSheet();


				if ((Math.round(center[0])  < -230000) || (Math.round(center[0]) > 700000 ) || (Math.round(center[1]) < 0) || (Math.round(center[1]) > 1300000 )) 

					{

					if (trench2 !== 'error')

						{
						str +=	'<ul><li><strong>Trench map coordinate:  </strong> ' + trench2;
						str +=	'<br/><strong>Latitude, Longitude:  </strong>  ' + lat + ', ' + lon + '</li></ul>';
						str += '</div><center><strong>Copy All</strong> <button class="js-emailcopybtn-All" title="Copy all to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></center>';
						str +=	'<div id = "popup-result"></div>';
			
						}
						else	
			
						{
						str +=	'<ul><li><strong>Latitude, Longitude:  </strong>  ' + lat + ', ' + lon + '</li></ul>';;
						str += '</div><center><strong>Copy All</strong> <button class="js-emailcopybtn-All" title="Copy all to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></center>';
						str +=	'<div id = "popup-result"></div>';
			
						}

					}
				else
				{
					str += '<ul><li><strong>British National Grid Ref: </strong><div id = "popup-copy-NGR">   ' + NGR + '<br/>';
					str += '</div><button class="js-emailcopybtn-NGR" title="Copy British National Grid Reference to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></li>';
					str += '<li><strong>' + 'BNG Eastings, Northings:  </strong><div id = "popup-copy-NGRXY">  ' + ol.coordinate.toStringXY(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:27700'), 0); 
					str += '</div><button class="js-emailcopybtn-NGRXY" title="Copy BNG Eastings/Northings to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></li>';
					str +=	'<li><strong>Latitude, Longitude:  </strong><div id = "popup-copy-latlon">  ' + lat + ', ' + lon;
					str += '</div><button class="js-emailcopybtn-latlon" title="Copy lat/lon to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></li>';
					
		//			str +=	'<li><strong>Geographic Extent of Map:  </strong><div id = "popup-copy-extent" style="text-wrap: wrap;">  [minx: ' + mapextent0 + ',miny: ' + mapextent1 + ',maxx: ' + mapextent2 + ',maxy: ' + mapextent3 + ']';

		//			str += '</div><button class="js-emailcopybtn-extent" title="Copy extent to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></li></ul>';
					
					str += '</div><center><strong>Copy All</strong> <button class="js-emailcopybtn-All" title="Copy all to clipboard"><img src="https://maps.nls.uk/img/copy-to-clipboard.png" width="20" /></button></center>';
					str +=	'<div id = "popup-result"></div>';
				}



		//		 console.log(content.innerHTML);

				content.innerHTML = str;

					overlaylayer.setPosition(coordinate);

				  if (document.querySelector('.js-emailcopybtn-NGR') !== null)
					  
					  {

							copyEmailBtnNGR = document.querySelector('.js-emailcopybtn-NGR');  

							copyEmailBtnNGR.disabled = !document.queryCommandSupported('copy');

							copyEmailBtnNGR.addEventListener('click', function(event) {  

							  window.getSelection().removeAllRanges();
								  // Select the email link anchor text  
								  var emailLink = document.getElementById('popup-copy-NGR');  
								  var range = document.createRange();  
								  range.selectNode(emailLink);  
								  window.getSelection().addRange(range);
								
								  try {  
									// Now that we've selected the anchor text, execute the copy command  
									var successful = document.execCommand('copy');  
									var msg = successful ? 'successful.' : 'unsuccessful.';  
									// console.log('Copy command was ' + msg);  
									document.getElementById("popup-result").innerHTML = 'Copy to clipboard command was ' + msg;
								  } catch(err) {  
									// console.log('Oops, unable to copy');  
									document.getElementById("popup-result").innerHTML = 'Sorry, unable to copy';
								  }
								
								  // Remove the selections - NOTE: Should use
								  // removeRange(range) when it is supported  
								  window.getSelection().removeAllRanges();  


									});
									
					  }
					  
				  if (document.querySelector('.js-emailcopybtn-NGRXY') !== null)
					  
					  {

							copyEmailBtnNGRXY = document.querySelector('.js-emailcopybtn-NGRXY');  

							copyEmailBtnNGRXY.disabled = !document.queryCommandSupported('copy');

							copyEmailBtnNGRXY.addEventListener('click', function(event) {  

							  window.getSelection().removeAllRanges();

								  // Select the email link anchor text  
								  var emailLink = document.getElementById('popup-copy-NGRXY');  
								  var range = document.createRange();  
								  range.selectNode(emailLink);  
								  window.getSelection().addRange(range);
								
								  try {  
									// Now that we've selected the anchor text, execute the copy command  
									var successful = document.execCommand('copy');  
									var msg = successful ? 'successful.' : 'unsuccessful.';  
									// console.log('Copy command was ' + msg);  
									document.getElementById("popup-result").innerHTML = 'Copy to clipboard command was ' + msg;
								  } catch(err) {  
									// console.log('Oops, unable to copy');  
									document.getElementById("popup-result").innerHTML = 'Sorry, unable to copy';
								  }
								
								  // Remove the selections - NOTE: Should use
								  // removeRange(range) when it is supported  
								  window.getSelection().removeAllRanges();  


									});
									
					  }
					  
				  if (document.querySelector('.js-emailcopybtn-latlon') !== null)
					  
					  {

							copyEmailBtnlatlon = document.querySelector('.js-emailcopybtn-latlon');  

							copyEmailBtnlatlon.disabled = !document.queryCommandSupported('copy');

							copyEmailBtnlatlon.addEventListener('click', function(event) {  

							  window.getSelection().removeAllRanges();

								  // Select the email link anchor text  
								  var emailLink = document.getElementById('popup-copy-latlon');  
								  var range = document.createRange();  
								  range.selectNode(emailLink);  
								  window.getSelection().addRange(range);
								
								  try {  
									// Now that we've selected the anchor text, execute the copy command  
									var successful = document.execCommand('copy');  
									var msg = successful ? 'successful.' : 'unsuccessful.';  
									// console.log('Copy command was ' + msg);  
									document.getElementById("popup-result").innerHTML = 'Copy to clipboard command was ' + msg;
								  } catch(err) {  
									// console.log('Oops, unable to copy');  
									document.getElementById("popup-result").innerHTML = 'Sorry, unable to copy';
								  }
								
								  // Remove the selections - NOTE: Should use
								  // removeRange(range) when it is supported  
								  window.getSelection().removeAllRanges();  


									});
									
					  }
					  
				  if (document.querySelector('.js-emailcopybtn-extent') !== null)
					  
					  {

							copyEmailBtnlatlon = document.querySelector('.js-emailcopybtn-extent');  

							copyEmailBtnlatlon.disabled = !document.queryCommandSupported('copy');

							copyEmailBtnlatlon.addEventListener('click', function(event) {  

							  window.getSelection().removeAllRanges();

								  // Select the email link anchor text  
								  var emailLink = document.getElementById('popup-copy-extent');  
								  var range = document.createRange();  
								  range.selectNode(emailLink);  
								  window.getSelection().addRange(range);
								
								  try {  
									// Now that we've selected the anchor text, execute the copy command  
									var successful = document.execCommand('copy');  
									var msg = successful ? 'successful.' : 'unsuccessful.';  
									// console.log('Copy command was ' + msg);  
									document.getElementById("popup-result").innerHTML = 'Copy to clipboard command was ' + msg;
								  } catch(err) {  
									// console.log('Oops, unable to copy');  
									document.getElementById("popup-result").innerHTML = 'Sorry, unable to copy';
								  }
								
								  // Remove the selections - NOTE: Should use
								  // removeRange(range) when it is supported  
								  window.getSelection().removeAllRanges();  


									});
									
					  }
									
				  if (document.querySelector('.js-emailcopybtn-All') !== null)
					  
					  {		
							copyEmailBtnAll = document.querySelector('.js-emailcopybtn-All');  

							copyEmailBtnAll.disabled = !document.queryCommandSupported('copy');

							copyEmailBtnAll.addEventListener('click', function(event) {  

							  window.getSelection().removeAllRanges();

								  // Select the email link anchor text  
								  var emailLink = document.getElementById('popup-copy-All');  
								  var range = document.createRange();  
								  range.selectNode(emailLink);  
								  window.getSelection().addRange(range);
								
								  try {  
									// Now that we've selected the anchor text, execute the copy command  
									var successful = document.execCommand('copy');  
									var msg = successful ? 'successful.' : 'unsuccessful.';  
									// console.log('Copy command was ' + msg);  
									document.getElementById("popup-result").innerHTML = 'Copy to clipboard command was ' + msg;
								  } catch(err) {  
									// console.log('Oops, unable to copy');  
									document.getElementById("popup-result").innerHTML = 'Sorry, unable to copy';
								  }
								
								  // Remove the selections - NOTE: Should use
								  // removeRange(range) when it is supported  
								  window.getSelection().removeAllRanges();  


									});

					  }

		 }
		else
		{
			event.preventDefault();
			document.getElementById('map').focus();
		}

//		$(document).ready(function () {
//	 		$("#popup-copy").attr('onclick', 'selectText("popup-copy")');
//		});


		if ((getCoordinates)  && ($(window).width() >= 850))
		{
		jQuery('#showCoordinatesinfo').show();
		
			$("#showCoordinatesinfo").css({ 'text-align': 'center' });
			$("#showCoordinatesinfo").css({ 'min-width': '250px' });
          	document.getElementById('showCoordinatesinfo').innerHTML = 'Stop showing coordinates and <br/><a href="javascript:remove_getCoordinates()">return to normal mouse navigation</a>';
		}


            });




	setTimeout( function(){


	map.getLayers().insertAt(8,scotland_layer);

//	console.log("addingscotlandgeom");


	setTimeout( function(){

//		console.log("abouttorun-runningscotlandgeom");

	if (map.getLayers().getArray()[8].getSource().getFeatures().length > 0)
	{

//		console.log("runningscotlandgeom");

		var centre = map.getView().getCenter();
		var scotlandgeom = map.getLayers().getArray()[8].getSource().getFeatures()[0].getGeometry();
	
		if (scotlandgeom.intersectsCoordinate(centre))
		{
		inScotland = true;
		}
		else
		{
		inScotland = false;
		}
	}
	
	checkreuse();
	


			if (map.getLayers().getArray()[8].getSource().getFeatures().length > 0)
				{

			//		console.log("runningscotlandgeom");

					var centre = map.getView().getCenter();
					var francegeom = map.getLayers().getArray()[8].getSource().getFeatures()[0].getGeometry();
				
					if (francegeom.intersectsCoordinate(centre))
					{
					inFrance = true;
					}
					else
					{
					inFrance = false;
					}
				}

		}, 500); // delay 50 ms
	
	
		map.getLayers().insertAt(8,france_layer);
		
		

//	console.log("addingscotlandgeom");


	setTimeout( function(){

//		console.log("abouttorun-runningscotlandgeom");

	if (map.getLayers().getArray()[8].getSource().getFeatures().length > 0)
	{

//		console.log("runningscotlandgeom");

		var centre = map.getView().getCenter();
		var francegeom = map.getLayers().getArray()[8].getSource().getFeatures()[0].getGeometry();
	
		if (francegeom.intersectsCoordinate(centre))
		{
		inFrance = true;
		}
		else
		{
		inFrance = false;
		}
	}
	
	checkreuse();

	}, 1500); // delay 50 ms
	
	
		map.getLayers().insertAt(9,united_kingdom_layer);
		
		

//	console.log("addingscotlandgeom");


	setTimeout( function(){

//		console.log("abouttorun-runningscotlandgeom");

	if (map.getLayers().getArray()[9].getSource().getFeatures().length > 0)
	{

//		console.log("runningscotlandgeom");

		var centre = map.getView().getCenter();
		var united_kingdom_geom = map.getLayers().getArray()[9].getSource().getFeatures()[0].getGeometry();
	
		if (united_kingdom_geom.intersectsCoordinate(centre))
		{
		inUK = true;
		}
		else
		{
		inUK = false;
		}
	}


	}, 1500); // delay 50 ms


}, 500); // delay 50 ms


function zoomtocenter(coordinates) {
	map.getView().setCenter(coordinates);
	
					if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
					{
					var overlayMaxZoom = map.getLayers().getArray()[4].get("maxZ");
					var MaxZoom = Math.round(overlayMaxZoom - 1);
					view.setZoom(MaxZoom);
					}
	
				
}


			
// geolocation scripts


		function geolocationMobileCheck()
		
		{
				var windowWidth = $(window).width();
				
				if (windowWidth < 850) 		
				
				{
					geolocation.setTracking(false);
				}	
		}


		var view = map.getView();
	
		var geolocation = new ol.Geolocation({
	        projection: view.getProjection()
	      });
	
	
	
	      function el(id) {
	        return document.getElementById(id);
	      }
	
	     el('track').addEventListener('change', function() {

		if (this.checked) 
		{
		geolocation.setTracking(true);

			var coordinates = geolocation.getPosition();
	        	positionFeature.setGeometry(coordinates ?
	            	new ol.geom.Point(coordinates) : null);
	
			var windowWidth = $(window).width();
	
							if (windowWidth > 850) 
								{
									console.log("windowWidth > 850");
									
							jQuery('#zoomtogeolocation').removeClass('hidden');
							jQuery('#zoomtogeolocation').show();
							console.log("coordinates: " +  coordinates);
							document.getElementById('zoomtogeolocation').innerHTML = '<a href="javascript:zoomtocenter([' + coordinates + ']);">Zoom to my location</a>';
									view.setCenter(coordinates);

								}

							else
							{
								view.setCenter(coordinates);
							
								if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
								{
								var overlayMaxZoom = map.getLayers().getArray()[4].get("maxZ");
								var MaxZoom = Math.round(overlayMaxZoom - 1);
								view.setZoom(MaxZoom);
								}
					
							}




		   if ( map.getLayers().getArray()[11].getSource().getFeatures().length < 1)
			{ map.getLayers().getArray()[11].getSource().addFeatures([accuracyFeature, positionFeature]); }
		}
		else
		{ 
		geolocation.setTracking(false);
		
		jQuery('#zoomtogeolocation').hide();
		

		if (map.getLayers().getArray()[11].get("title") == "geolocation_vector")
			{  
			map.getLayers().getArray()[11].getSource().clear();

				var windowWidth = $(window).width();
				if (windowWidth <= 850) 
					{
				    jQuery("#searchSideBar").hide();
					jQuery("#show").show();
					}

			}  

		$('#map').focus();
		}

	      });
	
	      // handle geolocation error.
	      geolocation.on('error', function(error) {
	        var info = document.getElementById('info');
	        info.innerHTML = error.message;
	        info.style.display = '';
	      });
	
	      var accuracyFeature = new ol.Feature();
	      geolocation.on('change:accuracyGeometry', function() {
	        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
	      });
	
	
	      var positionFeature = new ol.Feature();
	      positionFeature.setStyle(new ol.style.Style({
	        image: new ol.style.Circle({
	          radius: 6,
	          fill: new ol.style.Fill({
	            color: '#3399CC'
	          }),
	          stroke: new ol.style.Stroke({
	            color: '#fff',
	            width: 2
	          })
	        })
	      }));
	
	
	      geolocation.on('change:position', function() {
	        var coordinates = geolocation.getPosition();
	        positionFeature.setGeometry(coordinates ?
	            new ol.geom.Point(coordinates) : null);

			var windowWidth = $(window).width();
				
			if (windowWidth > 850) 
					{
						console.log("windowWidth > 850");
						
				jQuery('#zoomtogeolocation').removeClass('hidden');
				jQuery('#zoomtogeolocation').show();
				console.log("coordinates: " +  coordinates);
				document.getElementById('zoomtogeolocation').innerHTML = '<a href="javascript:zoomtocenter([' + coordinates + ']);">Zoom to my location</a>';
						view.setCenter(coordinates);

					}
			else 
			{
				
				
				jQuery('#showLayersInfo').removeClass('hidden');
				jQuery('#showLayersInfo').css({ 'max-width' : '250px !important' });
				jQuery('#showLayersInfo').show();
				console.log("coordinates: " +  coordinates);
				document.getElementById('showLayersInfo').innerHTML = '<a href="javascript:zoomtocenter([' + coordinates + ']);">Zoom to my location</a>';
			 //   view.setCenter(coordinates);			
			}
			
				$('#map').focus();
	      });
	
		var geolocationVector = new ol.layer.Vector({
			  title: "geolocation_vector",
			  source: new ol.source.Vector({
	          features: [accuracyFeature, positionFeature]
	        })
	      });

	
		map.getLayers().insertAt(11, geolocationVector);



	  
if (document.getElementById("geolocation-img") != null) {

	document.getElementById("geolocation-img")
	    .addEventListener("click", function(event) {
	    event.preventDefault();
		
		if (jQuery("#geolocation-img").css("background-color") == 'rgb(255, 255, 255)')
		{ 		jQuery("#geolocation-img").css({ 'background-color': 'rgb(135,206,250)' });
	
			geolocation.setTracking(true);

			var coordinates = geolocation.getPosition();
	        	positionFeature.setGeometry(coordinates ?
	            	new ol.geom.Point(coordinates) : null);
				//	view.setCenter(coordinates);
				//	if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
				//	{
				//	var overlayMaxZoom = map.getLayers().getArray()[4].get("maxZ");
				//	var MaxZoom = Math.round(overlayMaxZoom - 1);
				//	view.setZoom(MaxZoom);
				//	}


//				checkWidth();

		   if ( map.getLayers().getArray()[11].getSource().getFeatures().length < 1)
			{ map.getLayers().getArray()[11].getSource().addFeatures([accuracyFeature, positionFeature]);}
		}
		else
		{ 		jQuery("#geolocation-img").css({ 'background-color': 'rgb(255, 255, 255)' });

				geolocation.setTracking(false);
				
				
				jQuery('#showLayersInfo').hide();
				
				if (map.getLayers().getArray()[11].get("title") == "geolocation_vector")
					{  
					map.getLayers().getArray()[11].getSource().clear();

						var windowWidth = $(window).width();
						if (windowWidth <= 850) 
							{
							jQuery("#searchSideBar").hide();
							jQuery("#show").show();
							}

					}  
					
				$('#map').focus();
//				checkWidth();
		}

		
//		document.getElementById('geolocation-img').style.color = 'blue';
	    if (event.keyCode === 13) {
	       // document.getElementById("ngrgaz").click();
//		ngrgaz(document.getElementById("ngrgaz").value);

	    }
	});

}


	    const markerSource = new ol.source.Vector();
			const markerLayer = new ol.layer.Vector({
				name: 'os-places',
				source: markerSource,
				   style: new ol.style.Style({
					image: new ol.style.Circle({
								  radius: 6,
									fill: new ol.style.Fill({
									color: 'rgba(0, 0, 0, 0)'
											}),
								  stroke: new ol.style.Stroke({
									color: 'rgba(0, 0, 0, 0)'

								  }),
						})
				})
			});


		map.getLayers().insertAt(12, markerLayer);

		  var vector_import_source = new ol.source.Vector({

		  });	

		  var orangeMarkerStyle = new ol.style.Style({
			  
			/*  
					image : new ol.style.Icon({
								  src : "https://maps.nls.uk/geo/img/orange-marker.png",
								  size : [51, 51],
						}),  
		*/

			
						image : new ol.style.Icon({
							src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARfSURBVFiF3ZhfbBRVGMV/d2Z3212tbSkCbuNaqzaRiL6QyAMPjSFoYqgx4oOiRmMFUzQG479o2lQ0QXk1EhYFgmlD2mIRkYhRwqLEaA2GiKWV7rZLQ0sLwbZId7t/Zq4PFK1125m5s/vCedz7nXO+M9/N3jsD1xFEvgXlTkrI8hBQBywFbgEqgEvAMHAayZcYHBYbuZJP77yFkdsoR+ct4GXAb4OSQPARXj4QzzGejx7yEkZuZy2CMLBAgf4nkhfEi3S67UNzQ5YSIXfQhKAdtSAACxDsk2EapXT3cF2FYQdNSN7F/YQFsJkw77gVUcL01mp3o5EDJoK1Yj37VchKjcjdlJEmhvrWmg9jGNwhGhhzSlTbZmnepjBBAMrReF2F6Hgy0+fIKPb+flWRIMtip+eQ88lcPRCtg3gCCVZ3RqhPDbJepqlPDbJ6XwSvP2nDJYCXB522prLN6iwrPIEETw33U/VoLZovBPjQfCGqHqtl3XDUZiBrn1lQCXO3ZcUDLV34Su/JueYrW0btnp8tNSRLnTamEiZoWRF6uHre9dseuT0vPrOgEqbCWtW3xNX6VSy02c+/sk4JwF+WFWZ6xGL9vA2fyzb7+QcqYUYtKwYP9s+7PrA/bsNn/geSA87DSLosa44+fT/p8VM511Jjp4g8u8KGk7XPLKhM5qhlRSbppzV4JwMdEcz0WSCNmT5LrC1CS/AujKliSw1BxGljzm8AH3MjHs4BpU65DjCBn0rxDJNOSI4nM33F2O2U58yEnU6DgOpF02AzcEGJa40LZHlfhagUZvp6vkmFawObVK7/4PLFSoZpBZ50ozEThsne6i2hjZqmFRVJ6U8JUeSVUmQNzQvg0c1MVtNMIUTSl0pNLhsaGu8A4xrfbZhS4CRQ5SoFcCWtja/5NBg+N+GZsu0vhSEkcY8mf+iNx+OuX3llmJVABNCVNUA2fl3xWdvJkriqRBb2uPugAYgNHEey1Y3Gt3/ccNxFEAChm2al6zAAjNAEWF/rc1Ev6+ffOLTwmBt7E0xD02J5CSOayQLrsHMJnYGMITJvHrr588mUMKyr54CUaaHrnfF4fCQ/kwHEBmLAa044rb+WHP4xXnxJ0VJK6CkyjO2xWOx3KMSH8zDtwONWdb2jvt41u4JtChZJKeVveDwnYrHYfw5uj4KYFRpSWbGqyCPL5ypIpMTkKwcWfWVXUEqRRcio1LTuUCjUE4lEsrnq8j4ZgKEP9bpgmfHFHPpyy3fle3f9Uto3n4aUIqNhDghN6zZ1vTcajaasfAsSBmBwq7f11tLM/24Hx2L+n+rbF38zBy2JEP0anPEGAj3d3d1pJ56F2GYAGInM82M+bWW53wxd++3ipH7x1QMLj8ysk5BAyj6Ppp2+d/nyaEdHh/I/W8EmA3Ci2b/iviVT3+tCerMmxkudiz450hcYBSYQIqrDmScGBvqawSxkH3lDV2Pxe6ltItnWcFNLTXX1qpqamkoK/BCvC/wNB+l5MdQKNHsAAAAASUVORK5CYII=",
							scale: 1.1875,       // scale the image if you want
							anchor: [51, 38], 
						}),
					

						stroke : new ol.style.Stroke({
								  color : "#ffa500",
								  width : 7
						}),
						fill : new ol.style.Fill({
								  color : "rgba(255, 183, 152, 0.2)"
						}),
						text : new ol.style.Text({
								 font : "16px Sans",
								 textAlign : "left",
								 fill : new ol.style.Fill({
									 color : "rgba(255, 255, 255, 1)"
								 }),
								 stroke : new ol.style.Stroke({
									 color : "rgba(0, 0, 0, 1)",
									 width : 2
								 })
						})
				  });

		  var blueMarkerStyle = new ol.style.Style({
			  /*
						image : new ol.style.Icon({
								  src : "https://maps.nls.uk/geo/img/blue-marker.png",
								  size : [51, 51],
						}),
			*/
						image : new ol.style.Icon({
							src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS2SURBVFiF3VhbTBxVGP7+szPscmkq1FZqE2pvUYvYwpK0SUla0ib0iaf6oD6a+qDxoUlNvMTthZp4ifHBB22M8ZI0jVCqVk0gbeOKxAsJpAG3ENiBxdiWSypQdmd3Znbm9wGaCAKzc2b3Qb/HOf/3ff835+TMmQP8j0D5FjxwYGhdJlN0lIibmbEbwGYAGwDcBXCbmW8KIa6k0+mOWKw6mU/vvIWpqRkvV9XsK0R4CUBxDhQdwAe2Ld66cWPbbD56yEuY+vrRY8x8HkCFBP0vZhzv69tx2W8fwh+dKRzWIszcCrkgAFBBhEvhcPwNgH29XF9h6upGIwDOwP8ME0Bnw2HtdZ8iclhcWq1+NFaAw8zH+vp2fiVDlmpk796xBwIBR4P80loLM6ap7BgY2DrjlSi1zBSFX0NhggBAeVFR9mUZoueZWfiOqJPIbfuVhZ7JZB7y+h1SvLpkMkVHAXYNEgoJvaVlY09DQ8l2VaVKy+KJri59NBKZ2mcYrvyS4uJQE4B2L715XmZE3OxWEwoJvaNj62hjY+khVaUqAEWqSlWHD5ce6uzcGg8GKe2mwUyuPsvhOQwzHneraWnZ2FNWRk+sNFZWJmrOnNn0m5sGEe/22pvMBvCwW0FDQ8n2tcYPHizZ5qbBzK4+yyETZoNbgapSpZ/xBdCDube0AIkwNO9WYVk8sfY47uRgdC/nlhYhEYYn3Sq6uvTRtcaj0VQiB6M1X8hKkFlmPW4FkcjUvmTSGVhpbH7eGTh1amq/mwazu89yyGzNP7jVGAYXNzWN77x2LRW1LB4HYFoWj1+9moo2NY3vMk0OuTYmKOq5N6+E6upYWSgU+hPAeq9cD5izrNIt/f2VKS8kzzMTi1UnifCpV55HfOI1CCB50DQM5SyAKRluDpgyTeWcDFEqzOLx/IQMNweckDn+Az5/rMJh7QKAZ/xoLIV9cXr6yItCiGCQudggCqrMlLWFCgBKwLGyQjhElC4yjFTNrVuzbYB9n+03zHoANwA84isDAGZ9Njl7/LzjTGRy55BNjIQi+KehRCLh+5c3HNYaAEQBBORVmPXU+19Yme8TsgJZ4HOftzNAb++ObgDv+NGwzO5uH0EAgAKOs8V3GABYt+6PCADXY/1KYGf6Tjr59o9+/B3AsYXQ8hImGm3MAs6zAFwPoUthWXrq3XbmtO1euwqYTQoELicSiYm8hAGA3t5dGjOf9MIxMt92ZM3eu5KWzMBg0LY/0jTtd6AAF+fhsNYK4Cm3OierDc3PPf+lhEWamfuhKL2api35cHu+0HBH9gVm+whRsHy1Cnb0VDJ57rtcFZkpC+I4CxGrqqoajEaj2ZXq8j4zAFBb+0uzEJu+XkWfM6kPLxqZSyNraTCTJeCMkRAxJxAYisfjhptvQcIAQG1t9wUhNv/rdGCZPb/q8692rkJLg2hUAMNqSclgLBYzvXgWYJktYGbGeq6iYq6BaH3V/WeOMzOdTr55/Z91DOhgHlGEuPlkfX28ra1Nemcr2MwAQF3dlf1Ej3UBARWwbf3e6Y8t6+dJAHMgigeA4afHxkZOA04+/AoaBgD27PmmRVEePWka19sN/b3PoCiDw8PDtwFwob3/0/gbh/Lm30zcQi4AAAAASUVORK5CYII=",
							scale: 1.1875,       // scale the image if you want
							anchor: [51, 38], 
						}),
						stroke : new ol.style.Stroke({
								  color : "#000cff",
								  width : 7
						}),
						fill : new ol.style.Fill({
								  color : "rgba(152, 237, 255, 0.2)"
						}),
						text : new ol.style.Text({
								 font : "16px Sans",
								 textAlign : "left",
								 fill : new ol.style.Fill({
									 color : "rgba(255, 255, 255, 1)"
								 }),
								 stroke : new ol.style.Stroke({
									 color : "rgba(0, 0, 0, 1)",
									 width : 2
								 })
						})
				  });






			var vectorLayerFromImport = new ol.layer.Vector({
				  title: "vectorLayerFromImport",
				  source: vector_import_source,
				  style: orangeMarkerStyle
				});		

		map.getLayers().insertAt(13, vectorLayerFromImport);

function hasTwoLettersThenTwoNumbers(str) {
  return /^[A-Za-z]{2}\d{2}$/.test(str);
}

function hasTwoLettersThenFourNumbers(str) {
  return /^[A-Za-z]{2}\d{4}$/.test(str);
}

function hasTwoLettersThenSixNumbers(str) {
  return /^[A-Za-z]{2}\d{6}$/.test(str);
}
	
// Further details on OS Open Names	https://labs.os.uk/api/docs/opennames/

function postcodegaz(value) {
	
		if (jQuery('#layerfiltercheckbox').is(":checked")) 

		{
			$( "#layerfiltercheckbox" ).prop( "checked", false );
		}
	
	if (value.includes('Type NGR'))

			{ 
			gridreferror(); 
			return;
			}
	
	else if (value.includes('~'))
	
			{ ngrgaz(value); 
			return;
			}
	
	else if (value.includes('lon'))
	
			{ ngrgaz(value); 
			return;
			}
			
	else if (value.includes('Northing'))
	
			{ ngrgaz(value); 
			return;
			}
			
	else if (value.includes('Longitude'))
	
			{ ngrgaz(value); 
			return;
			}
			
	else if (value.includes('&y='))
	
			{ ngrgaz(value); 
			return;
			}
	else if ((value.length == 6) && (hasTwoLettersThenFourNumbers(value)))
			{
			ngrgaz(value); 
			return;
			}
	else if ((value.length == 8) && (hasTwoLettersThenSixNumbers(value)))
			{
			ngrgaz(value); 
			return;
			}	
	else if (value.length > 9)
			{
			ngrgaz(value); 
			return;
			}	
	else
		
		{
	
		remove_marker();
		
//		map.getLayers().getArray()[12].getSource().clear(true);
		
		$("#loading").show();
		

		const apiKey = 'Q9ESJToD1he64kb6Aacq2Wqjy2EMhkUY';

//        const url = 'https://api.os.uk/search/places/v1/postcode?postcode=' + value + '&key=' + apiKey;

			const url = 'https://geoserver.nls.uk/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature' +
			'&typename=nls:codepoint&PropertyName=postcode,Easting,Northing&outputFormat=text/javascript' +
			'&format_options=callback:handleJson3857&CQL_FILTER=postcode%20LIKE%20%27' + value + '%25%27&srsname=EPSG:900913';
			

			
			let valueUPPER = value.toUpperCase();

			value2 = valueUPPER+'%';
			
			
			if (value.includes(' '))
				
				{

				var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['codepoint'],
				  propertyNames: ['geometry'],
				  outputFormat: 'application/json',
				  filter: ol.format.filter.like ('postcode', value2)
					
				  });					
				}
				
				else
					
				{
					var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['codepoint'],
				  propertyNames: ['geometry'],
				  outputFormat: 'application/json',
				  filter: ol.format.filter.like ('postcnsp', value2)
					
					});		
				  
				}
			


		// then post the request and add the received features to a layer
		fetch('https://geoserver3.nls.uk/geoserver/wfs', {


		  method: 'POST',

		  body: new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {

		  return response.json();
		}).then(function(json) {


        markerSource.clear(true);
	

				
		  var features = new ol.format.GeoJSON().readFeatures(json);
		  markerSource.addFeatures(features);
				
//			console.log(JSON.stringify(data, null, 2));

/*
                data.results.forEach(function(element) {

                    // Transform the geometry values into Web Mercator coordinates.
                    let coord = ol.proj.transform(
                        [ properties.Easting, properties.Northing ],
                        "EPSG:27700",
                        "EPSG:3857"
                    );

                    markerSource.addFeature(
                        new ol.Feature({
                            geometry: new ol.geom.Point(coord),
                         })
                    );
					
				});
*/
				setTimeout( function(){
							
						var clusterFeatureNum = map.getLayers().getArray()[12].getSource().getFeatures().length;		

//						console.log("clusterFeatureNum: " + clusterFeatureNum);				
						
						var clusterFeatureExtent = map.getLayers().getArray()[12].getSource().getExtent();
						
//						console.log("extent: " + clusterFeatureExtent);


						if ( clusterFeatureNum > 0 )
							
							{
								
								console.log("greater than 1");
									
									const clusterFeatureExtent1 = map.getLayers().getArray()[12].getSource().getExtent()[0].toFixed(0);
									const clusterFeatureExtent2 = map.getLayers().getArray()[12].getSource().getExtent()[1].toFixed(0);
									const clusterFeatureExtent3 = map.getLayers().getArray()[12].getSource().getExtent()[2].toFixed(0);
									const clusterFeatureExtent4 = map.getLayers().getArray()[12].getSource().getExtent()[3].toFixed(0);
										
								
										 var x = clusterFeatureExtent[0] + (clusterFeatureExtent[2] - clusterFeatureExtent[0]) / 2; 
										 var y = clusterFeatureExtent[1] + (clusterFeatureExtent[3] - clusterFeatureExtent[1]) / 2; 
										 
	

											map.getView().setCenter([x,y]);
											
												if (typeof map.getLayers().getArray()[4].get("maxZ") != "undefined")
													{
													var overlayMaxZoom = map.getLayers().getArray()[4].get("maxZ");
													zoom = Math.round(overlayMaxZoom - 1);
													}
													else
													{
													console.log("no max zoom");
													zoom = 16;
													}
											
											map.getView().setZoom(zoom);
											


												setTimeout( function(){

													var centre = [];
													var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
													pointClicked = centre[1].toFixed(5) + ',' + centre[0].toFixed(5);
													pointClick(pointClicked);

													$("#loading").hide();
//													$('#map').focus();


												}, 400); // delay 50 ms


											var windowWidth = $(window).width();
												if (windowWidth <= 600) {
												setTimeout( function(){
													jQuery("#searchSideBar").hide();
													jQuery("#show").show();
												}, 1000); // delay 50 ms
											jQuery("#layersSideBarOutlines").hide();
											jQuery("#showlayersOutlinesExplore").show();

											jQuery("#exploreslideroverlay").show();
											jQuery("#exploreslideroverlaymobile").show();
											}

							}
							
							else
							{
								$("#loading").hide();
								ngrgaz(value);
								return;
							}
					
				
				}, 250); // delay 1000 ms
					
            })
			.catch(error => {
				
			    console.error("Fetch error:", error.message);
				$("#loading").hide();
				ngrgaz(value);
				return;
			})
	
		$("#map").focus();
	
		}

}

function postcodecsv(value) {
  return new Promise((resolve, reject) => {
    // ... construct featureRequest as you have


			const url = 'https://geoserver.nls.uk/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature' +
			'&typename=nls:codepoint&PropertyName=postcode,Easting,Northing&outputFormat=text/javascript' +
			'&format_options=callback:handleJson3857&CQL_FILTER=postcode%20LIKE%20%27' + value + '%25%27&srsname=EPSG:900913';
			

			
			let valueUPPER = value.toUpperCase();

			value2 = valueUPPER+'%';
	
				if (value.includes(' '))
				
				{

				var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['codepoint'],
				  propertyNames: ['geometry'],
				  outputFormat: 'application/json',
				  filter: ol.format.filter.like ('postcode', value2)
					
				  });					
				}
				
				else
					
				{
					var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['codepoint'],
				  propertyNames: ['geometry'],
				  outputFormat: 'application/json',
				  filter: ol.format.filter.like ('postcnsp', value2)
					
					});		
				  
				}
			

    fetch('https://geoserver3.nls.uk/geoserver/wfs', {
      method: 'POST',
      body: new XMLSerializer().serializeToString(featureRequest)
    })
    .then(response => response.json())
    .then(json => {
      var features = new ol.format.GeoJSON().readFeatures(json);
      markerSource.addFeatures(features);

      // Instead of setTimeout, process immediately or use Promise delay
      if (features.length > 0) {
		  
			var extent = markerSource.getExtent()
		
						console.log("extent: " + extent);
        var x = extent[0] + (extent[2] - extent[0]) / 2;
        var y = extent[1] + (extent[3] - extent[1]) / 2;
		
		var point4326 = ol.proj.transform([x,y], "EPSG:3857", "EPSG:4326");
		
		console.log("point4326: " + point4326);
        resolve([point4326[0], point4326[1]]);
      } else {
        // No features found
        console.error("No features found for value:", value);
        resolve(null); // Or reject(new Error("No features found"));
      }
    })
    .catch(error => {
      console.error("Fetch error:", error.message);
      reject(error);
    });
  });
}

/*

function postcodecsv(value) {
	

console.log("postcodecsv value: " + value);

			const url = 'https://geoserver.nls.uk/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature' +
			'&typename=nls:codepoint&PropertyName=postcode,Easting,Northing&outputFormat=text/javascript' +
			'&format_options=callback:handleJson3857&CQL_FILTER=postcode%20LIKE%20%27' + value + '%25%27&srsname=EPSG:900913';
			

			
			let valueUPPER = value.toUpperCase();

			value2 = valueUPPER+'%';
			
			
			if (value.includes(' '))
				
				{

				var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['codepoint'],
				  propertyNames: ['geometry'],
				  outputFormat: 'application/json',
				  filter: ol.format.filter.like ('postcode', value2)
					
				  });					
				}
				
				else
					
				{
					var featureRequest = new ol.format.WFS().writeGetFeature({
				  request: 'GetFeature',
				  srsName: 'EPSG:3857',
				  featureNS: 'https://www.nls.uk',
				  featurePrefix: 'nls',
				  featureTypes: ['codepoint'],
				  propertyNames: ['geometry'],
				  outputFormat: 'application/json',
				  filter: ol.format.filter.like ('postcnsp', value2)
					
					});		
				  
				}
			


		// then post the request and add the received features to a layer
		fetch('https://geoserver3.nls.uk/geoserver/wfs', {


		  method: 'POST',

		  body: new XMLSerializer().serializeToString(featureRequest)
		}).then(function(response) {

		  return response.json();
		}).then(function(json) {


 //       markerSource.clear(true);
	

				
		  var features = new ol.format.GeoJSON().readFeatures(json);
		  markerSource.addFeatures(features);
				
			console.log(JSON.stringify(data, null, 2));


				setTimeout( function(){
							
						var clusterFeatureNum = map.getLayers().getArray()[12].getSource().getFeatures().length;		

						console.log("clusterFeatureNum: " + clusterFeatureNum);				
						
						var clusterFeatureExtent = map.getLayers().getArray()[12].getSource().getExtent();
						
						console.log("extent: " + clusterFeatureExtent);


						if ( clusterFeatureNum > 0 )
							
							{
								
								console.log("greater than 1");
									
									const clusterFeatureExtent1 = map.getLayers().getArray()[12].getSource().getExtent()[0].toFixed(0);
									const clusterFeatureExtent2 = map.getLayers().getArray()[12].getSource().getExtent()[1].toFixed(0);
									const clusterFeatureExtent3 = map.getLayers().getArray()[12].getSource().getExtent()[2].toFixed(0);
									const clusterFeatureExtent4 = map.getLayers().getArray()[12].getSource().getExtent()[3].toFixed(0);
										
								
										 var x = clusterFeatureExtent[0] + (clusterFeatureExtent[2] - clusterFeatureExtent[0]) / 2; 
										 var y = clusterFeatureExtent[1] + (clusterFeatureExtent[3] - clusterFeatureExtent[1]) / 2; 
										 
							console.log("postcode x-y: " + x + ", " + y );
							
										var postcodeResult = [];
										postcodeResult.push(x.toFixed(0), y.toFixed(0));
										
							console.log("postcodeResult: " + postcodeResult );

											return [x,y];
											



							}
							
							else
							{
								$("#loading").hide();
			    console.error("Fetch error:", error.message);
								return;
							}
					
				
				}, 250); 
					
            })
			.catch(error => {
				
			    console.error("Fetch error:", error.message);

//				ngrgaz(value);
				return;
			})
	


}

*/

function keywordsearchgaz(value) {

	keywordsearchcontent = value.toUpperCase();
	scaleslidestop();

}

/*

$('#ngrgaz').bind('input keyup', function(e){
    var searchValue = $(this).val();
    ngrgaz(searchValue);
});

*/

function ngrgaz(value) {
	

	
		remove_marker();
	
	imageDATE = '';
	
//	console.log("ngr-value: " + value);
	
	value1 = value.replace('/', ',');
	value2 = value1.replace('~', ',');
	value3 = value2.replace('&lon=', ',');
	value4 = value3.replace('Longitude =', ',');
	value5 = value4.replace('Northing = ', ',');
//	value6 = value5.replace(' ', ',');
	value7 = value5.replace('&y=', ',');
	
// ~   &y=    Longitude =  Northing = 

    var osgbnum = gridreference(value7);

         // var osgb = new OpenLayers.LonLat(osgbnum[0], osgbnum[1]);
	if ((osgbnum) && (osgbnum != 'undefined'))
	{
	 point27700 = [];
	 point27700.push(parseFloat(osgbnum[0]), parseFloat(osgbnum[1]));

	outx = osgbnum[0];
	outy = osgbnum[1];

	if ((outx  < 0) || (outx > 700000 ) || (outy < 0) || (outy > 1300000 ))

	{ 
//	console.log('out of range');
	return; 
	}

	 // console.log(point27700);
	 point3857 = [];
	 point3857 = ol.proj.transform(point27700,"EPSG:27700", "EPSG:3857");
	 var a = map.getView().setCenter(point3857);
    	 var b = map.getView().setZoom(10+value.length);
	 var zoom1 = (10+value.length);
	// return b;
	 var zoom = Math.round(zoom1);

	if (zoom > 16 ) zoom = 16; 

	var x = point3857[0].toFixed(0);
	var y = point3857[1].toFixed(0);

//       map.getView().animate({
//	  center: [x, y],
//	  zoom: zoom,
//          duration: 1500
//        });

	map.getView().setCenter([x , y ]);
	map.getView().setZoom(zoom);


	pointClicked = '';

		setTimeout( function(){

			var centre = [];
			var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
			pointClicked = centre[1].toFixed(5) + ',' + centre[0].toFixed(5);
			pointClick(pointClicked);

//			$('#map').focus();


			}, 200); // delay 50 ms


	var windowWidth = $(window).width();
    	if (windowWidth <= 600) {
		setTimeout( function(){
	        jQuery("#searchSideBar").hide();
		    jQuery("#show").show();
		}, 1000); // delay 50 ms
	jQuery("#layersSideBarOutlines").hide();
	jQuery("#showlayersOutlinesExplore").show();

	jQuery("#exploreslideroverlay").show();
	jQuery("#exploreslideroverlaymobile").show();
	}


}
else
{ return; }




      }
	  

if (document.getElementById("keywordsearch") != null) {

	document.getElementById("keywordsearch")
	    .addEventListener("keyup", function(event) {
	    event.preventDefault();
		document.getElementById('search-button-keywordsearch').style.color = 'blue';
	    if (event.keyCode === 13) {
	       // document.getElementById("ngrgaz").click();
		keywordsearchgaz(document.getElementById("keywordsearch").value);

	    }
	});

}


if (document.getElementById("ngrgaz") != null) {

	document.getElementById("ngrgaz")
	    .addEventListener("keyup", function(event) {
	    event.preventDefault();
		document.getElementById('search-button-ngrgaz').style.color = 'blue';
	    if (event.keyCode === 13) {
	       // document.getElementById("ngrgaz").click();
		postcodegaz(document.getElementById("ngrgaz").value);

	    }
	});

}


	function hidechart() {
			stopmeasuringElevation();
//			$('#map').focus();
	}

	function stopmeasuringElevation() {

		jQuery("#chart").hide();
		document.querySelector("#chart").innerHTML = '<button type="button" id="hidechart" class="close"  aria-label="Close" onclick="hidechart()"><span aria-hidden="true">&times;</span></button><div id="chartinfo"></div>';
//		jQuery("#chart").css( { "display": "none" });
		

		$(".onoffswitch-profile-checkbox" ).prop( "checked", false );
		map.removeInteraction(drawE);
//		map.removeInteraction(snapE);
//		var overlayslength = map.getOverlays().getLength();
//		if (overlayslength > 0) {map.getOverlays().clear();}

//		var maplayerlength = map.getLayers().getLength();
//		var toplayer = (parseInt(maplayerlength) - 1)
//		if (map.getLayers().getArray()[toplayer].get("title") == "vectormeasures")
//		{ map.getLayers().removeAt([toplayer]); }
//		 map.getLayers().getArray()[6].getSource().clear();

		var maplayerlength = map.getLayers().getLength();
		var toplayer = parseInt(maplayerlength - 1);
		if ( map.getLayers().getArray()[parseInt(toplayer)].get("title") == "elevation")
			{
			map.getLayers().removeAt(parseInt(toplayer));
			}
		 
		 var baseLayerName = map.getLayers().getArray()[2].get('mosaic_id');
/*	
		if ( baseLayerName == '8')
	
			{
	
		  	map.getLayers().removeAt(2);
		  	map.getLayers().insertAt(2,baseLayers[0]);
			document.getElementById("layerSelect").selectedIndex = 0;
			updateUrl();
			
			$('#map').focus();
	
			}
*/		 
		 
		document.getElementById('elevationprofilemessage').innerHTML = '';
		} 








	/**
	 * format length output
	 * @param {ol.geom.LineString} line
	 * @return {string}
	 */
	const formatLength = function (line) {
	  const length = ol.sphere.getLength(line);
	  let output;
	  if (length > 100) {
		output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
	  } else {
		output = Math.round(length * 100) / 100 + ' ' + 'm';
	  }
	  return output;
	};
	

	var drawE;

      function addInteractionE() {

	colorsource = new ol.source.Vector();

	vectorcolor = new ol.layer.Vector({
	  title: "elevation",
	  source: colorsource,
	   style: new ol.style.Style({
	      fill: new ol.style.Fill({
	        color: 'rgba(255, 255, 255, 0.1)'
	      }),
	      stroke: new ol.style.Stroke({
	        color: 'rgba(30,144,255, 0.9)',
	        lineDash: [4, 4],
	        width: 3
	      }),
	      image: new ol.style.Circle({
	        radius: 5,
	        stroke: new ol.style.Stroke({
	          color: 'rgba(0, 0, 0, 0.7)'
	        }),
	        fill: new ol.style.Fill({
	          color: 'rgba(255, 255, 255, 0.2)'
	        })
	      })
	     })
	   });

	var maplayerlength = map.getLayers().getLength();

	map.getLayers().insertAt(maplayerlength,vectorcolor);


	function splitArrayIntoChunksOfLen(arr, len) {
	  var chunks = [], i = 0, n = arr.length;
	  while (i < n) {
	    chunks.push(arr.slice(i, i += len));
	  }
	  return chunks;
	}
	


   function getZoomLevelResolution(latitude, zoom) {
        const metersPerPx = (Math.cos(latitude * Math.PI/180.0) * 2 * Math.PI * 6378137) / (512 * 2**zoom);
        return metersPerPx;
    }

  function  sampleProfileLine(coordinates) {

//			 console.log("sampleProfileLinecoordinates : " + coordinates );
        const options = {units: 'meters'};
			//        const line = turf.lineString(coordinates);
        const line = JSON.parse(coordinates);
		    // console.log("line: " + JSON.stringify(line));
			//		document.getElementById('chart').innerHTML = "explore.js line 5450 - const line = " + JSON.stringify(line);
        const lineLength = turf.length(line, options);
		
		let LengthOutput;
		if (lineLength > 1000)
			{ LengthOutput = Math.round((lineLength / 1000) * 100) / 100 + ' kilometres';  }
		else
			{ LengthOutput = Math.round(lineLength * 100) / 100 + ' metres'; }


		
		
			//	 console.log("lineLength: " + lineLength);
			 
			//	 console.log("LengthOutput: " + LengthOutput);
			 
			//	console.log("coordinates2: " + coordinates2);
        let numSamples = 200;
		
		var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
		const latitude = Number(centre[1].toFixed(8));
		const zoom = Math.round(map.getView().getZoom());
	
		//				console.log("latitude: " + latitude);
		//				console.log("zoom: " + zoom);
						
//						console.log("coordinates[0]: " + coordinates[0]);
		
		//	       const metersPerPx = getZoomLevelResolution(coordinates[0][1], 12);
			       const metersPerPx = getZoomLevelResolution(latitude, 12);
        // const metersPerPx = 10.468007531300044
		//			console.log("metersPerPx: " + metersPerPx);

        const stepSize = Math.max(metersPerPx, lineLength / numSamples);
        numSamples = lineLength / stepSize;
		
//				 console.log("numSamples: " + numSamples);

        const samples = [];
        for (let i = 0; i <= numSamples; i++) {
            const along = turf.along(line, i * stepSize, options);
            const coords = along.geometry.coordinates;
            samples.push(coords);
        }

        return samples ;


    }
	
	function  calculateLength(coordinates) {
		
		        const options = {units: 'meters'};
			//        const line = turf.lineString(coordinates);
        const line = JSON.parse(coordinates);
		    // console.log("line: " + JSON.stringify(line));
			//		document.getElementById('chart').innerHTML = "explore.js line 5450 - const line = " + JSON.stringify(line);
        const lineLength = turf.length(line, options);

		return lineLength;
	}
	

	function transform(geometry) {
	    geometry.transform('EPSG:3857', 'EPSG:4326'); // <-- this removes my drawn feature from the map. If I remove this line, the drawn LineString remains.
	}



    function drawElevation()	{

		// extracts the path coordinates from the top layer as GeoJSON 


			var maplayerlength = map.getLayers().getLength();
			var toplayer = parseInt(maplayerlength - 1);
			var lastlayerfeatures = map.getLayers().getArray()[parseInt(toplayer)].getSource().getFeatures();
			var lastlayerfeatureslength = map.getLayers().getArray()[parseInt(toplayer)].getSource().getFeatures().length;

			//	console.log("lastlayerfeatureslength : " + lastlayerfeatureslength );

			var geojsonFormat = new ol.format.GeoJSON({ extractGeometryName: true});
			var file_original = geojsonFormat.writeFeatures(lastlayerfeatures, {featureProjection: 'EPSG:3857',  dataProjection: 'EPSG:4326',  decimals:8 });
			var file1 = file_original.replace('{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[','{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":');
			var file2 = file1.replace(']},"properties":null}]', '}');

			if (file2)

				{
				drawElevationProfile(file2);
				}

		}


    function clearChart() {
        if (this.chart) {
            this.chart.detach();
        }
        document.getElementById('chart').innerHTML = "";
    }


	drawElevationProfile = async (coordinates) => {
		
			//		console.log("drawElevationProfilecoordinates : " + coordinates );
			//		console.log("drawElevationProfilecoordinates : " + JSON.parse(JSON.stringify(coordinates)));

        const samples = sampleProfileLine(coordinates);
		
		const lineLength = calculateLength(coordinates);

		if (lineLength > 1000)
			{ LengthOutput = Math.round((lineLength / 1000) * 100) / 100;   
				var fifthLength = ( Number(LengthOutput) / 5).toFixed(2);
				var twofifthsLength = ( Number(fifthLength) * 2).toFixed(2);
				var threefifthsLength = ( Number(fifthLength) * 3).toFixed(2);
				var fourfifthsLength = ( Number(fifthLength) * 4).toFixed(2);
				var totalLength = LengthOutput + ' kilometres';
				var LengthUnit = ' (Kilometres)';
			}
		else
			{ LengthOutput = Math.round(lineLength * 100) / 100; 
				var fifthLength = ( Number(LengthOutput) / 5).toFixed(0);
				var twofifthsLength = ( Number(fifthLength) * 2).toFixed(0);
				var threefifthsLength = ( Number(fifthLength) * 3).toFixed(0);
				var fourfifthsLength = ( Number(fifthLength) * 4).toFixed(0);
				var totalLength = LengthOutput.toFixed(0) + ' metres';
				var LengthUnit = ' (Metres)';
			}
		


			
		var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
		const latitude = Number(centre[1].toFixed(8));
		const zoom = Math.round(map.getView().getZoom());
	
        let numSamples = 200;
		const metersPerPx = getZoomLevelResolution(latitude, 12);
        const stepSize = Math.max(metersPerPx, lineLength / numSamples);
        numSamples = lineLength / stepSize;

//		console.log("numSamples: " + numSamples);
		
		const numSamplesFifth = ( Number(numSamples) / 5 );
		
//		console.log("numSamplesFifth: " + numSamplesFifth);
		var arr = [];
		    for (var i = 0; i <= Math.round(numSamplesFifth); i++) {
			arr = arr.concat("");
		};
		
		console.log("arr: " + arr);
		
		const labels = [];
		labels.push("0");
		labels.push(arr);
		labels.push(String(fifthLength));
		labels.push(arr);
		labels.push(String(twofifthsLength));
		labels.push(arr);
		labels.push(String(threefifthsLength));
		labels.push(arr);
		labels.push(String(fourfifthsLength));
		labels.push(arr);
		labels.push(String(LengthOutput));
		
//		console.log("labels: " + labels);
		
		const elevationProvider = new ElevationProvider('7Y0Q1ck46BnB8cXXXg8X');
		
//			console.log("Samples: " + samples);
//			console.log("LengthOutput: " + LengthOutput);
			
//			console.log("fifthLength: " + fifthLength);

        const elevationProfile = [];
        for (const c of samples) {
            const elevation = await elevationProvider.getElevation(c[1], c[0]);
            elevationProfile.push(elevation);
        }
		
//		console.log("elevationProfile: " + elevationProfile);

        const minElevation = Math.min(...elevationProfile);
					 
        const maxElevation = Math.max(...elevationProfile);
		
		const ElevationDifference = maxElevation - minElevation;
		
		const chartwidth = $(window).width() * 0.6;
		const chartwidthpx = Math.round(chartwidth) + 'px';
		
//		console.log("chartwidthpx: " + chartwidthpx);
		
		document.getElementById('chartinfo').innerHTML = "<p><strong>Highest point:</strong>  " + Math.round(maxElevation) + " metres. <strong>Lowest point:</strong>  " + 
				Math.round(minElevation) + " metres. <strong>Height Difference:</strong> " +  Math.round(ElevationDifference) + " metres. <strong>Length of Profile:</strong> " +  totalLength + ".</p>";

        const mychart = new Chartist.Line('#chart', {
//			labels: [labels],
			series: [elevationProfile]
        }, {
            low: minElevation - 10,
            showArea: true,
            showPoint: false,
            fullWidth: true,
			chartPadding: { left: 20, right: 20 },
			height: '240px',
			width: chartwidthpx,
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 4,
                fillHoles: false
            }),
			plugins: [
			  Chartist.plugins.ctAxisTitle({
				axisX: {
				  axisTitle: "Length",
				  axisClass: "ct-axis-title",
				  offset: {
					x: 15,
					y: 22
				  },
				  textAnchor: "middle"
				},
				axisY: {
				  axisTitle: "Height (metres)",
				  axisClass: "ct-axis-title",
				  offset: {
					x: 0,
					y: -10
				  },
				  flipTitle: false
				}
			  })
			],
        });

//		document.getElementById('chartinfo').innerHTML = "<p>Height in metres. Distance: " + LengthOutput + "</p>";
//		document.getElementById('chartinfo').innerHTML = "<p>Height in metres.</p>";
//		document.getElementById('elevationprofilemessage').innerHTML = '<a href="javascript:stopmeasuringElevation()">Clear Elevation profile</a>';
		document.getElementById('elevationprofilemessage').innerHTML = '';
		
			map.removeInteraction(drawE);
//			map.removeInteraction(snapE);
    }







//      var modify = new ol.interaction.Modify({ source: map.getLayers().getArray()[11].getSource(); } );
//      map.addInteraction(new ol.interaction.Modify({ source: map.getLayers().getArray()[11].getSource() } ));


        var value = 'LineString';
        if ((((value == 'Polygon') || (value == 'LineString') || (value == 'MultiLineString') || (value == 'MultiPolygon')))) {
          drawE = new ol.interaction.Draw({
            source: colorsource,
            type: /** @type {ol.geom.GeometryType} */ ('MultiLineString')
	  });
          map.addInteraction(drawE);


 
		   drawE.on('drawstart', function (evt) {
			// set sketch
			sketch = evt.feature;
			

			

			/** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
			let tooltipCoord = evt.coordinate;
			
			var helpMsg = 'Click to start tracing a path.<br/>Click to change direction.<br/>Double-click to stop.<br/>Zoom in to trace small changes of direction.';
			



		  });
 
 
		  drawE.on('drawend',
			  function(evt) {
				  


//					coordinates1 = [];
//					coordinates.push(evt.feature.getGeometry().transform('EPSG:3857', 'EPSG:4326').getCoordinates());
					
//					coordinates1 = evt.feature.getGeometry();
//					coordinates1.transform('EPSG:3857', 'EPSG:4326').getCoordinates(); 

//					console.log("coordinates1: " + coordinates1);

					setTimeout(function () {

						drawElevation();

					}, 300)

					jQuery("#chart").show();
//					document.getElementById('chart').innerHTML = "";
					document.getElementById('chartinfo').innerHTML = "<p>Drawing elevation profile... please wait</p>";

			//		map.removeInteraction(drawE);


			  }, this);

//			snapE = new ol.interaction.Snap({source: colorsource});
//			map.addInteraction(snapE);

			}
		else
		{
		stopmeasuringElevation();
		}

      }


      /**
       * Handle change event.
       */

	$(".onoffswitch-profile-checkbox").on('change',  function (event) {

	if ($(".onoffswitch-profile-checkbox").prop('checked')== false)


		{

        	var value = 'Off';

			if (value == 'Off')

//			var helpMsg = '';
//			map.removeOverlay(helpTooltip);
			if (overlaylayer.getPosition() !== undefined)
			{ overlaylayer.setPosition(undefined); }

			document.getElementById('elevationprofilemessage').innerHTML = '';
			jQuery("#chart").hide();

			map.removeInteraction(drawE);
//			map.removeInteraction(snapE);
			
			stopmeasuringElevation();

	        return;
		}

	else

	{

		// check to see if MapTiler Elevation is base layer and if not, change the base layer to MapTiler Elevation
/*
		var baseLayerName = map.getLayers().getArray()[0].get('mosaic_id');
	
		if ( baseLayerName != '8')
	
			{
	
		  	map.getLayers().removeAt(2);
		  	map.getLayers().insertAt(2,baseLayers[7]);
			document.getElementById("layerSelect").selectedIndex = 7;
			updateUrl();
	
			}
*/
		var value = 'LineString';
	  	var helpMsg = 'Click to start tracing a path.<br/>Click to change direction.<br/>Double-click to stop.<br/>Zoom in to trace small changes of direction.';

		  document.getElementById('elevationprofilemessage').innerHTML = 'Click/tap a route on the map to see its elevation profile.<br/>Double-click to finish. <a href="help.html#elevation-profile-all">Help</a>';
		  
		  	setTimeout(function () {
					  document.getElementById('elevationprofilemessage').innerHTML = '';
			}, 10000)


//		if ((map.getLayers().getLength() > 3) && (map.getLayers().getArray()[3].get("title") == "vectors - paths")) map.getLayers().removeAt(3); 


			map.removeInteraction(drawE);
//			map.removeInteraction(snapE);
        	addInteractionE();

	}

      });



function updateOverlaySwitcher() {
  // Initialize tree overlay switcher
  overlayTree = {title: 'Historic Overlays', layer: null, subnodes: []};
  for (var x = 0; x < overlayLayers.length; x++) {
      // if (!overlayLayers[x].displayInLayerSwitcher) continue;
      //historical overlayTree
      var titleArray = overlayLayers[x].get('title').split('-');
      var title1 = jQuery.trim(titleArray.shift());
      var title2 = jQuery.trim(titleArray.join('-'));
      var node = {title: title1, subnodes: [{title: title2, layer: overlayLayers[x]}]};
      addNode(overlayTree, node);
      var overlayNodePath = [];
      var node1 = getNode(overlayTree, title1);
      overlayNodePath.push(indexOf(overlayTree.subnodes, node1));
      var node2 = getNode(node1, title2);
      overlayNodePath.push(indexOf(node1.subnodes, node2));
      overlayLayers[x].overlayNodePath = overlayNodePath;
  }

 // Initialize overlay switcher

 var overlaySelectNode = document.getElementById('overlaySelectNode');
  if (!initialisation) {
    while (overlaySelectNode.hasChildNodes()) {
      overlaySelectNode.removeChild(overlaySelectNode.lastChild);
    }
  } else {
    initialisation = false;
  }
  
  for(var i1 = 0; i1 < overlayTree.subnodes.length; i1++) {
    var node1 = overlayTree.subnodes[i1];
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(node1.title));
    option.setAttribute('value', i1);
    option.setAttribute('id', node1.title);
    overlaySelectNode.appendChild(option);
  }

}



function updateOverlaySwitcherRight() {
  // Initialize tree overlay switcher
  overlayTreeRight = {title: 'Historic Overlays', layer: null, subnodes: []};
  
  for (var x = 0; x < overlayLayersRight.length; x++) {
      // if (!overlayLayers[x].displayInLayerSwitcher) continue;
      //historical overlayTree 
	  
      var titleArray = overlayLayersRight[x].get('title').split('-');
      var title1 = jQuery.trim(titleArray.shift());
      var title2 = jQuery.trim(titleArray.join('-'));
      var node = {title: title1, subnodes: [{title: title2, layer: overlayLayersRight[x]}]};
      addNode(overlayTreeRight, node);
      var overlayNodePath = [];
      var node1 = getNode(overlayTreeRight, title1);
      overlayNodePath.push(indexOf(overlayTreeRight.subnodes, node1));
      var node2 = getNode(node1, title2);
      overlayNodePath.push(indexOf(node1.subnodes, node2));
      overlayLayersRight[x].overlayNodePath = overlayNodePath;
  }


 var overlaySelectNodeRight = document.getElementById('overlaySelectNodeRight');
  if (!initialisation) {
    while (overlaySelectNodeRight.hasChildNodes()) {
      overlaySelectNodeRight.removeChild(overlaySelectNodeRight.lastChild);
    }
  } else {
    initialisation = false;
  }
  
  for(var i1 = 0; i1 < overlayTreeRight.subnodes.length; i1++) {
    var node1 = overlayTreeRight.subnodes[i1];
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(node1.title));
    option.setAttribute('value', i1);
    option.setAttribute('id', node1.title);
    overlaySelectNodeRight.appendChild(option);
  }

}

function checkroymap()  {

	if (document.getElementById('showRoyinfo') !== null)

	{


			var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
		
		
			var str = map.getLayers().getArray()[4].get('mosaic_id');
			if (str == 3)
		
			{
		
		
			var url = '<a href="/geo/roy/#zoom=' + map.getView().getZoom().toFixed(0) + '&lat=' + centre[1].toFixed(5)  + '&lon=' + centre[0].toFixed(5) +  '&layers=0" " target="_blank">Search all Roy Map Names and Sheet References</a>';
		
		             jQuery("#showRoyinfo").show();
		             document.getElementById('showRoyinfo').innerHTML = url;
		
			}
		
			else if (str == 4)
		
			{
		
		
			var url = '<a href="/geo/roy/#zoom=' + map.getView().getZoom().toFixed(0) + '&lat=' + centre[1].toFixed(5)  + '&lon=' + centre[0].toFixed(5) +  '&layers=1">Search all Roy Map Names and Sheet References</a>';
		
		             jQuery("#showRoyinfo").show();
		             document.getElementById('showRoyinfo').innerHTML = url;
		
			}
		
			else
			{
		             jQuery("#showRoyinfo").hide();
		
			}

	}

}

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function sixinchenglandwalesfirst()   {
	
		if (map.getLayers().getArray()[4].get('mosaic_id') == '257')
			

			
			{



/*
					if (map.getLayers().getArray().length > 11)					
					if (map.getLayers().getArray()[11].get('title') == 'vectors - SixInchCount')	

					{ map.getLayers().removeAt(11); }
*/
			if  ((map.getView().getZoom() > 12) && (wfsSixInchON))
				
				{
					


					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
					// console.log("bboxextent: " + bboxextent );

					var geojsonFormat = new ol.format.GeoJSON();
					
					var urlgeoserverSixInch =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=nls:england_wales_ireland_counties' +
							'&PropertyName=(the_geom,COUNTY)&outputFormat=text/javascript&format_options=callback:loadFeaturesSixInch' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857&';
					
					// console.log("urlgeoserver:" + urlgeoserverSixInch);
							
					var ajaxgeoserver = $.ajax({url: urlgeoserverSixInch, dataType: 'jsonp', cache: false })

					vectorSourceSixInch = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					window.loadFeaturesSixInch = function(response) {
						 vectorSourceSixInch.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					
					// console.log("featuresALL.length:" + featuresALL.length);
					
					if (featuresALL.length < 1)
								{	    
						
								return;
								}
							
							
							  else  {

								countyname = featuresALL[0].properties.COUNTY;
								const countynameTitle = toTitleCase(countyname);
							//	console.log(countyname);
								
								
								 overlaySelected.getLayers().forEach(function(layer) {
									if (layer.get('title') === countyname) {
									  overlaySelectedSixInchLayer = layer;								  
									}								
								});
								

								if (countynameold != countyname)
								
								{
//									overlaySelected.getLayers().getArray().remove(overlaySelectedSixInchLayer);
									overlaySelected.getLayers().getArray().push(overlaySelectedSixInchLayer);	
									
									$("#showCoordinatesinfo").removeClass("hidden");
									jQuery('#showCoordinatesinfo').show();
				
									$("#showCoordinatesinfo").css({ 'text-align': 'center' });
										$("#showCoordinatesinfo").css({ 'min-width': '250px' });
									document.getElementById('showCoordinatesinfo').innerHTML = 'The current layer on top is <strong>' + countynameTitle + '</strong>';
	
									if (map.getLayers().getArray().length > 12)	{	
										if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')
										{ map.getLayers().getArray()[12].setStyle(redvector); }
									}
									
										var iconFeature = new ol.Feature();
		
									var iconStyle = new ol.style.Style({
									  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
										anchor: [10, 10],
										anchorXUnits: 'pixels',
										anchorYUnits: 'pixels',
										src: 'https://maps.nls.uk/geo/img/cross.png'
									  }))
									});
									
								
									iconFeature.setStyle(iconStyle);
								
									var vectorSource = new ol.source.Vector({
									  features: [iconFeature]
									});
									
									var vectorLayerMouseCross = new ol.layer.Vector({
									  source: vectorSource,
									  title: 'vectorMouseCross'
									});
									
			/*			
										var maplayerlength = map.getLayers().getLength();
										map.getLayers().insertAt(maplayerlength,vectorLayerMouseCross);
										iconFeature.setGeometry( new ol.geom.Point(point3857) );											
			*/
									

									
									setTimeout( function(){
											document.getElementById('showCoordinatesinfo').innerHTML = '';
			//							iconFeature.setGeometry(null);
										jQuery('#showCoordinatesinfo').hide();

										if (map.getLayers().getArray().length > 12)	{
											if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')
											{ map.getLayers().getArray()[12].setStyle(invisiblestyle); }
										}
										
									}, 5000); // delay 50 ms
								}
							  }



						var vectorLayerSixInch = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - SixInchCount",
							source: vectorSourceSixInch,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(250, 0, 0, 0.5)',
							  width: 1
								})
							})
						});


					if (map.getLayers().getArray().length > 12)					
					if (map.getLayers().getArray()[12].get('title') !== 'vectors - SixInchCount')	
					
						{
							map.getLayers().insertAt(12,vectorLayerSixInch);
						}
					};
				}

				else
					
					{


					if (map.getLayers().getArray().length > 12)					
					if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')	

					{ map.getLayers().removeAt(12); }
					}


					return;
			}
	
		else
			
			{
			document.getElementById('showCoordinatesinfo').innerHTML = '';
			return;
			}
}



function sixinchenglandwalessecond()   {
	
		if (map.getLayers().getArray()[4].get('mosaic_id') == '6')
			

			
			{



/*
					if (map.getLayers().getArray().length > 12)					
					if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')	

					{ map.getLayers().removeAt(12); }
*/
			if  ((map.getView().getZoom() > 12) && (wfsSixInchON))
				
				{
					


					var point3857 = map.getView().getCenter();
					
					var lat = point3857[1].toFixed(5);
					var lon = point3857[0].toFixed(5);
					var left = (lon - 10);
					var right = (lon + 10);
					var bottom = (lat - 10);
					var top = (lat + 10);
					
					var bboxextent = left +',' + bottom + ',' + right + ',' + top ;
					
					// console.log("bboxextent: " + bboxextent );

					var geojsonFormat = new ol.format.GeoJSON();
					
					var urlgeoserverSixInch =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
							'&version=1.1.0&request=GetFeature&typename=nls:ireland_counties' +
							'&PropertyName=(the_geom,COUNTY)&outputFormat=text/javascript&format_options=callback:loadFeaturesSixInch' +
							'&srsname=EPSG:900913&bbox=' + bboxextent + ',EPSG:3857&';
					
					// console.log("urlgeoserver:" + urlgeoserverSixInch);
							
					var ajaxgeoserver = $.ajax({url: urlgeoserverSixInch, dataType: 'jsonp', cache: false })

					vectorSourceSixInch = new ol.source.Vector({
					  loader: function(extent, resolution, projection) {
						ajaxgeoserver;
					  },
					  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom: 19
					  }))
					});
					
					
					window.loadFeaturesSixInch = function(response) {
						 vectorSourceSixInch.addFeatures(geojsonFormat.readFeatures(response));			


					var featuresALL = response.features;
					
					// console.log("featuresALL.length:" + featuresALL.length);
					
					if (featuresALL.length < 1)
								{	    
						
								return;
								}
							
							
							  else  {

								countyname = featuresALL[0].properties.COUNTY;
								const countynameTitle = toTitleCase(countyname);
							//	console.log(countyname);
								
								
								 overlaySelected.getLayers().forEach(function(layer) {
									if (layer.get('title') === countyname) {
									  overlaySelectedSixInchLayer = layer;								  
									}								
								});
								

								if (countynameold != countyname)
								
								{
//									overlaySelected.getLayers().getArray().remove(overlaySelectedSixInchLayer);
									overlaySelected.getLayers().getArray().push(overlaySelectedSixInchLayer);	
									
									$("#showCoordinatesinfo").removeClass("hidden");
									jQuery('#showCoordinatesinfo').show();
				
									$("#showCoordinatesinfo").css({ 'text-align': 'center' });
										$("#showCoordinatesinfo").css({ 'min-width': '250px' });
									document.getElementById('showCoordinatesinfo').innerHTML = 'The current layer on top is <strong>' + countynameTitle + '</strong>';
	
									if (map.getLayers().getArray().length > 12)	{
	
										if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')
										{ map.getLayers().getArray()[12].setStyle(redvector); }
									
									}
									
										var iconFeature = new ol.Feature();
		
									var iconStyle = new ol.style.Style({
									  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
										anchor: [10, 10],
										anchorXUnits: 'pixels',
										anchorYUnits: 'pixels',
										src: 'https://maps.nls.uk/geo/img/cross.png'
									  }))
									});
									
								
									iconFeature.setStyle(iconStyle);
								
									var vectorSource = new ol.source.Vector({
									  features: [iconFeature]
									});
									
									var vectorLayerMouseCross = new ol.layer.Vector({
									  source: vectorSource,
									  title: 'vectorMouseCross'
									});
									
			/*			
										var maplayerlength = map.getLayers().getLength();
										map.getLayers().insertAt(maplayerlength,vectorLayerMouseCross);
										iconFeature.setGeometry( new ol.geom.Point(point3857) );											
			*/
									

									
									setTimeout( function(){
											document.getElementById('showCoordinatesinfo').innerHTML = '';
			//							iconFeature.setGeometry(null);
										jQuery('#showCoordinatesinfo').hide();
										
									if (map.getLayers().getArray().length > 12)	{
										if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')
										{ map.getLayers().getArray()[12].setStyle(invisiblestyle); }
									}
									
									}, 5000); // delay 50 ms
								}
							  }



						var vectorLayerSixInch = new ol.layer.Vector({
						mosaic_id: '200',
						title: "vectors - SixInchCount",
							source: vectorSourceSixInch,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
							  color: 'rgba(0, 0, 0, 0)'
							}),
							stroke: new ol.style.Stroke({
							  color: 'rgba(250, 0, 0, 0.5)',
							  width: 1
								})
							})
						});


					if (map.getLayers().getArray().length > 12)					
					if (map.getLayers().getArray()[12].get('title') !== 'vectors - SixInchCount')	
					
						{
							map.getLayers().insertAt(12,vectorLayerSixInch);
						}
					};
				}

				else
					
					{


					if (map.getLayers().getArray().length > 12)					
					if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')	

					{ map.getLayers().removeAt(12); }
					}


					return;
			}
	
		else
			
			{
			document.getElementById('showCoordinatesinfo').innerHTML = '';
			return;
			}
}


function checkedinburghmap()  {

	if (document.getElementById('showEdinburghinfo') !== null)

	{
		
			var center27700 = [];
			center27700 = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");

//				console.log("center27700: " + center27700);
				
			var centre = [];
			centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");				

			
			const extent = map.getView().calculateExtent(map.getSize());
			const edinburghextent = [-376850.4455893086, 7544008.960999099, -339383.6644649869, 7545946.388116944];


			const zoom = map.getView().getZoom();
			var str = map.getLayers().getArray()[4].get('mosaic_id');
//			if (edinburghextent.intersectsCoordinate(centre))
			if ((center27700[0]  > 313684 ) && (center27700[0] < 332871 ) && ( center27700[1] > 664971  ) && (center27700[1] < 678853 )) 
//			if (ol.extent.intersects(edinburghextent, extent))
			{
			inEdinburgh = true;
			}
			else
			{
			inEdinburgh = false;
			}
			
			
//			if ((str == 73) || (str == 168))
		
//			{
				
//				console.log("Edinburgh25inch");

				var windowWidth = $(window).width();
				
				var mapoverlaytitle = map.getLayers().getArray()[4].get('title');


				if (((zoom > 12) && (inEdinburgh)  && (windowWidth > 850)))
					
					{
						
				 if (!(mapoverlaytitle.includes('Allmaps')))
					 
					 {

						var url = '<a href="/transcriptions/edinburgh/viewer/#zoom=' + Math.round(zoom) + '&lat=' + centre[1].toFixed(5)  + '&lon=' + centre[0].toFixed(5) +  ' " target="_blank">Search all names/text on OS 25 inch maps of Edinburgh (1892-94)</a>';
			
						 jQuery("#showEdinburghinfo").show();
						 document.getElementById('showEdinburghinfo').innerHTML = url;
						 
							 }
					}

		
	
			else
			{
		             jQuery("#showEdinburghinfo").hide();
		
			}

	}

}


function checktrenchmap()  {

	var str = map.getLayers().getArray()[4].get('group_no');
	if (str == 60)

	{
             jQuery("#trenchmapsearch").show();

			 
	}

	else
	{
             jQuery("#trenchmapsearch").hide();
	}

}

function checkgb()  {

	var center = [];
	center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");

	if ((Math.round(center[0])  < -230000) || (Math.round(center[0]) > 700000 ) || (Math.round(center[1]) < 0) || (Math.round(center[1]) > 1300000 )) 

		{
	             jQuery("#gb1900search").hide();
             	 jQuery("#ngrsearch").hide();
             	 jQuery("#countysearch").hide();
//				$("input[name=nlsgazarea][value='']").prop("checked",true);



		}

	else
		{
	             jQuery("#gb1900search").show();
                 jQuery("#ngrsearch").show();
             	 jQuery("#countysearch").show();

		}
		
//		console.log("inUK: " + inUK);
		
		
	if (inUK)
			
			{
					$('input[id\x3d"nlsgazareauk"]').prop('checked', true);
					$('input[id\x3d"nlsgazareaworld"]').prop('checked', false);

					$( "#nlsgaz").val(['Type a modern placename...']);
					$( "#nlsgazareauk" ).trigger( "click" );	
					
			}
		

		else
		{
			$('input[id\x3d"nlsgazareauk"]').prop('checked', false);
			$('input[id\x3d"nlsgazareaworld"]').prop('checked', true);

					$( "#nlsgaz").val(['Type a modern placename...']);
					$( "#nlsgazareaworld" ).trigger( "click" );


			
		}			
					


}

function removeTopLayer()  {

	
		var layers = map.getLayers().getArray();
		var maplayerlength = layers.length;
		const toplayer = maplayerlength - 1;
		var toplayerlayer = layers[toplayer];
		var toplayername = toplayerlayer.get('name');
		
		vector_import_source.clear();

//		if (!(toplayername.includes('os-places'))) {

//		  map.removeLayer(toplayerlayer);
//		}
	
//	map.removeControl(getFeatureInfo);
	
	if ( map.getLayers().getLength() < 13 )
	{
	jQuery("#deletesketch").hide();
	}
	
		wfsparishON = true;
		wfsON = true;
		wfsSixInchON = true;
		
				if ($(window).width() < 850)
				{
				checkWFSmobile();
				}
				else
				{
				checkWFS();
				}
	
	switchparishWFSON();
	jQuery("#showImport").show();	
	$('#map').focus();
}


function hideTopLayer()  {
	
	document.getElementById('toplayervisibility').innerHTML = '';
	
	var maplayerlength = map.getLayers().getLength();
	const toplayer = parseInt(maplayerlength - 1);
	map.getLayers().getArray()[toplayer].setVisible(false);
	
	document.getElementById('toplayervisibility').innerHTML = '<a href="javascript:showTopLayer()">Show top layer</a>';
	
//	$('#map').focus();
}

function showTopLayer()  {
	
	var maplayerlength = map.getLayers().getLength();
	const toplayer = parseInt(maplayerlength - 1);
	map.getLayers().getArray()[toplayer].setVisible(true);
	
	document.getElementById('toplayervisibility').innerHTML = '<a href="javascript:hideTopLayer()">Hide top layer</a>';
	
//	$('#map').focus();
}


function exportGeoJSONBNG(){

/*
	colorsourceALL = new ol.source.Vector();

	vectorcolorALL = new ol.layer.Vector({
	  title: "vectorcolorALL",
	  source: colorsourceALL,
	 
	});

	var maplayerlength = map.getLayers().getLength();
	map.getLayers().insertAt(maplayerlength,vectorcolorALL);
*/
		var maplayerlength = map.getLayers().getLength();
		var toplayer = parseInt(maplayerlength - 1);

	        var layers = map.getLayers().getArray().slice();
		    for (var x = 0; x < layers.length; x++) {
		        if (layers[x].get('title') == 'vectorcolor') 
			map.getLayers().getArray()[parseInt(toplayer)].getSource().addFeatures(layers[x].getSource().getFeatures());

		    }



		var lastlayerfeatures = map.getLayers().getArray()[parseInt(toplayer)].getSource().getFeatures();


//		var lastlayerfeatures = [];
//		lastlayerfeatures.push(map.getLayers().getArray()[parseInt(toplayer)].getSource().getFeatures());

		var geojsonFormat = new ol.format.GeoJSON({ extractGeometryName: true});
		var file_original = geojsonFormat.writeFeatures(lastlayerfeatures, {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:27700',  decimals:0 });

		var file = file_original.replace(/"properties":null/g,'"properties":[]');

//		var kmlFormat = new ol.format.kml({featureProjection: 'EPSG:3857'});
//		var file = kmlFormat.writeFeatures(lastlayerfeatures);

  		var filename = 'data:text/json;charset=utf-8,' + file;


			function download(filename, text) {
			
			  var element = document.createElement('a');
			  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + file);
			  element.setAttribute('download', filename);
			
			  element.style.display = 'none';
			  document.body.appendChild(element);
			
			  element.click();
			
			  document.body.removeChild(element);
			
			}

 		download("file.geojson",filename);

	}

function exportWKT(){


		var maplayerlength = map.getLayers().getLength();
		var toplayer = parseInt(maplayerlength - 1);

	        var layers = map.getLayers().getArray().slice();
		    for (var x = 0; x < layers.length; x++) {
		        if (layers[x].get('title') == 'vectorcolor') 
			map.getLayers().getArray()[parseInt(toplayer)].getSource().addFeatures(layers[x].getSource().getFeatures());

		    }


		var lastlayerfeatures = map.getLayers().getArray()[parseInt(toplayer)].getSource().getFeatures();


				// Prepare headers from the first feature's properties (excluding geometry)
				const allProps = lastlayerfeatures[0].getProperties();
				const headers = Object.keys(allProps).filter(key => key !== 'geometry');

				// Optional: If you want to include geometry as WKT
				headers.push('wkt');

				const rows = [headers.join(',')];

				for (const feature of lastlayerfeatures) {
					const properties = feature.getProperties();
					// Collect attribute values, excluding geometry
					const row = headers.map(header => {
						if (header === 'wkt') {
							// Export geometry as WKT
							const geom = feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326');
							return new ol.format.WKT().writeGeometry(geom);
						}
						return JSON.stringify(properties[header] ?? '');
					});
					rows.push(row.join(','));
				}

				const csvContent = rows.join('\n');


  		var filename = 'data:text/csv;charset=utf-8,' + csvContent;

		console.log("filename: " + csvContent);
			function download(filename, text) {
			
			  var element = document.createElement('a');
			  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + csvContent);
			  element.setAttribute('download', filename);
			
			  element.style.display = 'none';
			  document.body.appendChild(element);
			
			  element.click();
			
			  document.body.removeChild(element);
			
			}

 		download("wkt.txt",filename);

	}
	
	
	function exportCSV(){

		var maplayerlength = map.getLayers().getLength();
		var toplayer = parseInt(maplayerlength - 1);

	        var layers = map.getLayers().getArray().slice();
		    for (var x = 0; x < layers.length; x++) {
		        if (layers[x].get('title') == 'vectorcolor') 
			map.getLayers().getArray()[parseInt(toplayer)].getSource().addFeatures(layers[x].getSource().getFeatures());

		    }


		var lastlayerfeatures = map.getLayers().getArray()[parseInt(toplayer)].getSource().getFeatures();

				// Prepare headers from the first feature's properties (excluding geometry)
				const allProps = lastlayerfeatures[0].getProperties();
				const headers = Object.keys(allProps).filter(key => key !== 'geometry');


				  center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:27700");

				var lastlayerFeaturesExtent =	map.getLayers().getArray()[parseInt(toplayer)].getSource().getExtent();
				

					var extent27700 = ol.proj.transformExtent(lastlayerFeaturesExtent,  "EPSG:3857", "EPSG:27700");
					
					console.log("extent27700: " + extent27700);
					
					  
				  if ((Math.round(extent27700[0]) < 700000) && 
						(Math.round(extent27700[1]) < 1300000) && 
						(Math.round(extent27700[2]) > 0) && 
						(Math.round(extent27700[3]) > 0)) {
						// extent is within your defined British National Grid bounds
	
					console.log ("in Britain");
					headers.push('easting','northing','gridref');
				  }
				  
				  headers.push('lon','lat','wkt');

/*

				for (const feature of lastlayerfeatures) {
					const properties = feature.getProperties();
					// Collect attribute values, excluding geometry
					const row = headers.map(header => {
						if (header === 'easting') {
							
							const geometry = feature.getGeometry();
							const coordinates = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326");
							const coordinates27700 = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:27700");
							return coordinates27700[0].toFixed();
						}
						if (header === 'northing') {
							
							const geometry = feature.getGeometry();
							const coordinates = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326");
							const coordinates27700 = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:27700");
							return coordinates27700[1].toFixed();
						}
						if (header === 'gridref') {
							
							const geometry = feature.getGeometry();
							const coordinates = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326");
							const coordinates27700 = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:27700");
				

							var templatex = '{x}';
							var outx = ol.coordinate.format(coordinates27700, templatex, 0);
							var templatey = '{y}';
							var outy = ol.coordinate.format(coordinates27700, templatey, 0);
							return gridrefNumToLet(outx, outy, 8);
						}
						if (header === 'lon') {
							const geometry = feature.getGeometry();
							const geom = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326");
							return geom[0];
						}
						if (header === 'lat') {
							const geometry = feature.getGeometry();
							const geom = ol.proj.transform(geometry.getCoordinates(), "EPSG:3857", "EPSG:4326");
							return geom[1];
						}
						if (header === 'wkt') {

							const geom = feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326');
							return new ol.format.WKT().writeGeometry(geom);
						}
						return JSON.stringify(properties[header] ?? '');
					});
					rows.push(row.join(','));
				}
*/


				const rows = [headers.join(',')];

				for (const feature of lastlayerfeatures) {
				  const properties = feature.getProperties();
				  const geometry = feature.getGeometry();
				  const geomType = geometry.getType();

				  // Transform geometry to target projections just once if needed
				  let wgsGeom = geometry.clone().transform('EPSG:3857', 'EPSG:4326');
				  let osgbGeom = geometry.clone().transform('EPSG:3857', 'EPSG:27700');

				  // For Point geometries only, grab coordinate values
				  let easting = '', northing = '', lon = '', lat = '', gridref = '';
				  if (geomType === "Point") {
					const coord4326 = wgsGeom.getCoordinates();   // [lon, lat]
					const coord27700 = osgbGeom.getCoordinates(); // [easting, northing]
					easting = coord27700[0].toFixed();
					northing = coord27700[1].toFixed();
					lon = coord4326[0];
					lat = coord4326[1];
					gridref = gridrefNumToLet(coord27700[0], coord27700[1], 8); // Use your function
				  }

				  // WKT for any geometry
				  const wkt = new ol.format.WKT().writeGeometry(wgsGeom);

				  // Compose row based on headers
				  const row = headers.map(header => {
					if (header === 'easting') return easting || 'n/a';
					if (header === 'northing') return northing || 'n/a';
					if (header === 'gridref') return gridref || 'n/a';
					if (header === 'lon') return lon || 'n/a';
					if (header === 'lat') return lat || 'n/a';
					if (header === 'wkt') return wkt;
					return JSON.stringify(properties[header] ?? '');
				  });
				  rows.push(row.join(','));
				}

				const csvContent = rows.join('\n');



  		var filename = 'data:text/csv;charset=utf-8,' + csvContent;

		console.log("filename: " + csvContent);
			function download(filename, text) {
			
			  var element = document.createElement('a');
			  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + csvContent);
			  element.setAttribute('download', filename);
			
			  element.style.display = 'none';
			  document.body.appendChild(element);
			
			  element.click();
			
			  document.body.removeChild(element);
			
			}

 		download("file.csv",filename);		
		
	}

  $(document).ready(function () {

		$('input[type=radio][name=exportFormat]').change(function() {
			if (this.value == 'KML') {
                draw.setExportFormat("KML");

			}
			else if (this.value == 'GPX') {
                draw.setExportFormat("GPX");
				const $panel = $('[id^="GPdrawingPanel-"]');
				$panel.show();
			}
			else if (this.value == 'GeoJSON') {
                draw.setExportFormat("GeoJSON");
				const $panel = $('[id^="GPdrawingPanel-"]');
				$panel.show();
			}
			else if (this.value == 'GeoJSONBNG') {
				const $panel = $('[id^="GPdrawingPanel-"]');
				$panel.show();
			}
			else if (this.value == 'CSV') {
				const $panel = $('[id^="GPdrawingPanel-"]');
				$panel.show();
			}
			else if (this.value == 'WKT') {
//				exportWKT();
			}
		});
    });

function checkexportradio() {

		var drawExportFormat = draw.getExportFormat();
						
		if (drawExportFormat == 'GEOJSON')
				{ 	$("#radioGeoJSON").prop("checked", true); }
		else if (drawExportFormat == 'GPX')
			{ $("#radioGPX").prop("checked", true); }
		else  if (drawExportFormat == 'KML')
			{ $("#radioKML").prop("checked", true); }


		setTimeout(function () {		

			var maplayerlength = map.getLayers().getLength();
			const toplayer = parseInt(maplayerlength - 1);
								
//			draw.setLayer( map.getLayers().getArray()[toplayer] );

		}, 1000)
		

}

function checksketch()  {
	

	
	
				setTimeout(function () {
					
					
				console.log("checksketch running");
							
				var maplayerlength = map.getLayers().getLength();
							
				if (maplayerlength  > 11)
									
						{
								
										console.log("maplayerlength  > 11");		

								
//								lyrImport.setCollapsed(true);
								jQuery("#importPanel").hide();

								jQuery("#showImport").show();	

								$("#radioKML").prop("checked", true);
								
										wfsSixInchON = false;

										if (map.getLayers().getArray().length > 14)					
										if (map.getLayers().getArray()[14].get('title') == 'vectors - SixInchCount')	

										{ map.getLayers().removeAt(14); }
										
										if (map.getLayers().getArray().length > 13)					
										if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCount')	

										{ map.getLayers().removeAt(13); }
									
										if (map.getLayers().getArray().length > 12)					
										if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')	

										{ map.getLayers().removeAt(12); }

								
								
//										wfsparishOFF = true;

//										if (map.getLayers().getArray()[7].get('name') == 'vectorParish') {  


											if (map.getLayers().getArray()[10].getSource() !== null)										
												{												
												map.getLayers().getArray()[10].getSource().clear();
												}

											if (map.getLayers().getArray()[9].getSource() !== null)										
												{												
												map.getLayers().getArray()[9].getSource().clear();
												}

										
											if (map.getLayers().getArray()[7].getSource() !== null)										
												{
												
												map.getLayers().getArray()[7].getSource().clear();
												}
//											}
														
//										wfsOFF = true;
										

										
//										if (map.getLayers().getArray()[6].get('name') == 'vector') {  
										
												if (map.getLayers().getArray()[6].getSource() !== null)
												
												{

												map.getLayers().getArray()[6].getSource().clear(); 
												
												}

										
										

										switchWFSOFF();
										switchparishWFSOFF();
										
								
						//				if ( map.getLayers().getArray()[11].gpResultLayerId !== 'drawing' )
						//				if ( map.getLayers().getArray()[11].gpResultLayerId  )
						//				{
											
						//					console.log("gbResultLayerId: " + gbResultLayerId);
											
											if ($(window).width() > 850)
										{
												checkWFS();
												jQuery("#deletesketch").show();
												document.getElementById("deletesketchinfo").innerHTML = 'Edit layer with edit tools <img src="https://maps.nls.uk/geo/img/edit-icon.gif" width="20"   alt="Edit tools" title="Edit tools" /> (top right).';
												$("#radioKML").prop("checked", true);
	
											console.log("still working at line 15488");
	
												if (overlaySelected instanceof ol.layer.Group)
													
													{
														map.getLayers().removeAt(4);
														
														
														setTimeout(function () {
															
														console.log("getFeatureInfo setLayers1");
														map.addControl(getFeatureInfo);
														getFeatureInfo.setLayers( { obj: map.getLayers().getArray()[toplayer] , event: 'singleclick', infoFormat: 'text/html' });
														map.getLayers().insertAt(4,overlaySelected);
														console.log("getFeatureInfo setLayers");														
														}, 200)

													}
												else
													{	


																	console.log("getFeatureInfo setLayers2");					

													map.addControl(getFeatureInfo);
	
										var maplayerlength = map.getLayers().getLength();
										const toplayer = parseInt(maplayerlength - 1);
										console.log("toplayer: " + toplayer);
	
													getFeatureInfo.setLayers( { obj: map.getLayers().getArray()[toplayer] , event: 'singleclick', infoFormat: 'text/html' });
													console.log("getFeatureInfo setLayers afterwards");
													getFeatureInfo.setTarget( map.getLayers().getArray()[toplayer]);
												}
										
/*										
									setTimeout(function () {
										


													map.getLayers().getArray()[13].setStyle(function(feature, resolution) {
														  const value = feature.get('Place');
														return  new ol.style.Style({
														 image : new ol.style.Icon({
															//  src : "https://maps.nls.uk/geo/img/orange-marker.png",
															//  size : [51, 51],
															  src : "https://maps.nls.uk/geo/img/circle-10-black.png",
															  size : [10, 10],
														 }),
														 stroke : new ol.style.Stroke({
															  color : "#ffffff",
															  width : 7
														 }),
														 fill : new ol.style.Fill({
															  color : "rgba(255, 183, 152, 0.2)"
														 }),
														 text : new ol.style.Text({
															 text: feature.get('Place'),
															 font : "bold 20px Sans",
															 textAlign : "left",
															 fill : new ol.style.Fill({
																 color : "rgba(0, 0, 0, 1)"
															 }),
															 stroke : new ol.style.Stroke({
																 color : "rgba(255, 255, 255, 1)",
																 width : 2
															 }),
															offsetY: 10, // optional: move label above point
															offsetX: 10, // 													
														 })
													 })
												});		

										$('#map').focus();												
									}, 1200)
	*/
										$('#map').focus();
	
										var zoom = map.getView().getZoom();
										var oSzoom = overlaySelected.get('maxZ');

										if (zoom > oSzoom)

										{ 
										map.getView().setZoom(Math.round(oSzoom)); 

										}		
	
								}
								else
										{ 
									checkWFSmobile();
										return;
										}
																
					}
			else
			{
				
				wfsparishON = true;
				wfsON = true;
			}
			



							
		}, 1000)
		

		
}




function checkreuse() {
	document.getElementById('re-use').innerHTML = '';
	document.getElementById('re-use-mobile').innerHTML = '';

//	if ($("#mapslider") != null ) 
		{
//		var opacityvalue = jQuery('#mapslider').slider('getValue');

		var opacityvalue = 51;
		}
	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	var str = map.getLayers().getArray()[4].get('group_no');
	var mosaic_id = map.getLayers().getArray()[4].get('mosaic_id');

	if (opacityvalue < 50)
	{
        document.getElementById('re-use').innerHTML = '';
		document.getElementById('re-use-mobile').innerHTML = '';
	}
	else if ((opacityvalue > 49 ) && (str == 47))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-roy">CC-BY </a> (BL).';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-roy">CC-BY </a> (BL).';
	}
	
	else if ((opacityvalue > 49 ) && (str == 62))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-damp">CC-BY</a> (DAMP).';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-damp">CC-BY</a> (DAMP).';
	}

	else if ((opacityvalue > 49 ) && (str == 65))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-lus">CC-BY-NC-SA</a> (LUS).';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-lus">CC-BY-NC-SA</a> (LUS).';
	}
	else if ((opacityvalue > 49 ) && (str == 66))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-hutton">CC-BY-NC-SA</a> (Hutton).';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-hutton">CC-BY-NC-SA</a> (Hutton).';
	}
	else if ((opacityvalue > 49 ) && (str == 67))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-damp">CC-BY</a> (DAMP).';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-damp">CC-BY</a> (DAMP).';
	}
	else if ((opacityvalue > 49 ) && (str == 242))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-2lus">CC-BY-NC-SA</a> (2nd LUS)';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-2lus">CC-BY-NC-SA</a> (2nd LUS)';
	}
	else if ((opacityvalue > 49 ) && (str == 273))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#noncommercial">CC-BY-NC-SA</a>. With thanks to <a href="https://www.birmingham.gov.uk/archives">Birmingham Archives</a>.';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#noncommercial">CC-BY-NC-SA</a>. With thanks to <a href="https://www.birmingham.gov.uk/archives">Birmingham Archives</a>.';
	}
	else if ((opacityvalue > 49 ) && (str == 282))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-2lus">CC-BY-NC-SA</a> (2nd LUS)';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-2lus">CC-BY-NC-SA</a> (2nd LUS)';
	}
	else if ((opacityvalue > 49 ) && (str == 289))
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-2lus">CC-BY-NC-SA</a> (2nd LUS)';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#exceptions-2lus">CC-BY-NC-SA</a> (2nd LUS)';
	}
	else 
	{
        document.getElementById('re-use').innerHTML = 'Re-use: <a href="/copyright.html#noncommercial">CC-BY</a> (NLS).';
		document.getElementById('re-use-mobile').innerHTML = 'Re-use: <a href="/copyright.html#noncommercial">CC-BY</a> (NLS).';
	}
}




function switchOverlayinitial() {
	
	console.log("urlLayerName: " + urlLayerName);
	
	if (((urlLayerName == undefined) || (urlLayerName == '171') || (urlLayerName == '999'))) {


		urlLayerName = '6';
		overlaySelected = getOverlay(urlLayerName);
    	overlaySelected.setVisible(true);
		map.getLayers().insertAt(4,overlaySelected);
		
	}
	else if (urlLayerName.includes('allmaps')) {
		
	console.log("yes");
	
	

	
	overlayLayers.unshift(allmapslayer);
	overlayLayersAll.unshift(allmapslayer);
	
	map.getLayers().insertAt(4, allmapslayer);
	
	overlaySelected = map.getLayers().getArray()[4];





//			osoneincholdseriesAllMaps.removeGeoreferenceAnnotationByUrl('https://maps.nls.uk/geo/allmaps/old-series.json')


			var allmapsId = urlLayerName.replace('allmaps-', '');
			var new_value = 'https://annotations.allmaps.org/images/' + allmapsId;
			
			console.log("new_value: " + new_value);
			
				setTimeout( function(){
								warpedMapLayer.addGeoreferenceAnnotationByUrl( new_value
								)
								
						warpedMapLayer.on('warpedmapadded', (event) => {
//						  console.log(event.mapId, warpedMapLayer.getExtent())

								map.getView().fit(warpedMapLayer.getExtent());
								
							fetch(new_value)
							  .then((response) => response.json())
									.then(function(json) {

									//	console.log(JSON.stringify(json));
										
										const targetSourceId = json.items[0].target.source.id;
										console.log('Target source ID:', targetSourceId);
										let nls_id = targetSourceId.slice(-9);
		

										var iiifurl = targetSourceId + '/info.json'; 
										
										console.log("iifurl :" + iiifurl);
										var bbox_suffix = '&bbox=-8.5693359,55.0657869,0.3076172,59.310768';
										var iiifurl_escape = encodeURI(iiifurl + bbox_suffix);
										var allmaps_editor = 'https://editor.allmaps.org/#/georeference?url=' + iiifurl_escape ;
										
										if ( windowWidth = $(window).width() > 850)
											
											{
										
											$("#editallmaps").removeClass("hidden");
											jQuery("#editallmaps").show();
										
											}
										
										jQuery("#showEdinburghinfo").hide();
	
										document.getElementById('URHere').innerHTML = '';
										setResults1(999);
	
										document.getElementById('allmapseditorlink').innerHTML = '<a href="' +allmaps_editor + '" target="_blank">Edit georeferencing in Allmaps Editor</a>';

										
											
									})
						})


									if ( windowWidth = $(window).width() > 850)
											
											{
										$("#editallmaps").removeClass("hidden");
										jQuery("#editallmaps").show();
										jQuery("#showEdinburghinfo").hide();
										
											}





				}, 200); // delay 50 ms

					map.getLayers().getArray()[4].set('mosaic_id', urlLayerName);
				overlaySelected = map.getLayers().getArray()[4];
				updateUrl();	
				checkWidth();				
				return;
	}


	else
	{

	
						if (urlLayerName.indexOf('allmaps') == -1)
							
							{
										console.log("no allmaps");
										overlaySelected = getOverlay(urlLayerName);
										overlaySelected.setVisible(true);
										map.getLayers().insertAt(4,overlaySelected);

							}
				

	}






	var zoom = map.getView().getZoom();
	var oSzoom = overlaySelected.get('maxZ');

	if (zoom > oSzoom)

	{ 
	map.getView().setZoom(Math.round(oSzoom)); 
		setTimeout( function(){
				map.getView().setZoom(zoom); 
			}, 20); // delay 50 ms
	}

			if (overlaySelected.get('title').includes("Google"))  {
				jQuery("#googleexplore").removeClass('hidden');
				jQuery("#googleexplore").show();
			}
			else
			{ 
				jQuery("#googleexplore").hide();
			}


			if (overlaySelected.get('title').includes("Old Series"))  {
				osoneincholdseriesAllMaps.addGeoreferenceAnnotationByUrl(	'https://maps.nls.uk/geo/allmaps/old-series.json'
				)
			}

   	var map_group = overlaySelected.get('group_no');
	
	if (map_group)

				{ setResults1(map_group); } 
	/*
    		if (document.getElementById('URHere') != null) { 

				document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; Six-inch 2nd edition <a href=\"/os/6inch-ireland/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Ireland</a>, <a href=\"/os/6inch-2nd-and-later/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scotland</a>, <a href=\"/os/6inch-england-and-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales</a>, 1888-1915";  

			}
	*/
   		var map_group_keytext = overlaySelected.get('keytext');


 

	    var overlaylayerSelect = document.getElementById('overlaySelectdropdown');
	    for (var x = 0; x < overlayLayers.length; x++) {
	        // if (!baseLayers[x].displayInLayerSwitcher) continue;
//		 const titleArray[x] = overlayLayers[x].get('title').split('-');
	        var option = document.createElement('option');
		option.appendChild(document.createTextNode(overlayLayers[x].get('title').split(' - ')[1]));
//				option.appendChild(document.createTextNode(titleArray[x][1]));
	        option.setAttribute('value', x);
	        option.setAttribute('id', overlayLayers[x].get('title'));
	        overlaylayerSelect.appendChild(option);
	    }

		var sel = document.getElementById('overlaySelectdropdown');
		var val = overlaySelected.get('title');
			for(var i = 0, j = sel.options.length; i < j; ++i) {
				if(sel.options[i].id === val) {
				   sel.selectedIndex = i;
				   break;
				}
			}
	


/*
		var mapgroupno = map.getLayers().getArray()[4].get('group_no');
	
		if (mapgroupno !== '36')
	
		{
			jQuery("#gb1900search").hide();
		}

		else 

		{
			jQuery("#gb1900search").show();
		}


		var mapgroupno = map.getLayers().getArray()[4].get('group_no');
	
		if (mapgroupno == '70')
	
		{
			map.getView().setZoom(Math.round(12)); 
				setTimeout( function(){
						map.getView().setZoom(zoom); 
					}, 20); // delay 50 ms
		}
*/

		checkedinburghmap();

		checknumWFSFeatures();
		
	    opacity = mapslidervalue / 100;
	    map.getLayers().getArray()[4].setOpacity(opacity);
		
//			console.log("mapslidervalue: " + mapslidervalue);


		
	if (map.getLayers().getArray()[4].get('key') !== 'geo.nls.uk/maps/nokey.html')

			{ 	$("#exploremapkey").show(); }
		else
			{ 	$("#exploremapkey").hide(); }
		
	sixinchenglandwalesfirst();
	sixinchenglandwalessecond();
	
//	$("#map").focus();

}



function switchOverlayinitialRight() {
	


/*
			if (getOverlayRight(baseLayerName) == undefined) {
				overlaySelectedRight = overlayLayersRight[0];
			}
			else
			{
			var overlaySelectedRight = getOverlayRight(baseLayerName);
			}
*/

    	overlaySelectedRight.setVisible(true);


	    var e1Right = document.getElementById('overlaySelectNodeRight');
            var selNode1IndexRight = e1Right.options[e1Right.selectedIndex].value;
            var node1Right = overlayTreeRight.subnodes[selNode1IndexRight];
            var e2Right = document.getElementById('overlaySelectLayerRight');
            var selNode2IndexRight = e2Right.options[e2Right.selectedIndex].value;
            var selOverlayRight = node1Right.subnodes[selNode2IndexRight];
            //set switchers to permalink overlay
            if(selOverlayRight.layer!==overlaySelectedRight) {
                e1Right.options[overlaySelectedRight.overlayNodePath[0]].selected = true;
                loadOverlayNodeRight();
                e2Right.options[overlaySelectedRight.overlayNodePath[1]].selected = true;
                // switchOverlay();
            } 


    		map.getLayers().insertAt(2,overlaySelectedRight);

			
			var maprightTitle = map.getLayers().getArray()[2].get('title');
	

			
			if (maprightTitle.includes("Old Series"))  {
				osoneincholdseriesAllMaps.addGeoreferenceAnnotationByUrl(	'https://maps.nls.uk/geo/allmaps/old-series.json'
				)
			}
			
/*
			if (maprightTitle.includes("Land Cover")) 
			
			{ $("#landcoverkey").removeClass("hidden");
	        jQuery("#landcoverkey").show();
			}
			else
			{ 
	        jQuery("#landcoverkey").hide();
			}
			
			if (maprightTitle.includes("Light Pollution")) 
			
			{ $("#darkskieskey").removeClass("hidden");
	        jQuery("#darkskieskey").show();
			}
			else
			{ 
	        jQuery("#darkskieskey").hide();
			}

    	var map_group_right = overlaySelectedRight.get('group_no');
    		if (document.getElementById('URHereRight') != null) { setResultsRight(map_group_right); }
			
	checknumWFSFeaturesRight();

	sixinchenglandwalesfirstRight();
	sixinchenglandwalessecondRight();
	
*/
}



		
	var changeoverlay = function(index) {


	if (map.getLayers().getArray().length > 14)					
	if (map.getLayers().getArray()[14].get('title') == 'vectors - SixInchCount')	

	{ map.getLayers().removeAt(14); }

	if (map.getLayers().getArray().length > 13)					
	if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCount')	

	{ map.getLayers().removeAt(13); }
				
	if (map.getLayers().getArray().length > 12)					
	if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')	

	{ map.getLayers().removeAt(12); }



	jQuery('#showCoordinatesinfo').hide();

	 document.getElementById('wfsResults').innerHTML = "";
	if ((map.getLayers().getLength() > 6) && (map.getLayers().getArray()[6].getSource() !== null)) {map.getLayers().getArray()[6].getSource().clear();}


//	var overlayslength = map.getOverlays().getLength();
//	if (overlayslength > 0) {map.getOverlays().clear();}
	
	if (overlaylayer.getPosition() !== undefined)

		{ overlaylayer.setPosition(undefined); }

		map.getLayers().removeAt(4);

	    map.getLayers().insertAt(4,overlayLayers[index]);
		
		overlaySelected  = map.getLayers().getArray()[4];



		map.getLayers().getArray()[4].setOpacity(opacity);
    		var map_group = overlaySelected.get('group_no');
//   			if (document.getElementById('URHere') !== null) 
//				{ setResults1(map_group); } 
//				else 
//				{return; }
    			var map_group_keytext = overlaySelected.get('keytext');
			checkreuse();
			checktrenchmap();
			checkroymap();
			checkWidth();
			
			document.getElementById('wfsResults').innerHTML = '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';
		
			jQuery('#showLayersInfo').hide();	
			document.getElementById('showLayersInfo').innerHTML = '';
			
				if ($(window).width() < 850)
				{
				checkWFSmobile();
				}
				else
				{
				checkWFS();
				}
				
				
				checknumWFSFeatures();
				
//			checkedinburghmap();
			setZoomLayers();
			
			countynameold = '';
			
			sixinchenglandwalesfirst(); 
			sixinchenglandwalessecond(); 
     		updateUrl();

//		var centre = map.getView().getCenter();
//		var centre0 = centre[0] +1
//		var centre1 = centre[1] +1;

//		map.getView().setCenter([centre0, centre1]);


	
	
		 if (overlaySelected)
			 
		 
		 				if (overlaySelected instanceof ol.layer.Group)
		{
			map.getLayers().getArray()[4].getLayers().forEach(function(layer){
					layer.getSource().on('tileloadstart', function () {
					  progress.addLoading();
					});
			});
			map.getLayers().getArray()[4].getLayers().forEach(function(layer){			
					layer.getSource().on(['tileloadend', 'tileloaderror'], function () {
					  progress.addLoaded();
					});
			});

		}
		else
		{
	

		
			overlaySelected.getSource().on('tileloadstart', function () {
			  progress.addLoading();
			});
			overlaySelected.getSource().on(['tileloadend', 'tileloaderror'], function () {
			  progress.addLoaded();
			});

		}
/*
			var zoom = map.getView().getZoom();
			var oSzoom = overlay.layer.get('maxZ');

			if (map_group == '70')
		
			{ 
			map.getView().setZoom(oSzoom); 
			map.getLayers().getArray()[4].getLayers().forEach(function(layer){
					layer.getSource().refresh();
					});	
				setTimeout( function(){
						map.getView().setZoom(zoom); 
					}, 2000); // delay 50 ms
			}
*/
 
 	if (map.getLayers().getArray()[4].get('key') !== 'geo.nls.uk/maps/nokey.html')

			{ 	$("#exploremapkey").show(); }
		else
			{ 	$("#exploremapkey").hide(); }



}


function switchOverlay() {


	if (map.getLayers().getArray().length > 14)					
	if (map.getLayers().getArray()[14].get('title') == 'vectors - SixInchCount')	

	{ map.getLayers().removeAt(14); }

	if (map.getLayers().getArray().length > 13)					
	if (map.getLayers().getArray()[13].get('title') == 'vectors - SixInchCount')	

	{ map.getLayers().removeAt(13); }
				
	if (map.getLayers().getArray().length > 12)					
	if (map.getLayers().getArray()[12].get('title') == 'vectors - SixInchCount')	

	{ map.getLayers().removeAt(12); }

	jQuery('#editallmaps').hide();

	jQuery('#showCoordinatesinfo').hide();

	 document.getElementById('wfsResults').innerHTML = "";
	if ((map.getLayers().getLength() > 6) && (map.getLayers().getArray()[6].getSource() !== null)) {map.getLayers().getArray()[6].getSource().clear();}


//	var overlayslength = map.getOverlays().getLength();
//	if (overlayslength > 0) {map.getOverlays().clear();}
	
	if (overlaylayer.getPosition() !== undefined)

		{ overlaylayer.setPosition(undefined); }

	map.getLayers().removeAt(4);


	if (document.getElementById('overlaySelectNode').length !=0) {
    		var e1 = document.getElementById('overlaySelectNode');
    		var selNode1Index = e1.options[e1.selectedIndex].value;
    		var node1 = overlayTree.subnodes[selNode1Index];
    		var e2 = document.getElementById('overlaySelectLayer');
    		var selNode2Index = e2.options[e2.selectedIndex].value;
    		overlay = node1.subnodes[selNode2Index];

			overlaySelected = overlay.layer;






			map.getLayers().insertAt(4,overlay.layer);
			

/*
			var zoom = map.getView().getZoom();
			var oSzoom = overlaySelected.get('maxZ');
		
			if (zoom > oSzoom)
		
			{ 
			map.getView().setZoom(Math.round(oSzoom)); 
				setTimeout( function(){
						map.getView().setZoom(zoom); 
					}, 20); // delay 50 ms
			}
*/

			if (overlaySelected.get('title').includes("Google"))  {
				jQuery("#googleexplore").removeClass('hidden');
				jQuery("#googleexplore").show();
			}
			else
			{ 
				jQuery("#googleexplore").hide();
			}


			if (overlaySelected.get('title').includes("Old Series"))  {		
			
			osoneincholdseriesAllMaps.removeGeoreferenceAnnotationByUrl('https://maps.nls.uk/geo/allmaps/old-series.json')
			
			
				setTimeout( function(){
								osoneincholdseriesAllMaps.addGeoreferenceAnnotationByUrl(	'https://maps.nls.uk/geo/allmaps/old-series.json'
								)
				}, 200); // delay 50 ms
			}

		map.getLayers().getArray()[4].setOpacity(opacity);
    		var map_group = overlay.layer.get('group_no');
    			if (document.getElementById('URHere') !== null) 
				{ setResults1(map_group); } 
				else 
				{return; }
    			var map_group_keytext = overlay.layer.get('keytext');
			checkreuse();
			checktrenchmap();
			checkroymap();
			


	

			
			document.getElementById('wfsResults').innerHTML = '&nbsp;<a href="javascript:switchWFSON();" alt="Show specific details of map under mouse cursor" title="Show specific details of map under mouse cursor">Display map details? / View or order this map?</a>&nbsp;';
		
			jQuery('#showLayersInfo').hide();	
			document.getElementById('showLayersInfo').innerHTML = '';
			
				if ($(window).width() < 850)
				{
				checkWFSmobile();
				}
				else
				{
				checkWFS();
				}
				
				
				checknumWFSFeatures();
				
//			checkedinburghmap();
			setZoomLayers();
			
			countynameold = '';
			
			sixinchenglandwalesfirst(); 
			sixinchenglandwalessecond(); 
    		updateUrl();

			checkWidth();

//		var centre = map.getView().getCenter();
//		var centre0 = centre[0] +1
//		var centre1 = centre[1] +1;

//		map.getView().setCenter([centre0, centre1]);


	}
	
	if (!(overlaySelected.get('title').includes("Old Series")))
	
	{
		
		if (!(overlaySelected.get('title').includes("Allmaps")))
		
			{
	
				 if (overlaySelected)
					 
				 
				 if (overlaySelected instanceof ol.layer.Group)
				{
					

					map.getLayers().getArray()[4].getLayers().forEach(function(layer){
							layer.getSource().on('tileloadstart', function () {
							  progress.addLoading();
							});
					});
					map.getLayers().getArray()[4].getLayers().forEach(function(layer){			
							layer.getSource().on(['tileloadend', 'tileloaderror'], function () {
							  progress.addLoaded();
							});
					});
					

			}
				
		
		}
		else
		{
	
		if (!(overlaySelected.get('title').includes("Allmaps")))
		
			{
		
				overlaySelected.getSource().on('tileloadstart', function () {
				  progress.addLoading();
				});
				overlaySelected.getSource().on(['tileloadend', 'tileloaderror'], function () {
				  progress.addLoaded();
				});
			
				if ( windowWidth = $(window).width() > 850)
											
				{
				jQuery("#editallmaps").show();
				}
				

			
			}

		}


		
	}
/*
			var zoom = map.getView().getZoom();
			var oSzoom = overlay.layer.get('maxZ');

			if (map_group == '70')
		
			{ 
			map.getView().setZoom(oSzoom); 
			map.getLayers().getArray()[4].getLayers().forEach(function(layer){
					layer.getSource().refresh();
					});	
				setTimeout( function(){
						map.getView().setZoom(zoom); 
					}, 2000); // delay 50 ms
			}
*/
 
 	if (map.getLayers().getArray()[4].get('key') !== 'geo.nls.uk/maps/nokey.html')

			{ 	$("#exploremapkey").show(); }
		else
			{ 	$("#exploremapkey").hide(); }

	$("#map").focus();

}

function switchOverlayRight() {
	

		
	
//	document.getElementById('wfsResultsright').innerHTML = "";
//	if ((mapright.getLayers().getLength() > 2) && (mapright.getLayers().getArray()[2].getSource() !== null)) {mapright.getLayers().getArray()[2].getSource().clear();}

	// if (overlay) overlay.layer.setVisible(false);
	// if (mapright.getLayers().getLength() == 3) mapright.getLayers().removeAt(2);
	// if (mapright.getLayers().getLength() == 2) mapright.getLayers().removeAt(1);
	map.getLayers().removeAt(2);

	if (document.getElementById('overlaySelectNodeRight').length !=0) {
    		var e1R = document.getElementById('overlaySelectNodeRight');
    		var selNode1Index = e1R.options[e1R.selectedIndex].value;
    		var node1Right = overlayTreeRight.subnodes[selNode1Index];
    		var e2R = document.getElementById('overlaySelectLayerRight');
    		var selNode2Index = e2R.options[e2R.selectedIndex].value;
    		overlayRight = node1Right.subnodes[selNode2Index];
    		overlayRight.layer.setVisible(true);
    		map.getLayers().insertAt(2,overlayRight.layer);
			
			overlaySelectedRight = overlayRight.layer;
			
			var mapRightTitle = map.getLayers().getArray()[2].get('title');
			
			if (mapRightTitle.includes("Google"))  {

				jQuery("#googleexplore").removeClass('hidden');
				jQuery("#googleexplore").show();
			}
			else
			{ 
				jQuery("#googleexplore").hide();
			}
			
			
			if (mapRightTitle.includes("Old Series"))  {
				
				
				osoneincholdseriesAllMaps.removeGeoreferenceAnnotationByUrl('https://maps.nls.uk/geo/allmaps/old-series.json')
			
			
				setTimeout( function(){
								osoneincholdseriesAllMaps.addGeoreferenceAnnotationByUrl(	'https://maps.nls.uk/geo/allmaps/old-series.json'
								)
				}, 200); // delay 50 ms
				
			}
			
	   	updateUrl();
		
		
//		setZoomLayersRight();
//		setZoomLayersRightOS();
		
//		checknumWFSFeaturesRight();

//		checkWFSRight();

//	countynameoldRight = '';
	
//	sixinchenglandwalesfirstRight();
	
//	sixinchenglandwalessecondRight();

//		var zoom = mapright.getView().getZoom();
//		var oSzoom = overlayRight.layer.get('maxZ');
/*	
		if (zoom > oSzoom)
	
		{ 
		mapright.getView().setZoom(Math.round(oSzoom)); 
			setTimeout( function(){
					mapright.getView().setZoom(Math.round(zoom)); 
				}, 20); // delay 50 ms
		}


		var map_group_right = overlayRight.layer.get('group_no');
		   if (document.getElementById('URHereRight') !== null) 
				{ setResultsRight(map_group_right); } 
				else 
				{return; }

		checkWidth();

			var maprightTitle = mapright.getLayers().getArray()[0].get('title');
	
			if (maprightTitle.includes("Bing"))  {
		
					setTimeout( function(){
						R_BingWorldPlaceholder.setSource(BingWorldWorldPlaceholderSource);
					}, 2000); // delay 50 ms
		
			}


			if (maprightTitle.includes("Land Cover")) 
			
			{ $("#landcoverkey").removeClass("hidden");
	        jQuery("#landcoverkey").show();
			}
			else
			{ 
	        jQuery("#landcoverkey").hide();
			}
			
			if (maprightTitle.includes("Light Pollution")) 
			
			{ $("#darkskieskey").removeClass("hidden");
	        jQuery("#darkskieskey").show();
			}
			else
			{ 
	        jQuery("#darkskieskey").hide();
			}
			
			*/
	}
}

function switchOverlayUpdateModeSingle() { 


document.getElementById("overlaySelectdropdown").innerHTML = null;

if (overlayLayers.length > 0)
	
	{
		
			if ($("input[type='radio'][name='sort']:checked").val() == 'relevance')
				
			{
				
				console.log("sorting by relevance");

				overlayLayers.sort(function(a, b){
				   var nameA=a.get('relevance'), nameB=b.get('relevance')
				   if (nameA > nameB) //sort string ascending
					   return -1 
				   if (nameA < nameB)
					   return 1
				   return 0 //default return value (no sorting)

				})
				
			}
		
			else if ($("input[type='radio'][name='sort']:checked").val() == 'scale')
			
			{

				overlayLayers.sort(function(a, b){
				//   var nameA=a.get('mindate'), nameB=b.get('mindate')
				   var nameA=a.get('maxZ'), nameB=b.get('maxZ')
				   if (nameA > nameB) //sort string ascending
					   return -1 
				   if (nameA < nameB)
					   return 1
				   return 0 //default return value (no sorting)

				})
				
			}
			
			else if ($("input[type='radio'][name='sort']:checked").val() == 'date')
				
			{

				overlayLayers.sort(function(a, b){
				   var nameA=a.get('mindate'), nameB=b.get('mindate')
				   if (nameA < nameB) //sort string ascending
					   return -1 
				   if (nameA > nameB)
					   return 1
				   return 0 //default return value (no sorting)

				})
				
			}
			


	    var overlaylayerSelect = document.getElementById('overlaySelectdropdown');
	    for (var x = 0; x < overlayLayers.length; x++) {
	        var option = document.createElement('option');
			option.appendChild(document.createTextNode(overlayLayers[x].get('title').replace('Scotland, ', '')));
//		option.appendChild(document.createTextNode(overlayLayers[x].get('title').split(' - ')[1]));
	        option.setAttribute('value', x);
	        option.setAttribute('id', overlayLayers[x].get('title'));
	        overlaylayerSelect.appendChild(option);
	    }

			var layerIsInSelection = false;
		  for (var i = 0; i < overlayLayers.length; i++) {
//				if (overlayLayers[i].get('title') === map.getLayers().getArray()[4].get('title')){
				if (overlayLayers[i].get('title') === overlayOldName){
					
					

				var sel = document.getElementById('overlaySelectdropdown');
				var val = map.getLayers().getArray()[4].get('title');
					for(var i = 0, j = sel.options.length; i < j; ++i) {
						if(sel.options[i].id === val) {
						   sel.selectedIndex = i;
					   
//						   console.log("sel.selectedIndex: " + sel.selectedIndex);


						}
					}
							layerIsInSelection = true;
				}
				else
				{

//							changeoverlay(0);
				}

		  }
		  
		  if (!layerIsInSelection) {
			  changeoverlay(0);
		  }
		  
        }
	

	
	else 
				{
					
				updateSelectwithOverlay();


				}
	
}

function updateSelectwithOverlay() {

				var sel = document.getElementById('overlaySelectdropdown');
				var val = overlayLayers[0].get('title');
					for(var i = 0, j = sel.options.length; i < j; ++i) {
						if(sel.options[i].id === val) {
						   sel.selectedIndex = i;
						   break;
						}
					}
//				overlaySelected = overlayLayers[0];
				map.getLayers().removeAt(4);
				map.getLayers().insertAt(4,overlayLayers[0]);
				updateUrl();
}







function switchOverlayUpdateMode() { 
  var titleArray = overlayOldName.split('-'); 
  // var titleArray = overlayOldName.get('title').split('-');      
  var title1 = jQuery.trim(titleArray.shift());
  var title2 = jQuery.trim(titleArray.join('-'));
  var layerIsInSelection = false;
  for (var i = 0; i < overlayLayers.length; i++) {
    if (overlayLayers[i].get('title') === overlayOldName) {
      var e1 = document.getElementById('overlaySelectNode');
      for (var ii = 0 ; ii < e1.options.length; ii++) {
        if (e1.options[ii].text === title1) {
          e1.value = ii;
        }
      }
      loadOverlayNode();
      var e2 = document.getElementById('overlaySelectLayer');
      for (var ii = 0 ; ii < e2.options.length; ii++) {
        if (e2.options[ii].text === title2) {
          e2.value = ii;
        }
      }
      layerIsInSelection = true;
    }
  }
  
   if (!layerIsInSelection) 
	{

			jQuery('#showCoordinatesinfo').show();
			
			$("#showCoordinatesinfo").css({ 'text-align': 'center' });
				$("#showCoordinatesinfo").css({ 'min-width': '250px' });
			document.getElementById('showCoordinatesinfo').innerHTML = "Switched to show more detailed overlay layer.<br/>Uncheck 'Only show more detailed maps than the current zoom level' to stop this.";

			setTimeout( function(){
	       			document.getElementById('showCoordinatesinfo').innerHTML = '';
				jQuery('#showCoordinatesinfo').hide();
			}, 1000); // delay 50 ms
	switchOverlay();
	}
   else
	{
//	switchOverlay();
	}
}


function switchOverlayUpdateModeRight() { 
  var titleArray = overlayOldNameRight.split('-'); 
  // var titleArray = overlayOldName.get('title').split('-');      
  var title1 = jQuery.trim(titleArray.shift());
  var title2 = jQuery.trim(titleArray.join('-'));
  var layerIsInSelection = false;
  for (var i = 0; i < overlayLayersRight.length; i++) {
    if (overlayLayersRight[i].name === overlayOldNameRight) {
      var e1 = document.getElementById('overlaySelectNodeRight');
      for (var ii = 0 ; ii < e1R.options.length; ii++) {
        if (e1R.options[ii].text === title1) {
          e1R.value = ii;
        }
      }
      loadOverlayNodeRight();
      var e2R = document.getElementById('overlaySelectLayerRight');
      for (var ii = 0 ; ii < e2R.options.length; ii++) {
        if (e2R.options[ii].text === title2) {
          e2R.value = ii;
        }
      }
      layerIsInSelection = true;
    }
  }
    // if (!layerIsInSelection) switchOverlay();
}


// Return direct subnode from given tree
function getNode(tree, nodeTitle) {
    if(tree.subnodes) {
        for(var i = 0; i < tree.subnodes.length; i++) {
            if(tree.subnodes[i].title==nodeTitle) {
                return tree.subnodes[i];
            }
        }
    }
    return false;
};

// Add given node to given tree
function addNode(tree, nodeToAdd) {
    var existingNode = getNode(tree, nodeToAdd.title);
    if(existingNode && nodeToAdd.subnodes) {
        for(var i = 0; i < nodeToAdd.subnodes.length; i++) {
            addNode(existingNode, nodeToAdd.subnodes[i]);
        }
    } else {
        tree.subnodes.push(nodeToAdd);
    }
};



// Load overlay layers of current node
function loadOverlayNode() {
    var e1 = document.getElementById('overlaySelectNode');
    var e2 = document.getElementById('overlaySelectLayer');    
    while (e2.hasChildNodes()) {
      e2.removeChild(e2.lastChild);
    }
    if (e1.length != 0) {
      var selNodeIndex = e1.options[e1.selectedIndex].value;
      var node1 = overlayTree.subnodes[selNodeIndex]; 

      for(var i2 = 0; i2 < node1.subnodes.length; i2++) {
        var node2 = node1.subnodes[i2];
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(node2.title));
        option.setAttribute('value', i2);
        option.setAttribute('id', node2.title);
        e2.appendChild(option);
      }
    }
}

function loadOverlayNodeRight() {
    var e1R = document.getElementById('overlaySelectNodeRight');
    var e2R = document.getElementById('overlaySelectLayerRight');    
    while (e2R.hasChildNodes()) {
      e2R.removeChild(e2R.lastChild);
    }
    if (e1R.length != 0) {
      var selNodeIndex = e1R.options[e1R.selectedIndex].value;
      var node1Right = overlayTreeRight.subnodes[selNodeIndex]; 

      for(var i2R = 0; i2R < node1Right.subnodes.length; i2R++) {
        var node2Right = node1Right.subnodes[i2R];
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(node2Right.title));
        option.setAttribute('value', i2R);
        option.setAttribute('id', node2Right.title);
        e2R.appendChild(option);
      }
    }
}


// IE7- do not support Array.indexOf
function indexOf(array, item) {
    for(var i=0; i<array.length; i++) {
        if(array[i]==item) {
            return i;
        }
    }
    return null;
}



/*var exportPNGElement = document.getElementById('export-png');
*
*if ('download' in exportPNGElement) {
*  exportPNGElement.addEventListener('click', function(e) {
*    map.once('postcompose', function(event) {
*      var canvas = event.context.canvas;
*      exportPNGElement.href = canvas.toDataURL('image/png');
*    });
*    map.renderSync();
*  }, false);
*} else {
*  var info = document.getElementById('no-download');
*  info.style.display = '';
*}
*/

// setHeader();


function setHeader() {


	        var extent = map.getView().calculateExtent(map.getSize());
	      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
		var great_britain_extent = [-9.0, 49.9, 1.84, 60.9];
		var scotland_extent = [-9.0, 55.0, -1.4, 60.9];
		var england_extent = [-6.5, 49.8, 1.9, 55.0];


		var zoom = map.getView().getZoom();
        	var centre = [];
		centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");

		// console.log(centre);

        	// transformed_coordinate27700 = [];
		var transformed_coordinate27700 = ol.proj.transform(centre,"EPSG:4326", "EPSG:27700");

		var transformed_coordinate27700point = transformed_coordinate27700[0] + '%20' + transformed_coordinate27700[1];


	      var invisiblestyle = new ol.style.Style({
		    	fill: new ol.style.Fill({
				color: 'rgba(0, 0, 0, 0)'
	                    }),
	                });

	      var urlgeoservercounty =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
				'&version=1.1.0&request=GetFeature&typename=nls:Britain_Counties' +
				'&PropertyName=COUNTY&outputFormat=text/javascript&format_options=callback:parish' +
				'&srsname=EPSG:3857&cql_filter=INTERSECTS(the_geom,POINT(' 
				+ transformed_coordinate27700point + '))'; 

	      var urlgeoserverparish =  'https://geoserver.nls.uk/geoserver/wfs?service=WFS' + 
				'&version=1.1.0&request=GetFeature&typename=nls:Scot_Eng_Wales_1950s_parish' +
				'&PropertyName=PARISH&outputFormat=text/javascript&format_options=callback:parish' +
				'&srsname=EPSG:3857&cql_filter=INTERSECTS(the_geom,POINT(' 
				+ transformed_coordinate27700point + '))'; 

		var geojsonFormat = new ol.format.GeoJSON();
		
		if (zoom < 12)
	
		{

			var vectorSource2 = new ol.source.Vector({
			  loader: function(extent, resolution, projection) {
				var url = urlgeoservercounty
		    	$.ajax({url: url,  dataType: 'jsonp', cache: false, timeout: 8000,  jsonp: false})
			  },
			  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
			    maxZoom: 19
			  }))
			});

		}
	
		else

		{

			var vectorSource2 = new ol.source.Vector({
			  loader: function(extent, resolution, projection) {
				var url = urlgeoserverparish
		    	$.ajax({url: url,  dataType: 'jsonp', cache: false, timeout: 8000,  jsonp: false})
			  },
			  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
			    maxZoom: 19
			  }))
			});

		}

		featuresALLheader = [];

		window.parish = function(response) {
		  vectorSource2.addFeatures(geojsonFormat.readFeatures(response));


		featuresALLheader = response.features;


		if ((zoom < 8) && (ol.extent.containsXY(great_britain_extent, centre[0], centre[1])))
			{ placename = "of Great Britain"; }
		else if ((zoom > 7) && (zoom < 10) && (ol.extent.containsXY(scotland_extent, centre[0], centre[1])))
			{ placename = "of Scotland"; }
		else if ((zoom > 7) && (zoom < 10) && (ol.extent.containsXY(england_extent, centre[0], centre[1])))
			{ placename = "of England and Wales"; }
		else if ((zoom > 9) && (zoom < 12) && (featuresALLheader.length > 0))
			{ placename = "of " + featuresALLheader[0].properties.COUNTY; }
		else if ((zoom > 11) && (featuresALLheader.length > 0))
			{ placename = "of " + featuresALLheader[0].properties.PARISH; }
		else 
			{ placename = ""; }
		//	console.log(placename);
		    var str = "Georeferenced Maps " + placename + " - Map images - National Library of Scotland";
		    document.title = str;

		};


	            var vectorLayer2 = new ol.layer.Vector({
	  		title: "vectors - vectors",
	                source: vectorSource2,
			style: invisiblestyle
	            });

		var maplayerlength = map.getLayers().getLength();
		map.getLayers().insertAt(7,vectorLayer2);


}




function setResults(str) {
    if (!str) str = "<br/><p id=\"noMapsSelected\">None</p>";
    document.getElementById('results').innerHTML = str;
}

function loadurl(value) {
	
	if (value == 'Add XYZ or Allmaps URL...') {
      alert('Please add an XYZ or Allmaps URL into the box');
      return;
    }
	

	else if (value.includes('allmaps'))

			{ 
			addAllmaps(value);
			return;
			}
	else if (value.includes('{z}'))

			{ 
			addxyz(value);
			return;
			}			
			
}

// Function to transform from BNG (EPSG:27700) to map projection (EPSG:3857)
  function transformBngToMap(easting, northing) {
    return proj4('EPSG:27700', 'EPSG:3857', [easting, northing]);
  }



document.getElementById('importVector').addEventListener('click', function() {




    const input = document.getElementById('importFile');
    const file = input.files[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }
	
//        vector_import_source.clear();

		$("#loading").show();
		
	remove_marker();
    const extension = file.name.split('.').pop().toLowerCase();

setTimeout(() => {


	
	if (extension === 'csv') {
		
	
			// Parse CSV with headers to access columns by name

				Papa.parse(file, {
				  header: true,
				  skipEmptyLines: true,
//				  complete: function(results) {
				  complete: async function(results) {
					console.log('Parsed data:', results.data);
					if (!results.data || !Array.isArray(results.data)) {
					  alert('No data found in CSV file.');
					  return;
					}
					const features = [];

					// Detect easting and northing keys (case-insensitive)
					const firstRow = results.data[0];
					const featurePromises = results.data.map(async (row, index) => {
						
//					results.data.forEach((row, index) => {

					// Copy all properties as attributes except geometry properties
					const eastingKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'easting');
					const northingKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'northing');

					  
					let latKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'latitude');
					let lonKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'longitude');
					
					let NGRKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'gridref');		

					let postcodeKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'postcode');							

					let wktKey = Object.keys(firstRow).find(k => k.toLowerCase() === 'wkt');
					

					
					let geom = null;


						if (wktKey && row[wktKey]) {
						  try {
							const wktFormat = new ol.format.WKT();
							// readFeature takes dataProjection and featureProjection for reprojection
							const feature = wktFormat.readFeature(row[wktKey], {
							  dataProjection: 'EPSG:4326',
							  featureProjection: 'EPSG:3857'
							});
							
								geom = feature.getGeometry();

							  } catch (e) {
								console.warn(`Row ${index} has invalid WKT:`, row[wktKey]);
							  }
							}
							if (latKey && lonKey) {
								try {
							const lat = parseFloat(row[latKey]);
							const lon = parseFloat(row[lonKey]);
								if (!isNaN(lat) && !isNaN(lon)) {
								  geom = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
								}
								} catch (err) {
								  // Log the lookup error, but continue processing
								  console.warn(`Row ${index} - lat lookup failed: ${row[latKey]}, error: ${err}`);
								}
							}
							else if (eastingKey && northingKey) {
								try {
								const easting = parseFloat(row[eastingKey]);
								const northing = parseFloat(row[northingKey]);
								if (!isNaN(easting) && !isNaN(northing)) {
								const coords = transformBngToMap(easting, northing);
								geom = new ol.geom.Point(coords);
								}
								} catch (err) {
								  // Log the lookup error, but continue processing
								  console.warn(`Row ${index} - easting/northing lookup failed: ${row[eastingKey]}, error: ${err}`);
								}
							}
							else if (NGRKey) {
								try {
							//	const NGR = parseFloat(row[NGRKey]);
								const osgbnum = gridreference(row[NGRKey]);
								if (!isNaN(osgbnum[0]) && !isNaN(osgbnum[1])) {
								const coords = transformBngToMap(parseFloat(osgbnum[0]), parseFloat(osgbnum[1]));
								geom = new ol.geom.Point(coords);
								}
								} catch (err) {
								  // Log the lookup error, but continue processing
								  console.warn(`Row ${index} - NGR lookup failed: ${row[NGRKey]}, error: ${err}`);
								}
							}
	
							  else if (postcodeKey) {
								try {
								  // Await the async postcode lookup
								  const postcodenum = await postcodecsv(row[postcodeKey]);
								  console.log("postcodenum: " + postcodenum);
								  const lat = parseFloat(postcodenum[1]);
								  const lon = parseFloat(postcodenum[0]);
								  if (!isNaN(lon) && !isNaN(lat)) {
									geom = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
								  }
								} catch (err) {
								  // Log the lookup error, but continue processing
								  console.warn(`Row ${index} - postcode lookup failed: ${row[postcodeKey]}, error: ${err}`);
								}
							  }

							
					if (geom) {		
						hasGeometry = true;  // Mark that at least one geometry was found
						const properties = {...row};
						const feature = new ol.Feature({geometry: geom});
						feature.setProperties(properties);
						return feature; // Instead of features.push(feature) inside the map
					  } else {
						console.warn(`Row ${index} has invalid coordinates`, row);

					  }					

		
					});


						// Await all promises so all features are created before adding to source
					const createdFeatures = await Promise.all(featurePromises);
					
					if (!hasGeometry) {
					  alert('CSV file contains no usable geometry data. Please check that your columns include one of \'wkt\', \'easting/northing\', \'gridref\', \'postocde\', or \'latitude/longitude\'.');
					  return; // Stop further processing if no geometry
					}

					const validFeatures = createdFeatures.filter(f => f);
					validFeatures.forEach(f => features.push(f));


					// Only add valid features
//					createdFeatures.forEach(f => { if (f) features.push(f); });			

							featuresCountOld = featuresCount;

						if (vector_import_source.getFeatures().length > 0)
						{
						featuresCount = Math.round(featuresCountOld) + 1;							

								
						if (featuresCount == 1)	

						{
							
							
									// vFeatures = vector_import_source.getFeatures();
									features.forEach(function(f) {
										


											
										f.setStyle(new ol.style.Style({
								/*
												image : new ol.style.Icon({
													src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS2SURBVFiF3VhbTBxVGP7+szPscmkq1FZqE2pvUYvYwpK0SUla0ib0iaf6oD6a+qDxoUlNvMTthZp4ifHBB22M8ZI0jVCqVk0gbeOKxAsJpAG3ENiBxdiWSypQdmd3Znbm9wGaCAKzc2b3Qb/HOf/3ff835+TMmQP8j0D5FjxwYGhdJlN0lIibmbEbwGYAGwDcBXCbmW8KIa6k0+mOWKw6mU/vvIWpqRkvV9XsK0R4CUBxDhQdwAe2Ld66cWPbbD56yEuY+vrRY8x8HkCFBP0vZhzv69tx2W8fwh+dKRzWIszcCrkgAFBBhEvhcPwNgH29XF9h6upGIwDOwP8ME0Bnw2HtdZ8iclhcWq1+NFaAw8zH+vp2fiVDlmpk796xBwIBR4P80loLM6ap7BgY2DrjlSi1zBSFX0NhggBAeVFR9mUZoueZWfiOqJPIbfuVhZ7JZB7y+h1SvLpkMkVHAXYNEgoJvaVlY09DQ8l2VaVKy+KJri59NBKZ2mcYrvyS4uJQE4B2L715XmZE3OxWEwoJvaNj62hjY+khVaUqAEWqSlWHD5ce6uzcGg8GKe2mwUyuPsvhOQwzHneraWnZ2FNWRk+sNFZWJmrOnNn0m5sGEe/22pvMBvCwW0FDQ8n2tcYPHizZ5qbBzK4+yyETZoNbgapSpZ/xBdCDube0AIkwNO9WYVk8sfY47uRgdC/nlhYhEYYn3Sq6uvTRtcaj0VQiB6M1X8hKkFlmPW4FkcjUvmTSGVhpbH7eGTh1amq/mwazu89yyGzNP7jVGAYXNzWN77x2LRW1LB4HYFoWj1+9moo2NY3vMk0OuTYmKOq5N6+E6upYWSgU+hPAeq9cD5izrNIt/f2VKS8kzzMTi1UnifCpV55HfOI1CCB50DQM5SyAKRluDpgyTeWcDFEqzOLx/IQMNweckDn+Az5/rMJh7QKAZ/xoLIV9cXr6yItCiGCQudggCqrMlLWFCgBKwLGyQjhElC4yjFTNrVuzbYB9n+03zHoANwA84isDAGZ9Njl7/LzjTGRy55BNjIQi+KehRCLh+5c3HNYaAEQBBORVmPXU+19Yme8TsgJZ4HOftzNAb++ObgDv+NGwzO5uH0EAgAKOs8V3GABYt+6PCADXY/1KYGf6Tjr59o9+/B3AsYXQ8hImGm3MAs6zAFwPoUthWXrq3XbmtO1euwqYTQoELicSiYm8hAGA3t5dGjOf9MIxMt92ZM3eu5KWzMBg0LY/0jTtd6AAF+fhsNYK4Cm3OierDc3PPf+lhEWamfuhKL2api35cHu+0HBH9gVm+whRsHy1Cnb0VDJ57rtcFZkpC+I4CxGrqqoajEaj2ZXq8j4zAFBb+0uzEJu+XkWfM6kPLxqZSyNraTCTJeCMkRAxJxAYisfjhptvQcIAQG1t9wUhNv/rdGCZPb/q8692rkJLg2hUAMNqSclgLBYzvXgWYJktYGbGeq6iYq6BaH3V/WeOMzOdTr55/Z91DOhgHlGEuPlkfX28ra1Nemcr2MwAQF3dlf1Ej3UBARWwbf3e6Y8t6+dJAHMgigeA4afHxkZOA04+/AoaBgD27PmmRVEePWka19sN/b3PoCiDw8PDtwFwob3/0/gbh/Lm30zcQi4AAAAASUVORK5CYII=",
													scale: 1.1875,       // scale the image if you want
													anchor: [51, 38], 
												}),
								*/
												image : new ol.style.Icon({
														  src : "https://maps.nls.uk/geo/img/blue-marker.png",
														  size : [51, 51],
												}),
						
												stroke : new ol.style.Stroke({
														  color : "#000cff",
														  width : 7
												}),
												fill : new ol.style.Fill({
														  color : "rgba(152, 237, 255, 0.2)"
												}),
												text : new ol.style.Text({
														 font : "16px Sans",
														 textAlign : "left",
														 fill : new ol.style.Fill({
															 color : "rgba(255, 255, 255, 1)"
														 }),
														 stroke : new ol.style.Stroke({
															 color : "rgba(0, 0, 0, 1)",
															 width : 2
														 })
													})
												})
										  );
										  
									});
									
							}
							else

							{
							
							
									// vFeatures = vector_import_source.getFeatures();
									features.forEach(function(f) {
										


											
										f.setStyle(new ol.style.Style({
								/*
												image : new ol.style.Icon({
													src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAS2SURBVFiF3VhbTBxVGP7+szPscmkq1FZqE2pvUYvYwpK0SUla0ib0iaf6oD6a+qDxoUlNvMTthZp4ifHBB22M8ZI0jVCqVk0gbeOKxAsJpAG3ENiBxdiWSypQdmd3Znbm9wGaCAKzc2b3Qb/HOf/3ff835+TMmQP8j0D5FjxwYGhdJlN0lIibmbEbwGYAGwDcBXCbmW8KIa6k0+mOWKw6mU/vvIWpqRkvV9XsK0R4CUBxDhQdwAe2Ld66cWPbbD56yEuY+vrRY8x8HkCFBP0vZhzv69tx2W8fwh+dKRzWIszcCrkgAFBBhEvhcPwNgH29XF9h6upGIwDOwP8ME0Bnw2HtdZ8iclhcWq1+NFaAw8zH+vp2fiVDlmpk796xBwIBR4P80loLM6ap7BgY2DrjlSi1zBSFX0NhggBAeVFR9mUZoueZWfiOqJPIbfuVhZ7JZB7y+h1SvLpkMkVHAXYNEgoJvaVlY09DQ8l2VaVKy+KJri59NBKZ2mcYrvyS4uJQE4B2L715XmZE3OxWEwoJvaNj62hjY+khVaUqAEWqSlWHD5ce6uzcGg8GKe2mwUyuPsvhOQwzHneraWnZ2FNWRk+sNFZWJmrOnNn0m5sGEe/22pvMBvCwW0FDQ8n2tcYPHizZ5qbBzK4+yyETZoNbgapSpZ/xBdCDube0AIkwNO9WYVk8sfY47uRgdC/nlhYhEYYn3Sq6uvTRtcaj0VQiB6M1X8hKkFlmPW4FkcjUvmTSGVhpbH7eGTh1amq/mwazu89yyGzNP7jVGAYXNzWN77x2LRW1LB4HYFoWj1+9moo2NY3vMk0OuTYmKOq5N6+E6upYWSgU+hPAeq9cD5izrNIt/f2VKS8kzzMTi1UnifCpV55HfOI1CCB50DQM5SyAKRluDpgyTeWcDFEqzOLx/IQMNweckDn+Az5/rMJh7QKAZ/xoLIV9cXr6yItCiGCQudggCqrMlLWFCgBKwLGyQjhElC4yjFTNrVuzbYB9n+03zHoANwA84isDAGZ9Njl7/LzjTGRy55BNjIQi+KehRCLh+5c3HNYaAEQBBORVmPXU+19Yme8TsgJZ4HOftzNAb++ObgDv+NGwzO5uH0EAgAKOs8V3GABYt+6PCADXY/1KYGf6Tjr59o9+/B3AsYXQ8hImGm3MAs6zAFwPoUthWXrq3XbmtO1euwqYTQoELicSiYm8hAGA3t5dGjOf9MIxMt92ZM3eu5KWzMBg0LY/0jTtd6AAF+fhsNYK4Cm3OierDc3PPf+lhEWamfuhKL2api35cHu+0HBH9gVm+whRsHy1Cnb0VDJ57rtcFZkpC+I4CxGrqqoajEaj2ZXq8j4zAFBb+0uzEJu+XkWfM6kPLxqZSyNraTCTJeCMkRAxJxAYisfjhptvQcIAQG1t9wUhNv/rdGCZPb/q8692rkJLg2hUAMNqSclgLBYzvXgWYJktYGbGeq6iYq6BaH3V/WeOMzOdTr55/Z91DOhgHlGEuPlkfX28ra1Nemcr2MwAQF3dlf1Ej3UBARWwbf3e6Y8t6+dJAHMgigeA4afHxkZOA04+/AoaBgD27PmmRVEePWka19sN/b3PoCiDw8PDtwFwob3/0/gbh/Lm30zcQi4AAAAASUVORK5CYII=",
													scale: 1.1875,       // scale the image if you want
													anchor: [51, 38], 
												}),
								*/
												image : new ol.style.Icon({
														  src : "https://maps.nls.uk/geo/img/green-marker.png",
														  size : [51, 51],
												}),
						
												stroke : new ol.style.Stroke({
														  color : "#00ff2a",
														  width : 7
												}),
												fill : new ol.style.Fill({
														  color : "rgba(29, 239, 64, 0.2)"
												}),
												text : new ol.style.Text({
														 font : "16px Sans",
														 textAlign : "left",
														 fill : new ol.style.Fill({
															 color : "rgba(255, 255, 255, 1)"
														 }),
														 stroke : new ol.style.Stroke({
															 color : "rgba(0, 0, 0, 1)",
															 width : 2
														 })
													})
												})
										  );
										  
									});
									
							}						
						}
						else
						{
						// vFeatures = vector_import_source.getFeatures();
						features.forEach(function(f) {
							


								
							f.setStyle(new ol.style.Style({
								
					/*
									image : new ol.style.Icon({
										src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAmCAYAAABpuqMCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARfSURBVFiF3ZhfbBRVGMV/d2Z3212tbSkCbuNaqzaRiL6QyAMPjSFoYqgx4oOiRmMFUzQG479o2lQ0QXk1EhYFgmlD2mIRkYhRwqLEaA2GiKWV7rZLQ0sLwbZId7t/Zq4PFK1125m5s/vCedz7nXO+M9/N3jsD1xFEvgXlTkrI8hBQBywFbgEqgEvAMHAayZcYHBYbuZJP77yFkdsoR+ct4GXAb4OSQPARXj4QzzGejx7yEkZuZy2CMLBAgf4nkhfEi3S67UNzQ5YSIXfQhKAdtSAACxDsk2EapXT3cF2FYQdNSN7F/YQFsJkw77gVUcL01mp3o5EDJoK1Yj37VchKjcjdlJEmhvrWmg9jGNwhGhhzSlTbZmnepjBBAMrReF2F6Hgy0+fIKPb+flWRIMtip+eQ88lcPRCtg3gCCVZ3RqhPDbJepqlPDbJ6XwSvP2nDJYCXB522prLN6iwrPIEETw33U/VoLZovBPjQfCGqHqtl3XDUZiBrn1lQCXO3ZcUDLV34Su/JueYrW0btnp8tNSRLnTamEiZoWRF6uHre9dseuT0vPrOgEqbCWtW3xNX6VSy02c+/sk4JwF+WFWZ6xGL9vA2fyzb7+QcqYUYtKwYP9s+7PrA/bsNn/geSA87DSLosa44+fT/p8VM511Jjp4g8u8KGk7XPLKhM5qhlRSbppzV4JwMdEcz0WSCNmT5LrC1CS/AujKliSw1BxGljzm8AH3MjHs4BpU65DjCBn0rxDJNOSI4nM33F2O2U58yEnU6DgOpF02AzcEGJa40LZHlfhagUZvp6vkmFawObVK7/4PLFSoZpBZ50ozEThsne6i2hjZqmFRVJ6U8JUeSVUmQNzQvg0c1MVtNMIUTSl0pNLhsaGu8A4xrfbZhS4CRQ5SoFcCWtja/5NBg+N+GZsu0vhSEkcY8mf+iNx+OuX3llmJVABNCVNUA2fl3xWdvJkriqRBb2uPugAYgNHEey1Y3Gt3/ccNxFEAChm2al6zAAjNAEWF/rc1Ev6+ffOLTwmBt7E0xD02J5CSOayQLrsHMJnYGMITJvHrr588mUMKyr54CUaaHrnfF4fCQ/kwHEBmLAa044rb+WHP4xXnxJ0VJK6CkyjO2xWOx3KMSH8zDtwONWdb2jvt41u4JtChZJKeVveDwnYrHYfw5uj4KYFRpSWbGqyCPL5ypIpMTkKwcWfWVXUEqRRcio1LTuUCjUE4lEsrnq8j4ZgKEP9bpgmfHFHPpyy3fle3f9Uto3n4aUIqNhDghN6zZ1vTcajaasfAsSBmBwq7f11tLM/24Hx2L+n+rbF38zBy2JEP0anPEGAj3d3d1pJ56F2GYAGInM82M+bWW53wxd++3ipH7x1QMLj8ysk5BAyj6Ppp2+d/nyaEdHh/I/W8EmA3Ci2b/iviVT3+tCerMmxkudiz450hcYBSYQIqrDmScGBvqawSxkH3lDV2Pxe6ltItnWcFNLTXX1qpqamkoK/BCvC/wNB+l5MdQKNHsAAAAASUVORK5CYII=",
										scale: 1.1875,       // scale the image if you want
										anchor: [51, 38], 
									}),
					*/
									image : new ol.style.Icon({
											  src : "https://maps.nls.uk/geo/img/orange-marker.png",
											  size : [51, 51],
									}),  
		
									stroke : new ol.style.Stroke({
											  color : "#000cff",
											  width : 7
									}),
									fill : new ol.style.Fill({
											  color : "rgba(152, 237, 255, 0.2)"
									}),
									text : new ol.style.Text({
											 font : "16px Sans",
											 textAlign : "left",
											 fill : new ol.style.Fill({
												 color : "rgba(255, 255, 255, 1)"
											 }),
											 stroke : new ol.style.Stroke({
												 color : "rgba(0, 0, 0, 1)",
												 width : 2
											 })
										})
									})
							  );
							  
						});
						
						}
					
						vector_import_source.addFeatures(features);
						
//						map.getLayers().push(vectorLayerFromImport);
						vectorLayerFromImport.setVisible(true);

						var maplayerlength = map.getLayers().getLength();
						const toplayer = parseInt(maplayerlength - 1);						
						const secondtotoplayer = parseInt(maplayerlength - 2);

		


				
						setTimeout( function(){
						  if (features.length > 0) {
								map.getView().fit(vector_import_source.getExtent(),  { padding: [100, 100, 100, 100] });
								$("#loading").hide();						
						  }

						checksketch();
						
							setTimeout( function(){
									updateUrl();
							}, 2000); // delay 50 ms
						}, 200); // delay 50 ms


				  },
				  error: function(err) {
					alert('Error parsing CSV file: ' + err.message || err);
					$("#loading").hide();
				  }
				});





	}
	else
	{

		const reader = new FileReader();
		reader.onload = function(e) {
		  const extension = file.name.split('.').pop().toLowerCase();
		  let format;
		  try {
			let features;
			if (extension === 'geojson' || extension === 'json') {
			  format = new ol.format.GeoJSON();
			  const geojson = JSON.parse(e.target.result);
			  features = format.readFeatures(geojson, {
				featureProjection: map.getView().getProjection()
			  });
			} else if (extension === 'kml') {
			  format = new ol.format.KML();
			  features = format.readFeatures(e.target.result, {
				featureProjection: map.getView().getProjection()
			  });
			} else if (extension === 'gpx') {
			  format = new ol.format.GPX();
			  features = format.readFeatures(e.target.result, {
				featureProjection: map.getView().getProjection()
			  });
			
			} else {
			  alert('Unsupported file type.');
			  return;
			}


						if (vector_import_source.getFeatures().length > 0)
						{
						// vFeatures = vector_import_source.getFeatures();
						features.forEach(function(f) {
							f.setStyle(new ol.style.Style({
									image : new ol.style.Icon({
											  src : "https://maps.nls.uk/geo/img/blue-marker.png",
											  size : [51, 51],
									}),
									stroke : new ol.style.Stroke({
											  color : "#000cff",
											  width : 7
									}),
									fill : new ol.style.Fill({
											  color : "rgba(152, 237, 255, 0.2)"
									}),
									text : new ol.style.Text({
											 font : "16px Sans",
											 textAlign : "left",
											 fill : new ol.style.Fill({
												 color : "rgba(255, 255, 255, 1)"
											 }),
											 stroke : new ol.style.Stroke({
												 color : "rgba(0, 0, 0, 1)",
												 width : 2
											 })
										})
									})
							  );
							  
						});
						
						}
						else
						{
						// vFeatures = vector_import_source.getFeatures();
						features.forEach(function(f) {
							


								
							f.setStyle(new ol.style.Style({
									image : new ol.style.Icon({
											  src : "https://maps.nls.uk/geo/img/orange-marker.png",
											  size : [51, 51],
									}),
									stroke : new ol.style.Stroke({
											  color : "#000cff",
											  width : 7
									}),
									fill : new ol.style.Fill({
											  color : "rgba(152, 237, 255, 0.2)"
									}),
									text : new ol.style.Text({
											 font : "16px Sans",
											 textAlign : "left",
											 fill : new ol.style.Fill({
												 color : "rgba(255, 255, 255, 1)"
											 }),
											 stroke : new ol.style.Stroke({
												 color : "rgba(0, 0, 0, 1)",
												 width : 2
											 })
										})
									})
							  );
							  
						});
						
						}
				vector_import_source.addFeatures(features);
						
//				map.getLayers().push(vectorLayerFromImport);
				vectorLayerFromImport.setVisible(true);

				var maplayerlength = map.getLayers().getLength();
				const toplayer = parseInt(maplayerlength - 1);						
				const secondtotoplayer = parseInt(maplayerlength - 2);



		
		setTimeout( function(){
		  if (features.length > 0) {
				map.getView().fit(vector_import_source.getExtent(),  { padding: [100, 100, 100, 100]});
			$("#loading").hide();		
		  }
		checksketch();
			setTimeout( function(){
					updateUrl();
			}, 2000); // delay 50 ms
		}, 200); // delay 50 ms
		
      } catch (err) {
        alert('Could not load file: ' + err.message);
		$("#loading").hide();
      }
    };
    reader.readAsText(file);

	}

	document.getElementById('importFile').value = '';

			
}, 50); // even 0ms works, but 50ms is safer			
	

});

function gotoexploreallmaps() {
	var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	var mapZoom = map.getView().getZoom().toFixed(1);
	let num = Number(mapZoom);    
	let newmapZoom = num - 5;
	const url = "https://dev.explore.allmaps.org/#" + newmapZoom + '/' + centre[1].toFixed(3)  + '/' +  centre[0].toFixed(3);

	window.open(url, '_blank');

}

function addAllmaps(value) {
	AllMapsAnnotationURL = value;

	map.getLayers().removeAt(4);

	warpedMapLayer = new Allmaps.WarpedMapLayer();
	
    allmapslayer = new ol.layer.Group({ 
							  title: "World - Allmaps overlay",
						  relevance: 8,
						  mindate: 1801,
						  maxdate:	2025,
						  typename: 'nls:OS_One_inch_1st_GB_WFS',

						  layers: [warpedMapLayer],
							minx: -180.000000,
							miny: -72.483427, 
							maxx: 180.000000, 
							maxy: 82.099060,
							maxZ: 16,
						  key: 'maps.nls.uk/os/one-inch-old-series/symbols-popup.html'
	
	});	

	overlayLayers.unshift(allmapslayer);
	overlayLayersAll.unshift(allmapslayer);
	
	map.getLayers().insertAt(4, allmapslayer);
	
	overlaySelected = map.getLayers().getArray()[4];

	switchWFSOFF();

// https://annotations.allmaps.org/images/12ce7b8dd9110acb



				warpedMapLayer.addGeoreferenceAnnotationByUrl( value )
								
				warpedMapLayer.on('warpedmapadded', (event) => {
					
						  console.log(event.mapId, warpedMapLayer.getExtent())
						  
				setTimeout( function(){
								map.getView().fit(warpedMapLayer.getExtent());
								
			
				}, 600); // delay 50 ms		

				
							fetch(value)
							  .then((response) => response.json())
									.then(function(json) {

									//	console.log(JSON.stringify(json));
										
										const targetSourceId = json.items[0].target.source.id;
										console.log('Target source ID:', targetSourceId);
										let nls_id = targetSourceId.slice(-9);
		

										var iiifurl = targetSourceId + '/info.json'; 
										
										console.log("iifurl :" + iiifurl);
										var bbox_suffix = '&bbox=-8.5693359,55.0657869,0.3076172,59.310768';
										var iiifurl_escape = encodeURI(iiifurl + bbox_suffix);
										var allmaps_editor = 'https://editor.allmaps.org/#/georeference?url=' + iiifurl_escape ;
										
										if ( windowWidth = $(window).width() > 850)
											
											{
												$("#editallmaps").removeClass("hidden");
												jQuery("#editallmaps").show();
											}
										jQuery("#showEdinburghinfo").hide();
										jQuery("#importPanel").hide();
										jQuery("#showImport").show();
										jQuery("#layersSideBarOutlines").show();
										jQuery("#showlayersOutlinesExplore").hide();		

										
				setResults1(999);
										
				document.getElementById('allmapseditorlink').innerHTML = '<a href="' +allmaps_editor + '" target="_blank">Edit georeferencing in Allmaps Editor</a>';
				if (value.includes('images'))
				{
				var new_mosaic_id = value.replace('https://annotations.allmaps.org/images/', '');
				}
				else
				{
				var new_mosaic_id = value.replace('https://annotations.allmaps.org/maps/', '');
				}
				map.getLayers().getArray()[4].set('mosaic_id', 'allmaps-' + new_mosaic_id);
				
				$("#map").focus();
				
				setTimeout( function(){				
					checkWidth();
				}, 600); // delay 50 ms
				
				updateUrl();									
		
				})
		})

}

function removeAllmaps() {

	map.getLayers().removeAt(4);
	overlayLayers.shift();
	overlayLayersAll.shift();
	map.getLayers().insertAt(4, overlayLayers[1]);
	overlaySelected = map.getLayers().getArray()[4];
	urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
	updateUrl();
	jQuery("#editallmaps").hide();
	jQuery("#importPanel").hide();
	jQuery("#showImport").show();
	splitLists();
    var map_group = map.getLayers().getArray()[4].get('group_no');
    	if (document.getElementById('URHere') !== null) 
		{ setResults1(map_group); } 
}

function addxyz(value) {

	// https://mapseries-tilesets.s3.amazonaws.com/roy/highlands/{z}/{x}/{y}.png
	
	map.getLayers().removeAt(4);
	

	var xyzlayer = new ol.layer.Tile({
	              title: 'XYZ Layer',
						  group_no: '999',
						  mosaic_id: '999',
				  relevance: 8,
				  mindate: 1801,
				  maxdate:	2025,
							minx: -8.19032986, 
							miny: 49.85455434, 
							maxx: 1.91473164, 
							maxy: 60.99295342,
//			extent: ol.proj.transformExtent([-1.24943539, 53.00462605, -0.95231618, 53.25151704], 'EPSG:4326', 'EPSG:3857'),
		       source: new ol.source.XYZ({
			          attributions: '',

				url: value,
				tilePixelRatio: 1
		          }),
			maxZ: 19
	        });
	
	overlayLayers.unshift(xyzlayer);
	overlayLayersAll.unshift(xyzlayer);
	
	map.getLayers().insertAt(4, xyzlayer);
	
	
		switchWFSOFF();
	
	overlaySelected = map.getLayers().getArray()[4];
	urlLayerName = map.getLayers().getArray()[4].get('mosaic_id');
	updateUrl();
	
}


function setResults1(str) {  


       if (str == 2)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/towns/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Town Plans \/ Views, 1580-1919</a></li></ul>";
  }
       else if (str == 3)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/atlas/thomson/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">John Thomson's Atlas of Scotland, 1832</a></li></ul>";
  }
       else if (str == 4)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/counties/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">County maps, 1580s-1950s</a></li></ul>";
  }
       else if (str == 5) 
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/scotland/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Maps of Scotland, 1560-1928</a></li></ul>";
  }
       else if (str == 6)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/atlas/taylor-skinner/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Taylor and Skinner\'s Survey, 1776</a></li></ul>";
  }
       else if (str == 8)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/atlas/bartholomew/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Bartholomew Survey Atlas of Scotland, 1912</a></li></ul>";
  }
       else if (str == 12)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/bathymetric/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Bathymetrical Survey of Fresh-Water Lochs, 1897-1909</a></li></ul>";
  }
       else if (str == 15)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/coasts/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Coasts of Scotland on marine charts, 1580-1850</a></li></ul>";
  }
       else if (str == 18)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/coasts/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Coastal and Admiralty Charts of Scotland, 1693-1963</a></li></ul>";
  }

       else if (str == 20)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/atlas/blaeu/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Blaeu Atlas of Scotland, 1654</a></li></ul>";
  }
       else if (str == 22)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/roy/antiquities/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Roy Military Antiquities of the Romans, 1793</a></li></ul>";
  }
       else if (str == 23)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/estates/golspie-loth/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Survey of farms in Golspie and Loth, Sutherland, 1772</a></li></ul>";
  }
       else if (str == 25)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/pont/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Maps by Timothy Pont</a></li></ul>";
  }
       else if (str == 26)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/mapmakers/gordon.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Maps by Robert &amp; James Gordon, ca.1636-1652</a></li></ul>";
  }
       else if (str == 27)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/mapmakers/adair.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Maps by John Adair</a></li></ul>";
  }
       else if (str == 28)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/mapmakers/moll.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Maps by Herman Moll</a></li></ul>";
  }
       else if (str == 31)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/air-photos/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Air Photo Mosaics, 1944-1950</a></li></ul>";
  }
       else if (str == 32)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25k-gb-1937-61/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">1:25,000, Great Britain, 1937-1961</a></li></ul>";
  }
       else if (str == 33)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25inch/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">25 inch to the mile, 1st edition, 1855-1882</a></li></ul>";
  }
       else if (str == 34)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25inch-2nd-and-later/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">25 inch Scotland, 1892-1949</a> <a href=\"/os/25inch-england-and-wales/\"  alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales, 1841-1952</a></li></ul>";
  }
       else if (str == 35)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; Six-inch 1st edition <a href=\"/os/6inch-ireland/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Ireland</a>, <a href=\"/os/6inch/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scotland</a>, <a href=\"/os/6inch-england-and-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales</a>, 1840s-1880s";
  }
       else if (str == 36)
	{
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; Six-inch 2nd edition <a href=\"/os/6inch-ireland/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Ireland</a>, <a href=\"/os/6inch-2nd-and-later/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scotland</a>, <a href=\"/os/6inch-england-and-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales</a>, 1888-1915";  
	}
  
       else if (str == 37)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-nat-grid/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch Popular with Nat Grid, 1945-1947</a></li></ul>";
  }
       else if (str == 38)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-1st/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch, Scotland, 1st Edition, 1856-1891</a></li></ul>";
  }
       else if (str == 39)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-2nd/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch, Scotland, 1885-1900</a> or <a href=\"/os/one-inch-rev-new-series/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales, 1892-1908</a></li></ul>";
  }
       else if (str == 40)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch \"Popular\" edition, Scotland, 1921-1930</a></li></ul>";
  } 
       else if (str == 41)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/townplans/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Large scale Scottish town plans, 1847-1895</a></li></ul>";
  }
       else if (str == 42)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/county-series/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Indexes to the County Series maps, Scotland, 1854-1886</a></li></ul>";
  }
       else if (str == 43)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/quarter-inch-third/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter Inch to the Mile, England, Scotland, Wales, 3rd ed., 1919-1923</a></li></ul>";
  }
       else if (str == 44)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/ten-mile/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Ten-mile Planning Maps of Great Britain, 1944-1960</a></li></ul>";
  }
       else if (str == 45)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/bart_scotland_halfinch_list.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Bartholomew\'s \"Half Inch to the Mile Maps\" of Scotland, 1926-1935</a></li></ul>";
  }
       else if (str == 47)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/military/scotland.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Military Maps of Scotland (18th century)</a></li></ul>";
  }
       else if (str == 50)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/bart_half_england.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Bartholomew's Half Inch England and Wales, 1902-1906</a> <a href=\"/series/bart_half_scotland.html\">Scotland, 1899-1905</a> ";
  }
       else if (str == 54)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-rev-new-series/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch, England and Wales, Rev New Series</a></li></ul>";
  }
       else if (str == 55)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-seventh-series/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch, Seventh Series, 1952-1961</a></li></ul>";
  }
       else if (str == 56)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-new-popular/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch England and Wales, New Popular, 1945-1947</a></li></ul>";
  }

       else if (str == 57)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/london-1890s/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Five feet to the mile, London, 1893-6</a></li></ul>";
  }
       else if (str == 58)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-2nd-hills/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch Scotland, 1885-1903</a> or <a href=\"/os/one-inch-rev-new-series/\"  alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales, 1892-1908</a></li></ul>";
  }

       else if (str == 59)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/6inch-england-and-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales, 1842-1952</a> or <a href=\"/os/6inch-2nd-and-later/\"  alt=\"Further information about these maps\" title=\"Further information about these maps\">Six-inch Scotland 1892-1960</a>";
  }

       else if (str == 60)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/military/\">Military Maps</a> \> </li><li>&nbsp; <a href=\"/ww1/trenches/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">British First World War Trench Maps, 1915-1918</a></li></ul>";
  }
       else if (str == 61)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/national-grid/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">National Grid Maps, 1940s-1970s</a></li></ul>";
  }
       else if (str == 63)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/jamaica/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">James Robertson's Maps of Jamaica, 1804</a></li></ul>";
  }
       else if (str == 64)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25inch-2nd-and-later/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">25 inch Scotland, 1892-1949</a> <a href=\"/os/25inch-england-and-wales/\"  alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales, 1841-1952</a></li></ul>";
  }
       else if (str == 65)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">First Land Utilisation Survey, Britain, 1931-1938</a></li></ul>";
  }
       else if (str == 66)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/soils/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Soil Survey of Scotland, 1950s-1980s</a></li></ul>";
  }

       else if (str == 67)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/estates/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Estate Maps of Scotland, 1750s-1870s</a></li></ul>";
  }
       else if (str == 69)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/hongkong/102621568.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Collinson's Maps of Hong Kong, 1846</a></li></ul>";
  }


       else if (str == 70)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; Town Plans of <a href=\"/os/townplans-england/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales</a> / <a href=\"/townplans/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scotland</a>, 1840s-1890s";
  }
       else if (str == 79)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/cyprus/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Kitchener Survey of Cyprus, 1882</a></li></ul>";
  }
       else if (str == 80)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/bart_england_wales_halfinch_list.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Bartholomew, half-inch, England and Wales, 1919-1924</a></li></ul>";
  }
       else if (str == 82)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/atlas/times-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Times Survey Atlas of the World, 1920</a></li></ul>";
  }

       else if (str == 84)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/half-inch-mot-roads/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Half-Inch (MOT), 1923</a></li></ul>";
  }
       else if (str == 85)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/bart_half_great_britain.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Bartholomew's Revised Half-Inch Map, Great Britain, 1940-47</a></li></ul>";
  }
       else if (str == 93)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/geological/6inch/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Geological Survey, Six-inch Maps, 1850s-1940s</a> ";
  }

       else if (str == 95)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/25k-gb-1940-43/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">War Office, Great Britain 1:25,000. GSGS 3906, 1940-43</a></li></ul>";
  }

       else if (str == 96)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/geological/one-inch/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Geological Survey, One-Inch Maps, 1850s-1940s</a> ";
  }

       else if (str == 98)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-outline/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch Popular (Outline), 1921-1930</a></li></ul>";
  }

       else if (str == 100)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-3908/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch Popular, GSGS 3908, 1940-43</a></li></ul>";
  }

       else if (str == 101)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-nat-grid-outline/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch Popular with National Grid (Outline), 1945-47</a></li></ul>";
  }
       else if (str == 102)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-4639/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">War Office, Scotland One-Inch Popular GSGS 4639, 1947-53</a></li></ul>";
  }
       else if (str == 106)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25k-gb-outline/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">1:25,000 Outline Series, 1945-1965</a></li></ul>";
  }
       else if (str == 107)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/half-inch-hills/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Half-Inch (hill-shaded), 1902-18</a></li></ul>";
  }
       else if (str == 108)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/half-inch-layers/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Half-Inch (layer-coloured), 1902-18</a></li></ul>";
  }
       else if (str == 109)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-3rd-colour/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch 3rd ed (col), 1902-1923 </a></li></ul>";
  }
       else if (str == 147)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/half-inch-outline-blue/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Half-Inch (Outline), 1930-42</a></li></ul>";
  }
       else if (str == 148)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/quarter-inch-first-outline/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter-Inch, 1st ed (Outline), 1900-1906</a></li></ul>";
  }
       else if (str == 150)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/quarter-inch-first-hills/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter-Inch, 1st ed (Hills), 1900-1906</a></li></ul>";
  }
       else if (str == 152)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/quarter-inch-third-civil-air/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter-Inch, Civil Air ed., 1929-1930</a></li></ul>";
  }
       else if (str == 155)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/quarter-inch-fourth-colour/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter-Inch, 4th ed., 1935-1937</a></li></ul>";
  }

       else if (str == 157)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/belgium/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Belgium - Second World War military mapping</a></li></ul>";
  }
       else if (str == 158)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/belgium/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Belgium - Second World War military mapping</a></li></ul>";
  }
       else if (str == 159)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/belgium/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Belgium - Second World War military mapping</a></li></ul>";
  }
       else if (str == 116)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/towns/\">Towns</a> \> </li><li>&nbsp; <a href=\"/towns/goad/\"  alt=\"Further information about these maps\" title=\"Further information about these maps\">Goad Fire Insurance Plans, 1880s-1940s</a> ";
  }
       else if (str == 172)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/projects/api/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">1:1 million to 1:63K, 1920s-1940s</a></li></ul>";
  }
       else if (str == 173)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/national-grid/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">National Grid Maps, 1940s-1970s</a></li></ul>";
  }
       else if (str == 175)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/projects/api/index.html#api\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Ordnance Survey (1:1 million-1:10,560), 1900s</a></li></ul>";
  }
       else if (str == 177)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/military/\">Military Maps</a> \> </li><li>&nbsp;  <a href=\"/military/20th-century/\"alt=\"Further information about these maps\" title=\"Further information about these maps\">Scottish military maps, 20th century</a> ";
  }

       else if (str == 178)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25inch-england-and-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">25 inch England and Wales, 1841-1952</a></li></ul>";
  }
       else if (str == 180)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25inch-2nd-and-later/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">25 inch Scotland, 1892-1949</a>  \> </li><li>&nbsp; <a href=\"/os/25inch-2nd-and-later/drawings/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Drawings</a> ";
  }
       else if (str == 187)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; Town Plans of <a href=\"/os/townplans-england/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales</a> / <a href=\"/townplans/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scotland</a>, 1840s-1890s";
  }
       else if (str == 188)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/townplans-england/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Town Plans of England and Wales, 1840s-1890s</a></li></ul>";
  }
       else if (str == 195)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-england-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch Popular, England and Wales, 1919-1926</a></li></ul>";
  }
       else if (str == 199)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-popular-england-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch Popular, England and Wales, 1919-1926</a> / <a href=\"/os/one-inch-popular/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scotland, 1921-1930</a></li></ul>";
  }
       else if (str == 204)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/25inch-england-and-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">25 inch England and Wales, 1841-1952</a></li></ul>";
  }
       else if (str == 208)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/india/survey-of-india/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Survey of India - Half-inch 1st ed., 1916-1925</a> ";
  }
       else if (str == 209)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/india/survey-of-india/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Survey of India - Half-inch 2nd ed., 1942-1945</a> ";
  }
       else if (str == 210)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/india/survey-of-india/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Survey of India - One-inch 1st ed., 1912-1945</a> ";
  }
       else if (str == 211)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/india/survey-of-india/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Survey of India - One-inch 2nd-5th eds., 1925-1948</a> ";
  }
  
     else if (str == 225)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp;  <a href=\"/projects/api/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">1:1 million to 1:2,500, 1900s</a> ";
  }

       else if (str == 226)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp;  <a href=\"/os/quarter-inch-admin-1950-52/\"alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter-Inch, Administrative Areas, 1950-52</a> ";
  }
       else if (str == 227)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp;  <a href=\"/os/quarter-inch-admin-1955-66/\"alt=\"Further information about these maps\" title=\"Further information about these maps\">Quarter-Inch, Administrative Areas, 1955-66</a> ";
  }
       else if (str == 231)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  Bartholomew's library chart of the world, 1881</a> ";
  }  
       else if (str == 234)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp;  <a href=\"/os/one-inch-ireland-gsgs4136/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">War Office, One inch to the mile, Ireland (Large sheet series), G.S.G.S. 4136, 1940-1942</a></li></ul>";
  }
       else if (str == 240)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp;  <a href=\"/world/rec/5865/\"alt=\"Further information about this map\" title=\"Further information about this map\">Chart of the world on Mercator's projection, 1790</a> ";
  }
       else if (str == 242)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/series/\">Series maps</a> \> </li><li>&nbsp; <a href=\"/series/second-land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Second Land Utilisation Survey, Britain, ca. 1960-1975</a></li></ul>";
  }
       else if (str == 252)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/townplans-england/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Town Plans of England and Wales, 1840s-1890s</a></li></ul>";
  }
      else if (str == 253)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/air-photos/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Air Photo Mosaics, 1944-1950</a></li></ul>";
  }
 
       else if (str == 257)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/os/\">Ordnance Survey</a> \>&nbsp;</li><li> <a href=\"/os/one-inch-1st/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch, Scotland, 1st Edition, 1856-1891</a> ; <a href=\"/os/one-inch-old-series/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch Old Series, 1800s-1860s</a>";
  }
 
      else if (str == 263)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/channel-islands/#three-inch\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Channel Islands, 1:25,000 and 3 Inch to the mile, 1960s</a></li></ul>";
  }

      else if (str == 264)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/channel-islands/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Channel Islands, Town Plans, 1934-44</a></li></ul>";
  }

      else if (str == 265)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/channel-islands/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Channel Islands, 1:31,680 / Two Inch to the mile, 1902-14</a></li></ul>";
  }

      else if (str == 266)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/channel-islands/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Channel Islands, 1:10,560 / Six-Inch to the mile, 1960s</a></li></ul>";
  }

      else if (str == 267)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/os/\">Ordnance Survey</a> \>&nbsp;</li><li> <a href=\"/os/london-gsgs4157/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">London, 1:12,500, GSGS 4157, 1940s</a>";
  }
 
        else if (str == 268)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/one-inch-england-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch maps, England and Wales, 1872-1914</a></li></ul>";
  } 
  
       else if (str == 270)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/os/\">Ordnance Survey</a> \>&nbsp;</li><li> <a href=\"/os/one-inch-1st/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-inch, Scotland, 1st Edition, 1856-1891</a> ; <a href=\"/os/one-inch-old-series/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">One-Inch Old Series, 1800s-1860s</a>";
  }

      else if (str == 271)

  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li><li>&nbsp; <a href=\"/os/50k-gb/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">1:50,000 Great Britain, 1974-</a></li></ul>";
  }

      else if (str == 272)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><li>&nbsp; <a href=\"/os/\">Ordnance Survey</a> \> </li>&nbsp; One-inch maps, 3rd ed (col)<li>&nbsp; <a href=\"/os/one-inch-3rd-colour/\" alt=\"Further information about these maps\" title=\"Further information about these maps\"/>Scotland, 1902-23</a></li> / <li>&nbsp;<a href=\"/os/one-inch-3rd-england-wales/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">England and Wales, 1906-17</a></li></ul>";
  } 

      else if (str == 274)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li><a href=\"/towns/\">Town plans/views, 1580s-1940s</a> \> </li> <li>&nbsp;<a href=\"/towns/birmingham-1855.html\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Borough of Birmingham, 1855</a></li></ul>";
  } 

       else if (str == 282)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/series/\">Series maps</a> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Second Land Utilisation Survey, Britain, 1:10K, 1960s</a></li></ul>";
  }
       else if (str == 284)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/series/\">Series maps</a> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Second Land Utilisation Survey, Britain, 1:10K, 1960s</a></li> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/scapes-and-fringes\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Scapes and Fringes</a></li></ul>";
  }
       else if (str == 285)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/series/\">Series maps</a> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Second Land Utilisation Survey, Britain, 1:10K, 1960s</a></li> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/wildscape\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Wildscape Atlas (Habitats)</a></li></ul>";
  }
       else if (str == 287)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/series/\">Series maps</a> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Second Land Utilisation Survey, Britain, 1:10K, 1960s</a></li> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/wildscape\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Wildscape Atlas (Vegetation)</a></li></ul>";
  }
       else if (str == 289)
  {
  document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \>&nbsp;</li><li> <a href=\"/series/\">Series maps</a> \>&nbsp;</li><li> <a href=\"/series/second-land-utilisation-survey/\" alt=\"Further information about these maps\" title=\"Further information about these maps\">Second Land Utilisation Survey, Britain, 1:25,000, 1961-78</a></li></ul>";
  }

  else {
    document.getElementById('URHere').innerHTML = "<ul><li><a href=\"/\">Maps home</a> \> </li></ul>";
  }
  
  checkWidth();
}





jQuery.event.special.touchstart = {
  setup: function( _, ns, handle ){
    if ( ns.includes("noPreventDefault") ) {
      this.addEventListener("touchstart", handle, { passive: false });
    } else {
      this.addEventListener("touchstart", handle, { passive: true });
    }
  }
};




	$(document).ready(function() {
		
			$("#loading").hide();
			
			$('#ngrgaz').click(function(e){ $(this).focus(); });
	
			$("#show").removeClass("hidden");

			$("#mobile-notification").removeClass('hidden');
			
			$("#mobile-notification").hide();

	    	$("#chart").removeClass("hidden");
	    	$("#searchSideBar").removeClass("hidden");
	    	$("#layersSideBarOutlines").removeClass("hidden");
	    	$("#exploreslideroverlaymobile").removeClass("hidden");
			$("#footermobile").removeClass("hidden");
			$(".ol-popup").removeClass("hidden");	
			$(".close").removeClass("hidden");
			$("#showlayersOutlinesExplore").removeClass("hidden");
			$("#geolocation-img").removeClass("hidden");
			$("#fullscreen-img").removeClass("hidden");
			$("#footermore").removeClass("hidden");
			
			$("#mobile-notification").removeClass("hidden");
			
			$("#drawControlFormElevation-div").removeClass("hidden");
			
			$("#Modal").removeClass("hidden");
			$("#modal").removeClass("hidden");
			$("#modal-close").removeClass("hidden");
			$("#modal-content").removeClass("hidden");
			$("#modal-text").removeClass("hidden");

			$("#exitfullscreen-img").removeClass("hidden");
			
			$("#morePanel").removeClass("hidden");
			
			$("#splitlist").removeClass("hidden");
			
			$("#layerSelectDiv").removeClass("hidden");
			
			$("#layerSelectdropdown").removeClass("hidden");
			
			jQuery("#singlelist").hide(); 

			jQuery("#morePanel").hide();
			
			jQuery("#chart").hide();
		
			jQuery("#footermore").show();
			
			jQuery("#keyword").hide();
			
//			jQuery("#drawControlFormElevation-div").hide();
			
			$("#deletesketch").removeClass("hidden");
			
			$("#showImport").removeClass("hidden");
			

			
			document.getElementById('toplayervisibility').innerHTML = '<a href="javascript:hideTopLayer()">Hide top layer</a>';
			
			jQuery("#deletesketch").hide();
			
//			$( "#layerfiltercheckbox" ).prop( "checked", true );

			setTimeout( function(){	
				if (overlaySelected)			
				if (overlaySelected.get('maxZ') < 17)
					{
//					jQuery( "#scaleslider" ).slider('setValue',[12,15]);
//					$( "#layerfiltercheckbox" ).prop( "checked", true );
					}
				scaleslidestop();
//				$("#map").focus();
			}, 120); // delay 50 ms	




		var sliderrange = document.getElementById('slider');

		var formatForSlider = {
			from: function (formattedValue) {
				return Number(formattedValue);
			},
			to: function(numericValue) {
				return Math.round(numericValue);
			}
		};

		noUiSlider.create(sliderrange, {
			start: [1740, 2025],
			connect: true,
			behaviour: 'hover-snap',
			step: 1,
			tooltips: true,
			format: formatForSlider,
			range: {
				'min': 1740,
				'max': 2025
			}
		});
		
//		slider.noUiSlider.set([1810, 1970]);



		sliderrange.querySelector('.noUi-handle-lower').setAttribute('aria-labelledby', 'lower-value-label');

		sliderrange.querySelector('.noUi-handle-upper').setAttribute('aria-labelledby', 'upper-value-label');

		mergeTooltips(sliderrange, 15, ' - ');

		/**
		 * @param slider HtmlElement with an initialized slider
		 * @param threshold Minimum proximity (in percentages) to merge tooltips
		 * @param separator String joining tooltips
		 */
		function mergeTooltips(slider, threshold, separator) {

			var textIsRtl = getComputedStyle(slider).direction === 'rtl';
			var isRtl = slider.noUiSlider.options.direction === 'rtl';
			var isVertical = slider.noUiSlider.options.orientation === 'vertical';
			var tooltips = slider.noUiSlider.getTooltips();
			var origins = slider.noUiSlider.getOrigins();

			// Move tooltips into the origin element. The default stylesheet handles this.
			tooltips.forEach(function (tooltip, index) {
				if (tooltip) {
					origins[index].appendChild(tooltip);
				}
			});




	document.getElementById('slider').noUiSlider.on('update', function (values, handle, unencoded, tap, positions) {
		// "values" has the "to" function from "format" applied
		// "unencoded" contains the raw numerical slider values
		
		var pools = [[]];
        var poolPositions = [[]];
        var poolValues = [[]];
        var atPool = 0;

        // Assign the first tooltip to the first pool, if the tooltip is configured
        if (tooltips[0]) {
            pools[0][0] = 0;
            poolPositions[0][0] = positions[0];
            poolValues[0][0] = values[0];
        }

        for (var i = 1; i < positions.length; i++) {
            if (!tooltips[i] || (positions[i] - positions[i - 1]) > threshold) {
                atPool++;
                pools[atPool] = [];
                poolValues[atPool] = [];
                poolPositions[atPool] = [];
            }

            if (tooltips[i]) {
                pools[atPool].push(i);
                poolValues[atPool].push(values[i]);
                poolPositions[atPool].push(positions[i]);
            }
        }

        pools.forEach(function (pool, poolIndex) {
            var handlesInPool = pool.length;

            for (var j = 0; j < handlesInPool; j++) {
                var handleNumber = pool[j];

                if (j === handlesInPool - 1) {
                    var offset = 0;

                    poolPositions[poolIndex].forEach(function (value) {
                        offset += 1000 - value;
                    });

                    var direction = isVertical ? 'bottom' : 'right';
                    var last = isRtl ? 0 : handlesInPool - 1;
                    var lastOffset = 1000 - poolPositions[poolIndex][last];
                    offset = (textIsRtl && !isVertical ? 100 : 0) + (offset / handlesInPool) - lastOffset;

                    // Center this tooltip over the affected handles
                    tooltips[handleNumber].innerHTML = poolValues[poolIndex].join(separator);
                    tooltips[handleNumber].style.display = 'block';
                    tooltips[handleNumber].style[direction] = offset + '%';
                } else {
                    // Hide this tooltip
                    tooltips[handleNumber].style.display = 'none';
                }
            }
        });
		
		
	});
	
}

	document.getElementById('slider').noUiSlider.on('change', function (values, handle, unencoded, tap, positions) {


		dates = document.getElementById('slider').noUiSlider.get('range');
		

		minyear = dates[0];
		maxyear = dates[1];
			scaleslidestop();	
				
	});



		var sliderround = document.getElementById('slider-round');

		var formatForSlider = {
			from: function (formattedValue) {
				return Number(formattedValue);
			},
			to: function(numericValue) {
				return Math.round(numericValue);
			}
		};

	console.log("mapslidervalue: " + mapslidervalue);

		noUiSlider.create(sliderround, {
			start: mapslidervalue,
			connect: true,
			step: 1,
			tooltips: true,
			format: wNumb({
				decimals: 0,
				thousand: '.',
				suffix: '%'
			}),
			range: {
				'min': 0,
				'max': 100
			}
		});
		
			sliderround.querySelector('.noUi-handle-lower').setAttribute('aria-labelledby', 'value-label');

var nodes = [
    document.getElementById('lower-value'), // 0
    document.getElementById('upper-value')  // 1
];

	console.log("mapslidervalue: " + mapslidervalue);
	
	document.getElementById( "slider-round" ).noUiSlider.set([mapslidervalue]);
	

			
			
	document.getElementById('slider-round').noUiSlider.on('update', function (values, handle, unencoded) {
		// "values" has the "to" function from "format" applied
		// "unencoded" contains the raw numerical slider values

		
		value = document.getElementById('slider-round').noUiSlider.get('start');
	    opacity = value / 100;
	    map.getLayers().getArray()[4].setOpacity(opacity);
		
		if (WebGL) { osoneincholdseriesAllMaps.setOpacity(opacity); }
		if (WebGL) { warpedMapLayer.setOpacity(opacity); }
//		if (WebGL) { map.getLayers().getArray()[4].setMapOpacity(opacity); }

		mapslidervalue = value;
		updateUrl();
		checkreuse();
	});
	

	


	
		var slidersquare = document.getElementById('slider-round-mobile');

		var formatForSlider = {
			from: function (formattedValue) {
				return Number(formattedValue);
			},
			to: function(numericValue) {
				return Math.round(numericValue);
			}
		};

		noUiSlider.create(slidersquare, {
			start: mapslidervalue,
			connect: true,
			step: 1,
			behaviour: 'unconstrained-tap',
			tooltips: false,
			format: wNumb({
				decimals: 0,
				thousand: '.',
				suffix: '%'
			}),
			range: {
				'min': 0,
				'max': 100
			}
		});
		
		slidersquare.querySelector('.noUi-handle-lower').setAttribute('aria-labelledby', 'value-label-mobile');

		var nodes = [
			document.getElementById('lower-value'), // 0
			document.getElementById('upper-value')  // 1
		];


	document.getElementById('slider-round-mobile').noUiSlider.on('update', function (values, handle, unencoded) {
		// "values" has the "to" function from "format" applied
		// "unencoded" contains the raw numerical slider values

		
		value = document.getElementById('slider-round-mobile').noUiSlider.get('start');
	    opacity = value / 100;
	    map.getLayers().getArray()[4].setOpacity(opacity);
		
		if (WebGL) { osoneincholdseriesAllMaps.setOpacity(opacity); }
		if (WebGL) { warpedMapLayer.setOpacity(opacity); }
//		if (WebGL) { map.getLayers().getArray()[4].setMapOpacity(opacity); }
	    // overlay.layer.setOpacity(opacity);

		mapslidervalue = value;
		updateUrl();
		
	});





//			$("#map").focus();
			
			checkWFS();
			
			jQuery("#map").on("mouseenter", function(event) {
					$("#map").focus();
				}); 	
				


//				$("div[id^=\"GPshowMeasureAzimuth\"] input").attr('aria-label', 'Measure bearing / azimuth');
//				$("div[id^=\"GPshowMeasureAzimuth\"] input").attr('aria-labelledby', 'GPshowMeasureAzimuthPicto');
		
		
		
setTimeout( function(){	
		
/*
				var firstDiv = $("div[id^=\"GPmeasureAzimuth\"] :first");
				var inputField = firstDiv.find("input:first");
				
				inputField.attr('aria-label', 'Measure bearing / azimuth');
				inputField.attr('aria-labelledby', 'GPshowMeasureAzimuthPicto');

		
		console.log("working");
				
			//	var firstDiv = $("div[id^=\"GPmeasureAzimuth\"] :first");
			//	const checkbox = firstDiv.find("input:first");
				
				const checkbox = document.querySelector('.GPwidget input[type="checkbox"]');
				// Get the checkbox element

				// Check if the checkbox exists
				if (checkbox) {
					
				console.log("checkbox working and ID: " + checkbox.id);
				  // Create a label element
				  const label = document.createElement('label');

				  // Set the 'for' attribute of the label to the checkbox's ID
				  label.setAttribute('for', checkbox.id);

				  // Set the text content of the label.  Choose a meaningful label.
				  label.textContent = 'Measure Bearing/Azimuth'; // Or a more appropriate label text
				  
				  checkbox.before(label);

				  checkbox.next().filter(function() {
					return this.nodeType === 3 && this.nodeValue.trim() === 'Empty form label';
				  }).remove();

				  // Check if the parent div exists
				  
				} else {
				  console.error('Checkbox with ID "GPshowMeasureAzimuth" not found.');
				}
				
				$("div[id^=\"GPimport\"]").find("input:first").setAttribute('aria-hidden', 'true');
				
*/



				const exportbutton = document.querySelector('.tool-form-submit.drawing-button');

				if (exportbutton) {
					exportbutton.addEventListener('click', function (e) {
						let selectedFormat = $('#deletesketchexport input[name="exportFormat"]:checked').val();

						if (selectedFormat === 'CSV') {
							e.preventDefault();
							e.stopImmediatePropagation();
							exportCSV();  // your custom handler
						}
						else if (selectedFormat === 'GeoJSONBNG') {
							e.preventDefault();
							e.stopImmediatePropagation();
							exportGeoJSONBNG(); // your custom handler
						}
						// If it's neither, do nothing special — the original bound event will run
					}, true);  // <-- use capture phase so your code runs before the original handler
				}


//				var printTitleSelectLabel = document.querySelector('.ol-print');	
//				printTitleSelectLabel.setAttribute('id', 'printTitleSelect');

	
				var firstDiv = $("div[id^=\"GPmeasureAzimuth\"] :first");
				var inputField = firstDiv.find("input:first");
	
				var printTitleToggle = document.querySelector('.ol-print-title .ol-ext-toggle-switch');
				printTitleToggle.setAttribute('for', 'printTitleCheckbox');
				printTitleToggle.setAttribute('id', 'printTitleSelect');
				
				var printTitleCheckbox = document.querySelector('.ol-print-title input[type="checkbox"]');
				printTitleCheckbox.setAttribute('id', 'printTitleCheckbox');
				
				var printTitleSelect = document.querySelector('.ol-print-title input[type="text"]');
				printTitleSelect.setAttribute('id', 'printTitleInput');
				printTitleSelect.setAttribute('aria-label', 'Enter map title');
				printTitleSelect.setAttribute('aria-labelledby', 'printTitleSelect');
				
				document.getElementById("printTitleInput").removeAttribute("placeholder");
				
				
				var printScaleSelectLabel = document.querySelector('.ol-scale');
				printScaleSelectLabel.setAttribute('id', 'printScaleSelect');
				var printScaleSelect = document.querySelector('.ol-scale select');
				printScaleSelect.setAttribute('aria-labelledby', 'printScaleSelect');

				var printSizeSelectLabel = document.querySelector('.ol-size');
				printSizeSelectLabel.setAttribute('id', 'printSizeSelect');
				var printSizeSelect = document.querySelector('.ol-size select');
				printSizeSelect.setAttribute('aria-labelledby', 'printSizeSelect');	
				printSizeSelect.setAttribute('aria-label', 'Select size');		

				var printMarginSelectLabel = document.querySelector('.ol-margin');
				printMarginSelectLabel.setAttribute('id', 'printMarginSelect');
				var printMarginSelect = document.querySelector('.ol-margin select');
				printMarginSelect.setAttribute('aria-labelledby', 'printMarginSelect');	
				printMarginSelect.setAttribute('aria-label', 'Select margin');					


				var printSaveAsLabel = document.querySelector('.ol-saveas');
				printSaveAsLabel.setAttribute('id', 'printSaveAsSelect');
				var printSaveAsSelect = document.querySelector('.ol-saveas select');
				printSaveAsSelect.setAttribute('aria-labelledby', 'printSaveAsSelect');	
				printSaveAsSelect.setAttribute('aria-label', 'Select Save As Type');	

				var toolboxMeasureButton = jQuery("button[id^=\"GPtoolbox-measure-button\"]")[0];
				
				console.log("toolboxMeasureButton id:" + toolboxMeasureButton.id);
				
//				const toolboxMeasurebutton = document.getElementById('toolboxMeasureButton[0]');
				toolboxMeasureButton.setAttribute('aria-label', 'Measurement tools');

				var toolboxMeasureAzimuthInput = jQuery("input[id^=\"GPshowMeasureAzimuth\"]")[0];
				
				console.log("toolboxMeasureButton id:" + toolboxMeasureAzimuthInput.id);
				
				var toolboxMeasureAzimuthPictoID = jQuery("label[id^=\"GPshowMeasureAzimuthPicto\"]")[0].id;
				
//				const toolboxMeasurebutton = document.getElementById('toolboxMeasureButton[0]');
				toolboxMeasureAzimuthInput.setAttribute('aria-labelledby', toolboxMeasureAzimuthPictoID);
		
				
}, 2000); // delay 50 ms



/*

					  var checkbox = $("div[id^=\"GPshowMeasureAzimuth\"] input");
  
				  // Create a new label element
				  var label = $('<label>');
				  
				  // Set the 'for' attribute of the new label
				  label.attr('for', 'GPshowMeasureAzimuth');
				  
				  // Set the text content of the label
				  label.text('Measure bearing / azimuth');
				  
				  // Insert the new label before the checkbox
				  checkbox.before(label);
				  
				  // Remove the "Empty form label" text node
				  checkbox.next().filter(function() {
					return this.nodeType === 3 && this.nodeValue.trim() === 'Empty form label';
				  }).remove();
			
*/
			

				
//			jQuery("#map").on("singleclick", function(event) {
//					$("#map").focus();
//				}); 

			
//			         if (!$("#layersSideBarOutlines").is(":visible")) { jQuery("#showlayersOutlinesExplore").show(); }

/*
					window.onload = function () {
						Gp.Services.getConfig({
							apiKey: 'essentiels',
							onSuccess: go
							});

					}



		const elep = new ol.control.ElevationPath({
						stylesOptions : {
							draw : {
								finish : new ol.style.Stroke({
									color : "rgba(0, 0, 0, 0.8)",
									width : 2
								})
							},
						}
				});

		var centre = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
		if ( centre[1] < 60 )
			
			{

			jQuery("#drawControlFormElevation-div").show();
			
			}
*/

//		map.addControl(elep);


//		france();
		


				 jQuery("div[id^=\"GPtoolbox-measure-main\"]").click(function(){
					stopmeasuringElevation();

				});
				
					jQuery("div[id^=\"GPimport-\"]").click(function(){
						
								$('.GPimportChoiceAltTxt').css('display', 'none');
					
							var windowHeight = $(window).height();
							
							if (windowHeight < 900)
								{
						        jQuery("#searchSideBar").hide();
								jQuery("#show").show();
								}
								
					        jQuery("#layersSideBarOutlines").hide();

							jQuery("#showlayersOutlinesExplore").show();


								
								 var windowWidth = $(window).width();


							if ($("#date") != null ) { jQuery("#date").hide(); }
							
				//			if (!$("#layersSideBarOutlines").is(":visible")) { jQuery("#showlayersOutlinesExplore").show(); }
							
									if (windowWidth <= 850)
								{
									jQuery("#exploreslideroverlaymobile").show();
									jQuery("#exploreslideroverlay").hide();
									jQuery(".ol-zoomslider").hide();
								}
							else
								{
									jQuery("#exploreslideroverlay").show();
									jQuery("#exploreslideroverlaymobile").hide();
								}
					
						//	jQuery(".GPimportInputDelete").hide();
							
							
				});
				
					jQuery("div[id^=\"GPimportPanelClose\"]").click(function(){
					
								var windowWidth = $(window).width();
								
									if (windowWidth <= 850)
								{

									jQuery(".ol-zoomslider").show();									
								}


					});
				
					jQuery("input[id^=\"GPshowDrawing\"]").click(function(){
				    // jQuery("div[id^=\"GPdrawingPanel\"]").click(function(){
				    // jQuery(span[id^=\"GPdrawingDrawingOpen\"]").click(function(){					
							var windowHeight = $(window).height();
							var windowWidth = $(window).width();
							jQuery("#wfsParishCountyResults").hide();
							if (windowWidth < 850)
							{
							jQuery("#drawControlFormElevation-div").hide();
							jQuery("#drawControlFormProfile-div").hide();

							jQuery("#deletesketch").hide();
							jQuery("#deletesketchinfo").hide();

							}
							else
							{						
							jQuery("#deletesketch").show();
							jQuery("#deletesketchinfo").show();
							document.getElementById("deletesketchinfo").innerHTML = '';
							
							jQuery("div[id^=\"GPtoolbox-measure-widget\"]").css( { "display": "none" } );
							
								var maplayerlength = map.getLayers().getLength();
								const toplayer = parseInt(maplayerlength - 1);
							
							draw.setLayer( vectorLayerFromImport);
							
							switchparishWFSOFF();
							checkexportradio();
							
							}
					});

				    jQuery("div[id^=\"GPdrawingPanelClose\"]").click(function(){
					
						setTimeout( function(){
						
									var windowHeight = $(window).height();
									
									jQuery("#showImport").show();
						
									if (windowWidth > 850)
									{
									jQuery("#deletesketch").hide();
									jQuery("#wfsParishCountyResults").show();
									checkparishWFS();
									}
									else
									{
									jQuery("#deletesketch").hide();
									}
									
								if (windowHeight > 980)
									{
									jQuery("#drawControlFormElevation-div").show();
									jQuery("#drawControlFormProfile-div").show();
									}
								}, 250); // delay 50 ms
					});
					
				    jQuery("button[id^=\"drawing-export\"]").click(function(){
					
										checkexportradio();

					});		
					
					jQuery("input[id^=\"GPimportSubmit\"]").click(function(){
					
							checksketch();
					});
					
/*
					initialize(Allmaps.WarpedMapLayer, Allmaps.WarpedMapSource)

					const warpedMapSource = new WarpedMapSource()
					const warpedMapLayer = new WarpedMapLayer({
					  source: warpedMapSource
					})

					var maplayerlength = map.getLayers().getLength();
					map.getLayers().insertAt(maplayerlength,warpedMapLayer);

					const annotationUrl =
					  'https://annotations.allmaps.org/images/813b0579711371e2@2c1d7e89d8c309e8'

					fetch(annotationUrl)
					  .then((response) => response.json())
					  .then((annotation) => {
						warpedMapSource.addGeoreferenceAnnotation(annotation)
					  })
*/
					
					
							
				if (pointClicked)
				if ((pointClicked !== null) && (pointClicked.length > 5)  )

			
				{



				
			    if (map.getLayers().getArray()[5].getSource().getFeatures().length > 0)
						{map.getLayers().getArray()[5].getSource().clear(); }
		

				// console.log("initiating pointclick");
		
				// timedText(pointClicked);
				pointClick(pointClicked);

				}

														var baseLayerTitle = map.getLayers().getArray()[2].get('title');
		


													if (baseLayerTitle.includes("Google"))  {

														jQuery("#googleexplore").removeClass('hidden');
														jQuery("#googleexplore").show();
													}
													else
													{ 
														jQuery("#googleexplore").hide();
													}

	 
	 

						$(window).on('hashchange',function(){ 
						
							loadOptions();
					
							var centreN = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	
									if (args['zoom'])
									{
										currentZoom = args['zoom'];
										if (args['zoom'] !== map.getView().getZoom().toFixed(1))
											
											{ map.getView().setZoom(currentZoom); }
									}
									if (args['lat'] && args['lon'])
									{
										currentLat = parseFloat(args['lat']); 
										currentLon = parseFloat(args['lon']);	
										
										 centerN = ol.proj.transform([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857');
										if ((args['lat'] !== centreN[1].toFixed(5)) || (args['lon'] !== centreN[0].toFixed(5)))
//										setTimeout( function(){
						

											{ 
											   map.getView().setCenter([ centerN[0].toFixed(5), centerN[1].toFixed(5) ]); 
											 }
//										}, 3000); // delay 50 ms
									}



									if (args['b'])
									{
										baseLayerName = args['b'];
										if 	(args['b'] !== map.getLayers().getArray()[2].get('mosaic_id'))
										{
										if (map.getLayers().getArray()[2].get('mosaic_id') !== 23)
											{  	
												var baseSelected = getbaseLayer(baseLayerName);
												map.getLayers().removeAt(2);
												map.getLayers().insertAt(2,baseSelected);
												document.getElementById("layerSelectdropdown").selectedIndex = baseLayerName - 1;
												getbaseLayer(baseLayerName).setVisible(true);
											}
										}
									if (args['layers'])
									{
										

										urlLayerName = args['layers'];
										if (args['layers'] !== map.getLayers().getArray()[4].get('mosaic_id'))
										{
										if (!args['layers'].includes('allmaps'))
											
											{
											if (!args['layers'].includes('999'))
												
												{												
												overlaySelected = getOverlay(urlLayerName);
												overlayOldName = map.getLayers().getArray()[4].get('title');
	//											alert("overlaySelected: " + overlaySelected.get('mosaic_id'));
												map.getLayers().removeAt(4);
												map.getLayers().insertAt(4,overlaySelected);											
												updateOverlaySwitcher();
												loadOverlayNode();
												switchOverlayUpdateMode();		
												switchOverlayinitial();
												}
											}
											
										}
									}
									if (args['marker'])
									{
										pointClicked = args['marker'];
										
										if (map.getLayers().getArray()[5].getSource().getFeatures().length > 0)
											
											{
												var pointClickedCoordinates = map.getLayers().getArray()[5].getSource().getFeatures()[0].getGeometry().getCoordinates();
											//	console.log("pointClickedCoordinates: " + pointClickedCoordinates);

												espg4326 = [];
												espg4326 = ol.proj.transform(pointClickedCoordinates,"EPSG:3857", "EPSG:4326");
												var pointClickedCoordinates4326 = espg4326[1].toFixed(6) + "," + espg4326[0].toFixed(6);
											//	console.log("pointClickedCoordinates4326: " + pointClickedCoordinates4326);

												if ( args['marker'] !==  pointClickedCoordinates4326)
													
													{
														if (map.getLayers().getArray()[5].getSource().getFeatures().length > 0)
															{map.getLayers().getArray()[5].getSource().clear(); }
														pointClick(pointClicked);
													}
											}
//										addMarker = false;

									}

									}
	
						});
	 
	 
		});