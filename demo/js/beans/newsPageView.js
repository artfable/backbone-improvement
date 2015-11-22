/**
 * @author artfable
 * 01.11.15
 */
window.application.injectionManager.push('newsPageView', function() {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/news.html',
        title: 'News',

        model: new (Backbone.Collection.extend({
            url: 'serverMock/news.json'
        }))(),

        resolve: function() {
            var that = this;
            this.model.fetch({
                success: function(collection) {
                    that.$el.html(that.template({news: collection.toJSON()}));
                }
            });
        }
    }))();
});

window.application.injectionManager.pushStandalone('newsPage', ['TemplatePage', 'newsPageView', 'menuComponent', 'router'],
    function (TemplatePage, newsPageView, menuComponent, router) {
        'use strict';
        return new TemplatePage({
            views: [
                {
                    region: '#menu',
                    view: menuComponent
                },
                {
                    region: '#container',
                    view: newsPageView
                }
            ],

            afterInitialize: function () {
                router.routeByView('!/news', 'news', this);
            }
        });
    });