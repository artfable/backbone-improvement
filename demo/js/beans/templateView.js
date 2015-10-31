/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.push('templateView', ['appState', 'menuComponent'], function (appState, menuComponent) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/template.html',
        el: 'body',

        components: [menuComponent],

        afterInitialize: function () {
        },

        resolve: function () {
            this.$el.html(this.template(appState.toJSON()));

            this.componentsRender(appState.toJSON());
            this.eventsApply();
        }
    }))();
});