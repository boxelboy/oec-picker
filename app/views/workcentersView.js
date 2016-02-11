define([
  'jquery',
  'underscore',
  'backbone',
  'app/collections/Work_Centers',
  'app/models/Work_Centers',
  'app/collections/Product_LINK_Work_Center',
  'app/models/Product_LINK_Work_Center',
  'text!templates/workcenterTemplate.html'
], function($, _, Backbone, workcenterCollection, workcentreModel, plwcModel, workcenterTemplate){

  return Backbone.View.extend({
        el: '#workcentres',

    initialize:function(data)
    {
      this.stuff = new plwcModel();
      this.stuff.fetch({
            data: { fields:'Work_Center_Key_Primary',
                    Product_Key_Primary: data.id
             },
            success: _.bind(function () {
              var ss = "?";
              _.each(this.stuff.models, function(thingy) {ss += "Key_Primary="+thingy.attributes.Work_Center_Key_Primary+"&";});
              this.stuff2 = new workcentreModel();
              this.stuff2.fetch({
                data: {fields: '*'
              },
              success: _.bind(function() {
                console.log(this.stuff2);
              }, this)
              });

                 this.render();
            }, this) });
    },

    events: {
      'click' : ''
    },

    render: function(){
      var data = {
        products: this.stuff.models[0].attributes,
      };
      //var compiledTemplate = _.template(workcentreTemplate);
      //this.$el.html(compiledTemplate(data));

      }

    });

});