/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <jl@eidix.com>
 * @package WorkJS
 * @subpackage widget.dataview
 */

WorkJS.widget.dataview = function(args) {

	this.o = {
		id: '',
		cls: '',
		target: '',
		columns: 5,
		request: {
			page: 15,
			module: '',
			method: ''
		},
		totalfield: 'total',
		countfield: 'count',
		pagefield: 'page',
		startfield: 'start',
		datafield: 'rows',
		click: '',
		dbclick: '',
		selectable: false,
		render: '',
		autowidth: true
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wdg' + WorkJS.guid(),
			rendered: false,
			target: '',
			obj: '',
			data: ''
		};
		if( WorkJS.is( this.o.target ) ) {
			this.d.target = $('#' + this.o.target);
			this.d.target.empty();
		} else {
			this.d.target = $(document);
		}
		this.query(0);
	};

	/**
	 * Build widget based on options
	 */
	this._build = function() {
		if( this.d.data && parseInt( this.d.data[ this.o.totalfield ] ) > 0 ) {
			var z = $('<div/>').addClass( WorkJS.cls( 'dataview' ) ).prop( 'id', this.d.id );
			if( WorkJS.is( this.o.cls ) ) {
				z.addClass( this.o.cls );
			}
			z.append( this._build_items() );
			z.append( this._build_footer() );
			this.d.obj = z;
		}
	};

	this._empty = function() {
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'error' ) ).prop( 'id', this.d.id ).append( 'No data available' );
		this._render();
		this._layout();
	};

	this._build_button = function(i,l,r) {
		var b = $('<button/>').addClass( WorkJS.cls( 'button' ) );
		var i = $('<img/>').prop( 'src', WorkJS.icon( i ) );
		if( r ) {
			i.addClass( 'r' );
			b.append( l );
			b.append( i );
		} else {
			i.addClass( 'l' );
			b.append( i );
			b.append( l );
		}
		return b;
	};
	
	this._build_footer = function() {
		var s = 'Showing <em>' + (this.d.data.start + 1) + '</em> - <em>' + (this.d.data.start + this.d.data.count);
		s += '</em> of <em>' + this.d.data.total + '</em> items';
		var c = $('<div/>').addClass( WorkJS.cls( 'dataview-info' ) ).append( s );
		var e = $('<div/>').addClass( WorkJS.cls( 'dataview-ctrl' ) );
		var b1 = this._build_button( 'first', 'First' );
		var b2 = this._build_button( 'left', 'Previous' );
		if( this.d.data.start > 0 ) {
			b1.attr( 'disabled', false );
			b1.addClass( WorkJS.cls( 'button-hover' ) );
			b1.click( { obj: this }, this.gofirst );
			b2.attr( 'disabled', false );
			b2.addClass( WorkJS.cls( 'button-hover' ) );
			b2.click( { obj: this }, this.goprevious );
		} else {
			b1.attr( 'disabled', true );
			b1.addClass( WorkJS.cls( 'button-disable' ) );
			b2.attr( 'disabled', true );
			b2.addClass( WorkJS.cls( 'button-disable' ) );
		}
		var b3 = this._build_button( 'right', 'Next', true );
		var b4 = this._build_button( 'last', 'Last', true );
		if( (this.d.data.start + this.d.data.count) < this.d.data.total ) {
			b3.attr( 'disabled', false );
			b3.addClass( WorkJS.cls( 'button-hover' ) );
			b3.click( { obj: this }, this.gonext );
			b4.attr( 'disabled', false );
			b4.addClass( WorkJS.cls( 'button-hover' ) );
			b4.click( { obj: this }, this.golast );
		} else {
			b3.attr( 'disabled', true );
			b3.addClass( WorkJS.cls( 'button-disable' ) );
			b4.attr( 'disabled', true );
			b4.addClass( WorkJS.cls( 'button-disable' ) );
		}
		e.append( b1 );
		e.append( b2 );
		e.append( b3 );
		e.append( b4 );
		var d = $('<div/>').addClass( WorkJS.cls( 'dataview-footer' ) );
		d.append( c );
		d.append( e );
		return d;
	};

	this._build_items = function() {
		var a = $('<div/>').addClass( WorkJS.cls( 'dataview-wrap' ) );
		if( this.d.data && this.d.data[ this.o.datafield ] ) {
			var h = 1;
			for( var i = 0; i < this.d.data[ this.o.datafield ].length; i ++ ) {
				var r = this.d.data[ this.o.datafield ][i];
				if( h == 1 ) {
					var g = $('<div/>').addClass( WorkJS.cls( 'dataview-row' ) );
				}
				var b = $('<div/>').addClass( WorkJS.cls( 'dataview-item' ) );
				var p = false;
				if( WorkJS.is( this.o.selectable ) ) {
					b.click( { obj: this }, this.selectitem );
					p = true;
				}
				if( WorkJS.type( this.o.dblclick ) == 'function' ) {
					b.dblclick( { item: r }, this.o.dblclick );
					p = true;
				}
				if( WorkJS.type( this.o.click ) == 'function' ) {
					b.click( { item: r }, this.o.click );
					p = true;
				}
				if( p ) {
					b.addClass( WorkJS.cls( 'pointer' ) );
				}
				if( WorkJS.type( this.o.render ) == 'function' ) {
					b.append( this.o.render( r ) );
				}
				var f = $('<div/>').addClass( WorkJS.cls( 'dataview-item-wrap' ) );
				g.append( f.append( b ) );
				if( h == parseInt( this.o.columns ) || i == (this.d.data[ this.o.datafield ].length - 1) ) {
					a.append( g );
				}
				h = (h == parseInt( this.o.columns )) ? 1 : (h + 1);
			}
		}
		return a;
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		this.d.target.find('#' + this.d.id ).remove();
		this.d.target.append( this.d.obj );
		this.d.rendered = true;
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
			if( WorkJS.is( this.o.autowidth ) ) {
				var c = parseInt( this.o.columns );
				$('#' + this.d.id + ' div.' + WorkJS.cls( 'dataview-item-wrap' ) ).width( (this.d.target.width() / c) - (11 * c) );
			}
		}
	};

	this.items = function(d) {
		this.d.data = d;
		this._build();
		this._render();
		this._layout();
	};
	
	this.selectitem = function(e) {
		var c = WorkJS.cls( 'dataview-item-active' );
		$('#' + e.data.obj.d.id + ' div.' + WorkJS.cls( 'dataview-item' ) ).removeClass( c );
		$(this).addClass( c );
	};

	this.query = function(s) {
		var d = {
			module: this.o.request.module,
			method: this.o.request.method,
			data: {
				start: parseInt( s ),
				count: this.o.request.page
			}
		};
		if( this.o.request.data ) {
			for( var i in this.o.request.data ) {
				d.data[i] = this.o.request.data[i];
			}
		}
		$.ajax( {
			type: 'POST',
			url: '/workjs/api',
			data: d,
			dataType: 'json',
			context: this,
			success: function(d) {
				if( d.error ) {
					console.log( 'dataview error ', this.d.id, ' ', d.error );
				} else if( d.debug ) {
					console.log( 'dataview debug ', this.d.id, ' ', d.debug );
				} else if( d.empty ) {
					this._empty();
				} else if( d.data ) {
					this.items( d.data );
				}
			}
		} );
	};

	this.gofirst = function(e) {
		e.data.obj.query(0);
	};

	this.goprevious = function(e) {
		var i = (e.data.obj.d.data.start - e.data.obj.d.data.page);
		e.data.obj.query( (i < 0 ? 0 : i) );
	};

	this.gonext = function(e) {
		e.data.obj.query( (e.data.obj.d.data.start + e.data.obj.d.data.page) );
	};
	
	this.golast = function(e) {
		var i = Math.floor( e.data.obj.d.data.total / e.data.obj.d.data.page ) * e.data.obj.d.data.count;
		if( i >= parseInt( e.data.obj.d.data.total ) ) {
			i = Math.floor( (e.data.obj.d.data.total / e.data.obj.d.data.page) - 1 ) * e.data.obj.d.data.count;
		}
		e.data.obj.query( i );
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
