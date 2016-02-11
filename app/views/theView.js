define([
	'jquery',
	'underscore',
	'backbone',
	'app/collections/Products',
	'app/models/Products',
	'text!templates/homeTemplate.html',
	'app/collections/Finished_Goods',
	'app/models/Finished_Goods',
	'app/collections/Customer',
	'app/models/Customer',
	'app/collections/Order_Type',
	'app/models/Order_Type',
	'app/models/Steps',
	'app/models/Step_LINK_Option',
	'app/models/Options'],
	function ($, _, Backbone, productsCollection, productsModel, homeTemplate)
{
	return Backbone.View.extend(
	{
		//el: '#products',
		initialize: function (data)
		{
			//console.log("init");
			this.stuff = new productsCollection();
			this.stuff.fetch(
			{
				data:
				{
					fields: '*,customers.*,finished_goods.*,order_type.*,press.*,printers.*,products_steps.*,products_steps.step.*,products_steps.step.steps_options.*,products_steps.step.steps_options.option.*',
					sort: 'description'
				},
				success: _.bind(function ()
				{
					//console.log(this.stuff.models[3]._embedded["products:products_steps"][0]._embedded["products_steps:step"].description);
					//console.log('products stuff', this.stuff.models);
					_.each(this.stuff.models, function (p)
					{
						//console.log(p.attributes.description);
						_.each(p._embedded["products:products_steps"], function (m)
						{
							if ("_embedded" in m)
							{
								//console.log("steps: ", p._embedded["products:products_steps"].length);
								//console.log("m _embedded procucts_steps:step _embedded",m._embedded["products_steps:step"]._embedded);
								_.each(m._embedded["products_steps:step"]._embedded, function (n)
								{
									_.each(n, function (b)
									{
										//console.log("options: ", b._embedded["steps_options:option"].description, b._embedded["steps_options:option"].step_key_primary);
									});
								});
							}
						});
					});
					this.render();
				}, this)
			});
		},
		events:
		{
			'click': ''
		},

		killMe: function ()
		{
			if (this.child)
			{
				this.child.killMe();
			}
			this.remove();
		},

		render: function ()
		{
			//console.log("render");
			var data = {
				products: this.stuff.models,
			};
			var compiledTemplate = _.template(homeTemplate);
			this.$el.html(compiledTemplate(data));
		}
	});
});