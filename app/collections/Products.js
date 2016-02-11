define(['app/collections/Base', 'app/models/Products'], function (Base, Products) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/products',
        rel: 'api:products',
        model: Products
    });
});