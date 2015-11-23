/**
 * @author artfable
 * 31.10.15
 */
define('menuItemCollection', function() {
    'use strict';
    return new (Backbone.Collection.extend({
        url: 'serverMock/menuItems.json'
    }))();
});