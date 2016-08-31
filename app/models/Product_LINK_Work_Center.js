define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: '/api/BusinessMan/Product_LINK_Work_Center',

        relations: function () {
            return [];
        }
    });
});