/*---------------------------------------------------------------------------------------------------
* To add new 'tables' make sure the new API entity has the following fields/properties AS MINIMUM	*
*																									*
*		id, option_key, product_key, step_key, step_option, value									*																									*
* You will also have a key primary field/property but the naming of this is up to you				*
*																									*
* The only areas you will should need to change below are the 4 SWITCH/CASE statements. Either add	*
* new or if it's a new configurator, amend exisiting statements										*
*																									*
* Also, don't forget to set up the RELATIONS to product, step, option and step_option within the	*
* model																								*
*																									*
* There are a lot of functions here that are no longer accessed. They are kept in case the			*
* functionality is required in the future.															*
----------------------------------------------------------------------------------------------------*/

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
	'text!templates/loaderTemplate.html',	
	'app/collections/Product_Steps',
	'app/models/Product_Steps',
	'app/models/Simulator',
	'app/models/Simulator_Items',
	'app/collections/Simulator_Items',
	'app/collections/ProductSelectedOptions',
	'app/models/ProductSelectedOptions',
	'app/collections/QuoteLineItems',
	'app/models/QuoteLineItems',
	'app/models/Options',
	'app/models/Quotes'],
	function ($, _, Backbone, stepLinkCollection, steplinkModel, optionsTemplate, buttonTemplate, nostepsTemplate, noMoreStepsTemplate, existTemplate, completeTemplate, loaderTemplate, productstepsCollection, productstepsModel, simModel, simitemsModel, simitemsCollection, productselectedoptionsCollection, productselectedoptionsModel,QuoteLineItemsCollection,QuoteLineItemsModel)
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
			$('#loading').hide();
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

			this.productKey = data.productKey;
			this.table = data.table;
			this.record = data.record;
			this.TS;
			this.idArr = [];

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 1st SWITCH/CASE statements you need to edit. The format is as follows:									 *
*																														 *
*		case "NAME OF TABLE IN URL"																						 *
*			this.simCol = new COLLECTION NAME;																			 *
*			this.simItemCol = new OLLECTION NAME; - this is need to keep the collection away from the main 'loop'		 *
*			this.searchObj = {																							 *
*				fields: "*,NEW ENTITY.*,NEW ENTITY.step_option.*,step_option.step.*,step.*,NEW ENTITY.option,option.*"	 *
*				NEW ENTITY PRIMARY KEY: data.record																		 *
*			};																											 *
*			this.key1 = "NEW ENTITY:option";																			 *
*			this.key2 = "NEW ENTITY:step_option";																		 *
*			theFile = "FILEMAKER FILE"																					 *
*			break;																										 *
*																														 *
* But if you are unsure then duplicate an existing one making the relevant changes										 *
-------------------------------------------------------------------------------------------------------------------------*/

			switch (this.table) {
				case "simulator":
					this.simCol = new simitemsCollection();
					this.simItemCol = new simitemsCollection();
					this.searchObj = {
						fields: "*,simulator_items.*,simulator_items.step_option.*,step_option.step.*,step.*,simulator_items.option,option.*",
						simulator_key: data.record,
					};
					this.key1 = "simulator_items:option";
					this.key2 = "simulator_items:step_option";
					this.key3 = "api:simulator_items";
					theFile = "OEC_Configurator";
					break;
				case "order":
					this.simCol = new productselectedoptionsCollection();
					this.simItemCol = new productselectedoptionsCollection();
					this.searchObj = {
						fields: "*,product_selected_options.*,product_selected_options.step_option.*,step_option.step.*,step.*,product_selected_options.option,option.*,product_selected_options.quote.*,quote.*",
						order_key_primary: data.record,
					};
					this.key1 = "product_selected_options:option";
					this.key2 = "product_selected_options:step_option";
					this.key3 = "api:product_selected_options";
					theFile = "BusinessMan";
					break;
				case "quote":
					this.simCol = new productselectedoptionsCollection();
					this.simItemCol = new productselectedoptionsCollection();
					this.searchObj = {
						fields: "*,product_selected_options.*,product_selected_options.step_option.*,step_option.step.*,step.*,product_selected_options.option,option.*,product_selected_options.quote.*,quote.*",
						quote_key_primary: data.record,
					};
					this.key1 = "product_selected_options:option";
					this.key2 = "product_selected_options:step_option";
					this.key3 = "api:product_selected_options";
					theFile = "BusinessMan";
					break;
			}

			//this.searchObj['sort'] = 'step_key';

			this.simCol.fetch(
			{
				data: this.searchObj,
				success: _.bind(function()
				{
					if (this.simCol.models.length == 20 && !c)
					{
						_.each(this.simCol.models, _.bind(function(simColItem) {
							var value;
							if (simColItem.attributes.option_key == 77 || simColItem.attributes.option_key == 78)
							{value = simColItem.attributes.value;}
							else
							{value = simColItem.related(this.key1).get('description');}
							var data = {
									step: simColItem.related(this.key2).related("steps_options:step").get('description'),
									value: value
							};
							//this.completeRender(data);
						},this) );
					}

					//else
					//{
						c = true;

						_.each(this.simCol.models, _.bind(function(simColItem) {
							this.idArr.push(simColItem.get('id'));
						},this) );

						this.stepCol = new productstepsCollection();
						this.stepCol.fetch(
						{
							data:
							{
								fields: '*,step.*',
								product_key_primary: this.productKey,
								sequence: this.seqID
							},
							success: _.bind(function ()
							{
								this.steplinkCol = new stepLinkCollection();
									
								if (typeof this.stepCol.models[0].related("products_steps:step").get('description') == "undefined" && this.seqID > 1)
								{
									//this.button({ table: this.table });
									this.completeRender();
								}
								else if (typeof this.stepCol.models[0].related("products_steps:step").get('description') == "undefined" && this.seqID == 1)
								{
									this.noSteps();
								}
								else
								{
									this.steplinkCol.fetch(
									{
										data:
										{
											fields: '*,steps_options.*,steps_options.option.*,parent_option.*,option.*,step.*,option.custompricing.*,custompricing.*',
											parent_step_option_key_primary: this.parentKey+',~%\r'+this.parentKey+',~'+this.parentKey+'\r%'+',~%\r'+this.parentKey+'\r%',
											product_step: this.stepCol.models[0].attributes.key_primary,
											sort: 'description_for_tree'
										},
										success: _.bind(function ()
										{
											_.each(this.steplinkCol.models, _.bind(function(steplinkColItem) {
												if (typeof steplinkColItem._embedded["steps_options:option"] !== 'undefined') {
													if (typeof steplinkColItem._embedded["steps_options:option"]._embedded !== 'undefined') {
														steplinkColItem.attributes.price = steplinkColItem._embedded["steps_options:option"]._embedded["options:custompricing"][0].custom_price;
													}
												}
											},this) );
											if (!_.isEmpty(this.steplinkCol.models[0].attributes)){
												var saveData = {};

												var searchStr = "";
												_.each(this.steplinkCol.models, _.bind(function(steplinkItem){
													searchStr += steplinkItem.get('option_key_primary') + ",";
												},this));
												searchStr = searchStr.substring(0, searchStr.length -1);

												saveData['id'] = this.idArr[this.seqID - 1];

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 2nd SWITCH/CASE statements you need to edit. The format is as follows:									 *
*																														 *
*		case "NAME OF TABLE IN URL"																						 *
*			saveData['NEW ENTITY PRIMARY KEY'] = valueArr[0];															 *
*			saveData['option_key'] = this.steplinkCol.models[0].get('option_key_primary');								 *
*			saveData['step_option'] = this.steplinkCol.models[0].get('id');												 *
*			saveData['step_key'] = this.steplinkCol.models[0].get('step_key_primary');									 *
*			itemSaveModel = new NEW ENTITY MODEL(this.simItemColModelObj);												 *
*			break;																										 *
*																														 *
* But if you are unsure then duplicate an existing one making the relevant changes										 *
-------------------------------------------------------------------------------------------------------------------------*/

													switch (this.table) {
														case "simulator":
															saveData['simulator_key'] = valueArr[0];
															saveData['option_key'] = this.steplinkCol.models[0].get('option_key_primary');
															saveData['step_option'] = this.steplinkCol.models[0].get('id');
															saveData['step_key'] = this.steplinkCol.models[0].get('step_key_primary');
															itemSaveModel = new simitemsModel(saveData);
															break;
														case "order":
															saveData['order_key_primary'] = valueArr[0];
															saveData['option_key'] = this.steplinkCol.models[0].get('option_key_primary');
															saveData['step_option'] = this.steplinkCol.models[0].get('id');
															saveData['step_key'] = this.steplinkCol.models[0].get('step_key_primary');
															itemSaveModel = new productselectedoptionsModel(saveData);
															break;
														case "quote":
															saveData['quote_key_primary'] = valueArr[0];
															saveData['option_key'] = this.steplinkCol.models[0].get('option_key_primary');
															saveData['step_key'] = this.steplinkCol.models[0].get('step_key_primary');
															saveData['step_option'] = this.steplinkCol.models[0].get('id');
															itemSaveModel = new productselectedoptionsModel(saveData);
															break;
													}

										itemSaveModel.fetch({ data: saveData }).done(_.bind(function(check){
											if (check.total_items === 1) {

												if (check._embedded[this.key3][0].description === 'Calculation') {
													var parameter = check._embedded[this.key3][0].id;// + '\r' + theFile;
													$('#loading').show();
													$.post('/fm', { action: 'script', file: theFile, script: 'Update_Calculation', parameter: parameter });
													this.TS = check._embedded[this.key3][0].calcTS;

													this.calcCheckLoop(check._embedded[this.key3][0].id) ;
												}
												else {
													this.render(check._embedded[this.key3][0]);
												}

											} else {
												delete saveData.option_key;
												saveData['option_key'] = this.steplinkCol.models[0].get('option_key_primary');
												saveData['step_key'] = this.steplinkCol.models[0].get('step_key_primary');

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 3rd SWITCH/CASE statements you need to edit. The format is as follows:									 *
*																														 *
*		case "NAME OF TABLE IN URL"																						 *
*			saveData['simulator_key'] = valueArr[0];																	 *
*			itemSaveModel = new NEW ENTITY MODEL(saveData);																 *
*			break;																										 *
*																														 *
* But if you are unsure then duplicate an existing one making the relevant chages										 *
-------------------------------------------------------------------------------------------------------------------------*/

												switch (this.table) {
													case "simulator":
														saveData['simulator_key'] = valueArr[0];
														itemSaveModel = new simitemsModel(saveData);
														break;
													case "order":
														saveData['order_key_primary'] = valueArr[0];
														itemSaveModel = new productselectedoptionsModel(saveData);
														break;
													case "quote":
														saveData['option_key'] = Number(saveData['option_key']);
														itemSaveModel = new productselectedoptionsModel(saveData);
														break;
												}

												itemSaveModel.save().done(_.bind(function(saveResponse){
													if (this.steplinkCol.models[0].get('description_for_tree') === 'Calculation') {
														this.TS = itemSaveModel.get('calcTS');

														var parameter = saveResponse.id;
														if (this.table === 'quote' || this.table === 'order')
														{parameter += '\r' + theFile;}
														$('#loading').show();
														$.post('/fm', { action: 'script', file: theFile, script: 'Update_Calculation', parameter: parameter });

														this.calcCheckLoop(saveResponse.id);
													}
													else {
														this.render(saveResponse);
													}
												}, this));
											}

										},this));

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

		/* removes all input fields below the one selected on the screen */
		killMe: function ()
		{
			if (this.child)
			{
				this.child.killMe();
			}
			this.remove();
			this.updQuoteLineItems({ value:0 });
		},

		/* this is ONLY needed for quotes */
		updQuoteLineItems: function(data)
		{
			if (this.table == 'quote') {
				var updQLIModel = new QuoteLineItemsModel({
					id: this.record,
					close_picker: data.value});
				updQLIModel.save();
			}
		},

		/* processes user and calculation input fields */
		keyOption: function (e)
		{
			e.stopPropagation();

			var seq = $(e.target).attr("data-keySequence");
			$('#'+seq).focus();

			if (this.child)
			{
				this.child.killMe();
			}
			if (e.keyCode == 13 || e.keyCode == 9)
			{
				var productKey = $(e.target).attr("data-keyProduct");
				var parentKey = $(e.target).attr("data-keyParent");
				//var seq = $(e.target).attr("data-keySequence");
				var option = $(e.target).attr("data-keyOption");
				var stepLink = $(e.target).attr("data-steplink");
				var key = $(e.target).attr("data-simkey");
				var description = $(e.target).attr("data-description");
				var maximum = $(e.target).attr("data-maximum");
				var minimum = $(e.target).attr('data-minimum');
				var value = $(e.target).val();
				var step_key_primary = $(e.target).attr("data-skp");
				if (Number(value) === 'Nan' || value.length === 0) {
					alert('Input must be a number');
					return false;
				}
				else if (maximum !== 'undefined' && (Number(value) < minimum || Number(value) > maximum)) {
					alert('Value must be between ' + minimum + ' and ' + maximum);
					return false;
				}

				valueArr[seq] = value;

				var saveData = {
					option_key: option,
					simulator_key: this.record,
					step_key: seq,
					step_option: stepLink,
					description: description,
					value: value,
					step_key_primary: step_key_primary
				};

				if (key) {saveData['id'] = key;}

				var saved = this.saveOption(saveData);
				this.updQuoteLineItems({ value: 0 });

				this.child = new optionSelect(
				{
					productKey: productKey,
					parentKey: stepLink,
					seq: seq,
					table: this.table,
					record: this.record
				});

				$('#'+seq).blur();

				this.$el.append(this.child.$el);
			}
		},

		/* saves the value for each field - this is called everytime the user presses the ENTER or TAB key */
		saveOption: function(data)
		{
			var table = this.table;
			var itemSaveModel;

			this.simItemColModelObj = {
				//step_key: parseInt(data.step_key),
				step_key: parseInt(data.step_key_primary),
				option_key: parseInt(data.option_key),
				value: data.value,
				step_option: parseInt(data.step_option),
				description: data.description,
				id: parseInt(data.id)
			};


			if (data.id) {this.simItemColModelObj['id'] = parseInt(data.id);}

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 4th SWITCH/CASE statements you need to edit. The format is as follows:									 *
*																														 *
*		case "NAME OF TABLE IN URL"																						 *
*			this.simItemColModelObj['NEW ENTITY PRIMARY KEY'] = Number(valueArr[0]);									 *
*			itemSaveModel = new NEW ENTITY MODEL(this.simItemColModelObj);												 *
*			break;																										 *
*																														 *
* But if you are unsure then duplicate an existing one making the relevant changes										 *
-------------------------------------------------------------------------------------------------------------------------*/

				switch (table) {
					case "simulator":
						this.simItemColModelObj['simulator_key'] = valueArr[0];
						itemSaveModel = new simitemsModel(this.simItemColModelObj);
						break;
					case "order":
						this.simItemColModelObj['order_key_primary'] = valueArr[0];
						itemSaveModel = new productselectedoptionsModel(this.simItemColModelObj);
						break;
					case "quote":
						this.simItemColModelObj['quote_key_primary'] = valueArr[0];
						itemSaveModel = new productselectedoptionsModel(this.simItemColModelObj);
						break;
				}
				itemSaveModel.save();

		},

		/* post button press routine - no longer needed but kept in case we return to having a save button */
		buttonOption: function (e)
		{
			e.stopPropagation();
			$.get("/fm?action=script&file="+theFile+"&script="+theScript);
			$(e.target).replaceWith('<span style="display:block;margin-left:150px">Data saved successfully.</span>');
		},

		/* processes dropdown fields */
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
			var skp = $(e.target).find(":selected").attr("data-skp");
			var key = $(e.target).find(":selected").attr("data-simkey");
			var description = $(e.target).find(":selected").attr("data-description");
			var option = $(e.target).find(":selected").attr("data-option");

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
				simulator_key: key,
				step_key: seq,
				step_option: parentKey,
				value: option,
				step_key_primary: skp,
				description: description
			};

			if (key) {saveData['id'] = key;}

			var saved = this.saveOption(saveData);
			this.updQuoteLineItems({ value: 0 });


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

		/* main render routine */
		render: function (data)
		{
			var num = 0;
			var defaultVal;
			var simID = data.id;

			if (this.steplinkCol.models[0].attributes.hasOwnProperty('default')) {defaultVal = this.steplinkCol.models[0].attributes.default;}
			var stepData = {
				steps: this.steplinkCol.models,
				seq: this.stepCol.models[0].attributes.sequence,
				productKey: this.productKey,
				parentKey: this.parentKey,
				step: this.stepCol.models[0].related('products_steps:step').get('description'),
				num: num,
				defaultVal: defaultVal,
				simKey: simID
			};

			//if (typeof defaultVal === 'undefined') {stepData['defaultVal'] = this.simItemCol.models[0].get('value');}
			if (typeof data.value !== 'undefined') {
				if (data.hasOwnProperty('value')) {stepData['defaultVal'] = data.value;}
			}

			if (this.steplinkCol.models[0].get('description_for_tree') === 'Calculation') {
				stepData['num'] = data.evaluate;
			}

			var compiledTemplate = _.template(optionsTemplate);
			this.$el.html(compiledTemplate(stepData));
			this.$el.find("input").focus();
			this.$el.find("select").focus();
			if ((stepData['steps'][0].get('description_for_tree') !== 'Value' && stepData['steps'].length === 1) || this.steplinkCol.models[0].get('value') || typeof stepData['defaultVal'] !== 'undefined') {
				var e = $.Event('keydown', { keyCode: 13 });
				$(this.$el.find("select")).trigger(e);
				$(this.$el.find("input")).trigger(e);
			}

		},

/*------------------------------------------------------------------------------------------------------------------------
* Below is the 5th SWITCH/CASE statements you need to edit. The format is as follows:									 *
*																														 *
*		case "NAME OF TABLE IN URL"																						 *
*			itemGetodel = new NEW ENTITY MODEL(this.simItemColModelObj);												 *
*			break;																										 *
*																														 *
* But if you are unsure then duplicate an existing one making the relevant changes										 *
*																														 *
* calcCheckLoop checks for the completion of the calculation FM script													 *
-------------------------------------------------------------------------------------------------------------------------*/
		calcCheckLoop: function (data)
		{
			var itemGetModel;

			switch (this.table) {
				case "simulator":
					itemGetModel = new simitemsModel({ id: data });
					break;
				case "order":
					itemGetModel = new productselectedoptionsModel({ id: data });
					break;
				case "quote":
					itemGetModel = new productselectedoptionsModel({ id: data });
					break;
			}

			itemGetModel.fetch().done(_.bind(function(getResponse){
				if (typeof getResponse.calcTS === 'string' && this.TS != getResponse.calcTS) {
					this.render(getResponse);
					$('#loading').hide();
					return;
				} else {
					setTimeout(_.bind(function () {
						this.calcCheckLoop(data);
					}, this), 50);
				}
			}, this));
		},

		/* displays template if record exists - no longer needed as OEC can now edit exisitng records */
		existRender: function (data)
		{
			var compiledbuttonTemplate = _.template(existTemplate);
			this.$el.append(compiledbuttonTemplate(data));
		},

		/* displays when all fields have been completed */
		completeRender: function ()
		{
			var data = {
				text: "Product configured successfully"
			};
			this.updQuoteLineItems({ value: 1 });
			var compiledbuttonTemplate = _.template(completeTemplate);
			this.$el.append(compiledbuttonTemplate(data));
		},

		/* button displayed at end of all fields - no longer needed but kept in case we return to having a save button */
		button: function (val)
		{
			var data = {
				buttonText: "Save and Update Colors",
				table: val.table
			};
			var compiledbuttonTemplate = _.template(buttonTemplate);
			this.$el.html(compiledbuttonTemplate(data));
			this.$el.find("button").focus();
		},

		/* displays template if there are no steps for the product */
		noSteps: function ()
		{
			var compiledTemplate = _.template(nostepsTemplate);
			this.$el.html(compiledTemplate());
		},

		/* displays template if there are no more steps for the product */
		noMoreSteps: function ()
		{
			var compiledTemplate = _.template(noMoreStepsTemplate);
			this.$el.html(compiledTemplate());
		}

	});
	return optionSelect;
});