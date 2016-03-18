define(['app/collections/Base', 'app/models/QuoteLineItems'], function (Base, QuoteLineItems) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/quote_line_items',
        rel: 'api:quote_line_items',
        model: QuoteLineItems
    });
});