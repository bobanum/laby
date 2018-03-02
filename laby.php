<?php
require("laby.inc.php");

$l = (isset($_GET['l'])) ? $_GET['l'] : 12;
$h = (isset($_GET['h'])) ? $_GET['h'] : 10;
$laby = new Labyrinthe($l, $h);

if (isset($_GET['js'])) {
	header("content-type:text/javascript");
	echo $laby->js();
}else if (isset($_GET['php'])) {
	header("content-type:text/plain");
	echo $laby->php();
}else if (isset($_GET['table'])) {
	$skins = array('angle','autre','bosses','brique','courbe','creux','ligne','ligne2','mur','pierre','rond','rough','route','tuyau');
	$s = (isset($_GET['s'])) ? $_GET['s'] : $skins[array_rand($skins)];
	echo $laby->table($s);
}else{
	$skins = array('angle','autre','bosses','brique','courbe','creux','ligne','ligne2','mur','pierre','rond','rough','route','tuyau');
	$s = (isset($_GET['s'])) ? $_GET['s'] : $skins[array_rand($skins)];
	echo $laby->html($s);
}
?>
