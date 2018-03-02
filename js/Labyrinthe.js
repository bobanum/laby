/*jslint esnext:true,browser:true*/
/*globals Curseur, Cellule*/
class Labyrinthe {
	constructor(largeur, hauteur) {
		this.largeur = largeur || 10;
		this.hauteur = hauteur || 10;
		this.creer();
		this.ajouterES();
		this._skin = null;
	}
	get skin() {
		return this._skin;
	}
	set skin(val) {
		this._skin = val;
		val.labyrinthe = this;
	}
	/**
	 * Retourne une grille de la dimension du labyrinthe
	 * dont toutes les cellules sont fermées
	 * @returns {Array} - Un tableau à 2 dimensions d'objets Cellule
	 */
	creerGrille() {
		var resultat, rangee, colonne;
		resultat = [];

		for (rangee = 0; rangee < this.hauteur; rangee++) {
			resultat[rangee] = [];
			for (colonne = 0; colonne < this.largeur; colonne++) {
				let cellule = new Cellule(rangee, colonne);
				cellule.labyrinthe = this;
				resultat[rangee][colonne] = cellule;
			}
		}
		return resultat;
	}
	parcourirGrille(fct, thisArg) {
		var resultat, hauteur, largeur, rangee, colonne;
		thisArg = thisArg || this;
		hauteur = this.hauteur;
		largeur = this.largeur;
		resultat = [];
		for (rangee = 0; rangee < hauteur; rangee++) {
			for (colonne = 0; colonne < largeur; colonne++) {
				resultat.push(fct.call(thisArg, this.cellule(rangee, colonne), rangee, colonne));
			}
		}
		return resultat;
	}
	/**
	 * Retourne une certaine cellule en fonction de la rangee et de la colonne données
	 * @param   {number}  rangee  - La rangee à regarder. On peut également donner un Curseur
	 * @param   {number}  colonne - La colonne à regarder
	 * @returns {boolean} - L'objet Cellule trouvée ou false
	 */
	cellule(rangee, colonne) {
		if (arguments[0] instanceof Curseur) {
			return this.cellule(arguments[0].rangee, arguments[0].colonne);
		}
		if (rangee < 0 || rangee >= this.hauteur || colonne < 0 || colonne >= this.largeur) {
			return false;
		}
		return this.grille[rangee][colonne];
	}
	creer() {
		var curseur, trajet, nCurseur;

		// On fabrique un labyrinthe vierge rempli de cellule intactes
		this.grille = this.creerGrille();
		curseur = new Curseur(
			Math.floor(this.hauteur / 2), // On démarre le curseur à un endroit aléatoire
			Math.floor(this.largeur / 2) // On démarre le curseur à un endroit aléatoire
		);
		curseur.provenance = this.hasard(4); // On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
		trajet = [curseur]; // Permet de revenir en arrière lorsque le curseur est bloqué
		while (trajet.length > 0) {
			nCurseur = this.trouverOuverture(curseur);
			if (nCurseur) {
				trajet.push(nCurseur); // On garde en mémoire le curseur pour le retour
				curseur = nCurseur;
			} else {
				curseur = trajet.pop(); // On retire la direction
			}
		} // On arrête le curseur et le labyrinthe quand le curseur est à son point de départ
		return this; // On retourne le labyrinthe
	}
	/**
	 * Tente de trouver une ouverture dans les cellules adjacentes d'un curseur
	 * @param   {Curseur} curseur - Le curseur à tester
	 * @returns {boolean} - Un nouveau curseur
	 */
	trouverOuverture(curseur) {
		while (curseur.tentatives.length) { // On teste les 4 directions pour en trouver une valide
			var nCurseur = curseur.nouvelleTentative();

			// Si la case est valide, on ouvre le mur et on déplace le curseur
			var cellule = this.cellule(nCurseur);
			if (cellule && cellule.libre) {
				this.ouvrirDevant(curseur);
				this.ouvrirDerriere(nCurseur);
				curseur = nCurseur;
				return nCurseur; // On garde en mémoire le curseur pour le retour
			}
		}
		return false;
	}
	/**
	 * Ajoute l'entree et la sortie
	 * @returns {Labyrinthe} - this
	 */
	ajouterES() {
		this.cellule(0, 0).ouvrir("ouest");

		this.cellule(this.hauteur-1, this.largeur-1).ouvrir("sud");

//		var entree = this.hasard(this.largeur);
//		var sortie = this.largeur - entree - 1;
//
//		this.cellule(0, entree).ouvrir("nord");
//		this.cellule(this.hauteur - 1, sortie).ouvrir("sud");
		return this;
	}
	ouvrirDevant(curseur) {
		this.cellule(curseur).ouvrir(curseur.dir);
		return this;
	}
	ouvrirDerriere(curseur) {
		this.cellule(curseur).ouvrir(curseur.dirInverse);
		return this;
	}
	fermerDevant(curseur) {
		this.cellule(curseur).fermer(curseur.dir);
		return this;
	}
	fermerDerriere(curseur) {
		this.cellule(curseur).fermer(curseur.dirInverse);
		return this;
	}
	hasard(nombre) {
		return (Math.floor(Math.random() * nombre));
	}
	static parseDirection(direction) {
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
	static init() {
		this.directions = {nord:0, est:1, sud:2, ouest:3};
	}
}
Labyrinthe.init();