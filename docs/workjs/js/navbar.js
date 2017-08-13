/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.navbar
 */

WorkJS.widget.navbar = function(args) {

	this.o = {
		id: '',
		cls: '',
		items: [],
		target: '',
		autoshow: true,
		callback: ''
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wna' + WorkJS.guid(),
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
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'navbar' ) ).prop( 'id', this.d.id );
		if( WorkJS.is( this.o.items ) ) {
			this.d.obj.append( this._build_items( this.o.items, 1 ) );
		}
	};
	
	this._build_items = function(d,l) {
		if( d && d.length > 0 ) {
			var z = $('<ul/>').addClass( WorkJS.cls( 'navbar-group' ) );
			for( var i = 0; i < d.length; i ++ ) {
				var y = $('<li/>').addClass( WorkJS.cls( 'navbar-item' ) );
				if( l && l == 1 ) {
					y.addClass( WorkJS.cls( 'navbar-layer1' ) );
				} else {
					z.addClass( WorkJS.cls( 'navbar-sub' ) );
				}
				if( WorkJS.is( d[i].uri ) ) {
					y.prop( 'id', this.d.id + '-' + d[i].uri );
				}
				y.mouseenter( { obj: this, item: y.prop( 'id' ) }, this.showsub );
				y.mouseleave( { obj: this, item: y.prop( 'id' ) }, this.hidesub );
				if( WorkJS.is( d[i].caption ) || WorkJS.is( d[i].icon ) ) {
					var x = $('<div/>').addClass( WorkJS.cls( 'navbar-caption' ) );
					if( this.o.callback && typeof( this.o.callback ) == 'function' ) {
						x.click( { obj: this, item: d[i].uri }, this.o.callback );
					}
					if( WorkJS.is( d[i].icon ) ) {
						x.append( $('<img/>').addClass( WorkJS.cls( 'icon' ) ).prop( 'src', d[i].icon ) );
					}
					if( WorkJS.is( d[i].caption ) ) {
						x.append( '<span>' + d[i].caption + '</span>' );
					}
					y.append( x );
				}
				if( WorkJS.is( d[i].items ) ) {
					y.append( this._build_items( d[i].items, (l + 1) ) );
				}
				z.append( y );
			}
			return z;
		}
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
	
	this.hidesub = function(e) {
		if( e.data && e.data.obj ) {
			if( WorkJS.is( e.data.obj.d.rendered ) ) {
				$('#' + e.data.item + ' ul.' + WorkJS.cls( 'navbar-sub' ) ).hide();
			}
		}
	};

	this.showsub = function(e) {
		if( e.data && e.data.obj ) {
			if( WorkJS.is( e.data.obj.d.rendered ) ) {
				$('#' + e.data.item + ' ul.' + WorkJS.cls( 'navbar-sub' ) ).show();
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