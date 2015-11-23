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

    define('appState', appState);

    define('router', Backbone.routerBuilder.addStateHolder(appState).build());

    appState.fetch({
        success: function() {
            var loggersLevels = appState.get('logger');
            _.each(_.keys(loggersLevels), function(loggerName) {
                logger.applyLogLevel(loggersLevels[loggerName], loggerName);
            });
            logger.debug('[appState] The configurations were loaded.');

            Backbone.View.prototype._commonTitleConfig = _.defaults(appState.get('commonTitleConfig'), Backbone.View.prototype._commonTitleConfig);
            logger.log('[appState] Set common title ' + JSON.stringify(Backbone.View.prototype._commonTitleConfig));

            Backbone.history.start();

            logger.debug('[appState] The application was started.');
        }
    })
});