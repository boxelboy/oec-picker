define(['require', 'app/models/Base', 'app/models/Steps', 'app/models/Products'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/product_steps',

        relations: function () {
            return [
                {
                    key: 'products_steps:step',
                    relatedModel: require('app/models/Steps')
                },
                {
                    key: 'products_steps:product',
                    relatedModel: require('app/models/Products')
                }
            ];
        }
    });
});