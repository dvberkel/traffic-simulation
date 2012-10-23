describe("A Car", function(){
    it("should have a default speed", function(){
	var car = new Traffic.Car();

	var speed = car.get("speed");

	expect(speed).toBe(0);
    });

    it("should have a default acceleration", function(){
	var car = new Traffic.Car();

	var acceleration = car.get("acceleration");

	expect(acceleration).toBe(1);
    });

    it("should have a default maximum speed", function(){
	var car = new Traffic.Car();

	var maximum_speed = car.get("maximum_speed");

	expect(maximum_speed).toBe(5);
    });

    it("should not be able to speed up past maximum speed", function(){
	var expected_speed = 3;
	var car = new Traffic.Car({
	    "maximum_speed" : expected_speed,
	    "speed" : expected_speed
	});

	car.setSpeedTo(expected_speed + 1);

	expect(car).toHaveSpeed(expected_speed);
    });

    it("should not be able to speed faster then acceleration", function(){
	var car = new Traffic.Car({
	    "speed" : 1,
	    "acceleration" : 2
	});

	car.setSpeedTo(10);

	expect(car).toHaveSpeed(1 + 2);
    });

});
