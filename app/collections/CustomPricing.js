define(['app/collections/Base', 'app/models/CustomPricing'], function (Base, CustomPricing) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/custompricing',
        rel: 'api:customers',
        model: CustomPricing
    });
});