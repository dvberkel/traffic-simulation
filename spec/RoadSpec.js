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
});
