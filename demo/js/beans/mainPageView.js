/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.pushStandalone('mainPageView', ['router', 'templateView'], function(router, templateView) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/mainPage.html',
        mainView: templateView,
        title: 'Main',

        container: '#container',

        afterInitialize: function() {
            router.routeByView('!/main', 'main', this);
        },

        resolve: function() {
            $(this.container).html(this.template());
        }
    }))();
});