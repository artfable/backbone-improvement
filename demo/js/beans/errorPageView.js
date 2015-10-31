/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.pushStandalone('errorPageView', ['router', 'templateView'], function(router, templateView) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/errorPage.html',
        mainView: templateView,

        container: '#container',

        afterInitialize: function() {
            var that = this;
            // it works if only errorPage added first, but we don't want matter about order
            //router.route('*notFound', 'error', function() {
            //    that.render.apply(that, arguments);
            //});
            var originLoadUrl = Backbone.history.loadUrl;
            Backbone.history.loadUrl = function(fragment) {
                var error = !_.bind(originLoadUrl, this)(fragment);
                if (error) {
                    that.render();
                }
            }
        },

        resolve: function() {
            $(this.container).html(this.template());
        }
    }))();
});
