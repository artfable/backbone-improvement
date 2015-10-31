/**
 * @author artfable
 * 01.11.15
 */
window.application.injectionManager.pushStandalone('newsPageView', ['router', 'templateView'], function(router, templateView) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/news.html',
        mainView: templateView,

        container: '#container',

        model: new (Backbone.Collection.extend({
            url: 'serverMock/news.json'
        }))(),

        afterInitialize: function() {
            var that = this;
            router.route('!/news', 'news', function() {
                that.render.apply(that, arguments);
            });
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