/**
 * @author artfable
 * 31.10.15
 */
import { router } from '../app.js'

let startView = new (Backbone.View.extend({
    templateUrl: 'views/start.html',
    title: '',
    el: 'body',

    //events: [
    //    {
    //        selector: '#start_btn',
    //        event: 'click',
    //        call: 'start'
    //    }
    //],

    events: {
        'click #start_btn': 'start'
    },

    start: function() {
        router.navigate('!/main', {trigger: true});
    },

    afterInitialize: function() {
        router.routeStartView('start', this);
    },

    resolve: function() {
        let moveRight = function() {
            $startBtn.animate({'margin-left': '+=500'}, 4000, function() {
                moveLeft();
            });
        };
        this.$el.html(this.template());

        let $startBtn = $('#start_btn').off();
        let moveLeft = function() {
            $startBtn.animate({'margin-left': '-=500'}, 4000, function() {
                moveRight();
            });
        };
        moveRight();

        //this.eventsApply();
    }
}))();

export default startView