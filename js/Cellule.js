/*jslint esnext:true,browser:true*/
/*globals Labyrinthe*/
class Cellule {
	constructor(rangee, colonne) {
		this.rangee = rangee || 0;
		this.colonne = colonne || 0;
		this.murs = [1, 1, 1, 1];
		this.labyrinthe = null;
	}
	get nord() {
		return this.murs[0];
	}
	set nord(val) {
		this.murs[0] = val;
	}
	get est() {
		return this.murs[1];
	}
	set est(val) {
		this.murs[1] = val;
	}
	get sud() {
		return this.murs[2];
	}
	set sud(val) {
		this.murs[2] = val;
	}
	get ouest() {
		return this.murs[3];
	}
	set ouest(val) {
		this.murs[3] = val;
	}
	get libre() {
		return this.murs.join('') === '1111';
	}
	get binaire() {
		var resultat;
		resultat = this.murs.slice(0).reverse().reduce(function (b, m) {
			return b * 2 + m;
		}, 0, this);
		return 15 - resultat;	// Jusqu'à ce qu'on renomme les fichiers
	}
	get nbMurs() {
		var resultat;
		resultat = this.murs.reduce(function (b, m) {
			return b + m;
		}, 0, this);
		return resultat;
	}
	parseDirection(direction) {
		if (typeof direction === "string") {
			if (direction[0] === '-') {
				return this.parseDirection(this.directions[direction.substr(1)] + 2);
			} else {
				return this.directions[direction];
			}
		} else if (typeof direction === "number") {
			return ((direction % 4) + 4) % 4;
		} else if (direction.dir !== undefined) {
			return this.parseDirection(direction.dir);
		} else {
			throw "Mauvais type de données";
		}
	}
	toString() {
		return this.murs.toString();
	}
	/**
	 * Retourne ou modifie l'ouverture de la cellule dans une certaine direction
	 * @param   {mived}   direction - La direction à traiter
	 * @param   {number}  etat      - Ouvrir ou fermer (0 ou 1)
	 * @returns {Cellule} - this
	 */
	ouverture(direction, etat) {
		direction = Labyrinthe.parseDirection(direction);
		if (etat === undefined) {
			return this.murs[direction];
		}
		this.murs[direction] = etat;
		return this;
	}
	voisine(direction) {
		direction = Labyrinthe.parseDirection(direction);
		switch (direction) {
			case 0:
				return this.labyrinthe.cellule(this.rangee-1, this.colonne);
			case 1:
				return this.labyrinthe.cellule(this.rangee, this.colonne+1);
			case 2:
				return this.labyrinthe.cellule(this.rangee+1, this.colonne);
			case 3:
				return this.labyrinthe.cellule(this.rangee, this.colonne-1);
		}
		return false;
	}
	ouvrir(direction) {
		return this.ouverture(direction, 0);
	}
	fermer(direction) {
		return this.ouverture(direction, 1);
	}
	static init() {
		this.taille = this.prototype.taille = 64;
	}
}
Cellule.init();
