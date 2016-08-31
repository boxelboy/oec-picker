define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: '/api/BusinessMan/quote_line_items',

        relations: function () {
            return [];
        }
    });
});