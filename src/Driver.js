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


    var Rule = Backbone.Model.extend({
	defaults : {
	    "left" : "location",
	    "operator" : "<=",
	    "right" : 2,
	    "suggestion" : 2
	}
    });

    var RuleBased = Backbone.Collection.extend({
	template : _.template("if (<%= left %> <%= operator %> <%= right %>){ return <%= suggestion %>; };"),
	model : Rule,

	initialize : function(){
	    this.on("add", this.recalculate, this);
	    this.on("remove", this.recalculate, this);
	},
	
	recalculate : function() {
	    var self = this;
	    var rule = "this.responseFor = function(car, distance){" +
		"var speed = car.get('speed');";
	    self.each(function(r){
		rule += self.template(r.toJSON());
	    });
	    rule += "return car.get('maximum_speed');}";
	    console.log(rule);
	    eval(rule);
	},

	respondTo: function(car, distance){
	    return this.responseFor(car, distance);
	},
	
	responseFor : function(car, distance) {
	    return car.get("maximum_speed");
	}
    });

    var Driver = { 
	"constant" : wrap(constant),
	"speedUp" : wrap(speedUp),
	"target" : reachFor,
	"ruleBased" : RuleBased,
	"Rule": Rule
    };

    Traffic.Driver = Driver;
})(jQuery, _, Backbone, Traffic);
