<?php 

	//$fp = fopen('data/foursquare/file.csv', 'w');
    //fputcsv($fp, array('item1','items'));
    //fclose($fp);

	$lat = $_POST["lat"];
	$lng = $_POST["lng"];
	$data = $_POST["data"];
	
	$file = "../data/foursquare/" . $lat. ";" .$lng. ".json";
	file_put_contents($file, json_encode($data));
?>