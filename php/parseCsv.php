<?php 
	$array = array();
	$row = 1;
	if (($handle = fopen("../data/foursquare/fs-1.csv", "r")) !== FALSE) {
	    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	        //$num = count(print_r($data,true));
	        //echo print_r($data,true);
	        array_push( $array, $data );
	        //echo "<p> $num fields in line $row: <br /></p>\n";
	        $row++;
	        /*for ($c=0; $c < $num; $c++) {
	            echo $data[$c] . "<br />\n";
	        }*/
	    }
	    fclose($handle);
	}

	echo json_encode( $array );

?>
