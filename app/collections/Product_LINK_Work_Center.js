define(['app/collections/Base', 'app/models/Product_LINK_Work_Center'], function (Base, Product_LINK_Work_Center) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/Product_LINK_Work_Center',
        rel: 'api:Product_LINK_Work_Center',
        model: Product_LINK_Work_Center
    });
});