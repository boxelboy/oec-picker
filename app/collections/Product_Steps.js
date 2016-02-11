define(['app/collections/Base', 'app/models/Product_Steps'], function (Base, Product_Steps) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/products_steps',
        rel: 'api:products_steps',
        model: Product_Steps
    });
});