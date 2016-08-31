define(['app/collections/Base', 'app/models/Simulator'], function (Base, Customer) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/simulator',
        rel: 'api:simulator',
        model: Customer
    });
});