define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/finished_goods',

        relations: function () {
            return [];
        }
    });
});