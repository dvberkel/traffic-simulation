(function($, _, Backbone, Traffic){
    var MainView = Backbone.View.extend({

	initialize : function(){
	    this.render();
	},

	render : function(){
	    this.$el.empty();
	    var viewport = $("<div class='viewport'></div>");
	    viewport.appendTo(this.$el);
	    new RoadView({ model : this.model, el : viewport });
	    new Controls({ model : this.model, el : viewport });
	}
    });

    var RoadView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var road = $("<div class='road' />");
	    new SegmentsView({ model : this.model, el : road });
	    road.appendTo(this.$el);
	}
    });

    var SegmentsView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var segments = $("<div class='segments' />")
	    this.model.get("segments").each(function(segment){
		new SegmentView({ model : segment, el : segments });
	    });
	    segments.appendTo(this.$el);
	}
    });

    var SegmentView = Backbone.View.extend({
	initialize : function(){
	    this.model.on("change:car", this.render, this);

	    this.render();
	},

	render : function(){
	    var segment = this.container();
	    segment.empty();
	    if (this.model.has("car")) {
		new CarView({ model : this.model.get("car"), el : segment });
	    }
	},

	container : function(){
	    if (! this.options.container ) {
		var container = $("<span class='segment'/>");
		container.appendTo(this.$el);
		this.options.container = container;
	    }
	    return this.options.container;
	}
    });

    var CarView = Backbone.View.extend({
	template : _.template("<img src='image/car.svg' title='Speed: <%= speed %>'/>"),
	
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var car = $("<span class='car'></span>");
	    car.append(this.template(this.model.toJSON()));
	    car.appendTo(this.$el);
	}
    });

    var Controls = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var controls = $("<div class='controls' />");
	    controls.appendTo(this.$el);
	    new StepControl({ model : this.model, el : controls });
	    new PlayPauseControl({ model : this.model, el : controls });
	}
    });

    var StepControl = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var self = this;
	    var button = $("<button>Step</button>");
	    button.click(function(){
		self.model.update();
	    });
	    button.appendTo(self.$el);
	}
    });

    var PlayPauseControl = Backbone.View.extend({
	events : {
	    "click button.pauzePlay" : "playPauze"
	},

	initialize : function(){
	    this.render();
	},

	render : function(){
	    var self = this;
	    this.button = $("<button class='pauzePlay' />");
	    this.button.text(">");
	    this.button.appendTo(self.$el);
	},

	playPauze : function(){
	    var self = this;
	    if (this.action) {
		clearInterval(this.action);
		this.action = undefined;
		this.button.text(">");
	    } else {
		this.action = setInterval(function(){ self.model.update () }, 500);
		this.button.text("=");
	    };
	}
    });
    
    Traffic.MainView = MainView;
})(jQuery, _, Backbone, Traffic);
