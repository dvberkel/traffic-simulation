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
	    new CreateRuleControl({ model : this.model, el :container });
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
	    container.append(this.left());
	    container.append(this.operator());
	    container.append(this.right());
	    container.append(this.suggestion());
	    container.append(this.create(this.left(), this.operator(), this.right(), this.suggestion()));
	},

	left : function(){
	    if (!this._left) {
		var select = $("<select id='left'></select>");
		select.append("<option>distance</option>");
		select.append("<option>speed</option>");
		this._left = select;
	    }
	    return this._left;
	},

	operator : function(){
	    if(!this._operators) {
		var select = $("<select id='operator'></select>");
		select.append("<option>&lt;</option>");
		select.append("<option>&lt;=</option>");
		select.append("<option>==</option>");
		select.append("<option>&gt;=</option>");
		select.append("<option>&gt;</option>");
		this._operators = select;
	    }
	    return this._operators;
	},

	right : function(){
	    if(!this._right) {
		var input = $("<input id='right' type='text' size='2' value='2'>");
		this._right = input;
	    }
	    return this._right;
	},

	suggestion : function(){
	    if(!this._suggestion) {
		var input = $("<input id='suggestion' type='text' size='2' value='1'>");
		this._suggestion = input;
	    }
	    return this._suggestion;
	},

	create : function(left, operator, right, suggestion){
	    var self = this;
	    var button = $("<button>Add</button>");
	    button.click(function(){
		self.model.add({
		    "left" : left.val(),
		    "operator" : operator.val(),
		    "right" : right.val(),
		    "suggestion" : suggestion.val()
		});	
	    });
	    return button;
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
	template : _.template("<li><%= left %> <%= operator %> <%= right %> |-> <%= suggestion %></li>"),

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
