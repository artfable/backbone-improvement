/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.push('menuComponent', ['appState', 'menuItemCollection'], function(appState, menuItemCollection) {
    'use strict';
    return new (Backbone.View.extend({
        templateUrl: 'views/components/menu.html',

        afterInitialize: function() {},

        resolve: function() {
            if (this.loaded) {
                this.$el.html(this.template({menu: menuItemCollection.toJSON(), page: appState.get('page')}));
            } else {
                var that = this;
                menuItemCollection.fetch({
                    success: function (collection) {
                        that.$el.html(that.template({menu: collection.toJSON(), page: appState.get('page')}));
                        that.loaded = true;
                    }
                });
            }
        }
    }))();
});