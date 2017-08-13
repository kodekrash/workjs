/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.accordion
 */

WorkJS.widget.accordion = function(args) {

	this.o = {
		id: '',
		cls: '',
		items: [],
		target: '',
		autoshow: true
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wac' + WorkJS.guid(),
			items: [],
			rendered: false,
			target: '',
			obj: ''
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
		var z = $('<div/>').addClass( WorkJS.cls( 'accordion' ) );
		z.prop( 'id', this.d.id );
		this.d.obj = z;
		if( WorkJS.is( this.o.items ) ) {
			for( var i in this.o.items ) {
				this.additem( this.o.items[i] );
			}
		}
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		var z = $('<ul/>').addClass( WorkJS.cls( 'accordion-list' ) ).prop( 'id', WorkJS.id( this.d.id, 'tabs' ) );
		if( WorkJS.is( this.d.items ) ) {
			for( var i = 0; i < this.d.items.length; i ++ ) {
				z.append( this._build_item( i ) );
			}
			this.d.obj.append( z );
		}
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
	};
	
	this._build_item = function(i) {
		if( this.d.items[i] ) {
			var item = this.d.items[i];
			var li = $('<li/>').addClass( WorkJS.cls( 'accordion-item' ) );
			var id = WorkJS.is( item.uri ) ? item.uri : i;
			li.prop( 'id', WorkJS.id( this.d.id, id ) );
			var cap = $('<div/>').addClass( WorkJS.cls( 'accordion-item-caption' ) ).prop( 'id', WorkJS.id( this.d.id, id, 'caption' ) );
			cap.append( $('<img/>').addClass( WorkJS.cls( 'action-icon2' ) ).prop( 'src', WorkJS.icon( 'right' ) ).prop( 'id', WorkJS.id( this.d.id, id, 'icon' ) ) );
			if( WorkJS.is( item.caption ) ) {
				cap.append( item.caption );
			}
			cap.click( { obj: this, item: id }, function(e) {
				e.data.obj.showitem( e.data.item );
			} );
			li.append( cap );
			var body = $('<div/>').addClass( WorkJS.cls( 'accordion-item-body' ) ).prop( 'id', WorkJS.id( this.d.id, id, 'body' ) );
			if( WorkJS.is( item.html ) ) {
				body.html( item.html );
			}
			if( WorkJS.is( item.url ) ) {
				body.load( item.url );
			}
			body.hide();
			li.append( body );
			return li;
		}
	};

	/**
	 * Add item
	 * @param object obj section object to add
	 * {
	 *  	uri: [string],
	 *  	caption: [string],
	 *  	collapsable: [boolean],
	 *  	removeable: [boolean],
	 *  	refreshable: [boolean],
	 *  	html: [string],
	 *  	url: [string],
	 *  	autoload: [boolean]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			this.d.items.push( obj );
			if( WorkJS.is( this.d.rendered ) ) {
				var l = this._build_item( (this.d.items.length - 1) );
				$('#' + WorkJS.id( this.d.id, 'tabs' ) ).append( l );
			}
		}
	};
	
	this.removeitem = function(str) {
		if( WorkJS.is( str ) ) {
			$('#' + WorkJS.id( this.d.id, str ) ).remove();
		}
	};

	this.showitem = function(str) {
		if( WorkJS.is( this.d.rendered ) ) {
			var cls = WorkJS.cls( 'accordion-item-caption-active' );
			var img1 = WorkJS.icon( 'right' ), img2 = WorkJS.icon( 'down' );
			var c = $('#' + WorkJS.id( this.d.id, str, 'caption' ) );
			if( c.hasClass( cls ) ) {
				$('#' + WorkJS.id( this.d.id, str, 'body' ) ).hide();
				$('#' + WorkJS.id( this.d.id, str, 'icon' ) ).prop( 'src', img1 );
				c.removeClass( cls );
			} else {
				for( var x in this.d.items ) {
					var b = $('#' + WorkJS.id( this.d.id, this.d.items[x].uri, 'body' ) );
					var c = $('#' + WorkJS.id( this.d.id, this.d.items[x].uri, 'caption' ) );
					var i = $('#' + WorkJS.id( this.d.id, this.d.items[x].uri, 'icon' ) );
					if( this.d.items[x].uri == str ) {
						b.show(), c.addClass( cls ), i.prop( 'src', img2 );
					} else {
						b.hide(), c.removeClass( cls ), i.prop( 'src', img1 );
					}
				}
			}
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