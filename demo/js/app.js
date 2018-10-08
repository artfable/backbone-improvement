/**
 * @author artfable
 * 31.10.15
 */
import Logger from './libs/@artfable/js-logger/logger.js'

let logger = new Logger();
window.Logger = Logger;

let appState = new (Backbone.Model.extend({
        url: 'js/conf/conf.json',
        defaults: {
            page: 'none'
        }
    }))();

let router =  Backbone.routerBuilder.addStateHolder(appState).build();

$(() => {
    appState.fetch({
        success: function() {
            let loggersLevels = appState.get('logger');
            _.each(_.keys(loggersLevels), function(loggerName) {
                logger.applyLogLevel(loggersLevels[loggerName], loggerName);
            });
            logger.debug('[appState] The configurations were loaded.');

            Backbone.bextSettings.setCommonTitleConfig(appState.get('commonTitleConfig'));
            logger.log('[appState] Set preferences: ' + Backbone.bextSettings.toString());

            Backbone.history.start();
            logger.debug('[appState] The application was started.');
        }
    });
});

export { appState, router }
