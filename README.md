# backbone-improvement
Some utils to make easy work with [Backbone](http://backbonejs.org/) <br/>
(Version 2.1.0)

### Dependencies
jQuery (http://jquery.com/) <br/>
Underscore (http://underscorejs.org/) <br/>
Backbone (http://backbonejs.org/)

## Logger
Simple wrapper for console, can be used without backbone, underscore or jQuery. Can be used safely in IE.
Set common logger to `window.logger`. For create named logger use `new Logger(name)`.

#### constructor `new Logger([name] [, level])` *default: name = 'common', level = 'info'*
Create named logger.

#### applyLogLevel `applyLogLevel(level [, name])`
Set a level for logs (levels are the same as in `window.console`).

**Example:**

	window.logger.applyLogLevel('debug');

## Backbone extensions
Some additions to backbone for simplifies application.
If you use **Logger** - logger name will be 'backboneExtension'.

### Settings

#### \_commonTitleConfig `Object` *default: {on: false, front: false, separator: '|', text: ''}*
Configuration for common part of the title, for all views. Set to `Backbone._commonTitleConfig`


### View
Additional methods to the `Backbone.View` and some changes on it. `View` is a some part of a page. 

#### templateUrl `string`
Address of template with what view will be associated.

#### template `template()`
[Underscore](http://underscorejs.org/) template from file that was define in `templateUrl`.

#### events `Array`
**Deprecated**, use origin [Backbone events](http://backbonejs.org/#View-events). <br/>
Structure of events:

+ *selector* - string or function. Selector of a DOM element. If function - must return string, `this` will be the View.
+ *event* - string. JQuery event
+ *call* - string. Name of callback function, this function must be declared in the view. The entrees param is `event`.
+ *params* - Object, optional. Parameters that will be given to callback function as `event.data`

#### eventsApply `eventsApply()`
**Deprecated**, use origin [Backbone events](http://backbonejs.org/#View-events). <br/>
Apply events to DOM elements. Should be called in `resolve`, after view will be rendered.

#### title `string`
Set it if you need to change title for page associated with this view. No action if it's not set.
To reset for only common part - set ''.

#### setTitle `setTitle(title)`
Set page title and add common part to it, if it's turned on (see `_commonTitleConfig`). 

#### afterInitialize `afterInitialize()`
Should be used instead of `initialize`.

#### resolve `resolve([...arguments])`
Should be used instead of `render`. `Arguments` - some parameters that was sent from `router`.


### Page
Include all `View`s from page, and a `Layout` to locate them. `Backbone.Page`.

#### title `string`
Set it if you need to change title for page associated with this view. If it's not set, apply only common part to title (see `\_commonTitleConfig`).

#### views `Array`
List of metadata of `View`s that `Page` content. Each metadata consist of:

+ *region* - `string`. Selector of block where `View` must be rendered.
+ *view* - `Backbone.View`

#### layout `Backbone.Layout`
Layout for `Page`.

#### layoutOptions `Backbone.Model` or `Object`
Some options to render layout, can be used in layout template.

#### setTitle `setTitle(title)`
Set page title and add common part to it, if it's turned on (see `_commonTitleConfig`). 

#### afterInitialize `afterInitialize()`
Some actions, that will be done, after the page will be initialized.


### Layout
Layout for `View`s on `Page`.

#### templateUrl `string`
Address of template with what layout will be associated.

#### template `template()`
[Underscore](http://underscorejs.org/) template from file that was define in `templateUrl`.

#### el and $el
See in [Backbone](http://backbonejs.org/). `Backbone.View.el` and `Backbone.View.$el`.

#### initialize `initialize()`
Some actions, that will be done, after the layout will be initialized.

#### afterRender `afterRender()`
Some actions, that will be done, after the layout will be rendered.

#### setRegion `setRegion(region, view)`
Set `View` to chosen region.

+ *region* - `string`. Selector of block where `View` must be rendered.
+ *view* - `Backbone.View`


### RouterBuilder
The builder for construct `Backbone.Router`. Log navigation to debug level. Save information about navigation. `Backbone.routerBuilder`

#### addStateHolder `addStateHolder(stateHolder)`
*stateHolder* - `Backbone.Model`. Model that will be kept information about navigation. In property `page` will be name of function that was called.

#### addRoute `addRoute(path, actionName, action)`
Add route.

+ *path* - string. Route.
+ *actionName* - name of the route.
+ *action* - function or `View` or `Page` that will be called on the *path*.

#### addBeginRoute `addBeginRoute(actionName, view)`
Add route that will be at the start page. Same as `addRoute`, but `path` is already set with all possible paths.

+ *actionName* - name of the route.
+ *action* - function or `View` or `Page` that must be rendered on start page.

#### addAdditionalOptions `addAdditionalOptions(options)`
Some extra options for add to `Backbone.Router`.

#### build `build()`
Should be called at the end. Create and return `Backbone.Router`.

### Router
Result of `RouterBuilder`.

#### execute `execute(callback, args, name)` *set by default*
Now, by default set `name` (name of the route) into `stateHolder`, into property `page`. 
Also log `name` in console with `debug` level.

#### routeByView `routeByView(route, name, view)`
Add route.

+ *route* - string. Route.
+ *name* - name of the route.
+ *view* - `View` or `Page` that will be called on the *route*.

#### routeStartView `routeStartView(name, view)`
Add route that will be at the start page. Same as `routeByView`, but `route` is already set with all possible paths.

+ *name* - name of the route.
+ *view* - `View` or `Page` that must be rendered on start page.

**Note!** If you set it after call `Backbone.history.start`, then it won't open page first time. Or you need to restart.