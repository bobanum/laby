/*jslint esnext:true, browser:true*/
/*globals Labyrinthe*/
class App {
	static ajouterOptions() {
		document.body.appendChild(this.dom_options());
	}
	static dom_options() {
		var resultat;
		resultat = document.createElement('form');
		resultat.appendChild(this.dom_skins());
		resultat.appendChild(this.dom_tailles());
		return resultat;
	}
	static dom_skins() {
		var resultat, div;
		resultat = document.createElement('fieldset');
		div = resultat.appendChild(document.createElement('legend'));
		div.innerHTML = "Choisir le skin";
		div = resultat.appendChild(document.createElement('div'));
		div.classList.add("skins");
		Labyrinthe.skins.forEach(function (skin) {
			var s = div.appendChild(document.createElement('span'));
			var i = s.appendChild(document.createElement('input'));
			i.setAttribute("type", "radio");
			i.setAttribute("name", "skin");
			i.setAttribute("value", skin);
			i.setAttribute("id", "skin_" + skin);
			i.addEventListener("change", this.evt.btn_skin.click);
			var l = s.appendChild(document.createElement('label'));
			l.setAttribute("for", "skin_" + skin);
			l.style.backgroundImage = "url(" + this.cheminSkins + '/' + skin + '/0.gif)';
		}, this);
		return resultat;
	}
	static dom_tailles() {
		var resultat, div, btn;
		resultat = document.createElement('fieldset');
		div = resultat.appendChild(document.createElement('legend'));
		div.innerHTML = "Générer";
		div = resultat.appendChild(document.createElement('div'));
		div.classList.add("skins");
		btn = this.dom_bouton("taille", "Petit", this.evt.btn_taille.click);
		div.appendChild(btn);
		btn = this.dom_bouton("taille", "Moyen", this.evt.btn_taille.click);
		div.appendChild(btn);
		btn = this.dom_bouton("taille", "Grand", this.evt.btn_taille.click);
		div.appendChild(btn);
		btn = this.dom_bouton("taille", "Personnalisé", this.evt.btn_taille.click);
		div.appendChild(btn);
		this.ajouterDomLabelInput(div, "largeur", "Largeur", 10);
		this.ajouterDomLabelInput(div, "hauteur", "Hauteur", 10);
		return resultat;
	}
	static dom_bouton(name, value, evt) {
		var resultat;
		resultat = document.createElement('input');
		resultat.setAttribute("type", "button");
		resultat.setAttribute("name", name);
		resultat.setAttribute("value", value);
		if (evt) {
			resultat.addEventListener("click", evt);
		}
		return resultat;
	}
	static ajouterDomLabelInput(conteneur, id, etiquette, value) {
		var label, input;
		label = conteneur.appendChild(document.createElement('label'));
		label.setAttribute("for", id);
		label.innerHTML = etiquette;
		input = conteneur.appendChild(document.createElement('input'));
		input.setAttribute("type", 'text');
		input.setAttribute("id", id);
		input.setAttribute("name", id);
		input.setAttribute("size", 5);
		if (value !== undefined) {
			input.setAttribute("value", value);
		}
		return this;
	}
	static dom_sprite(classe, pos) {
		var resultat = document.createElement("div");
		resultat.classList.add("sprite");
		resultat.classList.add(classe);
		resultat.style.left = pos.x + "em";
		resultat.style.top = pos.y + "em";
		return resultat;
	}
	static ajouterEvts() {

	}
	static init() {
		this.prototype.cheminSkins = this.cheminSkins = "skins";
		this.evt = {
			window: {
				load: function () {
//					App.ajouterOptions();
					App.ajouterEvts();
				}
			},
			btn_skin: {
				click: function () {

				}
			},
			btn_taille: {
				click: function () {
					var l = new Labyrinthe(10,10);
					l.creer();
					var node = l.affichage("pierre");
					document.body.appendChild(node);
				}
			}
		};
		window.addEventListener("load", this.evt.window.load);
	}
}
App.init();
