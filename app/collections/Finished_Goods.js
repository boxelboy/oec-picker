define(['app/collections/Base', 'app/models/Finished_Goods'], function (Base, Finished_Goods) {
    'use strict';

    return Base.extend({
        url: '/api/BusinessMan/finished_goods',
        rel: 'api:finished_goods',
        model: Finished_Goods
    });
});