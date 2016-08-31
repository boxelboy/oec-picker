define(['app/collections/Base', 'app/models/Customer'], function (Base, Customer) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/customers',
        rel: 'api:customers',
        model: Customer
    });
});