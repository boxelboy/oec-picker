define(['jquery', 'underscore', 'backbone', 'text!templates/flow/index.html', 'text!templates/alert/index.html', 'text!templates/flow/chart.html', 'app/models/Products'], function ($, _, Backbone, flowTemplate, alertTemplate, flowChart, productsModel)
{
	flowChartView = Backbone.View.extend(
	{
		initialize: function (params)
		{

			this.params = params;
			this.render();
		},
		events:
		{
			'click span.false': 'falseClick',
			'click span.true': 'trueClick',
			'click span.sum': 'sumClick'
		},
		falseClick: function (e)
		{
			//Stops event going up the chains //
			e.stopPropagation();
			var selected = $(event.target).html();
			this.alertView = new AlertView(
			{
				'title': 'Choose Type',
				"selected": selected,
				'steps': this.params.steps,
				'icon': "info",
				'displayButton': 'true',
				'button': 'Insert',
			});
			$('body').append(this.alertView.$el);
			this.alertView.on('updateView', _.bind(function (tmpObject)
			{
				this.addChildView(tmpObject, "false");
			}, this));
		},
		trueClick: function (e)
		{
			//Stops event going up the chains //
			e.stopPropagation();
			var selected = $(event.target).html();
			this.alertView = new AlertView(
			{
				'title': 'Choose Type',
				"selected": selected,
				'steps': this.params.steps,
				'icon': "info",
				'displayButton': 'true',
				'button': 'Insert',
			});
			$('body').append(this.alertView.$el);
			this.alertView.on('updateView', _.bind(function (tmpObject)
			{
				this.addChildView(tmpObject, "true");
			}, this));
		},
		sumClick: function (e)
		{
			//Stops event going up the chains //
			e.stopPropagation();
			var selected = $(event.target).html();
			this.alertView = new AlertView(
			{
				'title': 'Choose Type',
				"selected": selected,
				'steps': this.params.steps,
				'icon': "info",
				'displayButton': 'true',
				'button': 'Insert',
			});
			$('body').append(this.alertView.$el);
			this.alertView.on('updateView', _.bind(function (tmpObject)
			{
				this.addChildView(tmpObject, "none");
			}, this));
		},
		addChildView: function (object, type)
		{
			this.flowChartView = new flowChartView(
			{
				data: object,
				steps: this.params.steps
			});
			switch (type)
			{
			case "none":
				this.$('.insertArea').append(this.flowChartView.$el);
				break;
			case "true":
				this.$('.insertAreaTrue').append(this.flowChartView.$el);
				break;
			case "false":
				this.$('.insertAreaFalse').append(this.flowChartView.$el);
				break;
			}
		},
		render: function ()
		{
			var data = {
				params: this.params
			};
			var compiledTemplate = _.template(flowChart);
			this.$el.html(compiledTemplate(data));
		}
	});
	AlertView = Backbone.View.extend(
	{
		tagName: 'div',
		id: "alertView",
		events:
		{
			'click button.confirm': 'update',
			'change .typeSelect': 'comparisonChange',
			'change .dynamicSelect': 'dynamicChange'
		},
		update: function ()
		{
			var selectedType = $('.typeSelect').find(":selected").val();
			var selectedTypeOperator;
			switch (selectedType)
			{
			case "if":
				selectedTypeOperator = $('.comparison').find(":selected").val();
				break;
			case 'calculation':
				selectedTypeOperator = $('.operator').find(":selected").val();
				break;
			}
			var startPost;
			if (typeof $('.start').html() === 'undefined')
			{
				startPost = $('.startList').find(":selected").val();
			}
			else
			{
				startPost = $('.start').html();
			}
			var viewVars = {
				type: selectedType,
				typeEnd: $('.dynamicSelect').find(":selected").val(),
				start: startPost,
				operator: selectedTypeOperator,
				calculation : {

				},
				end: ($('.dynamicSelect').find(":selected").val() == "static") ? $('.static').val() : $('.dynamic').find(":selected").val()
			};
			this.trigger('updateView', viewVars);
			this.remove();
		},
		comparisonChange: function (event)
		{
			var selected = $(event.target).find(":selected").val();
			switch (selected)
			{
			case "false":
				this.$('.comparison').hide();
				this.$('.operator').hide();
				break;
			case "if":
				this.$('.comparison').show();
				this.$('.operator').hide();
				break;
			case "calculation":
				this.$('.comparison').hide();
				this.$('.operator').show();
				break;
			}
		},
		dynamicChange: function ()
		{
			var selected = $(event.target).find(":selected").val();
			switch (selected)
			{
			case "false":
				this.$('.static').hide();
				this.$('.dynamic').hide();
				break;
			case "static":
				this.$('.static').show();
				this.$('.dynamic').hide();
				break;
			case "dynamic":
				this.$('.static').hide();
				this.$('.dynamic').show();
				break;
			}
		},
		initialize: function (settings)
		{
			this.settings = settings;
			this.render();
		},
		render: function ()
		{
			var data = {
				data: this.settings
			};

			var compiledTemplate = _.template(alertTemplate);
			this.$el.html(compiledTemplate(data));
		}
	});
	return Backbone.View.extend(
	{
		initialize: function (data)
		{
			this.flowObject = {};
			this.products = new productsModel( { id : parseInt(data.id)});
			this.products.fetch(
			{
				async:false,
				data:
				{
					fields: '*,products_steps.*,products_steps.step.*,products_steps.step.steps_options.*',
				},
				success: _.bind(function ()
				{
					this.render();
				}, this)
			});
			this.render();
		},
		events:
		{
			'click .list-group a': 'openDlg'
		},
		openDlg: function (event)
		{
			event.preventDefault();
			var selected = $(event.target).html();
			this.alertView = new AlertView(
			{
				'title': 'Choose Type',
				"selected": selected,
				'steps': this.products,
				'calculation' : {
					//Can you views down tree
					//Start at top move down down down acces this calculation
				},
				'icon': "info",
				'displayButton': 'true',
				'button': 'Insert',
			});
			$('body').append(this.alertView.$el);
			this.alertView.on('updateView', _.bind(function (tmpObject)
			{
				this.rerenderView(tmpObject);
			}, this));
		},
		rerenderView: function (tmpObject)
		{
			//Create root Item if empty object
			if (_.isEmpty(this.flowObject))
			{
				this.flowObject = tmpObject;
				this.flowChartView = new flowChartView(
				{
					data: this.flowObject,
					steps: this.products
				});
				this.$('.flowChart').append(this.flowChartView.$el);
			}else{
				alert('root item has already been created');
			}
		},
		render: function ()
		{
			var data = {
				products: this.products,
			};
			
			var compiledTemplate = _.template(flowTemplate);
			this.$el.html(compiledTemplate(data));
		}
	});
});