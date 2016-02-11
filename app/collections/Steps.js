define(['app/collections/Base', 'app/models/Steps'], function (Base, Steps) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/steps',
        rel: 'api:steps',
        model: Steps
    });
});