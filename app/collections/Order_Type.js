define(['app/collections/Base', 'app/models/Order_Type'], function (Base, Order_Type) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/order_type',
        rel: 'api:order_type',
        model: Order_Type
    });
});