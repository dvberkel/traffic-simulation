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
	    this.model.get("segments").each(function(segment){
		new SegmentView({ model : segment, el : road });
	    });
	    road.appendTo(this.$el);
	}
    });

    var SegmentView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var segment = $("<span class='segment'>c</span>")
	    segment.appendTo(this.$el);
	}
    });

    Traffic.MainView = MainView;
})(jQuery, _, Backbone, Traffic);
