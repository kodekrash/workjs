<?php
	/**
	 * @copyright 2011 3Source, Inc. <www.3source.ca>
	 * @author James Linden <jl@eidix.com>
	 * @package WorkJS
	 */

	header( 'Content-type: text/css' );
?>
/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 */

<?php
	$p = '/srv/workspace/workjs/workjs/css/';
	$fs = array( 'reset', 'global', 'accordion', 'autocomplete', 'buttonbar', 'datagrid', 'dataview',
				 'dialog', 'navbar', 'notifier', 'spinner', 'stack', 'tabs', 'timeline', 'tree' );
	foreach( $fs as $f ) {
		$f = $p . $f . '.css';
		if( is_readable( $f ) ) {
			print file_get_contents( $f ) . chr(10);
		}
	}
?>