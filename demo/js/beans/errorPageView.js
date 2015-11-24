/**
 * @author artfable
 * 31.10.15
 */
define('errorPageView', function() {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/errorPage.html',

        resolve: function() {
            this.$el.html(this.template());
        }
    }))();
});

$(function() {
    require(['TemplatePage', 'errorPageView', 'menuComponent'],
        function(TemplatePage, errorPageView, menuComponent) {
            'use strict';
            return new TemplatePage({
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
                }
            });
        })
});