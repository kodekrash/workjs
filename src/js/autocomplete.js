/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <kodekrash@gmail.com>
 * @package WorkJS
 * @subpackage widget.autocomplete
 */

WorkJS.widget.autocomplete = function(args) {

	this.o = {
		id: '',
		cls: '',
		target: '',
		minlength: 2,
		request: {
			module: '',
			method: '',
			param: 'query'
		}
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wau' + WorkJS.guid(),
			rendered: false,
			target: '',
			obj: ''
		};
		if( WorkJS.is( this.o.target ) ) {
			this.d.target = $('#' + this.o.target);
			this.d.value = $('#' + this.d.target.attr( 'for' ) );
			this.d.target.keyup( { obj: this }, this.query );
			this.d.target.click( function() {
				$(this).select();
			} );
		}
		this._build();
		this._render();
	};

	/**
	 * Build widget based on options
	 */
	this._build = function() {
		this.d.obj = $('<div/>').addClass( WorkJS.cls( 'autocomplete' ) ).prop( 'id', this.d.id );
	};

	/**
	 * Render object to DOM
	 */
	this._render = function() {
		this.d.target.parent().append( this.d.obj );
		this.d.rendered = true;
	};

	this._layout = function() {
		if( WorkJS.is( this.d.rendered ) ) {
			var d = $('#' + this.d.id );
			d.show();
			d.width( this.d.target.width() + 2 );
			d.offset( {
				left: this.d.target.offset().left,
				top: (this.d.target.offset().top + this.d.target.height()) + 2
			} );
			d.css( {
				'background-color': this.d.target.css( 'background-color' ),
				'border-color': this.d.target.css( 'border-color' )
			} );
		}
	};

	this.items = function(d) {
		if( WorkJS.is( d && d.length > 0 ) ) {
			var u = $('<ul/>').addClass( WorkJS.cls( 'autocomplete-list' ) );
			$('#' + this.d.id).mouseleave( { obj: this }, function(e) {
				e.data.obj.d.target.val('');
				e.data.obj.d.value.val('');
				e.data.obj.clear();
			} );
			for( var i = 0; i < d.length; i ++ ) {
				var l = $('<li/>').addClass( WorkJS.cls( 'autocomplete-item' ) ).append( d[i].label );
				l.attr( 'value', d[i].value );
				l.click( { obj: this, item: d[i] }, function(e) {
					e.data.obj.d.target.val( e.data.item.label );
					e.data.obj.d.value.val( e.data.item.value );
					e.data.obj.clear();
				} );
				u.append( l );
			}
			$('#' + this.d.id).empty().append( u );
			this._layout();
		}
	};

	this.query = function(e) {
		var s = $(this).val();
		var o = e.data.obj.o;
		if( s.length >= o.minlength ) {
			var d = {
				module: o.request.module,
				method: o.request.method,
				data: {}
			};
			if( WorkJS.is( o.request.param ) ) {
				d.data[ o.request.param ] = s;
			}
			$.ajax( {
				type: 'POST',
				url: '/workjs/api',
				data: d,
				dataType: 'json',
				context: e.data.obj,
				success: function(d) {
					if( d.error ) {
						console.log( 'autocomplete error ', d.error );
					} else if( d.debug ) {
						console.log( 'autocomplete debug ', d.debug );
					} else if( d.empty ) {
					} else if( d.data ) {
						this.items( d.data );
					}
				}
			} );
		}
	};

	this.clear = function() {
		$('#' + this.d.id).empty().hide();
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
