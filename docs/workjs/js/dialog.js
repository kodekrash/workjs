/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.dialog
 */

WorkJS.widget.dialog = function(args) {

	this.o = {
		id: '',
		cls: '',
		target: '',
		autoshow: true,
		modal: true,
		removeable: true,
		reloadable: true,
		uri: '',
		caption: '',
		url: '',
		html: '',
		onremove: ''
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wdi' + WorkJS.guid(),
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
		if( WorkJS.is( this.o.autoshow ) ) {
			this._render();
		}
	};

	/**
	 * Build widget based on options
	 */
	this._build = function() {
		var z = $('<div/>').addClass( WorkJS.cls( 'dialog-caption' ) );
		if( WorkJS.is( this.o.caption ) ) {
			z.append( this.o.caption );
		}
		if( WorkJS.is( this.o.removeable ) ) {
			var b = $('<img/>').addClass( WorkJS.cls( 'action-icon' ) ).prop( 'src', WorkJS.icon( 'close' ) );
			b.click( { obj: this }, function(e) {
				e.data.obj.remove();
			} );
			z.append( b );
		}
		if( WorkJS.is( this.o.reloadable ) ) {
			var b = $('<img/>').addClass( WorkJS.cls( 'action-icon' ) ).prop( 'src', WorkJS.icon( 'refresh' ) );
			b.click( { obj: this }, function(e) {
				e.data.obj.reload();
			} );
			z.append( b );
		}
		var y = $('<div/>').addClass( WorkJS.cls( 'dialog-body' ) );
		if( WorkJS.is( this.o.html ) ) {
			y.html( this.o.html );
		}
		if( WorkJS.is( this.o.url ) ) {
			y.load( this.o.url );
		}
		var x = $('<div/>').addClass( WorkJS.cls( 'dialog' ) ).prop( 'id', this.d.id );
		x.append( z ).append( y );
		this.d.obj = x;
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		if( WorkJS.is( this.o.modal ) ) {
			var z = $('<div/>').addClass( WorkJS.cls( 'dialog-mask' ) ).prop( 'id', WorkJS.id( this.d.id, 'mask' ) );
			this.d.target.append( z );
		}
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
		this._layout();
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
			var d = $('#' + this.d.id );
			if( WorkJS.is( this.o.width ) ) {
				d.width( this.o.width );
				d.css( 'left', ((this.d.target.width() - d.width()) / 2) + 'px' );
			}
			if( WorkJS.is( this.o.height ) ) {
				d.height( this.o.height );
				d.css( 'top', ((this.d.target.height() - d.height()) / 2) + 'px' );
			}
		}
	};

	this.remove = function() {
		this.d.obj.empty();
		this.d.target.find('#' + this.d.id).remove();
		if( WorkJS.is( this.o.modal ) ) {
			this.d.target.find('#' + WorkJS.id( this.d.id, 'mask' ) ).remove();
		}
		if( WorkJS.type( this.o.onremove ) == 'function' ) {
			this.o.onremove();
		}
	};

	this.reload = function() {
		$('#' + this.d.id + ' div.' + WorkJS.cls( 'dialog-body' ) ).empty().load( this.o.url );
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