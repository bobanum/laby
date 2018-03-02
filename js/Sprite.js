/*jslint esnext:true,browser:true*/
/*globals Point*/
class Sprite extends Point {
	constructor(url) {
		super(0, 0);
		this.url = url;
	}
	init(props) {
		this.setProperties(props);
		return this;
	}
	get x() {
		return super.x;
	}
	set x(val) {
		super.x = val;
		this.dom.style.left = this.x + "em";
	}
	get y() {
		return  super.y;
	}
	set y(val) {
		super.y = val;
		this.dom.style.top = this.y + "em";
	}
	get dom() {
		if (!this._dom) {
			this.dom = this.dom_creer();
		}
		return this._dom;
	}
	set dom(val) {
		val.obj = this;
		this._dom = val;
	}
	get position() {
		return Point.fromObject(this);
	}
	set position(val) {
		val = Point.createFrom(val);
		this.x = val.x;
		this.y = val.y;
	}
	getProperties(props) {
		var resultat;
		resultat = {};
		if (!props || typeof props !== "object") {
			props = Object.keys(this);
		} else if (!(props instanceof Array)) {
			props = Object.keys(props);
		}
		resultat = props.reduce((cumul, prop)=>(cumul[prop] = this.getProperty(prop)), {});
		return resultat;
	}
	setProperties(props) {
		var i;
		if (!props) {
			return this;
		}
		for (i in props) {
			this.setProperty(i, props[i]);
		}
		return this;
	}
	getProperty(prop) {
		return this[prop];
	}
	setProperty(prop, val) {
		this[prop] = val;
		return this;
	}
	static addEventListeners(obj, evts) {
		var evt;
		for (evt in evts) {
			obj.addEventListener(evt, evts[evt]);
		}
		return this;
	}
	dom_creer() {
		var resultat, image;
		resultat = document.createElement("div");
		resultat.classList.add("sprite");
		resultat.classList.add(this.classe);
		resultat.style.left = this.x + "em";
		resultat.style.top = this.y + "em";
		image = resultat.appendChild(document.createElement("div"));
		image.style.backgroundImage = "url("+this.url+")";
		return resultat;
	}
	static init() {

	}
}
Sprite.init();
