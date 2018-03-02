/*jslint esnext:true,browser:true*/
/*globals Curseur, Labyrinthe*/
class Unicursal extends Labyrinthe {
	trouverCDS() {
		var resultat;
		resultat = [];
		this.parcourirGrille(function (cellule, rangee, colonne) {
			if (cellule.nbMurs === 3) {
				var cds = [cellule];
				var curseur = new Curseur(rangee, colonne);
				curseur.dir = cellule.murs.indexOf(0);
				curseur.avancer();
				while (cellule = this.cellule(curseur), cellule.nbMurs > 1) {
					cds.push(cellule);
					curseur.tournerGauche();
					while (cellule.murs[curseur.dir] === 1) {
						curseur.tournerDroite();
					}
					curseur.avancer();
				}
				resultat.push(cds);
			}
		});
		return resultat;
	}
	boucherCDS() {
		var resultat, cds;
		cds = this.trouverCDS();
		cds.filter((cd)=>(cd.length===2)).forEach(function (c) {
			c.slice(0).forEach(function (cellule) {
				var curseur = new Curseur(cellule.rangee, cellule.colonne);
				curseur.dir = cellule.murs.indexOf(0);
				cellule.fermer(curseur);
				curseur.avancer().retourner();
				curseur.fermerDevant(this);
			}, this);
		}, this);
		return resultat;
	}
	unicursal() {
		var resultat, cellz;
		cellz = [
			[9,3,12,6],	//0
			[5,5,3,9],	//1
			[6,10,3,10],	//2
			[5,3,3,10],	//3
			[6,12,5,5],	//4
			[5,5,5,5],	//5
			[6,10,5,6],	//6
			[5,3,5,6],	//7
			[10,12,10,9],	//8
			[9,5,10,9],	//9
			[10,10,10,10],	//10
			[9,3,10,10],	//11
			[10,12,12,5],	//12
			[9,5,12,5],	//13
			[10,10,12,6],	//14
			[15,15,15,15],	//15
		];
		resultat = [];
		for (var rangee = 0; rangee < this.hauteur; rangee ++) {
			resultat[rangee*2] = [];
			resultat[rangee*2+1] = [];
			for (var colonne = 0; colonne < this.largeur; colonne ++) {
				let cell = this.cellule(rangee, colonne);
				resultat[rangee*2][colonne*2] = cellz[cell][0];
				resultat[rangee*2][colonne*2+1] = cellz[cell][1];
				resultat[rangee*2+1][colonne*2] = cellz[cell][2];
				resultat[rangee*2+1][colonne*2+1] = cellz[cell][3];
			}
		}
		return resultat;
	}
	static init() {
	}
}
Unicursal.init();
