define(['require', 'app/models/Base'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: '/api/BusinessMan/Work_Centers',

        relations: function () {
            return [];
        }
    });
});