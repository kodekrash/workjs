/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <kodekrash@gmail.com>
 * @package WorkJS
 * @subpackage widget.notifier
 */

WorkJS.widget.notifier = function(args) {

	this.o = {
		id: '',
		cls: '',
		target: '',
		timer: 3,
		bar: false
	};
	
	this.d = {};
	this.t = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wno' + WorkJS.guid(),
			counter: 0,
			rendered: false,
			target: '',
			obj: '',
			timer: parseInt( this.o.timer ) * 1000
		};
		if( WorkJS.is( this.o.target ) ) {
			this.d.target = $('#' + this.o.target);
			this.d.target.empty();
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
		this.d.obj = $('<div/>').prop( 'id', this.d.id );
		this.d.obj.addClass( WorkJS.cls( 'notifier' + (WorkJS.is( this.o.bar ) ? '-bar' : '') ) );
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
	};

	/**
	 * Add item
	 * @param object obj section object to add
	 * {
	 *  	type: [string] (success,error,normal),
	 *  	caption: [string],
	 *  	html: [string],
	 *  	text: [string]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' && WorkJS.is( this.d.rendered ) ) {
			this.d.counter ++;
			obj.type = (obj.type && (obj.type == 'success' || obj.type == 'error')) ? obj.type : 'normal';
			var w = $('<div/>').addClass( WorkJS.cls( 'notifier-message-wrap' ) );
			if( WorkJS.is( obj.caption ) ) {
				var y = $('<div/>').addClass( WorkJS.cls( 'notifier-message-caption' ) );
				y.append( obj.caption );
				w.append( y );
			}
			var y = $('<div/>').addClass( WorkJS.cls( 'notifier-message-body' ) );
			if( WorkJS.is( obj.html ) ) {
				y.append( obj.html );
			} else if( WorkJS.is( obj.text ) ) {
				y.append( $('<p/>').append( obj.text ) );
			}
			w.append( y );
			var z = $('<div/>').addClass( WorkJS.cls( 'notifier-message-' + obj.type ) );
			z.prop( 'id', WorkJS.id( this.d.id, 'm' + this.d.counter ) );
			z.append( w );
			z.bind( 'clear', { obj: this, item: y.prop( 'id' ) }, function(e) {
				clearTimeout( e.data.obj.t[ e.data.item ] );
				$(this).slideUp( 800, function() {
					$(this).remove();
				} );
			} );
			obj.timer = (obj.timer && parseInt(obj.timer) > 0 && parseInt(obj.timer) < 60) ? (parseInt(obj.timer) * 1000) : this.d.timer;
			this.t[ z.prop( 'id' ) ] = setTimeout( "$('#" + z.prop( 'id' ) + "').trigger( 'clear' )", obj.timer );
			$('#' + this.d.id ).append( z );
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