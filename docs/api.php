<?php
	$out = array();

	if( $_POST ) {
		$q = trim( $_POST['data']['query'] );
		switch( $_POST['method'] ) {

			case 'autocomplete':
				if( strlen( $q ) > 0 ) {
					$ws = simplexml_load_file( 'demo/data/weatherstations.xml' );
					foreach( $ws->station as $s ) {
						$n = (string)$s->station_name;
						$c = (string)$s->station_id;
						if( strpos( $n, $q ) || strpos( $c, $q ) ) {
							$out[] = array( 'value' => $c, 'label' => $n . ' (' . (string)$s->state . ')' );
						}
					}
				}
			break;

			case 'datagrid':
				$data = array();
				$ws = simplexml_load_file( 'demo/data/weatherstations.xml' );
				foreach( $ws->station as $s ) {
					$data[] = (array)$s;
				}
				$total = count( $data );
				$rs = array();
				$start = array_key_exists( 'start', $_POST['data'] ) ? intval( $_POST['data']['start'] ) : 0;
				$count = array_key_exists( 'count', $_POST['data'] ) ? intval( $_POST['data']['count'] ) : 15;
				$end = $total > ($start + $count) ? ($start + $count) : $total;
				for( $i = $start; $i < $end; $i ++ ) {
					$rs[] = array( 'id' => $data[ $i ]['station_id'], 'state' => $data[ $i ]['state'],
								   'title' => $data[ $i ]['station_name'], 'lat' => $data[ $i ]['latitude'],
								   'lng' => $data[ $i ]['longitude'] );
				}
				$out = array( 'total' => $total, 'start' => $start, 'page' => $count, 'count' => count( $rs ), 'rows' => $rs );
			break;

			case 'dataview':
				$data = file_get_contents( 'demo/data/usstates.json' );
				$data = json_decode( $data, true );
				$total = count( $data );
				$rs = array();
				$start = array_key_exists( 'start', $_POST['data'] ) ? intval( $_POST['data']['start'] ) : 0;
				$count = array_key_exists( 'count', $_POST['data'] ) ? intval( $_POST['data']['count'] ) : 15;
				$end = $total > ($start + $count) ? ($start + $count) : $total;
				for( $i = $start; $i < $end; $i ++ ) {
					$rs[] = $data[ $i ];
				}
				$out = array( 'total' => $total, 'start' => $start, 'page' => $count, 'count' => count( $rs ), 'rows' => $rs );
			break;
		}
	}

	if( is_array( $out ) ) {
		header( 'Content-type: application/json; charset=utf-8' );
		print json_encode( array( 'ok' => true, 'data' => $out ) );
		exit();
	}
?>
