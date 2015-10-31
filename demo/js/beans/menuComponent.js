/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.push('menuComponent', ['appState', 'menuItemCollection'], function(appState, menuItemCollection) {
    'use strict';
    return new (Backbone.Component.extend({
        name: 'menu',
        template: 'views/components/menu.html',

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