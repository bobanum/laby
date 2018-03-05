<?php
require("php/laby.inc.php");

if (isset($_GET['largeur'])) {
	$l = $_GET['largeur'];
} else if (isset($_GET['width'])) {
	$l = $_GET['width'];
} else if (isset($_GET['l'])) {
	$l = $_GET['l'];
} else if (isset($_GET['w'])) {
	$l = $_GET['w'];
} else {
	$l = 12;
}

if (isset($_GET['hauteur'])) {
	$h = $_GET['hauteur'];
} else if (isset($_GET['height'])) {
	$h = $_GET['height'];
} else if (isset($_GET['h'])) {
	$h = $_GET['h'];
} else {
	$h = 10;
}

if (isset($_GET['nomVar'])) {
	$n = $_GET['nomVar'];
} else if (isset($_GET['n'])) {
	$n = $_GET['n'];
} else {
	$n = "gLaby";
}

$laby = new Labyrinthe($l, $h);

header("content-type:text/javascript");
echo $laby->js($n);

