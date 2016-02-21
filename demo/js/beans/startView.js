/**
 * @author artfable
 * 31.10.15
 */
$(function() {
    require(['router'], function(router) {
        'use strict';

        return new (Backbone.View.extend({
            templateUrl: 'views/start.html',
            title: '',
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
                router.routeStartView('start', this);
            },

            resolve: function() {
                this.$el.html(this.template());

                var $startBtn = $('#start_btn').off();
                var moveLeft = function() {
                    $startBtn.animate({'margin-left': '-=500'}, 4000, function() {
                        moveRight();
                    });
                };
                var moveRight = function() {
                    $startBtn.animate({'margin-left': '+=500'}, 4000, function() {
                        moveLeft();
                    });
                };
                moveRight();

                this.eventsApply();
            }
        }))();
    })
});
