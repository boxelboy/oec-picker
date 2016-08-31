define([
  'jquery',
  'underscore',
  'backbone',
  'app/collections/Product_Steps',
  'app/models/Product_Steps',
  'app/models/Steps',
  'app/models/Step_LINK_Option',
  'app/models/Options',
  'text!templates/stepTemplate.html'
], function($, _, Backbone, productstepsCollection, productstepsModel, stepsModel, steplinkModel, optionsModel, stepTemplate){

  return Backbone.View.extend({

    initialize: function (data)
    {
      $('#1').remove();
      $('#2').remove();
      $('#3').remove();
      $('#4').remove();
      $('#5').remove();

      this.stuff = new productstepsCollection();
      this.stuff.fetch(
      {
        data:
        {
          fields: '*,step.*',
          product_key_primary: data.id,
          //sequence: data.seq,
          sort: 'sequence'
        },
        success: _.bind(function ()
        {
          this.render();
        }, this)
      });
    },
    events:
    {
      "change .chosen-select": "selectOption"
    },
    selectOption: function (e)
    {
      var selected = $(e.target).find(":selected").attr("data-keyprimary");

    },
    render: function ()
    {
      var data = {
        steps: this.stuff.models,
      };

      var compiledTemplate = _.template(stepTemplate);
      this.$el.html(compiledTemplate(data));
    }

    });

});