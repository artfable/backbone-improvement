/**
 * @author artfable
 * 31.10.15
 */
import { appState } from '../app.js';

let templateLayout = new (Backbone.Layout.extend({
    templateUrl: 'views/template.html',
    el: 'body'
}))();

let TemplatePage = Backbone.Page.extend({
    layout: templateLayout,
    layoutOptions: appState // yes, now we allowed to keep here a changeable data, but think twice, before do it!
});

export { templateLayout };
export default TemplatePage;