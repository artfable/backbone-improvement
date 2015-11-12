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
            var loggersLevels = appState.get('logger');
            _.each(_.keys(loggersLevels), function(loggerName) {
                logger.applyLogLevel(loggersLevels[loggerName], loggerName);
            });
            logger.debug('[appState] The configurations were loaded.');

            Backbone.View.prototype._commonTitleConfig = _.defaults(appState.get('commonTitleConfig'), Backbone.View.prototype._commonTitleConfig);
            logger.log('[appState] Set common title ' + JSON.stringify(Backbone.View.prototype._commonTitleConfig));

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