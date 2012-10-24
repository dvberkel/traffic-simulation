(function($, _, Backbone, Traffic){
    var Car = Backbone.Model.extend({
	defaults : { "speed" : 0, "acceleration" : 1, "maximum_speed" : 5, "updater" : function(distance){ return this.get("speed"); } },
	
	setSpeedTo : function(target){
	    this.set("speed", Math.max(
		0,
		Math.min(
		    target, 
		    this.get("speed") + this.get("acceleration"),
		    this.get("maximum_speed")
		)
	    ));
	},
	
	updateSpeed : function(distance) {
		this.setSpeedTo(this.get("updater").call(this, distance));
	}
		
    });

    Traffic.Car = Car;
})(jQuery, _, Backbone, Traffic);
