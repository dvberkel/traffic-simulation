(function($, Traffic){
    var driver = new Traffic.Driver.ruleBased();
    driver.add(new Traffic.Driver.Rule({ "suggestion" : 0 }));

    var road = new Traffic.Road({ "driver" : driver });
    road.at(1).place(new Traffic.Car({ "speed" : 0 }));
    road.at(2).place(new Traffic.Car({ "speed" : 0 }));
    road.at(3).place(new Traffic.Car({ "speed" : 0 }));
    
    $(function(){
	new Traffic.MainView({ model : road, el : $("body") });
    });
})(jQuery, Traffic);
