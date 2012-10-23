(function($, Traffic){
    var road = new Traffic.Road();
    
    $(function(){
	new Traffic.MainView({ model : road, el : $("body") });
    });
})(jQuery, Traffic);
