define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/Product_LINK_Work_Center',

        relations: function () {
            return [];
        }
    });
});