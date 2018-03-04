/*jslint esnext:true,browser:true*/
/*globals Sprite*/
class Perso extends Sprite {
	constructor(url) {
		super(Perso.chemin(url));
		this.queue = [];
	}
	init(props) {
		this.setEvents();
		super.init(props);
		this.direction = 1;
		this.vitesse = 0;
		return this;
	}
	get cellule() {
		return this._cellule;
	}
	set cellule(val) {
		this._cellule = val;
		this.x = val.colonne * 2 + 0.5;
		this.y = val.rangee * 2 + 0.5;
	}
	get domImage() {
		return this.dom.firstChild;
	}
	get direction() {
		return this._direction;
	}
	set direction(val) {
		this._direction = val;
		this.domImage.style.backgroundPositionX = "-"+val+"em";
	}
	get vitesse() {
		return this._vitesse;
	}
	set vitesse(val) {
		this._vitesse = val;
		if (this._vitesse === 0) {
			this.domImage.style.animationIterationCount = "0";
		} else {
			this.domImage.style.animationIterationCount = "infinite";
			this.domImage.style.animationDuration = this.animPas + "ms";
			this.avancer();
		}
	}
	avancer() {
		var fermee = this.cellule.ouverture(this.direction);
		if (fermee) {
			return this.finMouvement();
		}
		this.dom.style.transitionDuration = (this.animMouvement) + "ms";
		this.cellule = this.cellule.voisine(this.direction);
		this.dom.addEventListener('transitionend', this.evt.dom.transitionend);
	}
	dom_creer() {
		var resultat;
		resultat = super.dom_creer();
		resultat.classList.add("perso");
		Sprite.addEventListeners(window, this.evt.window);
		return resultat;
	}
	mouvement(dir) {
		if (dir === undefined) {
			return this;
		}
//		if (this.direction === dir) {
//			this.vitesse = Math.min(1, this.vitesse + 1);
//		} else {
			this.vitesse = 0;
			this.direction = dir;
			this.vitesse = 1;
//		}
		return this;
	}
	queueEvent(e) {
		this.queue.push(e);
		if (this.queue.length === 1) {
			this.unqueueEvent();
		}
		return this;
	}
	unqueueEvent() {
		if (this.queue.length === 0) {
			return this;
		}
		var e = this.queue[0];
		var directions = {
			ArrowUp:0,
			ArrowRight:1,
			ArrowDown:2,
			ArrowLeft:3
		};
		var dir = directions[e.code];
		this.mouvement(dir);
		return this;
	}
	finMouvement() {
		this.dom.removeEventListener('transitionend', this.evt.dom.transitionend);
		this.queue.shift();
		this.vitesse = 0;
		this.unqueueEvent();
	}
	setEvents() {
		var sprite = this;
		this.evt = {
			window: {
				keydown: function (e) {
					sprite.queueEvent(e);
				}
			},
			dom: {
				transitionend: function () {
					sprite.finMouvement();
				}
			}
		};
	}
	static chemin(fic) {
		if (fic === undefined) {
			return this._chemin;
		} else {
			return this._chemin + "/" + fic;
		}
	}
	static init() {
		this._chemin = "images/persos";
		this.prototype.animMouvement = 500;
		this.prototype.animPas = 300;
	}
}
Perso.init();
