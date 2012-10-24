(function($, _, Backbone, Traffic){
    var Driver = {};

    var constant = function(distance) {
	return this.get("speed");
    }

    var speedUp = function(distance) {
	return this.get("speed") + 1;
    }

    var reachFor = function(target){
	return wrap(function(){ 
	    return target 
	});
    }

    var wrap = function(strategy){
	return { "respondTo" : strategy }
    }

    var Driver = { 
	"constant" : wrap(constant),
	"speedUp" : wrap(speedUp),
	"target" : reachFor
    };

    Traffic.Driver = Driver;
})(jQuery, _, Backbone, Traffic);