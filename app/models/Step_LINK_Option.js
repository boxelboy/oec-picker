define(['require', 'app/models/Base', 'app/models/Steps', 'app/models/Options'], function (require, Base) {
    'use strict';
    return Base.extend({
        urlRoot: 'http://localhost:63471/api/BusinessMan/Step_LINK_Option',

        relations: function () {
            return [
                {
                    key: 'steps_options:step',
                    relatedModel: require('app/models/Steps')
                },
                {
                    key: 'steps_options:parent_option',
                    relatedModel: require('app/models/Options')
                },
                {
                    key: 'steps_options:options',
                    relatedModel: require('app/models/Options')
                }
            ];
        }
    });
});