define(['require', 'app/models/Base', 'app/models/Product_Steps', 'app/models/Step_LINK_Option'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: '/api/BusinessMan/steps',

        relations: function () {
            return [
                {
                    key: 'steps:products_steps',
                    relatedModel: require('app/models/Product_Steps')
                },
                {
                    key: 'steps:steps_options',
                    relatedModel: require('app/models/Step_LINK_Option')
                }
            ];
        }
    });
});