/*------------------------------------------------------------------------------------------------
* To add new 'tables' make sure the new API entity has the following fields/properties AS MINIMUM
*
*		id, option_key, product_key, step_key, step_option, value
*
* You will also have a key primary field/property but the naming of this is up to you
*
* The only areas you will need to change below are the 3 SWITCH/CASE statements. Either add new
* or if it's a new configurator, amend exisiting statements
*
* Also, don't forget to set up the RELATIONS to product, step, option and step_option within the
* model
------------------------------------------------------------------------------------------------*/

define([
	'jquery',
	'underscore',
	'backbone',
	'app/collections/Step_LINK_Option',
	'app/models/Step_LINK_Option',
	'text!templates/optionTemplate.html',
	'text!templates/buttonTemplate.html',
	'text!templates/nostepsTemplate.html',
	'text!templates/nomorestepsTemplate.html',
	'text!templates/existingTemplate.html',
	'text!templates/completeTemplate.html',
	'app/collections/Product_Steps',
	'app/models/Product_Steps',
	'app/models/Simulator',
	'app/models/Simulator_Items',
	'app/collections/Simulator_Items',
	'app/collections/ProductSelectedOptions',
	'app/models/ProductSelectedOptions',
	'app/models/Options',
	'app/models/Quotes'],
	function ($, _, Backbone, stepLinkCollection, steplinkModel, optionsTemplate, buttonTemplate, nostepsTemplate, noMoreStepsTemplate, existTemplate, completeTemplate, productstepsCollection, productstepsModel, simModel, simitemsModel, simitemsCollection, productselectedoptionsCollection, productselectedoptionsModel)
	{
	var valueArr = [0];
	var priceArr = [0];
	var c = false;
	var theScript;
	var theFile;

	optionSelect = Backbone.View.extend(
	{
		initialize: function (data)
		{
			this.seqID = 0;
			if (data.seq === 0)
			{
				this.seqID = Number(data.seq) + 1;
				$('#1').remove();
				$('#2').remove();
				$('#3').remove();
				$('#4').remove();
				$('#5').remove();
				this.parentKey = 0;
				valueArr[0] = data.record;
				theScript = data.script;
			}
			else
			{
				this.seqID = Number(data.seq) + 1;
				this.parentKey = data.parentKey;
			}
			this.listenTo(this, 'calc', this.getCalc);
			this.productKey = data.productKey;
			this.table = data.table;
			this.record = data.record;
			//this.custNum;

/*------------------------------------------------------------------------------------------------------------------------
* Below is the first SWITCH/CASE statements you need to edit. The format is as follows:
*
*		case "NAME OF TABLE IN URL"
*			this.simStuff = new COLLECTION NAME;
*			this.searchObj = {
*				fields: "*,NEW ENTITY.*,NEW ENTITY.step_option.*,step_option.step.*,step.*,NEW ENTITY.option,option.*"
*				NEW ENTITY PRIMARY KEY: data.record
*			};
*			this.key1 = "NEW ENTITY:option";
*			this.key2 = "NEW ENTITY:step_option";
*			theFile = "FILEMAKER FILE"
*			break;
*
* But if you are unsure then duplicate an existing one making the relevant chages
-------------------------------------------------------------------------------------------------------------------------*/

			switch (this.table) {
				case "simulator":
					this.simStuff = new simitemsCollection();
					this.simItem = new simitemsCollection();
					this.searchObj = {
						fields: "*,simulator_items.*,simulator_items.step_option.*,step_option.step.*,step.*,simulator_items.option,option.*",
						simulator_key: data.record,
					};
					this.key1 = "simulator_items:option";
					this.key2 = "simulator_items:step_option";
					theFile = "OEC_Configurator";
					break;
				case "order":
					this.simStuff = new productselectedoptionsCollection();
					this.simItem = new productselectedoptionsCollection();
					this.searchObj = {
						fields: "*,product_selected_options.*,product_selected_options.step_option.*,step_option.step.*,step.*,product_selected_options.option,option.*,product_selected_options.quote.*,quote.*",
						order_key_primary: data.record,
					};
					this.key1 = "product_selected_options:option";
					this.key2 = "product_selected_options:step_option";
					theFile = "BusinessMan";
					break;
				case "quote":
					this.simStuff = new productselectedoptionsCollection();
					this.simItem = new productselectedoptionsCollection();
					this.searchObj = {
						fields: "*,product_selected_options.*,product_selected_options.step_option.*,step_option.step.*,step.*,product_selected_options.option,option.*,product_selected_options.quote.*,quote.*",
						quote_key_primary: data.record,
					};
					this.key1 = "product_selected_options:option";
					this.key2 = "product_selected_options:step_option";
					theFile = "BusinessMan";
					break;
			}

			this.searchObj['sort'] = 'step_key';

			this.simStuff.fetch(
			{
				data: this.searchObj,
				success: _.bind(function()
				{
					//this.custNum = this.simStuff.models[0].related("product_selected_options:quote").get("customer_acc_num");
					//if (this.simStuff.models[0].attributes.hasOwnProperty('id') && !c)
					if (this.simStuff.models.length == 20 && !c)
					{
						_.each(this.simStuff.models, _.bind(function(thing) {
							var value;
							if (thing.attributes.option_key == 77 || thing.attributes.option_key == 78)
							{value = thing.attributes.value;}
							else
							{value = thing.related(this.key1).get('description');}
							var data = {
									step: thing.related(this.key2).related("steps_options:step").get('description'),
									value: value
							};
							//this.completeRender(data);
						},this) );
					}

					//else
					//{
						c = true;
						this.stepStuff = new productstepsCollection();
						this.stepStuff.fetch(
						{
							data:
							{
								fields: '*,step.*',
								product_key_primary: this.productKey,
								sequence: this.seqID
							},
							success: _.bind(function ()
							{
								this.stuff = new stepLinkCollection();
									
								if (typeof this.stepStuff.models[0].related("products_steps:step").get('description') == "undefined" && this.seqID > 1)
								{
									this.button({ table: this.table });
								}
								else if (typeof this.stepStuff.models[0].related("products_steps:step").get('description') == "undefined" && this.seqID == 1)
								{
									this.noSteps();
								}
								else
								{
									this.stuff.fetch(
									{
										data:
										{
											fields: '*,steps_options.*,steps_options.option.*,parent_option.*,option.*,step.*,option.custompricing.*,custompricing.*',
											parent_step_option_key_primary: this.parentKey,
											product_step: this.stepStuff.models[0].attributes.key_primary,
											sort: 'description_for_tree'
										},
										success: _.bind(function ()
										{
											_.each(this.stuff.models, _.bind(function(thing) {
												if (typeof thing._embedded["steps_options:option"] !== 'undefined') {
													if (typeof thing._embedded["steps_options:option"]._embedded !== 'undefined') {
														thing.attributes.price = thing._embedded["steps_options:option"]._embedded["options:custompricing"][0].custom_price;
													}
												}
											},this) );
											if (!_.isEmpty(this.stuff.models[0].attributes)){

												var saveData = {
													//option_key: this.stuff.models[0]._embedded["steps_options:option"].id,
													//simulator_key: valueArr[0],
													step_key: this.stepStuff.models[0].attributes.sequence,
													//step_option: this.stuff.models[0].attributes.id,
												};

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 3rd SWITCH/CASE statements you need to edit. The format is as follows:
*
*		case "NAME OF TABLE IN URL"
*			this.simitemModelObj['NEW ENTITY PRIMARY KEY'] = Number(valueArr[0]);
*			itemSaveModel = new NEW ENTITY MODEL(this.simitemModelObj);
*			break;
*
* But if you are unsure then duplicate an existing one making the relevant chages
-------------------------------------------------------------------------------------------------------------------------*/

													switch (this.table) {
														case "simulator":
															saveData['simulator_key'] = Number(valueArr[0]);
															itemSaveModel = new simitemsModel(saveData);
															break;
														case "order":
															saveData['order_key_primary'] = valueArr[0];
															itemSaveModel = new productselectedoptionsModel(saveData);
															break;
														case "quote":
															saveData['quote_key_primary'] = valueArr[0];
															itemSaveModel = new productselectedoptionsModel(saveData);
															break;
													}


												this.simItem.fetch(
												{
													data: saveData,
													success: _.bind(function (response){
														console.log('inital save',response);
														console.log(this.stuff.models[0]);
														if (typeof response.models[0].get('id') === 'undefined') {
															console.log('try to save');
															itemSaveModel.save().done(_.bind(function(saveResponse){
																if (this.stuff.models[0].get('description_for_tree') === 'Calculation') {
																	this.trigger('calc', saveResponse);
																}
																simID = saveResponse.id;
																this.render(saveResponse.id);
															}, this));
														}
														else
														{
															simID = response.models[0].get('id');
															this.render(response.models[0].get('id'));
														}
													}, this)
												}); // the magic ends here!!!

												//this.render();
											} else {
												this.noMoreSteps();
											}
										}, this)
									});
								}

							}, this)
						});
					//}
				}, this)
			});


		},

		events:
		{
			"change .chosen-select": "selectOption",
			"keydown .chosen-select": "selectOption",
			"keydown .input-data": "keyOption",
			"click label": "keyOption",
			"click button": "buttonOption"
		},

		killMe: function ()
		{
			if (this.child)
			{
				this.child.killMe();
			}
			this.remove();
		},

		keyOption: function (e)
		{
			e.stopPropagation();
			if (this.child)
			{
				this.child.killMe();
			}
			if (e.keyCode == 13)
			{
				var productKey = $(e.target).attr("data-keyProduct");
				var parentKey = $(e.target).attr("data-keyParent");
				var seq = $(e.target).attr("data-keySequence");
				var option = $(e.target).attr("data-keyOption");
				var stepLink = $(e.target).attr("data-steplink");
				var key = $(e.target).attr("data-simkey");
				var value = $(e.target).val();
				valueArr[seq] = value;

				var saveData = {
					option_key: option,
					simulator_key: this.record,
					step_key: seq,
					step_option: stepLink,
					value: value
				};

				if (key) {saveData['id'] = key;}

				var saved = this.saveOption(saveData);

				this.child = new optionSelect(
				{
					productKey: productKey,
					parentKey: stepLink,
					seq: seq,
					table: this.table

				});
				this.$el.append(this.child.$el);
			}
		},

		saveOption: function(data)
		{
			var table = this.table;
			var itemSaveModel;

			this.simitemModelObj = {
				step_key: parseInt(data.step_key),
				option_key: parseInt(data.option_key),
				value: Number(data.value),
				step_option: parseInt(data.step_option)
			};

			if (data.id) {this.simitemModelObj['id'] = parseInt(data.id);}

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 2nd SWITCH/CASE statements you need to edit. The format is as follows:
*
*		case "NAME OF TABLE IN URL"
*			this.simitemModelObj['NEW ENTITY PRIMARY KEY'] = Number(valueArr[0]);
*			itemSaveModel = new NEW ENTITY MODEL(this.simitemModelObj);
*			break;
*
* But if you are unsure then duplicate an existing one making the relevant chages
-------------------------------------------------------------------------------------------------------------------------*/

				switch (table) {
					case "simulator":
						//this.simitemModelObj['simulator_key'] = Number(valueArr[0]);
						this.simitemModelObj['simulator_key'] = valueArr[0];
						itemSaveModel = new simitemsModel(this.simitemModelObj);
						break;
					case "order":
						this.simitemModelObj['order_key_primary'] = valueArr[0];
						itemSaveModel = new productselectedoptionsModel(this.simitemModelObj);
						break;
					case "quote":
						this.simitemModelObj['quote_key_primary'] = valueArr[0];
						itemSaveModel = new productselectedoptionsModel(this.simitemModelObj);
						break;
				}

				itemSaveModel.save();

		},

		getCalc: function (response)
		{
			console.log('getCalc',response);
			//var parameter = response.id + '\r' + theFile;
			//$.post('/fm', { action: 'script', file: theFile, script: 'Update_Calculation', parameter: parameter });
			$.post('/fm', { action: 'script', file: theFile, script: 'Update_Calculation', parameter: response.id});
			return "yess";
		},

		buttonOption: function (e)
		{
			e.stopPropagation();
			$.get("/fm?action=script&file="+theFile+"&script="+theScript);
			$(e.target).replaceWith('<span style="display:block;margin-left:150px">Data saved successfully.</span>');
		},

		selectOption: function (e)
		{
			e.stopPropagation();
			if (this.child)
			{
				this.child.killMe();
			}
			var productKey = $(e.target).find(":selected").attr("data-keyProduct");
			var currentVal = $(e.target).find(":selected").val();
			var parentKey = $(e.target).find(":selected").attr("data-steplink");
			var seq = $(e.target).find(":selected").attr("data-keySequence");
			var price = $(e.target).find(":selected").attr("data-price");
			var key = $(e.target).find(":selected").attr("data-simkey");

			if (currentVal == "default")
			{
				return;
			}
			else
			{
				valueArr[seq] = currentVal;
				priceArr[seq] = price;
			}

			var saveData = {
				option_key: currentVal,
				simulator_key: this.record,
				step_key: seq,
				step_option: parentKey,
				value: currentVal
			};

			if (key) {saveData['id'] = key;}

			var saved = this.saveOption(saveData);

			this.child = new optionSelect(
			{
				productKey: productKey,
				parentKey: parentKey,
				seq: seq,
				table: this.table,
				record: this.record
			});
			this.$el.append(this.child.$el);
		},

		render: function (data)
		{
			var num = 0;
			var defaultVal;
			var itemSaveModel;
			var simID = data;
			if (this.stuff.models[0].attributes.default) {defaultVal = this.stuff.models[0].attributes.default;}

/*					switch (this.stepStuff.models[0].attributes.sequence)
					{
						case 7:
							//defaultVal = valueArr[0];
							break;
						case 16:
						// IF( Stagger Type = "None" ; 0 ; IF( Stagger Type = "Stairstep Continuous" ; (Number AC - 1)  * Stagger Amount ; Stagger Amount ) )
							if (valueArr[6] == 44)
							{num = 0;}
							else if(valueArr[6] == 43)
							{num = (Number(valueArr[10]) - 1) * Number(valueArr[11]);}
							else
							{num = Number(valueArr[11]);}
							break;
						case 17:
						//( 1up Cutoff * Number AR) + Stagger Amount + Add AC For Marks
							num = (Number(valueArr[7]) * Number(valueArr[8])) + Number(valueArr[16]) + Number(valueArr[11]) + Number(valueArr[13]);
							break;
						case 18:
						// (1up Web * Number AC) + Add AC For Marks + Width Flashing
							num = (Number(valueArr[9]) * Number(valueArr[10])) + Number(valueArr[13]) + Number(valueArr[15]);
							break;
						case 19:
							{num = (Number(priceArr[1]) + Number(priceArr[3])).toFixed(5);}
							break;
						case 20:
							num = Number(valueArr[17]) * Number(valueArr[18]);
							break;
						default:
							num = Math.floor(Math.random() * 41) + 60;
					}
*/

					var stepData = {
						steps: this.stuff.models,
						seq: this.stepStuff.models[0].attributes.sequence,
						productKey: this.productKey,
						parentKey: this.parentKey,
						step: this.stepStuff.models[0].related('products_steps:step').get('description'),
						num: num,
						defaultVal: defaultVal,
						simKey: simID
					};

					if (typeof defaultVal === 'undefined') {stepData['defaultVal'] = this.simItem.models[0].get('value');}
					stepData['num'] = this.simItem.models[0].get('value');

					var compiledTemplate = _.template(optionsTemplate);
					this.$el.html(compiledTemplate(stepData));
					this.$el.find("input").focus();
					this.$el.find("select").focus();
					//console.log(stepData['steps'][0].get('description_for_tree'));
					if ((stepData['steps'][0].get('description_for_tree') !== 'Value' && stepData['steps'].length === 1) || this.simItem.models[0].get('value')) {
						var e = $.Event('keydown', { keyCode: 13 });
						$(this.$el.find("select")).trigger(e);
						$(this.$el.find("input")).trigger(e);
					}

		},

		existRender: function (data)
		{
			var compiledbuttonTemplate = _.template(existTemplate);
			this.$el.append(compiledbuttonTemplate(data));
		},

		completeRender: function (data)
		{
			var compiledbuttonTemplate = _.template(completeTemplate);
			this.$el.append(compiledbuttonTemplate(data));
		},

		button: function (val)
		{
			var data = {
				buttonText: "Save",
				table: val.table
			};
			var compiledbuttonTemplate = _.template(buttonTemplate);
			this.$el.html(compiledbuttonTemplate(data));
			this.$el.find("button").focus();
		},

		noSteps: function ()
		{
			var compiledTemplate = _.template(nostepsTemplate);
			this.$el.html(compiledTemplate());
		},

		noMoreSteps: function ()
		{
			var compiledTemplate = _.template(noMoreStepsTemplate);
			this.$el.html(compiledTemplate());
		}

	});
	return optionSelect;
});