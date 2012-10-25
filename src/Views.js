(function($, _, Backbone, Traffic){
    var MainView = Backbone.View.extend({

	initialize : function(){
	    this.render();
	},

	render : function(){
	    this.$el.empty();
	    var viewport = $("<div class='viewport'></div>");
	    viewport.appendTo(this.$el);
	    new RoadView({ model : this.model, el : viewport });
	    new Controls({ model : this.model, el : viewport });
	}
    });

    var RoadView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var road = $("<div class='road' />");
	    new SegmentsView({ model : this.model, el : road });
	    road.appendTo(this.$el);
	}
    });

    var SegmentsView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var segments = $("<div class='segments' />")
	    this.model.get("segments").each(function(segment){
		new SegmentView({ model : segment, el : segments });
	    });
	    segments.appendTo(this.$el);
	}
    });

    var SegmentView = Backbone.View.extend({
	initialize : function(){
	    this.model.on("change:car", this.render, this);

	    this.render();
	},

	render : function(){
	    var segment = this.container();
	    segment.empty();
	    if (this.model.has("car")) {
		new CarView({ model : this.model.get("car"), el : segment });
	    }
	},

	container : function(){
	    if (! this.options.container ) {
		var container = $("<span class='segment'/>");
		container.appendTo(this.$el);
		this.options.container = container;
	    }
	    return this.options.container;
	}
    });

    var CarView = Backbone.View.extend({
	template : _.template("<img src='image/car.svg' title='Speed: <%= speed %>'/>"),
	
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var car = $("<span class='car'></span>");
	    car.append(this.template(this.model.toJSON()));
	    car.appendTo(this.$el);
	}
    });

    var Controls = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var controls = $("<div class='controls' />");
	    controls.appendTo(this.$el);
	    new StepControl({ model : this.model, el : controls });
	    new PlayPauseControl({ model : this.model, el : controls });
	    new DriverControl({ model : this.model.get("driver"), el : controls });
	}
    });

    var StepControl = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var self = this;
	    var button = $("<button>Step</button>");
	    button.click(function(){
		self.model.update();
	    });
	    button.appendTo(self.$el);
	}
    });

    var PlayPauseControl = Backbone.View.extend({
	events : {
	    "click button.pauzePlay" : "playPauze"
	},

	initialize : function(){
	    this.render();
	},

	render : function(){
	    var self = this;
	    this.button = $("<button class='pauzePlay' />");
	    this.button.text(">");
	    this.button.appendTo(self.$el);
	},

	playPauze : function(){
	    var self = this;
	    if (this.action) {
		clearInterval(this.action);
		this.action = undefined;
		this.button.text(">");
	    } else {
		this.action = setInterval(function(){ self.model.update () }, 500);
		this.button.text("=");
	    };
	}
    });
    
    var DriverControl = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var container = $("<div class='rules'/>");
	    container.appendTo(this.$el);
	    new CreateRuleControl({ model : this.model, el :container, maximum : 5 });
	    new RulesView({ model : this.model, el : container });
	}
    });

    var CreateRuleControl = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var container = $("<div class='create'/>");
	    container.appendTo(this.$el);
	    var range = _.range(this.options.maximum + 1);
	    new SelectionView({ model : new TermModel({ id : "left" }), el : container, items : ["distance", "speed"]});
	    new SelectionView({ model : new TermModel({ id : "operator" }), el : container, items : ["&lt;", "&lt;=", "==", "&gt;=", "&gt;"]});
	    new SelectionView({ model : new TermModel({ id : "right" }), el : container, items : range.concat(["distance", "speed"])});
	    new SelectionView({ model : new TermModel({ id : "suggestion" }), el : container, items : range.concat(["speed", "speed + 1", "speed - 1"])});
	    new CreateView({ model : this.model, el : container, leftId : "left", operatorId : "operator", rightId : "right", suggestionId : "suggestion"});
	}
    });

    var TermModel = Backbone.Model.extend({
	defaults : { "id" : "left" }
    });

    var SelectionView = Backbone.View.extend({
	selectionTemplate : _.template("<select id='<%= id %>'></select>"),
	optionTemplate : _.template("<option><%= option %></option>"),

	initialize : function(){
	    this.render();
	},

	render : function(){
	    var self = this;
	    var select = $(self.selectionTemplate(self.model.toJSON()));
	    select.appendTo(self.$el);
	    _.each(this.options.items, function(option){
		select.append(self.optionTemplate({ "option" : option }));
	    })
	}
    });
    
    var CreateView = Backbone.View.extend({
	initialize : function(){
	    this.render();
	},

	render : function(){
	    var self = this;
	    var button = $("<button>Add</button>");
	    button.appendTo(this.$el);
	    button.click(function(){
		self.model.add({
		    "left" : $("#" + self.options.leftId).val(),
		    "operator" : $("#" + self.options.operatorId).val(),
		    "right" : $("#" + self.options.rightId).val(),
		    "suggestion" : $("#" + self.options.suggestionId).val()
		});	
	    });
	}
    });
    
    var RulesView = Backbone.View.extend({
	initialize : function(){
	    this.model.on("add", this.render, this);
	    this.render();
	},

	render : function(){
	    var container = this.container();
	    container.empty();
	    this.model.each(function(rule){
		new RuleView({ model : rule, el : container})
	    });
	},

	container : function(){
	    if (!this.ul) {
		this.ul = $("<ul/>");
		this.ul.appendTo(this.$el);
	    }
	    return this.ul;
	}
    });

    var RuleView = Backbone.View.extend({
	template : _.template("<li><tt>if(<%= left %> <%= operator %> <%= right %>){ return <%= suggestion %>;}</tt></li>"),

	initialize : function(){
	    this.render();
	},

	render : function(){
	    var item = $(this.template(this.model.toJSON()));
	    item.appendTo(this.$el);
	}
    });

    Traffic.MainView = MainView;
})(jQuery, _, Backbone, Traffic);
