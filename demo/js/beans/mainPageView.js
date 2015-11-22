/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.push('mainPageView', function() {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/mainPage.html',
        title: 'Main',

        resolve: function() {
            this.$el.html(this.template());
        }
    }))();
});

window.application.injectionManager.pushStandalone('mainPage', ['TemplatePage', 'mainPageView', 'menuComponent', 'router'],
    function(TemplatePage, mainPageView, menuComponent, router) {
    'use strict';
    return new TemplatePage({
        views: [
            {
                region: '#menu',
                view: menuComponent
            },
            {
                region: '#container',
                view: mainPageView
            }
        ],

        afterInitialize: function() {
            router.routeByView('!/main', 'main', this);
        }
    });
});