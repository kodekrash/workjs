/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <kodekrash@gmail.com>
 * @package WorkJS
 * @subpackage widget.buttonbar
 */

WorkJS.widget.buttonbar = function(args) {

	this.o = {
		id: '',
		cls: '',
		items: [],
		target: '',
		caption: '',
		autoshow: true,
		callback: ''
	};

	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wbb' + WorkJS.guid(),
			items: [],
			rendered: false,
			target: '',
			obj: '',
			count: 1
		};
		if( WorkJS.is( this.o.target ) ) {
			this.d.target = $('#' + this.o.target);
			this.d.target.empty();
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
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'buttonbar' ) ).prop( 'id', this.d.id );
		if( WorkJS.is( this.o.caption ) ) {
			var z = $('<div/>').addClass( WorkJS.cls( 'buttonbar-caption' ) ).prop( 'id', WorkJS.id( this.d.id, 'caption' ) );
			z.append( this.o.caption );
			this.d.obj.append( z );
		}
		if( WorkJS.is( this.o.items ) ) {
			for( var i = 0; i < this.o.items.length; i ++ ) {
				this.d.items.push( this.o.items[i] );
				this.d.obj.append( this._build_item( this.o.items[i] ) );
			}
		}
	};
	
	this._build_item = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			var b = $('<button/>').addClass( WorkJS.cls( 'buttonbar-button' ) );
			var id = WorkJS.is( obj.uri ) ? obj.uri : 'b' + this.d.count;
			b.prop( 'id', WorkJS.id( this.d.id, id ) );
			b.click( function() { $(this).blur(); } );
			if( obj.callback && typeof( obj.callback ) == 'function' ) {
				b.click( { obj: this, item: id }, obj.callback );
				b.addClass( WorkJS.cls( 'buttonbar-button-hover' ) );
			} else if( this.o.callback && typeof( this.o.callback ) == 'function' ) {
				b.click( { obj: this, item: id }, this.o.callback );
				b.addClass( WorkJS.cls( 'buttonbar-button-hover' ) );
			}
			if( WorkJS.is( obj.icon ) ) {
				b.append( $('<img/>').addClass( WorkJS.cls( 'buttonbar-button-icon' ) ).addClass( 'l' ).prop( 'src', obj.icon ) );
			}
			if( WorkJS.is( obj.caption ) ) {
				b.append( $('<span/>').addClass( WorkJS.cls( 'buttonbar-button-caption' ) ).append( obj.caption ) );
			}
			if( WorkJS.is( obj.disabled ) ) {
				b.css( 'disabled', true );
				b.addClass( WorkJS.cls( 'buttonbar-button-disabled' ) );
				b.removeClass( WorkJS.cls( 'buttonbar-button-hover' ) );
			}
			return b;
		}
	};

	this.build = function() {
		return this.d.obj;
	};
	
	/**
	 * Sample Item
	 * {
	 *  	icon: [string],
	 *  	caption: [string],
	 *  	callback: [function],
	 *  	disabled: [boolean]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			this.d.items.push( obj );
			var b = this._build_item( obj );
			if( b && typeof( b ) == 'object' ) {
				if( WorkJS.is( this.d.rendered ) ) {
					$('#' + thid.d.id ).append( b );
				} else {
					this.d.obj.append( b );
				}
			}
		}
	};
	
	this.removeitem = function(str) {
		$('#' + WorkJS.id( this.d.id, str ) ).remove();
	};
	
	this.disableitem = function(str) {
		$('#' + WorkJS.id( this.d.id, str ) ).css( 'disabled', true );
		var c = WorkJS.cls( 'buttonbar-button-disabled' );
		if( !b.hasClass( c ) ) {
			b.addClass( c );
		}
		var c = WorkJS.cls( 'buttonbar-button-hover' );
		if( b.hasClass( c ) ) {
			b.removeClass( c );
		}
	};
	
	this.enableitem = function(str) {
		$('#' + WorkJS.id( this.d.id, str ) ).css( 'disabled', false );
		b.removeClass( WorkJS.cls( 'buttonbar-button-disabled' ) );
		b.addClass( WorkJS.cls( 'buttonbar-button-hover' ) );
	};
	
	this.showitem = function(str) {
		$('#' + WorkJS.id( this.d.id, str ) ).show();
	};
	
	this.hideitem = function(str) {
		$('#' + WorkJS.id( this.d.id, str ) ).hide();
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
		this._layout();
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
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