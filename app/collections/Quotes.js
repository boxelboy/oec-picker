define(['app/collections/Base', 'app/models/Quotes'], function (Base, Quote) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/quotes',
        rel: 'api:quotes',
        model: Quote
    });
});