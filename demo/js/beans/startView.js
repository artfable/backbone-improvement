/**
 * @author artfable
 * 31.10.15
 */
window.application.injectionManager.pushStandalone('startView', ['router'], function(router) {
    'use strict';

    return new (Backbone.View.extend({
        templateUrl: 'views/start.html',
        el: 'body',

        events: [
            {
                selector: '#start_btn',
                event: 'click',
                call: 'start'
            }
        ],

        start: function() {
            router.navigate('!/main', {trigger: true});
        },

        afterInitialize: function() {
            var that = this;
            _.each(['', '!/', '/'], function(route) {
                router.routeByView(route, 'start', that);
            });
        },

        resolve: function() {
            this.$el.html(this.template());

            var $startBtn = $('#start_btn').off();
            var moveLeft = function() {
                $startBtn.animate({'margin-left': '-=500'}, 4000, function () {
                    moveRight();
                });
            };
            var moveRight = function() {
                $startBtn.animate({'margin-left': '+=500'}, 4000, function () {
                    moveLeft();
                });
            };
            moveRight();

            this.eventsApply();
        }
    }))();
});
