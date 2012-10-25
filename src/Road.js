(function($, _, Backbone, Traffic, undefined){
    var Segment = Backbone.Model.extend({
	defaults : { "car" : undefined, "driver" : Traffic.Driver.constant },

	place : function(car) {
	    if (!car.has("driver")) {
		car.set("driver", this.get("driver"));
	    }
	    this.set("car", car);
	}
    });

    var Segments = Backbone.Collection.extend({
	model : Segment,

	updateTo : function(commands) {
	    var self = this;
	    self.clearCars();
	    _.each(commands, function(command){
		self.at(command.target % self.length).place(command.car);
	    });
	},

	clearCars : function() {
	    this.each(function(segment){
		segment.set("car", undefined);
	    });
	}
    });
    
    var Road = Backbone.Model.extend({
	defaults : { "track_length" : 30, "driver" : Traffic.Driver.constant },

	initialize : function(){
	    var self = this;
	    var segments = new Segments();
	    _.each(_.range(this.get("track_length")), function(){
		segments.add({ "driver" : self.get("driver") });
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
		    car.updateSpeed(self.distanceToNextCarFrom(index));
		    var command = {
			"car" : car,
			"current" : index,
			"target" : (index + car.get("speed"))
		    };
		    commands.push(command);
		}
	    });
	    if(commands.length > 1) {
		_.each(commands, function(command, start){
		    var subject = command, index = start, next, mark;
		    if (index < commands.length - 1) {
			next = commands[index + 1];
			mark = next.target;
		    } else {
			next = commands[0];
			mark = next.target + self.get("track_length");
			
		    }
		   while (index >= 0 && subject.target >= mark) {
			subject.target = mark - 1;
			subject.car.setSpeedTo(subject.target - subject.current);

			mark = subject.target;
			index--;
			subject = commands[index];
		    }
		});
	    }
	    segments.updateTo(commands);
	},

	distanceToNextCarFrom : function(index){
	    var distance = this.get("track_length");
	    for (var step = 1; step < distance; step++) {
		if (this.at(index + step).has("car")) {
		    distance = step;
		    break;
		}
	    }
	    return distance;
	}

    });

    Traffic.Road = Road;
})(jQuery, _, Backbone, Traffic);
