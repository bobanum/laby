/*jslint browser:true*/
/*globals hasard*/
var cheminSkins = "skins/";
var vitesse = 0;
var suivi = false;
var skins = ["pierre", "brique", "ligne", "ligne2", "courbe", "rond", "bosses", "creux", "mur", "tuyau", "autre", "angle", "rough", "route"];

function affichageSkins() {
	var resultat = "";
	var skin;
	for (var x = 0; x < skins.length; x++) {
		skin = skins[x];
		resultat += '<input type="radio" name="skin" value="' + skin + '" id="' + skin + '" onchange="changerSkin(this, \'labyrinthe\');" />';
		resultat += '<label for="' + skin + '"><img src="' + cheminSkins + skin + '/0.gif" width="32" height="32" align="absbottom" /></label>';
	}
	return resultat;
}

function compPerso(id) {
	var largeur = parseInt(document.getElementById("largeur").value);
	var hauteur = parseInt(document.getElementById("hauteur").value);
	if (isNaN(largeur)) {
		largeur = 15;
	}
	if (isNaN(hauteur)) {
		hauteur = 15;
	}
	creer(id, hauteur, largeur);
}

function creer(id, inHauteur, inLargeur) {
	var resultat, labyrinthe = document.getElementById(id);
	labyrinthe.largeur = inLargeur;
	labyrinthe.hauteur = inHauteur;
	labyrinthe.skin = "ligne";
	labyrinthe.chemin = [];
	var skins = document.getElementById("commande").skin;
	for (var x = 0; x < skins.length; x++) {
		if (skins[x].checked) {
			labyrinthe.skin = skins[x].value;
			break;
		}
	}
	suivi = document.getElementById("suivi").checked;
	// Les METHODES
	labyrinthe.composer = composer;
	labyrinthe.bouger = bouger;
	labyrinthe.ouvrir = ouvrir;
	labyrinthe.changerIcone = changerIcone;
	labyrinthe.appliquerSkin = appliquerSkin;
	labyrinthe.prendreCase = prendreCase;
	labyrinthe.caseValide = caseValide;
	labyrinthe.test = test;
	labyrinthe.onkeypress = gererTouche;

	resultat = "";
	for (x in labyrinthe) {
		resultat += x + "=" + labyrinthe[x] + "<br>";
	}
	//message(resultat);

	labyrinthe.composer();
}

function gererTouche() {
	alert(1212);
}
/* METHODES DE L'OBJET LABYRINTHE */
function composer() {
	var hauteur = this.hauteur;
	var largeur = this.largeur;
	var skin = this.skin;

	var resultat = '<table cellpadding="0" cellspacing="0">';
	for (var rangee = 0; rangee < hauteur; rangee++) {
		resultat += '<tr>';
		for (var colonne = 0; colonne < largeur; colonne++) {
			resultat += '<td style="background-image:url(' + cheminSkins + skin + '/0.gif);"><img src="espace.gif"></td>';
		}
		resultat += '</tr>';
	}
	resultat += '</table>';

	this.innerHTML = resultat;
	this.rangee = hasard(hauteur);
	this.colonne = hasard(largeur);
	this.bouger(-1);
}

function bouger(provenance) {
	var deltaColonne, deltaRangee;
	var colonne = this.colonne;
	var rangee = this.rangee;
	var hauteur = this.hauteur;
	var largeur = this.largeur;

	provenance %= 4;
	var caseCourante = this.prendreCase();
	if (provenance >= 0) {
		this.chemin.push(provenance);
		this.ouvrir(provenance);
	} else if (provenance === -2) {
		if (this.chemin.length === 0) {
			this.changerIcone(-2);
			this.rangee = this.colonne = 0;
			this.test();
			if (!suivi) {
				this.appliquerSkin(this.skin);
			}
			return;
		}
	}
	var trouve = false;
	var tDeltaColonne = [0, 1, 0, -1];
	var tDeltaRangee = [-1, 0, 1, 0];
	var dir = hasard(4);
	var rot = (hasard(2) * 2) - 1;
	var commande = "";
	for (var cpt = 0; !trouve && cpt < 4; cpt++) {
		deltaColonne = tDeltaColonne[dir];
		deltaRangee = tDeltaRangee[dir];
		if (this.caseValide(rangee + deltaRangee, colonne + deltaColonne)) {
			this.prendreCase().chemins |= Math.pow(2, dir);
			this.ouvrir(dir);
			trouve = true;
			this.changerIcone(dir);
			this.rangee = rangee + deltaRangee;
			this.colonne = colonne + deltaColonne;
			provenance = (dir + 2) % 4;
			commande = 'bouger(' + provenance + ');'; //XXX
		} else {
			dir += rot;
			dir = (dir + 4) % 4;
		}
	}
	// on doit reculer si on est bloqué
	if (commande === "") {
		provenance = this.chemin.pop();
		this.changerIcone(-2);
		deltaColonne = tDeltaColonne[provenance];
		deltaRangee = tDeltaRangee[provenance];
		this.rangee = rangee + deltaRangee;
		this.colonne = colonne + deltaColonne;
		commande = 'bouger(' + -2 + ');'; //XXX
	}
	setTimeoutObjet(this.id, commande, vitesse);
}

function setTimeoutObjet(id, commande) {
	if (suivi) {
		setTimeout(function () {
			eval("document.getElementById(id)."+commande+"");
		}, vitesse);
	} else {
		eval("document.getElementById(id)."+commande+"");
	}
	return;
}

function prendreCase(rangee, colonne) {
	if (colonne === undefined) {
		colonne = this.colonne;
	}
	if (rangee === undefined) {
		rangee = this.rangee;
	}

	return this.firstChild.firstChild.childNodes[rangee].childNodes[colonne];
}

function caseValide(rangee, colonne) {
	var hauteur = this.hauteur;
	var largeur = this.largeur;

	var resultat = false;
	resultat = ((colonne >= 0) &&
		(colonne < largeur) &&
		(rangee >= 0) &&
		(rangee < hauteur) &&
		(this.prendreCase(rangee, colonne).chemins === undefined));
	return resultat;
}

function ouvrir(dir) {
	var skin = this.skin;

	var leTD = this.prendreCase();

	var leStyle = leTD.style;
	dir %= 4;
	leTD.chemins |= Math.pow(2, dir);

	if (suivi) {
		leStyle.backgroundImage = "url(" + cheminSkins + skin + "/" + leTD.chemins + ".gif)";
	}
}

function test() {
	this.prendreCase().firstChild.src = "d1.gif";
}

function changerIcone(dir) {
	if (!suivi) {
		return;
	}
	var skin = this.skin;
	var leTD = this.prendreCase();
	var lImage = leTD.firstChild;
	var leStyle = leTD.style;
	if (dir === -2) {
		lImage.src = "espace.gif"; //	met un espaceur
	} else {
		lImage.src = "d" + dir + ".gif";
	}
}
// XXXXXXXX
function changerSkin(objet, id) {
	var labyrinthe = document.getElementById(id);
	labyrinthe.appliquerSkin(objet.value);
}

function appliquerSkin(skin) {
	this.skin = skin;
	var largeur = this.largeur;
	var hauteur = this.hauteur;
	var labyrinthe = this.firstChild.firstChild;
	if (labyrinthe === null) {
		return;
	}
	var leTD, lImage, pos, leSrc;

	for (var rangee = 0; rangee < hauteur; rangee++) {
		for (var colonne = 0; colonne < largeur; colonne++) {
			leTD = this.prendreCase(rangee, colonne);
			lImage = cheminSkins + skin + "/" + leTD.chemins + ".gif";
			leTD.style.backgroundImage = "url(" + lImage + ")";

			leSrc = leTD.firstChild.src;
			pos = leSrc.lastIndexOf("/") + 1;
			leSrc = leSrc.substr(pos, 1);
			if (leSrc != "e" && leSrc != "d") {
				leTD.firstChild.src = lImage;
			}
		}
	}
}
