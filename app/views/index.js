define([
  'jquery',
  'underscore',
  'backbone',
  'app/collections/SchedDetails',
  'app/models/SchedDetails',
  'text!templates/homeTemplate.html',
  'app/models/Schedule',
  'app/collections/Schedule'
], function($, _, Backbone, scheddetailsCollection, scheddetailsModel, homeTemplate, schedModel, schedCollection){

  return Backbone.View.extend({

    initialize:function()
    {
      var me = '>2015-09-01+<2015-09-30';
      this.stuff = new scheddetailsCollection();
      this.stuff.fetch({
            data: { fields: '*,SCHEDULE.*,SCHEDULE.SCHEDULER_EVENTS.*',
                    Start_Date: me,
                    sort:'Start_Date,Start_Time'
                  },
            success: _.bind(function () {
                 this.render();
            }, this) });
    },

    events: {
      'click' : ''
    },

    render: function(){
      var data = {
        items: this.stuff.models,
      };
      var compiledTemplate = _.template(homeTemplate);
      this.$el.html(compiledTemplate(data));
      }
 

    });

});