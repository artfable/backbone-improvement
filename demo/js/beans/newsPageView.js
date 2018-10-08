/**
 * @author artfable
 * 01.11.15
 */
import menuComponent from './menuComponent.js';
import { router } from "../app.js";
import TemplatePage from './templateView.js';

let newsPageView = new (Backbone.View.extend({
    templateUrl: 'views/news.html',
    title: 'News',

    model: new (Backbone.Collection.extend({
        url: 'serverMock/news.json'
    }))(),

    resolve: function() {
        this.model.fetch({
            success: (collection) => {
                this.$el.html(this.template({news: collection.toJSON()}));
            }
        });
    }
}))();

let newsPage = new TemplatePage({
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

    afterInitialize: function() {
        router.routeByView('!/news', 'news', this);
    }
});