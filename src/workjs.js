/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <kodekrash@gmail.com>
 * @package WorkJS
 */

var WorkJS = {

	widget: {},
	_viewport: {},
	_guid: 0,
	_url: './',
	_cls: 'wjs',
	_color: 'black',

	/**
	 * Load external javascript file
	 * @param string u URL to load
	 */
	loadjs: function(u) {
		$('head').append( '<script type="text/javascript" src="' + u + '"></script>' );
	},

	/**
	 * Increment internal ID key
	 * @return integer new ID
	 */
	guid: function() {
		this._guid ++;
		return this._guid;
	},

	/**
	 * Prepend string with url prefix
	 * @param string str suffix
	 * @return string relative URL
	 */
	url: function(str) {
		return this._url + str;
	},

	/**
	 * Prepend string with global CSS class prefix
	 * @param string str suffix
	 * @return string complete CSS class string
	 */
	cls: function(str) {
		return this._cls + '-' + str;
	},

	/**
	 * Create URL string for specified icon
	 * @param string str icon name
	 * @return string relative URL
	 */
	icon: function(str,ext) {
		return this._url + 'img/' + this._color + '/' + str + (ext ? '.' + ext : '.png');
	},

	id: function() {
		var s = [];
		for( var i = 0; i < arguments.length; i ++ ) {
			s.push( arguments[i] );
		}
		return s.join( '-' );
	},

	/**
	 * Load libraries and widgets
	 */
	init: function( u ) {
		if( u ) {
			this._url = u;
		}
		var m = [ 'jquery.resize', 'accordion', 'autocomplete', 'buttonbar', 'datagrid', 'dataview',
		          'dialog', 'navbar', 'notifier', 'panelbar', 'spinner', 'stack', 'tabs', 'timeline',
		          'tree' ];
		for( var z in m ) {
			this.loadjs( this.url( 'js/' + m[z] + '.js' ) );
		}
	},

	/**
	 * Get/Set current viewport size
	 * @param integer w Width
	 * @param integer h Height
	 * @return object size if @param w and @param h not specified
	 */
	viewport: function(w,h) {
		if( w || h ) {
			this._viewport = { width: w, height: h };
		} else {
			return this._viewport;
		}
	},
	
	/**
	 * Check value for boolean, length > 0, or val > 0
	 * @param mixed val value to check
	 * @return boolean value not empty and is true
	 */
	is: function(val) {
		return ( (val && val === true) || (val && val.length > 0) || (val && parseInt( val ) > 0) );
	},

	/**
	 * return type of obj
	 * @param object obj object to check
	 * @param string type to check against
	 * @return string type of obj if @param type is omitted
	 * @return boolean @param obj is of type @param type
	 */
	type: function(obj,type) {
		var x = Object.prototype.toString.call( obj );
		if( x && x.indexOf( '[object ', 0 ) === 0 ) {
			x = x.substring( 8, (x.length - 1) ).toLowerCase();
			x = ( x.indexOf( 'html', 0 ) === 0 && x.indexOf( 'element', 4 ) > 4 ) ? 'dom' : x;
			return (type && type.length > 0) ? x == type : x;
		}
	}

};

$( function() {
	$.ajaxSetup( { cache: false } );

	$(document).bind( 'resize', function(e) {
		WorkJS.viewport( $(document).width(), $(document).height() );
	} );

	WorkJS.viewport( $(document).width(), $(document).height() );
} );
