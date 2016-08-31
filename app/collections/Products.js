define(['app/collections/Base', 'app/models/Products'], function (Base, Products) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/products',
        rel: 'api:products',
        model: Products
    });
});