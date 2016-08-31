define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        self,
        today;

    return Backbone.Router.extend({
        initialize: function (options) {
            self = this;
            self.app = options.app;

        },

        routes: {
            ''                                  : 'default',
            'step/:id'                          : 'stepsAction',
            'option/:id/:rec/:tbl/:script'      : 'optAction',
            'flow'                              : 'flowAction'

        },

        default: function () {
            require(['../app/views/theView'], function (Content) {
                self.app.setView(new Content({ app: self.app }));
            });
        },

        stepsAction: function (id) {
            require(['../app/views/stepsView'], function (Content) {
                self.app.setSteps(new Content({ app: self.app, id: id, seq: 3 }));
            });
            /*require(['../app/views/workcentersView'], function (Content) {
                self.app.setView(new Content({ app: self.app, id: id }));
            });*/
        },

        flowAction: function ()
        {
            require(['../app/views/flow/index'], function (Content) {
                self.app.setView(new Content({ app: self.app }));
            });
        },

/*------------------------------------------------------------
*   the values of the variable passed in the url need to be:
*           id:         INTEGER
*           rec:        ALPHANUMERIC
*           tbl:        ALPHA
*           script:     ALPHA
--------------------------------------------------------------*/
        optAction: function (id, rec,tbl, script) {
            require(['../app/views/optionsView'], function (Content) {
                self.app.setOptions(new Content({ app: self.app, productKey: id, seq: 0, record: rec, table: tbl, script: script }));
            });
        }

    });
});