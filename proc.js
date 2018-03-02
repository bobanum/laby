/*jslint browser:true*/
var cheminSkins = "skins/";
/** Fonction qui retrourne un tableau à 2 dimensions contenant le labyrinthe en fonction de la largeur et de la hauteur donnée en paramètres */
function labyrinthe(largeur, hauteur){
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
	rangee = Math.floor(hauteur/2);		// On démarre le curseur à un endroit aléatoire
	var tDeltaColonne = [0,1,0,-1];			// Permet le déplacement du curseur selon la direction
	var tDeltaRangee = [-1,0,1,0];			// Permet le déplacement du curseur selon la direction
	dir = hasard(4);				// On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
	do {
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
}
function affichage(laby, skin) {
	var resultat = '<table cellpadding="0" cellspacing="0">';
	var hauteur = laby.length;
	var largeur = laby[0].length;
	for (var rangee=0; rangee<hauteur; rangee++){
		resultat += '<tr>';
		for (var colonne=0; colonne<largeur; colonne++){
			resultat += '<td><img src="'+cheminSkins+skin+'/'+laby[rangee][colonne]+'.gif"></td>';
		}
		resultat += '</tr>';
	}
	return resultat;
}
function affichageBG(laby, skin) {
	var resultat = '<table cellpadding="0" cellspacing="0">';
	var hauteur = laby.length;
	var largeur = laby[0].length;
	for (var rangee=0; rangee<hauteur; rangee++){
		resultat += '<tr>';
		for (var colonne=0; colonne<largeur; colonne++){
			resultat += '<td><img style="background-image:url('+cheminSkins+skin+'/'+laby[rangee][colonne]+'.gif)" src="espace.gif"></td>';
		}
		resultat += '</tr>';
	}
	return resultat;
}
function dessiner(laby, skin, id) {
	document.getElementById(id).innerHTML = affichage(laby, skin);
}
function sortir(laby){
	var resultat = "var laby = ";
	var res = [];
	var hauteur = laby.length;
	for (var rangee=0; rangee<hauteur; rangee++){
		res[rangee] = '[' + laby[rangee].join(',') + ']';
	}
	resultat += '[' + res.join(',<br>') + '];';
	return resultat;
}
