(function($, Traffic){
    var road = new Traffic.Road();
    road.at(2).place(new Traffic.Car({ "speed" : 1 }));
    road.at(5).place(new Traffic.Car({ "speed" : 2 }));
    road.at(13).place(new Traffic.Car({ "speed" : 3 }));
    
    $(function(){
	new Traffic.MainView({ model : road, el : $("body") });
    });
})(jQuery, Traffic);
