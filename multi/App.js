/*jslint esnext:true, browser:true */
/*globals Piece, Coin*/
class App {
	constructor() {

	}
	static ajouterSVG() {
		var resultat;
		resultat = document.createElementNS(this.NS, "svg");
		resultat.setAttribute("viewBox", "-2 -2 100 100");
		document.body.appendChild(resultat);
		this.svg = resultat;
		this.svg.obj = this;
		return resultat;
	}
	static init() {
		this.NS = this.prototype.NS = "http://www.w3.org/2000/svg";
		this.evt = {
			window: {
				load: function () {
					App.ajouterSVG();
					var piece, p2;
					piece = new Piece();
					piece.ajouterCoins([
						new Coin(0,0),
						new Coin(10,0),
						new Coin(10,10),
						new Coin(0,10)
					]);
					p2 = piece.murs[2].ajouterPiece(new Piece());
					p2.ajouterCoins([
						new Coin(20,0),
						new Coin(20,10)
					]);
					App.svg.appendChild(piece.dom);
					App.svg.appendChild(piece.dom_murs());
					App.svg.appendChild(p2.dom);
					App.svg.appendChild(p2.dom_murs());
				}
			}
		};
		window.addEventListener("load", this.evt.window.load);
	}
}
App.init();
