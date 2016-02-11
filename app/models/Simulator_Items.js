define(['require', 'app/models/Base', 'app/models/Steps', 'app/models/Products', 'app/models/Options', 'app/models/Step_Link_Option'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/simulator_items',

        relations: function () {
            return [
                {
                    key: 'simulator_items:step',
                    relatedModel: require('app/models/Steps'),
                    collection: false
                },
                {
                    key: 'simulator_items:product',
                    relatedModel: require('app/models/Products'),
                    collection: false
                },
                {
                    key: 'simulator_items:option',
                    relatedModel: require('app/models/Options'),
                    collection: false
                },
                {
                    key: 'simulator_items:step_option',
                    relatedModel: require('app/models/Step_LINK_Option'),
                    collection: false
                }
            ];
        }
    });
});