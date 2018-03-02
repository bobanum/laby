/*jslint esnext:true, browser:true */
class Point {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	get coords() {
		return this.x + "," + this.y;
	}
	static init() {

	}
}
Point.init();
