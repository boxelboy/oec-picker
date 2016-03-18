define(['app/collections/Base', 'app/models/Simulator_Items'], function (Base, Simulator_Items) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/simulator_items',
        rel: 'api:simulator_items',
        model: Simulator_Items
    });
});