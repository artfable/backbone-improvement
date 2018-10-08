/**
 * @author artfable
 * 31.10.15
 */
import menuComponent from './menuComponent.js';
import { router } from "../app.js";
import TemplatePage from './templateView.js'

let mainPageView = new (Backbone.View.extend({
    templateUrl: 'views/mainPage.html',

    resolve: function() {
        this.$el.html(this.template());
    }
}))();

let mainPage = new TemplatePage({
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

export { mainPageView };
export default mainPageView;