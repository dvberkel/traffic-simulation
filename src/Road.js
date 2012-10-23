(function($, _, Backbone, Traffic, undefined){
    var Segment = Backbone.Model.extend({
	default : { "car" : undefined },

	place : function(car) {
	    this.set("car", car);
	}
    });

    var Segments = Backbone.Collection.extend({
	model : Segment,

	updateTo : function(commands) {
	    var self = this;
	    self.clearCars();
	    _.each(commands, function(command){
		self.at(command.location).place(command.car);
	    });
	},

	clearCars : function() {
	    this.each(function(segment){
		segment.set("car", undefined, { "silent" : true });
	    });
	}
    });
    
    var Road = Backbone.Model.extend({
	defaults : { "track_length" : 30 },

	initialize : function(){
	    var segments = new Segments();
	    _.each(_.range(this.get("track_length")), function(){
		segments.add({});
	    });
	    this.set("segments", segments);
	},

	at : function(index) {
	    return this.get("segments").at(index % this.get("track_length"));
	},
	
	update : function() {
	    var segments = this.get("segments");
	    var commands = [];
	    segments.each(function(segment, index){
		if(segment.has("car")) {
		    var car = segment.get("car");
		    commands.push({
			"car" : car,
			"location" : index + car.get("speed")
		    });
		}
	    });
	    segments.updateTo(commands);
	}

    });

    Traffic.Road = Road;
})(jQuery, _, Backbone, Traffic);
