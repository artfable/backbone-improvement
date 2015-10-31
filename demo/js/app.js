/**
 * @author artfable
 * 31.10.15
 */
$(function() {
    'use strict';

    var appState = new (Backbone.Model.extend({
        url: 'js/conf/conf.json',
        defaults: {
            page: 'none'
        }
    }))();

    window.application.injectionManager.push('appState', appState);

    appState.fetch({
        success: function() {
            logger.applyLogLevel(appState.get('logLevel'));
            logger.debug('[appState] The configurations were loaded.');

            window.application.injectionManager.push('router',
                Backbone.routerBuilder.addStateHolder(appState).build()
            );

            window.application.injectionManager.initStandalone();
            Backbone.history.start();

            delete window.application.injectionManager; // delete it to remove functions for create beans, that doesn't need now

            logger.debug('[appState] The application was started.');
        }
    })
});