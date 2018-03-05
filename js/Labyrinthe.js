/*jslint esnext:true,browser:true*/
/*globals Curseur, Cellule*/
class Labyrinthe {
	constructor(largeur, hauteur) {
		this.largeur = largeur || 10;
		this.hauteur = hauteur || 10;
		this.wrap = [false, false];
		this.sorties = true;
		this.creer();
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
		if (this.wrap[0]) {
			rangee = ((rangee % this.hauteur) + this.hauteur) % this.hauteur;
		}
		if (this.wrap[1]) {
			colonne = ((colonne % this.largeur) + this.largeur) % this.largeur;
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
			Math.floor(this.hauteur / 2), // On démarre le curseur à un endroit aléatoire ou au centre
			Math.floor(this.largeur / 2) // On démarre le curseur à un endroit aléatoire ou au centre
		);
		curseur.provenance = this.hasard(4); // On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
		curseur.labyrinthe = this;
		trajet = [curseur]; // Permet de revenir en arrière lorsque le curseur est bloqué
		while (trajet.length > 0) {
			nCurseur = curseur.trouverOuverture();	//Attention! Modifie le curseur
			if (nCurseur) {
				// On ouvre le mur et on déplace le curseur
				this.ouvrirDevant(curseur);
				this.ouvrirDerriere(nCurseur);
				trajet.push(nCurseur); // On garde en mémoire le curseur pour le retour
				curseur = nCurseur;
			} else {
				curseur = trajet.pop(); // On retire la direction
			}
		} // On arrête le curseur et le labyrinthe quand le curseur est à son point de départ
		if (this.sorties) {
			this.ajouterEntreeSortie();
		}
		return this; // On retourne le labyrinthe
	}
	/**
	 * Ajoute l'entree et la sortie
	 * @returns {Labyrinthe} - this
	 */
	ajouterEntreeSortie() {
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
		curseur.ouvrirDevant();
		return this;
	}
	ouvrirDerriere(curseur) {
		curseur.ouvrirDerriere();
		return this;
	}
	fermerDevant(curseur) {
		curseur.fermerDevant();
		return this;
	}
	fermerDerriere(curseur) {
		curseur.fermerDerriere();
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
