var geguide = geguide || {};


geguide.DisplayListAdress = function($main) {
	this.$main = $main;
};

geguide.DisplayListAdress.prototype = {
	load : function(adresses){
		$tab = $('<table class="table"></table>').appendTo(this.$main);
		$("<tr><th>nom</th><th>detail</th><th>adresse</th><th>tags</th></tr>").appendTo($tab);
		for(var i =  0 ; i < adresses.length; i++){
			var adresse = adresses[i];
			$('<tr><td>'+adresse.titre+'</td><td>'+adresse.detail+'</td><td>'+adresse.adresse+'</td><td>'+adresse.tags+'</td><td>'+adresse.geredacteur+'</td><td>'+adresse.dernierevisite+'</td></tr>').appendTo($tab);
		}
	}	

};

