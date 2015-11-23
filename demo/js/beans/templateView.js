/**
 * @author artfable
 * 31.10.15
 */
define('templateLayout', function () {
    'use strict';

    return new (Backbone.Layout.extend({
        templateUrl: 'views/template.html',
        el: 'body'
    }))();
});

define('TemplatePage', ['templateLayout', 'menuComponent', 'appState'],
    function(templateLayout, menuComponent, appState) {
        'use strict';
        return Backbone.Page.extend({
            layout: templateLayout,
            layoutOptions: appState.toJSON() // only configurations, we don't want any changeable information here
        });
    });