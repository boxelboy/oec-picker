var version = '1.4.1';
require.config({
    baseUrl: 'lib',
	paths: {
		'app': '../app',
		'jquery': 'jquery',
		"jquery.bootstrap": "bootstrap-min",
		'underscore': 'underscore',
		'backbone': 'backbone',
		'templates': '../templates',
		'text': 'text',
		'sync': 'sync',
		'bootstrap-select': 'dist/js/bootstrap-select'
	},
    shim: {
   		'backbone': {
    		deps: ['underscore', 'jquery'],
    		exports: 'Backbone'
	    },
	    'underscore': {
	        exports: '_'
	    },
    },
    urlArgs: version
});

require(['jquery', 'underscore', 'backbone', 'sync', '../app/router', '../app/AppView'], function ($, _, Backbone, Sync, Router, AppView) {
        
		var app = new AppView();
		app.setRouter(new Router({ app: app }));
		Backbone.history.start();
	}
);
