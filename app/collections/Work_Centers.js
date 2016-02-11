define(['app/collections/Base', 'app/models/Work_Centers'], function (Base, WorkCenters) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/Work_Centers',
        rel: 'api:Work_Centers',
        model: WorkCenters
    });
});