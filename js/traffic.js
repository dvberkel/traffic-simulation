(function($, _, Traffic){
    var driver = new Traffic.Driver.ruleBased();
    driver.add(new Traffic.Driver.Rule({ "suggestion" : 0 }));

    var road = new Traffic.Road({ "driver" : driver });
    _.each(_.range(6), function(index){
	road.at(index + 1).place(new Traffic.Car({ "speed" : 0 }));
    }, road);
    
    $(function(){
	new Traffic.MainView({ model : road, el : $("body") });
    });
})(jQuery, _, Traffic);
