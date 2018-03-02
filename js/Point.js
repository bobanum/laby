/*jslint esnext:true,browser:true*/
/*globals*/
class Point {
	constructor(x, y) {
		this._x = x || 0;
		this._y = y || 0;
	}
	init() {
		return this;
	}
	get x() {
		return this._x || 0;
	}
	set x(val) {
		this._x = val;
	}
	get y() {
		return this._y || 0;
	}
	set y(val) {
		this._y = val;
	}
	static fromString(val) {
		val = val.split(/, */);
		return this.fromArray(val);
	}
	static fromArray(val) {
		var resultat;
		resultat = new this(val[0], val[1]);
		return resultat;
	}
	static fromObject(val) {
		var resultat;
		resultat = new this(val.x, val.y);
		return resultat;
	}
	static createFrom(val) {
		if (typeof val === "string") {
			return this.fromString(val);
		} else if (val instanceof Array) {
			return this.fromArray(val);
		} else if (typeof val === "object") {
			return this.fromObject(val);
		} else {
			throw "Mauvais type de données";
		}
	}
	static init() {

	}
}
Point.init();
