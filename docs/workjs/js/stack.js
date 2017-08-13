/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.stack
 */

WorkJS.widget.stack = function(args) {

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
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wst' + WorkJS.guid(),
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
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'stack' ) ).prop( 'id', this.d.id );
		if( WorkJS.is( this.o.cls ) ) {
			this.d.obj.addClass( this.o.cls );
		}
		if( WorkJS.is( this.o.items ) ) {
			for( var i in this.o.items ) {
				this.additem( this.o.items[i] );
			}
		}
	};

	this._build_item = function(i) {
		if( this.d.items[i] ) {
			var item = this.d.items[i];
			var id = WorkJS.is( item.uri ) ? item.uri : i;
			var a = $('<div/>').addClass( WorkJS.cls( 'stack-panel' ) );
			a.prop( 'id', WorkJS.id( this.d.id, id ) );
			var bid = 'stack-panel-body';
			if( WorkJS.is( item.caption ) ) {
				bid = 'stack-panel-caption-body';
				var c = $('<div/>').addClass( WorkJS.cls( 'stack-panel-caption' ) );
				if( WorkJS.is( item.refreshable ) ) {
					var b = $('<img/>').addClass( WorkJS.cls( 'action-icon' ) ).prop( 'src', WorkJS.icon( 'refresh' ) );
					b.click( { obj: this, item: id }, function(e) {
						e.data.obj.loaditem( e.data.item );
					} );
					c.append( b );
				}
				if( WorkJS.is( item.removeable ) ) {
					var b = $('<img/>').addClass( WorkJS.cls( 'action-icon' ) ).prop( 'src', WorkJS.icon( 'close' ) );
					b.click( { obj: this, item: id }, function(e) {
						e.data.obj.removeitem( e.data.item );
					} );
					c.append( b );
				}
				c.append( item.caption );
				a.append( c );
			}
			var b = $('<div/>').addClass( WorkJS.cls( bid ) );
			b.prop( 'id', WorkJS.id( this.d.id, id, 'body' ) );
			if( WorkJS.is( item.html ) ) {
				b.html( item.html );
			}
			if( WorkJS.is( item.url ) ) {
				b.load( item.url );
			}
			a.append( b );
			a.hide();
			return a;
		}
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		var z = $('<div/>').addClass( WorkJS.cls( 'stack-panels' ) ).prop( 'id', WorkJS.id( this.d.id, 'panels' ) );
		if( this.d.items ){
			for( var i = 0; i < this.d.items.length; i ++ ) {
				z.append( this._build_item( i ) );
			}
		}
		this.d.obj.append( z );
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
		this._layout();
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
			var t = $('#' + this.d.id );
			t.width( t.parent().innerWidth() );
			var p = $('#' + WorkJS.id( this.d.id, 'panels' ) );
			p.width( t.innerWidth() );
		}
	};

	/**
	 * Add item
	 * @param object obj section object to add
	 * {
	 *  	uri: [string],
	 *  	caption: [string],
	 *  	removeable: [boolean],
	 *  	refreshable: [boolean],
	 *  	html: [string],
	 *  	url: [string],
	 *  	autoload: [boolean],
	 *  	onremove: [function]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			this.d.items.push( obj );
			if( WorkJS.is( this.d.rendered ) ) {
				$('#' + WorkJS.id( this.d.id, 'panels' ) ).append( this._build_item( (this.d.items.length - 1) ) );
			}
		}
	};

	this.removeitem = function(str) {
		if( WorkJS.is( str ) ) {
			if( WorkJS.is( this.d.rendered ) ) {
				$('#' + WorkJS.id( this.d.id, str ) ).remove();
				for( var i = 0; i < this.d.items.length; i ++ ) {
					if( this.d.items[i].uri == str ) {
						if( WorkJS.type( this.d.items[i].onremove ) == 'function' ) {
							this.d.items[i].onremove();
						}
						this.d.items.splice( i, 1 );
						break;
					}
				}
			}
		}
	};

	this.showitem = function(str) {
		if( WorkJS.is( this.d.rendered ) ) {
			for( var x in this.d.items ) {
				var p = $('#' + WorkJS.id( this.d.id, this.d.items[x].uri ) );
				if( this.d.items[x].uri == str ) {
					p.show();
				} else {
					p.hide();
				}
			}
		}
	};

	this.loaditem = function(str) {
		if( WorkJS.is( this.d.rendered ) ) {
			for( var x in this.d.items ) {
				if( this.d.items[x].uri == str && WorkJS.is( this.d.items[x].url ) ) {
					var b = $('#' + WorkJS.id( this.d.id, str, 'body' ) );
					b.empty().load( this.d.items[x].url );
				}
			}
		}
	};
	
	this.exists = function(str) {
		for( var i in this.d.items ) {
			if( this.d.items[i].uri && this.d.items[i].uri == str ) {
				return true;
			}
		}
		return false;
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