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
	    this.render();
	},

	render : function(){
	    var segment = $("<span class='segment'>&nbsp;</span>");
	    if (this.model.has("car")) {
		segment.empty();
		new CarView({ model : this.model.get("car"), el : segment });
	    }
	    segment.appendTo(this.$el);
	}
    });

    var CarView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var car = $("<span class='car'></span>");
	    car.append("<img src='image/car.svg'/>");
	    car.appendTo(this.$el);
	}
    });

    Traffic.MainView = MainView;
})(jQuery, _, Backbone, Traffic);
