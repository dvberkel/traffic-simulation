beforeEach(function() {
    this.addMatchers({
	toHaveSpeed: function(expectedSpeed) {
	    var car = this.actual;
	    return car.get("speed") === expectedSpeed;
	},
	toHaveAnCarAt: function(index) {
	    var road = this.actual;
	    return road.at(index).get("car") != undefined;
	}
    });
});
