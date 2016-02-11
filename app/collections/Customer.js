define(['app/collections/Base', 'app/models/Customer'], function (Base, Customer) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/customers',
        rel: 'api:customers',
        model: Customer
    });
});