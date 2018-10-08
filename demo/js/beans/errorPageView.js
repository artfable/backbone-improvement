/**
 * @author artfable
 * 31.10.15
 */
import menuComponent from './menuComponent.js';
import TemplatePage from './templateView.js'

let errorPageView = new (Backbone.View.extend({
    templateUrl: 'views/errorPage.html',

    resolve: function() {
        this.$el.html(this.template());
    }
}))();

let errorPage = new TemplatePage({
    views: [
        {
            region: '#menu',
            view: menuComponent
        },
        {
            region: '#container',
            view: errorPageView
        }
    ],

    afterInitialize: function() {
        let that = this;
        // it works if only errorPage added first, but we don't want matter about order
        //router.route('*notFound', 'error', function() {
        //    that.render.apply(that, arguments);
        //});
        let originLoadUrl = Backbone.history.loadUrl;
        Backbone.history.loadUrl = function(fragment) {
            let error = !_.bind(originLoadUrl, this)(fragment);
            if (error) {
                that.render();
            }
        }
    }
});

export { errorPageView };
export default errorPage;