define(['require', 'app/models/Base','app/models/Customer', 'app/models/Finished_Goods', 'app/models/Order_Type', 'app/models/Press', 'app/models/Printers', 'app/models/Product_Steps'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: '/api/BusinessMan/products',

        relations: function () {
            return [
                {
                    key: 'products:customers',
                    relatedModel: require('app/models/Customer'),
                    collection : true
                },
                {
                    key: 'products:finished_goods',
                    relatedModel: require('app/models/Finished_Goods'),
                    collection : true
                },
                {
                    key: 'products:order_type',
                    relatedModel: require('app/models/Order_Type'),
                    collection : true
                },
                {
                    key: 'products:press',
                    relatedModel: require('app/models/Press'),
                    collection : true
                },
                {
                    key: 'products:printers',
                    relatedModel: require('app/models/Printers'),
                    collection : true
                },
                {
                    key: 'products:products_steps',
                    relatedModel: require('app/models/Product_Steps'),
                    collection : true
                }
           ];
        }
    });
});