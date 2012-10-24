(function($, Traffic){
    var driver = new Traffic.Driver.ruleBased();
    driver.add(new Traffic.Driver.Rule());

    var road = new Traffic.Road({ "driver" : driver });
    road.at(2).place(new Traffic.Car({ "speed" : 1 }));
    road.at(5).place(new Traffic.Car({ "speed" : 2 }));
    road.at(13).place(new Traffic.Car({ "speed" : 3 }));
    
    $(function(){
	new Traffic.MainView({ model : road, el : $("body") });
    });
})(jQuery, Traffic);
