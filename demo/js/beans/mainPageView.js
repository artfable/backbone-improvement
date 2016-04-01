/**
 * @author artfable
 * 31.10.15
 */
define('mainPageView', function() {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/mainPage.html',

        resolve: function() {
            this.$el.html(this.template());
        }
    }))();
});

$(function() {
    require(['TemplatePage', 'mainPageView', 'menuComponent', 'router'],
        function(TemplatePage, mainPageView, menuComponent, router) {
            'use strict';
            return new TemplatePage({
                title: 'Main',
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
        })
});