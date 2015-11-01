/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.push('menuComponent', ['appState', 'menuItemCollection'], function(appState, menuItemCollection) {
    'use strict';
    return new (Backbone.Component.extend({
        name: 'menu',
        template: 'views/components/menu.html',

        afterInitialize: function() {
            var that = this;
            appState.on('change:page', function() {
                that.render(appState.toJSON());
            });
        },

        getData: function(callback, params) {
            var that = this;

            menuItemCollection.fetch({
                success: function(collection) {
                    that.data.menu = collection.toJSON();

                    if (callback) {
                        callback(params);
                    }
                }
            });
        }
    }))();
});