/**
 * @copyright 2011 3Source, Inc. <www.3source.ca>
 * @author James Linden <kodekrash@gmail.com>
 * @package WorkJS
 * @subpackage widget.timeline
 */

WorkJS.widget.timeline = function(args) {

	this.o = {
		id: '',
		cls: '',
		items: [],
		target: '',
		autoshow: true,
		mode: 'span',
		begin: '',
		end: '',
		callback: ''
	};
	
	this.d = {};

	/**
	 * Widget initialization
	 */
	this._init = function() {
		this.d = {
			id: WorkJS.is( this.o.id ) ? this.o.id : 'wti' + WorkJS.guid(),
			items: [],
			rendered: false,
			target: '',
			obj: '',
			scale: this._scale()
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
	
	this._scale = function() {
		var z = {
			begin: this.o.begin ? this._date( this.o.begin ) : new Date(),
			end: this.o.end ? this._date( this.o.end ) : new Date(),
			diff: '',
			unit: ''
		};
		z.diff = (z.end - z.begin);
		return z;
	};
	
	this._calc = function(b,e) {
		if( b ) {
			var z = { offset: '', offsetp: '', length: '', lengthp: '' };
			b = this._date( b );
			z.offset = (b - this.d.scale.begin);
			z.offsetp = new Number( (z.offset / this.d.scale.diff) * 100 ).toFixed(3);
			if( e ) {
				e = this._date( e );
				z.length = (e - b);
				z.lengthp = new Number( (z.length / this.d.scale.diff) * 100 ).toFixed(3);
			}
			return z;
		}
	};
	
	this._date = function(d) {
		if( WorkJS.type( d, 'string' ) ) {
			if( d.indexOf( '-' ) > 0 ) {
				d = d.split( '-' );
				for( var i = 0; i < d.length; i ++ ) {
					d[i] = d[i].substr(0,1) == '0' ? d[i].substr(1) : d[i];
				}
				if( d.length == 3 ) {
					d = new Date( parseInt( d[0] ), (d[1] - 1), d[2] );
				}
			} else {
				d = new Date( d );
			}
		}
		if( WorkJS.type( d, 'date' ) ) {
			return d;
		}
	};

	/**
	 * Build widget based on options
	 */
	this._build = function() {
		var z = $('<div/>').addClass( WorkJS.cls( 'timeline' ) );
		z.prop( 'id', this.d.id );
		this.d.obj = z;
		if( WorkJS.is( this.o.caption ) ) {
			var z = $('<div/>').addClass( WorkJS.cls( 'timeline-caption' ) );
			z.prop( 'id', WorkJS.id( this.d.id, 'caption' ) );
			z.append( this.o.caption );
			this.d.obj.append( z );
		}
		if( WorkJS.is( this.o.items ) ) {
			for( var i in this.o.items ) {
				this.additem( this.o.items[i] );
			}
			switch( this.o.mode ) {
				case 'single':
					this._build_single();
				break;
				case 'span':
				default:
					this._build_span();
				break;
			}
		}
	};

	this._build_single = function() {
		if( WorkJS.is( this.d.items ) ) {
			for( var i = 0; i < this.d.items.length; i ++ ) {
				var r = this.d.items[i];
				var wrap = $('<div/>').addClass( WorkJS.cls( 'timeline-item' ) );
				var id = WorkJS.is( r.uri ) ? r.uri : 'i' + i;
				wrap.prop( 'id', WorkJS.id( this.d.id, id ) );
				if( r.caption ) {
					wrap.attr( 'title', r.caption );
					var cap = $('<div/>').addClass( WorkJS.cls( 'timeline-item-caption' ) );
					cap.prop( 'id', WorkJS.id( this.d.id, id, 'caption' ) );
					cap.append( r.caption );
					wrap.append( cap );
				}
				if( this.o.callback && typeof( this.o.callback ) == 'function' ) {
					wrap.addClass( WorkJS.cls( 'pointer' ) );
					wrap.click( { obj: this, item: r }, this.o.callback );
				}
				if( r.begin ) {
					var scale = this._calc( r.begin );
					if( scale && typeof( scale ) == 'object' && scale.offsetp ) {
						var bar = $('<div/>').addClass( WorkJS.cls( 'timeline-item-bar' ) );
						var img = $('<img/>').addClass( WorkJS.cls( 'timeline-bullet' ) ).prop( 'src', WorkJS.icon( 'bullet-small' ) );
						bar.append( img );
						bar.prop( 'id', WorkJS.id( this.d.id, id, 'bar' ) );
						bar.css( 'margin-left', scale.offsetp + '%' );
						wrap.append( bar );
					}
				}
				this.d.obj.append( wrap );
			}
		}
	};

	this._build_span = function() {
		if( WorkJS.is( this.d.items ) ) {
			for( var i = 0; i < this.d.items.length; i ++ ) {
				var r = this.d.items[i];
				var wrap = $('<div/>').addClass( WorkJS.cls( 'timeline-item' ) );
				var id = WorkJS.is( r.uri ) ? r.uri : 'i' + i;
				wrap.prop( 'id', WorkJS.id( this.d.id, id ) );
				if( r.caption ) {
					wrap.attr( 'title', r.caption );
					var cap = $('<div/>').addClass( WorkJS.cls( 'timeline-item-caption' ) );
					cap.prop( 'id', WorkJS.id( this.d.id, id, 'caption' ) );
					cap.append( r.caption );
					wrap.append( cap );
				}
				if( this.o.callback && typeof( this.o.callback ) == 'function' ) {
					wrap.addClass( WorkJS.cls( 'pointer' ) );
					wrap.click( { obj: this, item: r }, this.o.callback );
				}
				if( r.begin && r.end ) {
					var scale = this._calc( r.begin, r.end );
					if( scale && typeof( scale ) == 'object' && scale.offsetp ) {
						var bar = $('<div/>').addClass( WorkJS.cls( 'timeline-item-bar' ) );
						bar.addClass( WorkJS.cls( 'timeline-item-span-bar' ) );
						bar.prop( 'id', WorkJS.id( this.d.id, id, 'bar' ) );
						bar.css( {
							'margin-left': scale.offsetp + '%',
							'width': scale.lengthp + '%'
						} );
						wrap.append( bar );
					}
				}
				this.d.obj.append( wrap );
			}
		}
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
	 *  	uri: [string],
	 *  	caption: [string],
	 *  	begin: [date],
	 *  	end: [date]
	 * }
	 */
	this.additem = function(obj) {
		if( obj && typeof( obj ) == 'object' ) {
			this.d.items.push( obj );
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