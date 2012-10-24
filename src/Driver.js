(function($, _, Backbone, Traffic){
    var Driver = {};

    var constant = function(car, distance) {
	return car.get("speed");
    }

    var speedUp = function(car,distance) {
	return car.get("speed") + 1;
    }

    var reachFor = function(target){
	return wrap(function(){ 
	    return target 
	});
    }

    var wrap = function(strategy){
	return { "respondTo" : strategy }
    }

    var RuleBased = Backbone.Model.extend({
	
	respondTo: function(car){
	    return car.get("maximum_speed");
	}
    });

    var Driver = { 
	"constant" : wrap(constant),
	"speedUp" : wrap(speedUp),
	"target" : reachFor,
	"ruleBased" : RuleBased
    };

    Traffic.Driver = Driver;
})(jQuery, _, Backbone, Traffic);