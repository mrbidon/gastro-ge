//coupe les lignes du texte au mot prèt
//n nombre de caractère max 	
function textCutter(n, text) {
    var tab = text.split(" ");
    var length = 0;
    var result = "";
    for(var i = 0; i<tab.length;i++){
    	if(length > n){
    		result += "<br />";
    		length = 0;
    	}else{
    		result += " ";
    	}
    	length += tab[i].length;
    	result += tab[i];
    }
    
    return result;
}