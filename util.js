/*jslint browser:true*/
function hasard(nombre){
	return(Math.floor(Math.random()*nombre));
}

function message(texte){
	var debug = document.getElementById("debug");
	debug.innerHTML += texte + "<br>";
}

function message2(texte){
	var debug = document.getElementById("debug");
	debug.innerHTML = texte;
}
function detail(objet) {
	var resultat = "";
	for (var x in objet) {
		resultat += x + " = " + objet[x] + "<br>";
	}
	message(resultat);
}
