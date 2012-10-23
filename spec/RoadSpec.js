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
});
