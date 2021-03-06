/*jslint esnext:true,browser:true*/
/*globals Labyrinthe, Cellule*/
class Curseur {
	constructor(rangee, colonne, dir) {
		this.rangee = rangee || 0;
		this.colonne = colonne || 0;
		this.dir = dir || 0;
		this._provenance = 0;
		this.tentatives = [1, 2, 3];
		this.tentatives.sort(()=>(Math.random() < 0.5));
		this.labyrinthe = null;
	}
	get dir() {
		return this._dir;
	}
	set dir(val) {
		val = val || 0;
		this._dir = ((val % 4) + 4) %4;
	}
	get provenance() {
		return this._provenance;
	}
	set provenance(val) {
		val = val || 0;
		this._provenance = ((val % 4) + 4) %4;
	}
	get dirInverse() {
		return (this.dir + 2) % 4;
	}
	placer (rangee, colonne, dir) {
		this.rangee = rangee;
		this.colonne = colonne;
		if (dir !== undefined) {
			this.dir = dir;
		}
		return this;
	}
	egal(curseur) {
		return this.rangee === curseur.rangee && this.colonne === curseur.colonne;
	}
	clone() {
		var resultat = new Curseur(this.rangee, this.colonne, this.dir);
		resultat.labyrinthe = this.labyrinthe;
		return resultat;
	}
	cellule() {
		return this.labyrinthe.cellule(this);
	}
	/**
	 * Tente de trouver une ouverture dans les cellules adjacentes au curseur
	 * @returns {Curseur|null} - Un nouveau curseur dans la cellule libre
	 */
	trouverOuverture() {
		while (this.tentatives.length) { // On teste les 4 directions pour en trouver une valide
			var nCurseur = this.nouvelleTentative();
			// On retourne la case si elle est valide, on ouvre le mur et on déplace le curseur
			var cellule = nCurseur.cellule();
			if (cellule && cellule.libre) {
				return nCurseur; // On retourne le curseur
			}
		}
		return null;
	}
	nouvelleTentative() {
		var resultat;
		this.dir = this.provenance + this.tentatives.shift();
		resultat = this.clone().avancer();
		resultat.provenance = this.dirInverse;
		return resultat;
	}
	avancer(qte) {
		if (qte === undefined) {
			qte = 1;
		}
		this.rangee += this.tDelta.rangee[this.dir] * qte; // On calcule la nouvelle position du curseur
		this.colonne += this.tDelta.colonne[this.dir] * qte; // On calcule la nouvelle position du curseur
		return this;
	}
	retourner() {
		this.dir = this.dirInverse;
		return this;
	}
	tournerGauche() {
		this.dir = (this.dir + 3) % 4;
		return this;
	}
	tournerDroite() {
		this.dir = (this.dir + 1) % 4;
		return this;
	}
	ouvrirDevant(place) {
		if (place === undefined) {
			this.ouvrirDevant(this.cellule());
		} else if (place instanceof Labyrinthe) {
			this.ouvrirDevant(place.cellule(this));
		} else if (place instanceof Cellule) {
			place.ouvrir(this.dir);
		} else {
			throw "Mauvais type de données";
		}
		return this;
	}
	ouvrirDerriere(place) {
		if (place === undefined) {
			this.ouvrirDerriere(this.cellule());
		} else if (place instanceof Labyrinthe) {
			this.ouvrirDerriere(place.cellule(this));
		} else if (place instanceof Cellule) {
			place.ouvrir(this.dirInverse);
		} else {
			throw "Mauvais type de données";
		}
		return this;
	}
	fermerDevant(place) {
		if (place === undefined) {
			this.fermerDevant(this.cellule());
		} else if (place instanceof Labyrinthe) {
			this.fermerDevant(place.cellule(this));
		} else if (place instanceof Cellule) {
			place.fermer(this.dir);
		} else {
			throw "Mauvais type de données";
		}
		return this;
	}
	fermerDerriere(place) {
		if (place === undefined) {
			this.fermerDerriere(this.cellule());
		} else if (place instanceof Labyrinthe) {
			this.fermerDerriere(place.cellule(this));
		} else if (place instanceof Cellule) {
			place.fermer(this.dir);
		} else {
			throw "Mauvais type de données";
		}
		return this;
	}
	estDedans(hauteur, largeur) {
		return (this.colonne >= 0) &&
			(this.colonne < largeur) &&
			(this.rangee >= 0) &&
			(this.rangee < hauteur);
	}
	static init() {
		this.prototype.tDelta = {
			rangee: [-1, 0, 1, 0], // Permet le déplacement du curseur selon la direction
			colonne: [0, 1, 0, -1] // Permet le déplacement du curseur selon la direction
		};

	}
}
Curseur.init();
