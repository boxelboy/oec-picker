define(['app/collections/Base', 'app/models/CustomPricing'], function (Base, CustomPricing) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/custompricing',
        rel: 'api:customers',
        model: CustomPricing
    });
});