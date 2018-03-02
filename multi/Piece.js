/*jslint esnext:true, browser:true */
/*globals Mur, App, Coin*/
class Piece {
	constructor() {
		this.murs = [];
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
	ajouterCoin(coin) {
		if (this.coins.length === 0) {
			this.coins.push(coin);
			return this;
		}
		var dernier = this.coins.slice(-1)[0];
		var mur = new Mur(dernier, coin);
		//////////////////////////////////
		this.coins.push(coin);
		this.murs.push(mur);
		mur.coins.push(dernier);
		mur.coins.push(coin);
		mur.pieces.push(this);
		coin.pieces.push(this);
		coin.murs.push(mur);
		dernier = coin;
	}
	ajouterCoins(coins) {
		var dernier;
		if (this.coins.length) {
			dernier = this.coins.slice(-1)[0];
		} else {
			dernier = coins.slice(-1)[0];

		}
		coins.forEach(function (coin) {
			var mur = new Mur();
			this.coins.push(coin);
			this.murs.push(mur);
			mur.coins.push(dernier);
			mur.coins.push(coin);
			mur.pieces.push(this);
			coin.pieces.push(this);
			coin.murs.push(mur);
			dernier = coin;
		}, this);
	}
	ajouterMur() {

	}
	dom_creer() {
		var resultat, points;
		points = this.coins.map((c)=>(c.coords)).join(" ");
		resultat = document.createElementNS(App.NS, "polygon");
		resultat.setAttribute("points", points);
		resultat.style.fillOpacity = 0.2;
		return resultat;
	}
	dom_murs() {
		var resultat, points;
		points = this.coins.map((c)=>(c.coords)).join(" ");
		resultat = document.createElementNS(App.NS, "g");
		this.murs.forEach((m)=>(resultat.appendChild(m.dom)));
		return resultat;
	}
	static init() {

	}
}
Piece.init();
