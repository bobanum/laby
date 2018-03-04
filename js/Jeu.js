/*jslint esnext:true, browser:true*/
/*globals Labyrinthe,Skin,Perso,Sprite*/
class Jeu {
	constructor(labyrinthe, skin) {
		this.labyrinthe = labyrinthe;
		this.labyrinthe.skin = skin;
		this.skin = skin;
		this.skin.labyrinthe = labyrinthe;
		this.sprites = {};
	}
	ajouter(nom, sprite) {
		this.skin.dom.appendChild(sprite.dom);
		this.sprites[nom] = nom;
		this[nom] = sprite;
		return this;
	}
	static init() {
		this.prototype.cheminSkins = this.cheminSkins = "skins";
		this.evt = {
			window: {
				load: function () {
					var largeur = 15, hauteur = 7;
					var jeu = new Jeu(new Labyrinthe(largeur, hauteur), new Skin("brique"));
					document.body.appendChild(jeu.skin.dom);
					var perso = new Perso("wnv1.png").init({classe:'femme', cellule: jeu.labyrinthe.cellule(0,0)});
					jeu.ajouter("femme", perso);
					var coffre = new Sprite(Perso.chemin("coffre.png")).init({classe:'coffre', x:largeur - 0.5, y:hauteur - 0.5});
					jeu.skin.dom.appendChild(coffre.dom);
					var portes = new Sprite(Perso.chemin("porte.png")).init({classe:'portes', x:(largeur - 1) * 2, y:(hauteur - 1) * 2});
					jeu.skin.dom.appendChild(portes.dom);
					var cle = new Sprite(Perso.chemin("cle.png")).init({classe:'cle', x:largeur - 0.5, y:hauteur - 0.5});
					jeu.skin.dom.appendChild(cle.dom);
				}
			}
		};
		window.addEventListener("load", this.evt.window.load);
	}
}
Jeu.init();
