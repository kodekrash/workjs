/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <kodekrash@gmail.com>
 * @package WorkJS
 * @subpackage widget.panelbar
 */

WorkJS.widget.panelbar = function(args) {

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
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wta' + WorkJS.guid(),
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
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'panelbar' ) ).prop( 'id', this.d.id );
		if( WorkJS.is( this.o.cls ) ) {
			this.d.obj.addClass( this.o.cls );
		}
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
		var z = $('<ul/>').addClass( WorkJS.cls( 'panelbar-list' ) ).prop( 'id', WorkJS.id( this.d.id, 'panelbar' ) );
		var y = $('<div/>').addClass( WorkJS.cls( 'panelbar-panels' ) ).prop( 'id', WorkJS.id( this.d.id, 'panels' ) );
		if( WorkJS.is( this.d.items ) ) {
			for( var i = 0; i < this.d.items.length; i ++ ) {
				x = this._build_item( i );
				z.append( x.tab );
				y.append( x.panel );
			}
		}
		this.d.obj.append( z );
		this.d.obj.append( y );
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
		$('#' + WorkJS.id( this.d.id, this.d.items[0].uri, 'tab' ) ).click();
		this._layout();
	};

	this._build_item = function(i) {
		if( this.d.items[i] ) {
			var item = this.d.items[i];
			var l = $('<li/>').addClass( WorkJS.cls( 'panelbar-item' ) );
			var id = WorkJS.is( item.uri ) ? item.uri : i;
			l.prop( 'id', WorkJS.id( this.d.id, id, 'tab' ) );
			if( WorkJS.is( item.url ) && WorkJS.is( item.refreshonclick ) ) {
				l.click( { obj: this, item: id }, function(e) {
					e.data.obj.loaditem( e.data.item );
				} );
			}
			l.click( { obj: this, item: id }, function(e) {
				e.data.obj.showitem( e.data.item );
			} );
			var icon = false;
			if( WorkJS.is( item.refreshable ) ) {
				icon = true;
				var b = $('<img/>').addClass( WorkJS.cls( 'action-icon' ) ).prop( 'src', WorkJS.icon( 'refresh' ) );
				b.click( { obj: this, item: id }, function(e) {
					e.data.obj.loaditem( e.data.item );
				} );
				l.append( b );
			}
			if( WorkJS.is( item.removeable ) ) {
				icon = true;
				var b = $('<img/>').addClass( WorkJS.cls( 'action-icon' ) ).prop( 'src', WorkJS.icon( 'close' ) );
				b.click( { obj: this, item: id }, function(e) {
					e.data.obj.removeitem( e.data.item );
				} );
				l.append( b );
			}
			if( icon ) {
				l.addClass( WorkJS.cls( 'panelbar-item-icon' ) );
			}
			if( WorkJS.is( item.caption ) ) {
				l.attr( 'title', item.caption );
				var c = $('<div/>').addClass( WorkJS.cls( 'panelbar-caption' ) ).append( item.caption );
				l.append( c );
			}
			var a = $('<div/>').addClass( WorkJS.cls( 'panelbar-item-body' ) );
			a.prop( 'id', WorkJS.id( this.d.id, id, 'body' ) );
			if( WorkJS.is( item.html ) ) {
				a.html( item.html );
			}
			if( WorkJS.is( item.url ) && !WorkJS.is( item.refreshonclick ) ) {
				a.load( item.url );
			}
			a.hide();
			return { tab: l, panel: a };
		}
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
			var w1 = $('#' + WorkJS.id( this.d.id, 'panelbar' ) ).innerWidth();
			var w2 = (w1 / this.d.items.length);
			for( var i in this.d.items ) {
				if( this.d.items[i] ) {
					var item = this.d.items[i];
					var id = WorkJS.is( item.uri ) ? item.uri : i;
					$('#' + WorkJS.id( this.d.id, id, 'tab' ) ).width( w2 );
				}
			}
		}
	};
	
	/**
	 * Add item
	 * @param object obj section object to add
	 * {
	 *  	uri: [string],
	 *  	caption: [string],
	 *  	html: [string],
	 *  	url: [string],
	 *  	removeable: [boolean],
	 *  	refreshable: [boolean],
	 *  	autoload: [boolean],
	 *  	refreshonclick: [boolean]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			this.d.items.push( obj );
			if( WorkJS.is( this.d.rendered ) ) {
				var l = this._build_item( (this.d.items.length - 1) );
				$('#' + WorkJS.id( this.d.id, 'panelbar' ) ).append( l.tab );
				$('#' + WorkJS.id( this.d.id, 'panels' ) ).append( l.panel );
				this._layout();
			}
		}
	};
	
	this.removeitem = function(str) {
		if( WorkJS.is( str ) ) {
			if( WorkJS.is( this.d.rendered ) ) {
				$('#' + WorkJS.id( this.d.id, str, 'body' ) ).remove();
				$('#' + WorkJS.id( this.d.id, str, 'tab' ) ).remove();
				for( var i = 0; i < this.d.items.length; i ++ ) {
					if( this.d.items[i].uri == str ) {
						this.d.items.splice( i, 1 );
						break;
					}
				}
				this._layout();
				$('#' + WorkJS.id( this.d.id, this.d.items[0].uri, 'tab' ) ).click();
//				this.showitem( this.d.items[0].uri );
			}
		}
	};

	this.showitem = function(str) {
		if( WorkJS.is( this.d.rendered ) ) {
			var cls = WorkJS.cls( 'panelbar-item-active' );
			for( var x in this.d.items ) {
				var b = $('#' + WorkJS.id( this.d.id, this.d.items[x].uri, 'body' ) );
				var t = $('#' + WorkJS.id( this.d.id, this.d.items[x].uri, 'tab' ) );
				if( this.d.items[x].uri == str ) {
					b.show();
					t.addClass( cls );
				} else {
					b.hide();
					t.removeClass( cls );
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