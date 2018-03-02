/*jslint browser:true*/
function hasard(nombre){
	return(Math.floor(Math.random()*nombre));
}
function Labyrinthe(largeur, hauteur, skin) {
	this.largeur = (largeur) ? largeur : 12;
	this.hauteur = (hauteur) ? hauteur : 10;
	this.cheminSkins = "skins/";
	this.tailleTuile = 32;
	this.skin = (skin) ? skin : "pierre";

	this.generer = function(largeur, hauteur){
		var rangee;		// Entre autres la position du curseur
		var colonne;	// Entre autres la position du curseur
		var dir;		// La direction pointée par le curseur

		// On fabrique un labyrinthe vierge rempli de 0
		var laby = [];
		for (rangee=0 ; rangee<hauteur; rangee++){
			laby[rangee] = [];
			for (colonne=0 ; colonne<largeur; colonne++){
				laby[rangee][colonne] = 0;
			}
		}
		var trajet = [];				// Permet de revenir en arrière lorsque le curseur est bloqué
		colonne = Math.floor(largeur/2);	// On démarre le curseur à un endroit aléatoire
		rangee = Math.floor(hauteur/2);	// On démarre le curseur à un endroit aléatoire
		var tDeltaColonne = [0,1,0,-1];			// Permet le déplacement du curseur selon la direction
		var tDeltaRangee = [-1,0,1,0];			// Permet le déplacement du curseur selon la direction
		do {
			dir = hasard(4);				// On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
			var rot = (hasard(2)*2)-1;			// Si le curseur ne peut pas avancer dans cette direction, il tournera de 90deg. dir-1 ou dir+1

			var trouve = false;					// Flag indiquant que le curseur est avancé et qu'on arrête de tourner
			for (var cpt=0; !trouve && cpt < 4; cpt++){				// On teste les 4 direction pour en trouver une valide
				var nlleColonne = colonne + tDeltaColonne[dir];		// On calcule la nouvelle position du curseur
				var nlleRangee = rangee + tDeltaRangee[dir];		// On calcule la nouvelle position du curseur
				// La case est valide si elle est dans le tableau et que sa donnée est vierge
				var caseValide =
					(nlleColonne >= 0) && (nlleColonne < largeur) &&
					(nlleRangee >= 0) && (nlleRangee < hauteur) &&
					(laby[nlleRangee][nlleColonne] === 0);
				// Si la case est valide, on ouvre le mur et on déplace le curseur
				if (caseValide) {
					laby[rangee][colonne]|= Math.pow(2, dir);		// On ouvre le mur de la case courante vers la nouvelle position
					rangee = nlleRangee;				// On déplace le curseur vers la nouvelle position
					colonne = nlleColonne;				// On déplace le curseur vers la nouvelle position
					dir = (dir+2) % 4;					// Inverse la direction afin d'ouvrir le mur de la nouvelle position
					laby[rangee][colonne]|= Math.pow(2, dir);		// On ouvre le mur de la nouvelle position
					trajet.push(dir);					// On garde en mémoire la direction du retour
					trouve=true;						// On indique que la nouvelle position est bonne
				}else{	// Si la case n'est pas valide, on tourne la direction du curseur
					dir = (dir+rot+4) % 4;		// On tourne le curceur dans la direction rot
				}

			}
			// Si le curseur est pris, on recule vers la case précédente
			if (!trouve) {
				dir = trajet.pop();						// On retire la direction
				colonne = colonne + tDeltaColonne[dir];	// On déplace le curseur vers cette direction
				rangee = rangee + tDeltaRangee[dir];	// On déplace le curseur vers cette direction
			}
		}while (trajet.length !== 0);		// On arrête le curseur et le labyrinthe quand le curseur est à son point de départ
		var depart = hasard(largeur);
		var arrivee = largeur-depart-1;
		laby[0][depart] |= 1;					// On ouvre le coin supérieur gauche
		laby[hauteur-1][arrivee] |= 4;	// On ouvre le coin inf.rieur droit

		return(laby);						// On retourne le labyrinthe
	};
	this.affichage = function(laby, skin) {
		var tbody;
		laby = (laby) ? laby : this.laby;
		skin = (skin) ? skin : this.skin;
		var table = document.createElement("table");
		table.cellPadding = table.cellSpacing = 0;
		tbody = table.appendChild(document.createElement("tbody"));
		var nb = laby.length;
		for (var rangee=0; rangee<nb; rangee++){
			tbody.appendChild(this.creerRangee(laby[rangee], skin));
		}
		return table;
	};
	this.creerRangee = function(aRangee, skin) {
		skin = (skin) ? skin : this.skin;
		var tr = document.createElement("tr");
		var nb = aRangee.length;
		for (var colonne=0; colonne<nb; colonne++){
			tr.appendChild(this.creerTuile(aRangee[colonne], skin));
		}
		return tr;
	};
	this.creerTuile = function(tuile, skin) {
		var offsetY = [0, 3, 0, 3, 1, 2, 1, 2, 0, 3, 0, 3, 1, 2, 1, 2];
		var offsetX = [0, 0, 1, 1, 0, 0, 1, 1, 3, 3, 2, 2, 3, 3, 2, 2];
		skin = (skin) ? skin : this.skin;
		var td = document.createElement("td");
		var img = td.appendChild(document.createElement("img"));
		img.src="espace.gif";
		img.style.width = img.style.height = this.tailleTuile + "px";
		img.style.backgroundImage = 'url('+this.cheminSkins+this.skin+'.gif)';
		img.style.backgroundPosition = -(offsetX[tuile] * this.tailleTuile) + "px "+ -(offsetY[tuile] * this.tailleTuile) + "px";
		return td;
	};
	this.genererCode = function(laby) {
		laby = (laby) ? laby : this.laby;
		var resultat = "var laby = ";
		var res = [];
		var hauteur = laby.length;
		//var largeur = laby[0].length;
		for (var rangee=0; rangee<hauteur; rangee++){
			res[rangee] = '[' + laby[rangee].join(',') + ']';
		}
		resultat += '[' + res.join(', ') + '];';
		return resultat;
	};
	this.laby = this.generer(this.largeur, this.hauteur);
}
