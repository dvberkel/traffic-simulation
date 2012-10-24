describe("A Driver", function(){
    var car;
    var driver;

    beforeEach(function(){
	car = new Traffic.Car({ "speed" : 2 });
    });
    
    describe("(Constant)", function(){
	beforeEach(function(){
	    driver = Traffic.Driver.constant;
	});

	it("should respond to distances", function(){
	    var suggestion = driver.respondTo.call(car, 1);

	    expect(suggestion).toBe(car.get("speed"));
	});
    });

    describe("(SpeedUp)", function(){
	beforeEach(function(){
	    driver = Traffic.Driver.speedUp;
	});

	it("should respond to distances", function(){
	    var suggestion = driver.respondTo.call(car, 1);

	    expect(suggestion).toBe(car.get("speed") + 1);
	});
    });

    describe("(target)", function(){
	beforeEach(function(){
	    driver = Traffic.Driver.target(4);
	});

	it("should respond to distances", function(){
	    var suggestion = driver.respondTo.call(car, 1);

	    expect(suggestion).toBe(4);
	});
    });
});