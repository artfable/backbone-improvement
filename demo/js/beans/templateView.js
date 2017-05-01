/**
 * @author artfable
 * 31.10.15
 */
define('templateLayout', ['tpl!views/template.html'], function (template) {
    'use strict';

    return new (Backbone.Layout.extend({
        template: template,
        el: 'body'
    }))();
});

define('TemplatePage', ['templateLayout', 'menuComponent', 'appState'],
    function(templateLayout, menuComponent, appState) {
        'use strict';
        return Backbone.Page.extend({
            layout: templateLayout,
            layoutOptions: appState // yes, now we allowed to keep here a changeable data, but think twice, before do it!
        });
    });