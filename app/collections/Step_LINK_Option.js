define(['app/collections/Base', 'app/models/Step_LINK_Option'], function (Base, Step_LINK_Option) {
    'use strict';

    return Base.extend({
        url: 'http://localhost:63471/api/BusinessMan/steps_options',
        rel: 'api:steps_options',
        model: Step_LINK_Option
    });
});