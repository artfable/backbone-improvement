/**
 * @author artfable
 * 01.11.15
 */
window.application.injectionManager.pushStandalone('newsPageView', ['router', 'templateView'], function(router, templateView) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/news.html',
        mainView: templateView,
        title: 'News',

        container: '#container',

        model: new (Backbone.Collection.extend({
            url: 'serverMock/news.json'
        }))(),

        afterInitialize: function() {
            router.routeByView('!/news', 'news', this);
        },

        resolve: function() {
            var that = this;
            this.model.fetch({
                success: function(collection) {
                    $(that.container).html(that.template({news: collection.toJSON()}));
                }
            });
        }
    }))();
});