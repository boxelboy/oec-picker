define(['app/collections/Base', 'app/models/Simulator_Items'], function (Base, Simulator_Items) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/simulator_items',
        rel: 'api:simulator_items',
        model: Simulator_Items
    });
});