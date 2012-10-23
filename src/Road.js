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
		self.at(command.target).place(command.car);
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
	    var self = this;
	    var segments = self.get("segments");
	    var commands = [];
	    segments.each(function(segment, index){
		if(segment.has("car")) {
		    var car = segment.get("car");
		    var command = {
			"car" : car,
			"current" : index,
			"target" : (index + car.get("speed")) % self.get("track_length")
		    };
		    commands.push(command);
		}
	    });
	    if(commands.length > 1) {
		_.each(commands, function(command, index){
		    if (index < commands.length - 1) {
			var next = commands[index + 1];
			if (command.target > next.target) {
			    console.log("collision avoidance");
			    command.target = next.target - 1;
			    command.car.setSpeedTo(command.target - command.current);
			}
		    }
		});
	    }
	    segments.updateTo(commands);
	}

    });

    Traffic.Road = Road;
})(jQuery, _, Backbone, Traffic);
