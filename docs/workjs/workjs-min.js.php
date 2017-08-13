<?php
	/**
	 * @copyright 2011 3Source, Inc. <www.3source.ca>
	 * @author James Linden <jl@eidix.com>
	 * @package WorkJS
	 */

	header( 'Content-type: text/javascript' );

	print file_get_contents( '/srv/workspace/workjs/workjs/workjs.js' ) . chr(10);

	$p = '/srv/workspace/workjs/workjs/js/';
	$fs = array( 'jquery.resize', 'accordion', 'autocomplete', 'buttonbar', 'datagrid', 'dataview',
				 'dialog', 'navbar', 'notifier', 'spinner', 'stack', 'tabs', 'timeline', 'tree' );
	foreach( $fs as $f ) {
		$f = $p . $f . '.js';
		if( is_readable( $f ) ) {
			print file_get_contents( $f ) . chr(10);
		}
	}
?>