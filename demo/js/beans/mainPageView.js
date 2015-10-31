/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.pushStandalone('mainPageView', ['router', 'templateView'], function(router, templateView) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/mainPage.html',
        mainView: templateView,

        container: '#container',

        afterInitialize: function() {
            var that = this;
            router.route('!/main', 'main', function() {
                that.render.apply(that, arguments);
            });
        },

        resolve: function() {
            $(this.container).html(this.template());
        }
    }))();
});