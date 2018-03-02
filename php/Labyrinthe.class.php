<?php
class Labyrinthe {
	public $dimensions;
	public $premiereTuile = null;
	public $tuiles = array();
	public function __construct($largeur=10, $hauteur=10) {
		$this->dimensions = new Point($largeur, $hauteur);
	    $nord = null;
	    for ($r=0; $r<$hauteur; $r++) {
			$ouest = null;
			for ($c=0; $c<$largeur; $c++) {
				$t = new Tuile();
				$t->contenu = $r*$hauteur+$c;
				$t->labyrinthe = $this;
				$this->tuiles[] = $t;
				if ($ouest) {
					$ouest->voisins[Tuile::EST] = $t;
					$t->voisins[Tuile::OUEST] = $ouest;
				}
				$ouest = $t;
				if ($nord) {
					$nord->sud = $t;
					$t->nord = $nord;
					$nord = $nord->est;
				}
			}
			$nord = $t->x_ouest;
	    }
	    $this->premiereTuile = $this->tuiles[0];
	}
	private function initArray(){
		$this->laby = array_fill(0, $this->dimensions->x, array_fill(0, $this->dimensions->y, 0));
	}
	private function validerTuile($pt) {
		$y = $pt->y;
		$x = $pt->x;
		if ($y < 0 || $y >= count($this->laby)) return false;
		if ($y < 0 || $x >= count($this->laby[$y])) return false;
		return true;
	}
	private function ztuile($pt, $val=null) {
		$y = $pt->y;
		$x = $pt->x;
		if ($y < 0 || $y >= count($this->laby)) return false;
		if ($y < 0 || $x >= count($this->laby[$y])) return false;
		if (is_null($val)) return $this->laby[$y][$x];
		$this->laby[$y][$x] = $val;
		return $this;
	}
	private function generer() {
		$curseur = new Curseur(0, 0, 0);	// La position du curseur

		// On fabrique un labyrinthe vierge rempli de 0
		$laby = array_fill(0, $this->dimensions->x, array_fill(0, $this->dimensions->y, 0));

		$trajet = array();				// Permet de revenir en arrière lorsque le curseur est bloqué
		$curseur->deplacer($this->dimensions);
		$curseur->diviser(2)->map("floor");
		do {
			$curseur->direction = hasard(4);		// On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
			$rot = (hasard(2)*2)-1;		// Si le curseur ne peut pas avancer dans cette direction, il tournera de 90deg. direction-1 ou direction+1

			$trouve = false;				// Flag indiquant que le curseur est avancé et qu'on arrête de tourner
			for ($cpt=0; !$trouve && $cpt < 4; $cpt++){					// On teste les 4 direction pour en trouver une valide
				$nPos = $curseur->clone()->avancer();
				$tuile = $this->tuile($nPos);
				if ($tuile === 0) {
				// Si la tuile est valide, on ouvre le mur et on déplace le curseur
///////////////////////////////////////////////
					$nPos->retourner();
					$this->tuile($nPos, $tuile | pow(2, $nPos->direction));		// On ouvre le mur de la tuile courante vers la nouvelle position
					$this->tuile($curseur, $tuile | pow(2, $curseur->direction));		// On ouvre le mur de la tuile courante vers la nouvelle position
					$rangee = $nllerangee;				// On déplace le curseur vers la nouvelle position
					$colonne = $nllecolonne;				// On déplace le curseur vers la nouvelle position
					$direction = ($direction+2) % 4;					// Inverse la direction afin d'ouvrir le mur de la nouvelle position
					$laby[$rangee][$colonne]|= pow(2, $direction);		// On ouvre le mur de la nouvelle position
					$trajet[] = $direction;					// On garde en mémoire la direction du retour
					$trouve=true;							// On indique que la nouvelle position est bonne
				}else{	// Si la tuile n'est pas valide, on tourne la direction du curseur
					$direction = ($direction+$rot+4) % 4;		// On tourne le curceur dans la direction rot
				}

			}
			// Si le curseur est pris, on recule vers la tuile précédente
			if (!$trouve) {
				$direction = array_pop($trajet);					// On retire la direction
				$colonne = $colonne + $tDeltacolonne[$direction];	// On déplace le curseur vers cette direction
				$rangee = $rangee + $tDeltarangee[$direction];		// On déplace le curseur vers cette direction
			}
		}while (count($trajet) != 0);		// On arrête le curseur et le labyrinthe quand le curseur est à son point de départ
		$laby[0][0] |= 1;					// On ouvre le coin supérieur gauche
		$laby[$hauteur-1][$largeur-1] |= 4;	// On ouvre le coin inférieur droit

		return($laby);						// On retourne le labyrinthe
	}
}
$pt = new Curseur(10,10);
$pt->diviser(3);
$pt->map('floor');
$pt->retourner();
$pt->reculer();
var_export($pt);
class Point {
	public $x;
	public $y;

	public function __construct($x, $y=null) {
		$this->position($x, $y);
	}
	public function position($x, $y=null) {
		if (is_object($x)) {
			$pt = $x;
			$this->x = $pt->x;
			$this->y = $pt->y;
		}else if (is_null($y)){
			$this->x = $x;
			$this->y = $x;
		}else{
			$this->x = $x;
			$this->y = $y;
		}
		return $this;
	}
	public function operation($op, $val_x, $val_y=null) {
		$pt = new Point($val_x, $val_y);
		eval('$this->x '.$op.'= $pt->x; $this->y '.$op.'= $pt->y;');
		return $this;
	}
	public function cloner() {
		return new Curseur($this);
	}
	public function ajouter($val_x, $val_y=null) {
		return $this->operation("+", $val_x, $val_y);
	}
	public function enlever($val_x, $val_y=null) {
		return $this->operation("-", $val_x, $val_y);
	}
	public function multiplier($val_x, $val_y=null) {
		return $this->operation("*", $val_x, $val_y);
	}
	public function diviser($val_x, $val_y=null) {
		return $this->operation("/", $val_x, $val_y);
	}
	public function map($fct) {
		$this->x = $fct($this->x);
		$this->y = $fct($this->y);
		return $this;
	}
	public function intersect($x, $y, $largeur, $hauteur) {
		if (($this->x < $x) || ($this->y < $y) || ($this->x >= $x+$largeur) || ($this->y >= $y+$hauteur)) return false;
		return true;
	}
}
class Curseur {
	public $tuile;
	public $direction=0;	// 0=nord, 1=est, 2=sud, 3=ouest
	public function avancer($nb=1) {

	}
	public function tourner($nb=1) {	// 1=horaire, -1=anti-horaire
		$this->direction = ($direction+1)%4;
	}

}
class xCurseur extends Point {
	static private $tDelta;// Permet le déplacement du curseur selon la direction
	public $direction;
	public $tuile;
	public function __construct($x, $y=null, $dir=0) {
		self::$tDelta = array(new Point(0,-1), new Point(1,0), new Point(0,1), new Point(-1,0));
		parent::__construct($x, $y);
		$this->direction = $dir;
	}
	public function tourner($sens = null) {
		if (is_null($sens)) $sens = (hasard(2)*2)-1;
		if ($sens > 0) $this->direction++;
		if ($sens < 0) $this->direction--;
		return $this;
	}
	public function retourner() {
		$this->direction = ($this->direction + 2) % 4;
		return $this;
	}
	public function avancer($nb = 1) {
		$deplacement = self::$tDelta[$this->direction]->cloner()->multiplier($nb);
		return $this->ajouter($deplacement);
	}
	public function reculer($nb = 1) {
		$deplacement = self::$tDelta[$this->direction]->cloner()->multiplier($nb);
		return $this->enlever($deplacement);
	}
}

function hasard($nombre){
	return(rand(0, $nombre-1));
}

function labyrinthe($largeur, $hauteur){
	$rangee = 0;	// Entre autres la position du curseur
	$colonne = 0;	// Entre autres la position du curseur
	$direction = 0;	// La direction pointée par le curseur

	// On fabrique un labyrinthe vierge rempli de 0
	$laby = array_fill(0,$hauteur,array_fill(0,$largeur,0));
	/* version JS
	for ($rangee=0 ; $rangee<$hauteur; $rangee++){
		$laby[$rangee] = array();
		for ($colonne=0 ; $colonne<$largeur; $colonne++){
			$laby[$rangee][$colonne] = 0;
		}
	}*/
	$trajet = array();				// Permet de revenir en arrière lorsque le curseur est bloqué
	$colonne = floor($largeur/2);		// On démarre le curseur à un endroit aléatoire
	$rangee = floor($hauteur/2);		// On démarre le curseur à un endroit aléatoire
	$tDeltacolonne = array(0,1,0,-1);// Permet le déplacement du curseur selon la direction
	$tDeltarangee = array(-1,0,1,0);	// Permet le déplacement du curseur selon la direction
	do {
		$direction = hasard(4);		// On détermine une direction au hasard. 0=nord; 1=est; 2=sud; 3=ouest
		$rot = (hasard(2)*2)-1;		// Si le curseur ne peut pas avancer dans cette direction, il tournera de 90deg. direction-1 ou direction+1

		$trouve = false;				// Flag indiquant que le curseur est avancé et qu'on arrête de tourner
		for ($cpt=0; !$trouve && $cpt < 4; $cpt++){					// On teste les 4 direction pour en trouver une valide
			$nllecolonne = $colonne + $tDeltacolonne[$direction];	// On calcule la nouvelle position du curseur
			$nllerangee = $rangee + $tDeltarangee[$direction];		// On calcule la nouvelle position du curseur
			// La case est valide si elle est dans le tableau et que sa donnée est vierge
			$caseValide =
				($nllecolonne >= 0) && ($nllecolonne < $largeur) &&
				($nllerangee >= 0) && ($nllerangee < $hauteur) &&
				($laby[$nllerangee][$nllecolonne] == 0);
			// Si la case est valide, on ouvre le mur et on déplace le curseur
			if ($caseValide) {
				$laby[$rangee][$colonne]|= pow(2, $direction);		// On ouvre le mur de la case courante vers la nouvelle position
				$rangee = $nllerangee;				// On déplace le curseur vers la nouvelle position
				$colonne = $nllecolonne;				// On déplace le curseur vers la nouvelle position
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
	}while (count($trajet) != 0);		// On arrête le curseur et le labyrinthe quand le curseur est à son point de départ
	$laby[0][0] |= 1;					// On ouvre le coin supérieur gauche
	$laby[$hauteur-1][$largeur-1] |= 4;	// On ouvre le coin inf.rieur droit

	return($laby);						// On retourne le labyrinthe
}
function affichage($laby, $skin) {
	$resultat = '<table cellpadding="0" cellspacing="0">'."\n";
	$hauteur = count($laby);
	$largeur = count($laby[0]);
	for ($rangee=0; $rangee<$hauteur; $rangee++){
		$resultat .= "\t".'<tr>'."\n";
		for ($colonne=0; $colonne<$largeur; $colonne++){
			$resultat .= "\t\t".'<td><img src="'.$skin.'/'.$laby[$rangee][$colonne].'.gif"></td>'."\n";
		}
		$resultat .= "\t".'</tr>'."\n";
	}
	$resultat .= '</table>';
	return $resultat;
}
function sortie($laby){
	$resultat = "var laby = ";
	$res = array();
	$hauteur = count($laby);
	$largeur = count($laby[0]);
	for ($rangee=0; $rangee<$hauteur; $rangee++){
		$res[$rangee] = '[' . implode(',',$laby[$rangee]) . ']';
	}
	$resultat .= "[\n" . implode(",\n", $res) . "\n];";
	return $resultat;
}
function sortiePHP($laby){
	$resultat = "<?\n\$laby = ";
	$res = array();
	$hauteur = count($laby);
	$largeur = count($laby[0]);
	for ($rangee=0; $rangee<$hauteur; $rangee++){
		$res[$rangee] = 'array(' . implode(',',$laby[$rangee]) . ')';
	}
	$resultat .= "array(\n" . implode(",\n", $res) . "\n);\n?".">";
	return $resultat;
}
class Tuile {
	const NORD = 0;
	const EST = 1;
	const SUD = 2;
	const OUEST = 3;

	public $contenu = "";
	public $labyrinthe = null;
	public $ouvertures = array(false, false, false, false);
	public $voisins = array(null, null, null, null);
	public $nord = null;
	public $est = null;
	public $sud = null;
	public $ouest = null;
	public function __construct() {
		echo '';
	}
	public function __get($nom) {
		if (substr($nom, 0, 2) == "x_") return $this->extreme(substr($nom,2));
	}
	public function extreme($direction) {
		$direction = self::noDirection($direction);
		$voisin = $this;
		while ($voisin) {
			$ptr = $voisin;
			$voisin = $voisin->voisin($direction);
		}
		return $ptr;
	}
	static public function noDirection($direction) {
		if (is_string($direction)) {
			$direction = strtoupper($direction);
			$direction = self::$direction;
		}
		return $direction;
	}
	public function voisin($direction) {
		$direction = self::noDirection($direction);
		return $this->voisins[$direction];
	}
}
$l = new Labyrinthe();
print_r(($l->premiereTuile->x_sud->x_est->contenu));
?>
