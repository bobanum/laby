/*jslint esnext:true, browser:true */
/*globals Piece*/
class Mur {
	constructor() {
		this.pieces = [];
		this.coins = [];
		arguments.forEach(function (e) {
			if (e instanceof Coin) {
				this.ajouterCoin(e);
			}
		}, this);
	}
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
		resultat = document.createElementNS(App.NS, "line");
		resultat.setAttribute("x1", this.coins[0].x);
		resultat.setAttribute("y1", this.coins[0].y);
		resultat.setAttribute("x2", this.coins[1].x);
		resultat.setAttribute("y2", this.coins[1].y);
		return resultat;
	}
	ajouterPiece(piece) {
		if (this.pieces.length !== 1) {
			throw "Il manque un mur";
		}
		if (!piece) {
			piece = new Piece();
		}
		this.coins.forEach((coin)=>(piece.coins.unshift(coin)));
		this.pieces[1] = piece;
		piece.murs.push(this);
		return piece;
	}
	static init() {
	}
}
Mur.init();
