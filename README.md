# backbone-improvement
Some utils to make easy work with [backbone](http://backbonejs.org/)

### Dependencies
jQuery (http://jquery.com/)
Underscore (http://underscorejs.org/)
Backbone (http://backbonejs.org/)

## Logger
Simple wrapper for console, can be used without backbone, underscore or jQuery. Can be used safely in IE.

#### applyLogLevel `applyLogLevel(level)`
Set a level for logs (levels are the same as in `window.console`).

**Example:**

	window.logger.applyLogLevel('debug');
	
## InjectManager
Allow to write Backbone components ("beans") in independent file or code block, and initialize it only when it's needed. 
It's a good idea to delete manager after application was started (by `delete window.application.injectionManager;`).

#### push `push(name, [beansNames,] actionOrBean)`
Register beans in injectManager.

+ *name* - name of the bean.
+ *beansNames* - array of names of beans that must be inject in the current bean (This beans will be sent as arguments to *actionOrBeans*). **Available only when *actionOrBean* is a function**
+ *actionOrBean* - bean that must be registered in **injectManager** or a function to initialize it. If it's a function, then bean will be initialized only when it will be injected somewhere.
 
**Example of use:**

	window.application.injectionManager.push('someView', ['appState', 'someEvent'], 
		function(appState, someEvent) {
		return new (Backbone.View.extend({...}))();
	})
	
#### pushStandalone `pushStandalone(name, [beansNames,] actionOrBean)`
Same as a `push`, but this beans will be initialized, after `initStandalone` will be called. This beans shouldn't be injected anywhere.

#### initStandalone `initStandalone()`
Initialize beans that were registered with `pushStandalone`.
 
#### applyFunction `applyFunction(beansNames, action)`
Allowed to make some activities that must use beans. Can be used for configure application.

**Example of use:**

	window.application.injectionManager.applyFunction(['router'], function(router) {...});
	
#### auditNotInitializedBeans `auditNotInitializedBeans()`
Tool for check application. Log in console all beans that were registered, but weren't initialized.

## Backbone extensions
Some additions to backbone for simplifies application.

### View
Additional methods to `Backbone.View` and some changes on it.

#### templateUrl `string`
Address of template with what view will be associated.

#### template `template()`
[Underscore](http://underscorejs.org/) template from file that was define in `templateUrl`.

#### events `Array`
Structure of events:

+ *selector* - string. Selector of a DOM element.
+ *event* - string. JQuery event
+ *call* - string. Name of callback function, this function must be declared in the view. The entrees param is `event`.
+ *params* - Object, optional. Parameters that will be given to callback function as `event.data`

#### eventsApply `eventsApply()`
Apply events to DOM elements. Should be called in `resolve`, after view will be rendered.

#### components `Array`
Array of components that was associated with view.

#### componentsRender `componentsRender([data])`
Render `components` that was associated with view. Should be called in `resolve`, after view will be rendered. `Data` will be sent to an each component.

#### afterInitialize `afterInitialize()`
Should be used instead of `initialize`.

#### resolve `resolve([...arguments])`
Should be used instead of `render`. `Arguments` - some parameters that was sent from `router`.


### Component
Additional element. Type of `View` that can live only in context of view. Can be many exemplars of it on a screen at the same time.

#### templateUrl `string`
Address of template with what view will be associated.

#### template `template()`
[Underscore](http://underscorejs.org/) template from file that was define in `templateUrl`.

#### data `Object` *default: {}*
Data that will be given to `template`.

#### events `Array`
Structure of events:

+ *selector* - string. Selector of a DOM element.
+ *event* - string. JQuery event
+ *call* - string. Name of callback function, this function must be declared in the view. The entrees param is `event`.
+ *params* - Object, optional. Parameters that will be given to callback function as `event.data`

#### eventsApply `eventsApply()`
Apply events to DOM elements. Should be called in `resolve`, after view will be rendered.

#### afterInitialize `afterInitialize()`
Should be used instead of `initialize`.

#### getData `getData(callback, params)`
*default:*

	function(callback, params) {
		if(callback) {
			callback(params);
		}
	}
Method to load data for a component. Should call `callback` with params, after data will be loaded, if it is existing.

#### getId `getId()`
Can be called to get unique id of a component. 

#### afterRender `afterRender()`
Some actions that will be done after render a component.

#### beforeRender `beforeRender(callback)`
Some actions that will be done before render a component. Should call `callback` after data will be loaded, if it is existing.

#### extend `extend(options)`
Same interface as in `Backbone.View`.


### RouterBuilder
The builder for construct `Backbone.Router`. Log navigation to debug level. Save information about navigation.

#### addStateHolder `addStateHolder(stateHolder)`
*stateHolder* - `Backbone.Model`. Model that will be kept information about navigation. In property `page` will be name of function that was called.

#### addBeginRoute `addBeginRoute(actionName, view)`
Route that will be at the start page.

+ *actionName* - name of the route.
+ *view* - view that must be rendered on start page.

#### addRoute `addRoute(path, actionName, action)`
Add route.

+ *path* - string. Route.
+ *actionName* - name of the route.
+ *action* - function or `View` that will be called on the *path*.

#### addAdditionalOptions `addAdditionalOptions(options)`
Some extra options for add to `Backbone.Router`.

#### build `build()`
Should be called at the end. Create and return `Backbone.Router`.