define(['app/collections/Base', 'app/models/Quotes'], function (Base, Quote) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/quotes',
        rel: 'api:quotes',
        model: Quote
    });
});