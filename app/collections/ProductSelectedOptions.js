define(['app/collections/Base', 'app/models/ProductSelectedOptions'], function (Base, ProductSelectedOptions) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/product_selected_options',
        rel: 'api:product_selected_options',
        model: ProductSelectedOptions
    });
});