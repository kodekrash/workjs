<?php
	$data = file_get_contents( 'usstates.json' );

	header( 'Content-type: application/json; charset=utf-8' );
	print json_encode( $data );
	exit();
?>