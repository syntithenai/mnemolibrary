/* global google */ 
import React, { Component } from 'react';

export default class AlaDistributionMap extends Component {
    
    constructor(props) {
		super(props)
		this.mapRef = null;
	}
    
    componentDidMount() {
		var map;
		let that = this;
		var locationCentre = new google.maps.LatLng(-25.0, 135.0);
		
		// Define MWS baselayer
		var wmsMapType = new google.maps.ImageMapType({
						getTileUrl: function (coord, zoom) {
							return "https://tile.openstreetmap.org/" +
						zoom + "/" + coord.x + "/" + coord.y + ".png";
						},
						tileSize: new google.maps.Size(256, 256),
						isPng: true,
						alt: "ALA species layer",
						name: "ALA",
						maxZoom: 19
					});

	   //Define custom WMS tiled layer
	   var SLPLayer = new google.maps.ImageMapType({
						getTileUrl: function (coord, zoom) {
							var proj = map.getProjection();
							var zfactor = Math.pow(2, zoom);
							// get Long Lat coordinates
							var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
							var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

							//corrections for the slight shift of the SLP (mapserver)
							var deltaX = 0.0013;
							var deltaY = 0.00058;

							//create the Bounding box string
							var bbox =     (top.lng() + deltaX) + "," +
										   (bot.lat() + deltaY) + "," +
										   (bot.lng() + deltaX) + "," +
										   (top.lat() + deltaY);

							//base WMS URL
							let species = that.props.species ? that.props.species.split(' ').join('+') : ''
							var url = "https://biocache.ala.org.au/ws/ogc/wms/reflect?q=taxon_name:"+species;
							url += "&REQUEST=GetMap"; //WMS operation
							url += "&SERVICE=WMS";    //WMS service
							url += "&VERSION=1.1.1";  //WMS version  
							url += "&LAYERS=" + "ALA:occurrences"; //WMS layers
							url += "&FORMAT=image/png" ; //WMS format
							url += "&BGCOLOR=0xFFFFFF";  
							url += "&TRANSPARENT=TRUE";
							url += "&ENV=color:e6704c;name:circle;size:4;opacity:0.8";
							url += "&OUTLINE=false";
							url += "&SRS=EPSG:4326";     //set WGS84 
							url += "&BBOX=" + bbox;      // set bounding box
							url += "&WIDTH=256";         //tile size in google
							url += "&HEIGHT=256";
							return url;                 // return URL for the tile

						},
						tileSize: new google.maps.Size(256, 256),
						isPng: true
					});
	  
													  

	  
		function initialize() {
			var mapOptions = {
				zoom: 4,
				center: locationCentre,
				mapTypeId: 'ALA',
				mapTypeControlOptions: {
					mapTypeIds: ['ALA', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN],
					style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
				}
			};
			map = new google.maps.Map(that.mapRef, mapOptions);
			map.mapTypes.set('ALA', wmsMapType);
			map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			//add WMS layer
			map.overlayMapTypes.push(SLPLayer);
		   
		}
		if (this.props.species && this.props.species.length > 0) {
			initialize()
		}
	}
    
    render() {
		  return <div ref={(ref) => this.mapRef = ref} id="map_canvas" style={{width:'100%',height:'400px'}} ></div>

    }
}
