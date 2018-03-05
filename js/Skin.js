/*jslint esnext:true,browser:true*/
/*globals Cellule*/
class Skin {
	/**
	 * Constructor
	 * @param {string} skin L'adresse du skin (le nom seulement)
	 */
	constructor(skin) {
		this.skin = skin;
	}
	/**
	 * Le dom de la grille à afficher
	 * @type {HTMLElement}
	 */
	get dom() {
		if (!this._dom) {
			this.dom = this.dom_creer();
		}
		return this._dom;
	}
	set dom(val) {
		this._dom = val;
		val.obj = this;
	}
	dom_creer() {
		var resultat;
		resultat = document.createElement("div");
		resultat.classList.add("skin");
		resultat.appendChild(this.dom_grille());
		//		resultat.appendChild(this.dom_bords(this.dom_grille()));
		return resultat;
	}
	dom_bords(grille) {
		var resultat, tbody, tr, td, i, j;
		resultat = document.createElement("table");
		resultat.classList.add("bords");
		tbody = resultat.appendChild(document.createElement("tbody"));
		for (i = 0; i < 3; i += 1) {
			tr = tbody.appendChild(document.createElement("tr"));
			for (j = 0; j < 3; j += 1) {
				td = tr.appendChild(document.createElement("td"));
				if (i === 1 && j === 1) {
					td.appendChild(grille);
				}
			}
		}
		return resultat;
	}
	dom_grille() {
		var resultat;
		resultat = document.createElement("div");
		resultat.classList.add("grille");
		resultat.style.fontSize = Cellule.taille + "px";
		resultat.style.width = this.labyrinthe.largeur + "em";
		this.labyrinthe.parcourirGrille(function (cellule) {
			resultat.appendChild(this.dom_BGPos(cellule));
		}, this);
		return resultat;
	}
	dessiner(skin, id) {
		document.getElementById(id).innerHTML = this.affichage(skin);
	}
	changerSkin(objet) {
		var skincourant;
		skincourant = objet.value;
		this.dessiner(skincourant, 'lab');
	}
	static url(image) {
		var resultat;
		resultat = this.chemin;
		if (image !== undefined) {
			resultat += '/' + image;
		}
		return resultat;
	}
	url(cellule) {
		var resultat = '';
		if (cellule === undefined) {
			resultat += '' + Skin.chemin + '/' + this.skin + '.gif';
		} else {
			resultat += '' + Skin.chemin + '/' + this.skin + '/' + cellule.binaire + '.gif';
		}
		return resultat;
	}
	/**
	 * Retourne la valeur de la propriete CSS background-position d'une cellule
	 * @param   {Cellule} cellule La cellule à observer
	 * @returns {string}  La valeur. ex.: "-1em, -4em
	 */
	dom_BGPos(cellule) {
		var resultat;
		var posbg = [
			[0, 0], [3, 0], [0, 1], [3, 1],
			[1, 0], [2, 0], [1, 1], [2, 1],
			[0, 3], [3, 3], [0, 2], [3, 2],
			[1, 3], [2, 3], [1, 2], [2, 2],
		];
		var bin = cellule.binaire;
		resultat = document.createElement("div");
		resultat.style.backgroundPosition = (-posbg[bin][1]) + "em " + (-posbg[bin][0]) + "em ";
		return resultat;
	}
	static ajouterStyle() {
		var s = document.createElement('style');
		this.styles = {};
		document.head.appendChild(s);
		s.innerHTML = 'div.skin{}div.grille{}div.grille>div{}';
		this.styles.skin = s.sheet.cssRules[0].style;
		this.styles.grille = s.sheet.cssRules[1].style;
		this.styles.cellule = s.sheet.cssRules[2].style;
		this.styles.grille.backgroundImage = 'url("'+this.cheminTexture('plancherbriques/256.png')+'")';
		this.styles.grille.backgroundSize = '100px';
		this.styles.cellule.backgroundImage = 'url("'+this.chemin('murs.svg')+'")';
	}
	static perso() {
		var largeur, hauteur;
		largeur = parseInt(document.getElementById("largeur").value);
		hauteur = parseInt(document.getElementById("hauteur").value);
		if (isNaN(largeur)) {
			largeur = 15;
		}
		if (isNaN(hauteur)) {
			hauteur = 15;
		}
		return new this(largeur, hauteur);
	}
	static chemin(fic) {
		if (fic === undefined) {
			return this._chemin;
		} else {
			return this._chemin + "/" + fic;
		}
	}
	static cheminTexture(fic) {
		if (fic === undefined) {
			return this._cheminTextures;
		} else {
			return this._cheminTextures + "/" + fic;
		}
	}
	static init() {
		this._chemin = "../images/skins";
		this._cheminTextures = "../images/textures";
		this.prototype.skin = this.skin = "pierre";
		this.skins = ["pierre", "brique", "ligne", "ligne2", "courbe", "rond", "bosses", "creux", "mur", "tuyau", "autre", "angle", "angle2", "rough", "route"];
		window.addEventListener("load", function () {
			Skin.ajouterStyle();
		})
	}
}
Skin.init();
