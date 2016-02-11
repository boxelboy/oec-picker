define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/options',

        relations: function () {
            return [
                {
                    key: 'options:custompricing',
                    relatedModel: require('app/models/CustomPricing'),
                    collection: false
                }
            ];
        }
    });
});