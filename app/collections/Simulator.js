define(['app/collections/Base', 'app/models/Simulator'], function (Base, Customer) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/simulator',
        rel: 'api:simulator',
        model: Customer
    });
});