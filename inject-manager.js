/**
 * LICENSE https://raw.githubusercontent.com/artfable/backbone-improvement/master/LICENSE
 * @author a.veselov
 * 02/10/2015
 */
(function() {
	'use strict';

    /*
     * If no specify logger is register, use usual console.
     * Attention! In IE console may be undefined, so it can be an exception!
     */
    if (window.logger === undefined) {
        window.logger = console;
    }

    /**
     * InjectManager - allow to write Backbone components ("beans") in independent file or code block, and initialize it only when it's needed.
     * It's good idea to delete manager after application is started (by <pre>delete window.application.injectionManager;</pre>).
     *
     * @type {{injectionManager: {push, applyFunction}}}
     */
	window.application = {
		injectionManager: (function() {
			var actions = {};
			var beans = {};

			var getBean = function(name) {
				logger.debug('[application.modulesInitFunctions] Ask for "' + name + '"');
				if (beans[name]) {
					return beans[name];
				}

				if (actions[name]) {
					return beans[name] = actions[name]();
				}

				logger.error('[application.injectionManager] There\'s no component for name "' + name + '".');
			};

			return {
                /**
                 * Register beans in injectManager.
                 * Example of use: <br/>
                 * window.application.injectionManager.push('someView', ['appState', 'someEvent'], function(appState, someEvent) {
                 *  return new (Backbone.View.extend({...}))();
                 * })
                 *
                 * @param {string} name - name of bean
                 * @param {=} beansNames - names of beans that must be inject in current bean (can be skipped if no beans must be injected)
                 * @param {function|Object} actionOrBean - function that create and return bean or bean; enter params is beans that were declared in <b>beansNames</b>
                 */
				push: function(name, beansNames, actionOrBean) {
					if (beans[name]) {
						logger.warn('[application.injectionManager] Rewrite component "' + name + '".');
					}
					if (arguments.length < 3) {
						// I don't like this, for justification: jQuery do the same)
						actionOrBean = beansNames;
					}
					if (_.isFunction(actionOrBean)) {
						actions[name] = function() {
							logger.log('[application.modulesInitFunctions] Register component "' + name + '".');
							var beansToInject = [];
							_.each(beansNames, function(injectName) {
								var bean = getBean(injectName);
								if (bean) {
									beansToInject.push(bean);
								} else {
									logger.error('[application.injectionManager] Error while creating bean "' + name
										+ '", no bean "' + injectName + '".');
								}
							});
							return actionOrBean.apply(null, beansToInject);
						};
					} else {
						beans[name] = actionOrBean;
					}
				},

                /**
                 * Allowed to make some activities that must use beans. Can be used for start application.
                 * Example of use: <br/>
                 * window.application.injectionManager.applyFunction(['router'], function(router) {...})
                 *
                 * @param {Array} beansNames
                 * @param {function} action
                 * @returns {*}
                 */
				applyFunction: function(beansNames, action) {
					var beansToInject = [];
					_.each(beansNames, function(injectName) {
						var bean = getBean(injectName);
						if (bean) {
							beansToInject.push(bean);
						} else {
							logger.error('[application.injectionManager] Error while execution, no component "' + injectName + '".');
						}
					});
					return action.apply(null, beansToInject);
				}
			}
		})()
	};
})();