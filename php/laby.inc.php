<?php
/**
 * Fonction qui retourne un tableau à 2 dimensions représentant un labyrinthe.
 * Chaque élément du tableau représente une tuile qui peut être ouverte dans 4 directions.
 * @param integer $largeur La largeur du labyrinthe
 * @param integer $hauteur La hauteur du labyrinthe
 * @return array Un tableau de tableaux de integers
 */
define('NORD', 1);
define('EST', 2);
define('SUD', 4);
define('OUEST', 8);
class Labyrinthe {
	public $laby;
	public $largeur;
	public $hauteur;
	public function __construct($largeur, $hauteur){
	  $this->largeur = $largeur;
	  $this->hauteur = $hauteur;
	  /* @var $rangee integer La position du curseur */
		$rangee = floor($hauteur/2);		// On démarre le curseur à un endroit aléatoire
	  /* @var $colonne integer La position du curseur */
		$colonne = floor($largeur/2);		// On démarre le curseur à un endroit aléatoire
	  /* @var $direction La direction pointée par le curseur */
	  $direction = 0;

		// On fabrique un labyrinthe vierge rempli de 0
		$laby = array_fill(0,$hauteur,array_fill(0,$largeur,0));
		$trajet = array();				// Permet de revenir en arrière lorsque le curseur est bloqué
		$tDeltacolonne = array(0,1,0,-1);// Permet le déplacement du curseur selon la direction
		$tDeltarangee = array(-1,0,1,0);	// Permet le déplacement du curseur selon la direction
		do {
			$direction = rand(0, 3);		// On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
			$rot = (rand(0, 1)*2)-1;		// Si le curseur ne peut pas avancer dans cette direction, il tournera de 90deg. direction-1 ou direction+1

			$trouve = false;				// Flag indiquant que le curseur est avancé et qu'on arrête de tourner
			for ($cpt=0; !$trouve && $cpt < 4; $cpt++){					// On teste les 4 direction pour en trouver une valide
				$nlleColonne = $colonne + $tDeltacolonne[$direction];	// On calcule la nouvelle position du curseur
				$nlleRangee = $rangee + $tDeltarangee[$direction];		// On calcule la nouvelle position du curseur
				// La case est valide si elle est dans le tableau et que sa donnée est vierge
				$caseValide =
					($nlleColonne >= 0) && ($nlleColonne < $largeur) &&
					($nlleRangee >= 0) && ($nlleRangee < $hauteur) &&
					($laby[$nlleRangee][$nlleColonne] == 0);
				// Si la case est valide, on ouvre le mur et on déplace le curseur
				if ($caseValide) {
					$laby[$rangee][$colonne]|= pow(2, $direction);		// On ouvre le mur de la case courante vers la nouvelle position
					$rangee = $nlleRangee;				// On déplace le curseur vers la nouvelle position
					$colonne = $nlleColonne;				// On déplace le curseur vers la nouvelle position
					$direction = ($direction+2) % 4;					// Inverse la direction afin d'ouvrir le mur de la nouvelle position
					$laby[$rangee][$colonne]|= pow(2, $direction);		// On ouvre le mur de la nouvelle position
					$trajet[] = $direction;					// On garde en mémoire la direction du retour
					$trouve=true;							// On indique que la nouvelle position est bonne
				}else{	// Si la case n'est pas valide, on tourne la direction du curseur
					$direction = ($direction+$rot+4) % 4;		// On tourne le curceur dans la direction rot
				}
			}
			// Si le curseur est pris, on recule vers la case précédente
			if (!$trouve) {
				$direction = array_pop($trajet);					// On retire la direction
				$colonne = $colonne + $tDeltacolonne[$direction];	// On déplace le curseur vers cette direction
				$rangee = $rangee + $tDeltarangee[$direction];		// On déplace le curseur vers cette direction
			}
		} while (count($trajet) > 0);		// On arrête le curseur et le labyrinthe quand le curseur est à son point de départ
		$laby[0][0] |= 1;					// On ouvre le coin supérieur gauche
		$laby[$hauteur-1][$largeur-1] |= 4;	// On ouvre le coin inférieur droit

		$this->laby = $laby;						// On garde le labyrinthe
	}
	function js($nomVar = "gLaby"){
		$laby = $this->laby;
		$resultat = "var $nomVar = ";
		$res = array();
		$hauteur = $this->hauteur;
		$largeur = $this->largeur;
		for ($rangee=0; $rangee<$hauteur; $rangee++){
			$res[$rangee] = '[' . implode(',',$laby[$rangee]) . ']';
		}
		$resultat .= "[\n" . implode(",\n", $res) . "\n];";
		return $resultat;
	}
	public function php(){
		$laby = $this->laby;
		$resultat = "<?\n\$laby = ";
		$res = array();
		$hauteur = $this->hauteur;
		$largeur = $this->largeur;
		for ($rangee=0; $rangee<$hauteur; $rangee++){
			$res[$rangee] = 'array(' . implode(',',$laby[$rangee]) . ')';
		}
		$resultat .= "array(\n" . implode(",\n", $res) . "\n);\n?".">";
		return $resultat;
	}
	public function table($skin="ligne") {
		$laby = $this->laby;
		$resultat = '<table cellpadding="0" cellspacing="0">'."\n";
		$hauteur = $this->hauteur;
		$largeur = $this->largeur;
		for ($rangee=0; $rangee<$hauteur; $rangee++){
			$resultat .= "\t".'<tr>'."\n";
			for ($colonne=0; $colonne<$largeur; $colonne++){
				$resultat .= "\t\t".'<td><img src="skins/'.$skin.'/'.$laby[$rangee][$colonne].'.gif"></td>'."\n";
			}
			$resultat .= "\t".'</tr>'."\n";
		}
		$resultat .= '</table>';
		return $resultat;
	}
	public function html($skin="ligne") {
		$laby = $this->laby;
		$resultat = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		$resultat = '<html xmlns="http://www.w3.org/1999/xhtml">';
		$resultat .= '<head>';
		$resultat .= '<title>Labyrinthe</title>';
		$resultat .= '<meta http-equiv="content-type" content="text/html;charset=utf-8" /></head><body>';
		$resultat .= $this->table($skin);
		$resultat .= '</body></html>';
		return $resultat;
	}

}
//var_export(labyrinthe(10,10));
