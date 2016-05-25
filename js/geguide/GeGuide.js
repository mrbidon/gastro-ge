var geguide = geguide ||  {};


geguide.GeGuide = function(html_id){
	this.mercator = new OpenLayers.Projection("EPSG:900913");
	this.gps = new OpenLayers.Projection("EPSG:4326");
	
	
	this.$main = $("#"+html_id);
	this.$map = $("<div id='map'></div>").appendTo(this.$main);

	this.$displayListAdress = new geguide.DisplayListAdress(this.$main);

	this.map = new OpenLayers.Map({
	    div: "map",
	    projection: this.mercator
	});

	this.map.addLayers([new OpenLayers.Layer.OSM()]);

    this.map.setCenter(
        new OpenLayers.LonLat(10.2, 48.9).transform(
            new OpenLayers.Projection("EPSG:4326"),
            this.map.getProjectionObject()
        ), 
        5
    );
	
	var vector = new OpenLayers.Layer.Vector("Points Of G.E. Interest", {
	        styleMap: new OpenLayers.StyleMap({
	        	"default":{
		        	graphicWidth: 21,
		            graphicHeight: 25,
		            graphicYOffset: -28, 
		            externalGraphic: "${icon}"
				},
				"select":{
					externalGraphic: "${icon_hover}"
				}}
	        )
	    });
	    
	    
	this.map.addLayers([vector]);
	 
	$.ajax({
		url: "data/geguide.csv?"+Math.random(),
		dataType: "text",
		context: this,
		contentType: "text/plain; charset=utf-8",
		success: function(data){
			var lines = null;
			//gestion saut de ligne windows ou linux
			if(data.search("\r\n") != -1){
				 lines = data.split("\r\n");
			}else{
				 lines = data.split("\n");
			}
			
			// create the layer styleMap that uses the above style for all render intents
			var adresses = [];
		    var features = [];
			for(var i = 1; i < lines.length; i++){
				if(lines[i] != ""){
					var line = lines[i].split(";");
					var adresse = 	{
									 "id":  parseInt(line[0]),	
									 "titre": line[1],
									 "detail": line[2], 
									 "adresse": line[3],
									 "latitude":   parseFloat(line[4]),
									 "longitude": parseFloat(line[5]),
									 "tags" : line[6].split(","),
									 "dernierevisite": line[7],
									 "geredacteur": line[8]		
									};
					
					
					//personalisation de l'icone en fonction du tag
					adresse.icon = "js/lib/OpenLayers-2.13.1/img/marker-blue.png";
					adresse.icon_hover = "js/lib/OpenLayers-2.13.1/img/marker-green.png";
					if(adresse.tags.length>0){
						if(adresse.tags[0] == "MiamMiam"){
							adresse.icon = "img/chaudron-nofire.png";
							adresse.icon_hover = "img/chaudron.png";
						}else if(adresse.tags[0] == "GlouGlou"){
							adresse.icon = "img/chope_full.png";
							adresse.icon_hover = "img/chope_empty.png";
						}					
					}
					adresses.push(adresse);
					 
				    features.push(new OpenLayers.Feature.Vector(
						            new OpenLayers.Geometry.Point(
							                parseFloat(adresse.longitude),
							                parseFloat(adresse.latitude)
						               	).transform(this.gps,this.mercator),
						            adresse)
					         );	
				}

			}
			vector.addFeatures(features);
			this.map.zoomToExtent(vector.getDataExtent());
			vector.redraw();
			
			//tableau avec la liste des adresses
			this.$displayListAdress.load(adresses);
		}
	});

	//event
	///////////
	var popup = null, _this = this;
	function onPopupClose(evt) {
	    // 'this' is the popup.
	    selectControl.unselect(this.feature);
	}
	
	function onFeatureSelect(evt) {
	    //feature = evt.feature;
	    popup = new OpenLayers.Popup.FramedCloud("featurePopup",
	                             evt.geometry.getBounds().getCenterLonLat(),
	                             new OpenLayers.Size(100,100),
	                             "<h2>"+evt.attributes.titre + "</h2>" +
	                             textCutter(50,evt.attributes.detail),
	                             null, true, onPopupClose);
	    evt.popup = popup;
	    popup.feature = evt;
	    _this.map.addPopup(popup);
	}

	function onFeatureUnselect(evt) {
	    if (evt.popup) {
	        popup.feature = null;
	        _this.map.removePopup(evt.popup);
	        evt.popup.destroy();
	        evt.popup = null;
	    }
	}
	
	 var selectControlHover = new OpenLayers.Control.SelectFeature(vector, {
          hover: true,
          highlightOnly: true});
	this.map.addControl(selectControlHover);
	selectControlHover.activate();


	var selectControl = new OpenLayers.Control.SelectFeature(vector,
            						{ 	
            							toggle: true, 
            							onSelect: onFeatureSelect, 
            							onUnselect: onFeatureUnselect
            						});
	this.map.addControl(selectControl);
	selectControl.activate();
	
	
}

