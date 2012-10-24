describe("A Road", function(){
    it("should have a default track_length", function(){
	var road = new Traffic.Road();

	var length = road.get("track_length");

	expect(length).toBe(30);
    });

    it("should be able to place a car", function(){
	var road = new Traffic.Road();
	
	road.at(0).place(new Traffic.Car());

	expect(road).toHaveAnCarAt(0);
    });

    it("should be able to update a car", function(){
	var road = new Traffic.Road();
	road.at(0).place(new Traffic.Car({ "speed" : 1 }));

	road.update();

	expect(road).toHaveAnCarAt(1);
	expect(road).not.toHaveAnCarAt(0);
    });

    it("should be connected end to end", function(){
	var road = new Traffic.Road({ "track_length" : 5});
	road.at(4).place(new Traffic.Car({ "speed" : 1 }));

	road.update();

	expect(road).toHaveAnCarAt(0);
    });

    it("should not update passed an other car", function(){
	var road = new Traffic.Road();
	road.at(0).place(new Traffic.Car({ "speed" : 5 }));
	road.at(2).place(new Traffic.Car({ "speed" : 1 }));

	road.update();

	expect(road).toHaveAnCarAt(2);
	expect(road.at(2).get("car")).toHaveSpeed(2);
	expect(road).toHaveAnCarAt(3);
	expect(road.at(3).get("car")).toHaveSpeed(1);
    });

    it("should not update passed an other car around the end", function(){
	var road = new Traffic.Road({ "track_length" : 10});
	road.at(2).place(new Traffic.Car({ "speed" : 1 }));
	road.at(9).place(new Traffic.Car({ "speed" : 5 }));

	road.update();

	expect(road).toHaveAnCarAt(2);
	expect(road.at(2).get("car")).toHaveSpeed(3);
	expect(road).toHaveAnCarAt(3);
	expect(road.at(3).get("car")).toHaveSpeed(1);
    });

    it("should correct all cars if one can not make it ", function(){
	var road = new Traffic.Road({ "track_length" : 10});
	road.at(0).place(new Traffic.Car({ "speed" : 5 }));
	road.at(1).place(new Traffic.Car({ "speed" : 5 }));
	road.at(2).place(new Traffic.Car({ "speed" : 1 }));

	road.update();

	expect(road).toHaveAnCarAt(1);
	expect(road.at(1).get("car")).toHaveSpeed(1);
	expect(road).toHaveAnCarAt(2);
	expect(road.at(2).get("car")).toHaveSpeed(1);
	expect(road).toHaveAnCarAt(3);
	expect(road.at(3).get("car")).toHaveSpeed(1);
    });

    it("should allow driver to change speed of car prior to update", function(){
	var road = new Traffic.Road();
	road.at(0).place(new Traffic.Car({ "speed" : 0, "driver" : Traffic.Driver.speedUp }));

	road.update();

	expect(road).toHaveAnCarAt(1);
	expect(road.at(1).get("car")).toHaveSpeed(1);
    });

    it("should pass driver the distance to next car prior to update", function(){
	var road = new Traffic.Road();
	var mockDriver = new (function(){
	    var seen = -1;

	    this.respondTo = function(distance){
		seen = distance;
		return this.get("speed");
	    };

	    this.distanceSeen = function(){
		return seen;
	    }
	})();
	road.at(0).place(new Traffic.Car({ "speed" : 0, "driver" : mockDriver }));
	road.at(2).place(new Traffic.Car({ "speed" : 0 }));

	road.update();

	console.log(mockDriver);

	expect(mockDriver.distanceSeen()).toBe(2);
    });
});
