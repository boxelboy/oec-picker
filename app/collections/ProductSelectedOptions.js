define(['app/collections/Base', 'app/models/ProductSelectedOptions'], function (Base, ProductSelectedOptions) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/product_selected_options',
        rel: 'api:product_selected_options',
        model: ProductSelectedOptions
    });
});