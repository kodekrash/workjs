/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.tree
 */

WorkJS.widget.tree = function(args) {

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
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wtr' + WorkJS.guid(),
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
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'tree' ) ).prop( 'id', this.d.id );
		if( WorkJS.is( this.o.items ) ) {
			this.d.obj.append( this._build_items( this.o.items ) );
		}
	};
	
	this._build_items = function(d) {
		if( d && d.length > 0 ) {
			var z = $('<ul/>').addClass( WorkJS.cls( 'tree-trunk' ) );
			for( var i = 0; i < d.length; i ++ ) {
				var y = $('<li/>').addClass( WorkJS.cls( 'tree-branch' ) );
				if( WorkJS.is( d[i].uri ) ) {
					y.prop( 'id', WorkJS.id( this.d.id, d[i].uri ) );
				}
				if( WorkJS.is( d[i].caption ) || WorkJS.is( d[i].icon ) ) {
					var x = $('<div/>').addClass( WorkJS.cls( 'tree-caption' ) );
					if( WorkJS.type( this.o.callback ) == 'function' && WorkJS.is( d[i].uri ) ) {
						x.addClass( WorkJS.cls( 'pointer' ) );
						x.click( { obj: this, item: d[i].uri }, this.o.callback );
						x.click( { tree: this.d.id, item: d[i].uri }, function(e) {
							$('#' + e.data.tree + ' div').removeClass( '_selected' );
							$(this).addClass( '_selected' );
						} );
					} else {
						x.addClass( WorkJS.cls( 'tree-group-caption' ) );
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
					y.append( this._build_items( d[i].items ) );
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
	 *  	autoload: [boolean]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			this.d.items.push( obj );
			if( WorkJS.is( this.d.rendered ) ) {
				l = this._build_item( (this.d.items.length - 1) );
				$('#' + this.d.id + ' ul.' + WorkJS.cls( 'tree-list' ) ).append( l.tab );
				$('#' + this.d.id + ' div.' + WorkJS.cls( 'tree-panels' ) ).append( l.panel );
				this._layout();
			}
		}
	};
	
	this.removeitem = function(str) {
		if( WorkJS.is( str ) ) {
			if( WorkJS.is( this.d.rendered ) ) {
				$('#' + this.d.id ).find( $('#' + this.d.id + '-' + str + '-body' ) ).remove();
				$('#' + this.d.id ).find( $('#' + this.d.id + '-' + str + '-tab' ) ).remove();
				this._layout();
			}
		}
	};

	this.showitem = function(str) {
		if( WorkJS.is( this.d.rendered ) ) {
			$('#' + this.d.id + ' div.' + WorkJS.cls( 'tree-item-body' ) ).hide();
			$('#' + this.d.id + ' li.' + WorkJS.cls( 'tree-item' ) ).removeClass( WorkJS.cls( 'tree-item-active' ) );
			$('#' + str + '-body').show();
			$('#' + str + '-tab' ).addClass( WorkJS.cls( 'tree-item-active' ) );
		}
	};
	
	this.selectitem = function(str) {
		$('#' + WorkJS.id( this.d.id, str ) + ' div.' + WorkJS.cls( 'tree-caption' ) ).click();
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