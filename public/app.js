SignupModel = Backbone.Model.extend({

});

SignupView = Backbone.View.extend({
	template: _.template($("#signup").html()),
    initialize: function() {
        this.render();
    },
    render: function(){
 		this.el.innerHTML = this.template(this.model.toJSON());
        return this;
           },
    events:{
           	'click .nav': 'handleClick'
           },
    handleClick: function(event){
    	console.log('handle');
    	Backbone.history.navigate(event.target.getAttribute('href'),{trigger: true});
    	event.preventDefault(); 
    }
});		
		signup = new SignupModel();
		signupview = new SignupView({model:signup});


var Router = Backbone.Router.extend({
	routes:{
		'signup':'signup'
	},
	signupform: function(){
		console.log('hi')

	$('#main').append(signupview.template.el);
	}
});

console.log('hi')

var router = new Router();

Backbone.history.start({ pushState: true});