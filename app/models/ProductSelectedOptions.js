define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/product_selected_options',

        relations: function () {
            return [
                {
                    key: 'product_selected_options:step',
                    relatedModel: require('app/models/Steps'),
                    collection: false
                },
                {
                    key: 'product_selected_options:product',
                    relatedModel: require('app/models/Products'),
                    collection: false
                },
                {
                    key: 'product_selected_options:option',
                    relatedModel: require('app/models/Options'),
                    collection: false
                },
                {
                    key: 'product_selected_options:step_option',
                    relatedModel: require('app/models/Step_LINK_Option'),
                    collection: false
                },
                {
                    key: 'product_selected_options:quote',
                    relatedModel: require('app/models/Quotes'),
                    collection: false
                }
            ];
        }
    });
});