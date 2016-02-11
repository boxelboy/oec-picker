define(function (require) {

    var Backbone = require('backbone');
    return Backbone.View.extend({
        el: 'body',
        template: require('text!templates/main.html'),

        initialize: function () {
            this.render();
        },

        setRouter: function (router) {
            this.router = router;
        },

        setView: function (view, url) {
            this.$('.container').empty().append(view.$el);
            if (url && this.router) {
                this.router.navigate(url);
            }
        },
        
        setProducts: function (view) {
            this.$('.container').append(view);
        },
        
        setSteps: function (view) {
            this.$('.container').append(view.$el);
        },

        setWorkCentres: function (view) {
            this.$('.container').append(view);
        },

        setOptions: function (view) {
            this.$('.container').append(view.$el);
        },
        render: function () {
            this.$el.append(this.template);
            return this;
        }
    });
});
