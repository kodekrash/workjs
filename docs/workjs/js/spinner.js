/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.spinner
 */

WorkJS.widget.spinner = function(args) {

	this.o = {
		id: '',
		cls: '',
		target: '',
		caption: '',
		url: '',
		html: '',
		width: 300,
		height: 32,
		autoshow: true
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wsp' + WorkJS.guid(),
			rendered: false,
			target: '',
			obj: ''
		};
		if( WorkJS.is( this.o.target ) ) {
			this.d.target = $('#' + this.o.target);
		} else {
			this.d.target = $(document);
		}
		this._build();
		this._render();
	};

	/**
	 * Build widget based on options
	 */
	this._build = function() {
		var z = $('<div/>').addClass( WorkJS.cls( 'spinner' ) ).prop( 'id', this.d.id );
		if( !( WorkJS.is( this.o.html ) || WorkJS.is( this.o.url ) ) ) {
			z.append( $('<img/>').addClass( WorkJS.cls( 'spinner-icon' ) ).prop( 'src', WorkJS.icon( 'spin', 'gif' ) ) );
			var y = $('<div/>').addClass( WorkJS.cls( 'spinner-caption' ) );
			y.prop( 'id', WorkJS.id( this.d.id, 'caption' ) );
			if( WorkJS.is( this.o.caption ) ) {
				y.append( this.o.caption );
			}
			z.append( y );
		} else if( WorkJS.is( this.o.html ) ) {
			z.html( this.o.html );
		} else if( WorkJS.is( this.o.url ) ) {
			z.load( this.o.url );
		}
		this.d.obj = z;
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		var z = $('<div/>').addClass( WorkJS.cls( 'spinner-mask' ) ).prop( 'id', WorkJS.id( this.d.id, 'mask' ) );
		this.d.target.append( z );
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
		this._layout();
		if( WorkJS.is( this.o.autoshow ) ) {
			this.show();
		} else {
			this.hide();
		}
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
			var d = $('#' + this.d.id );
			var w = this.d.target.innerWidth();
			var h = this.d.target.parent().innerHeight();
			if( WorkJS.is( this.o.width ) ) {
				d.width( this.o.width );
				d.css( 'left', ((w - d.width()) / 2) + 'px' );
			}
			if( WorkJS.is( this.o.height ) ) {
				d.height( this.o.height );
				d.css( 'top', ((h - d.height()) / 2) + 'px' );
			}
		}
	};

	this.remove = function() {
		this.d.obj.empty();
		$('#' + this.d.id).remove();
		$('#' + WorkJS.id( this.d.id, 'mask' ) ).remove();
	};

	this.hide = function() {
		this.d.target.css( 'z-index', '-10' );
		$('#' + this.d.id).hide();
		$('#' + WorkJS.id( this.d.id, 'mask' ) ).hide();
	};

	this.show = function() {
		this.d.target.css( 'z-index', '9999' );
		$('#' + this.d.id).show();
		$('#' + WorkJS.id( this.d.id, 'mask' ) ).show();
	};
	
	this.caption = function(str) {
		if( WorkJS.is( str ) ) {
			this.d.target.find('#' + WorkJS.id( this.d.id, 'caption' ) ).html( str );
		}
	};

	/**
	 * If widget options specified, merge with default options
	 */
	if( args ) {
		for( var x in args ) {
			this.o[x] = args[x];
		}
	}

	/**
	 * Initialize widget
	 */
	this._init();

};