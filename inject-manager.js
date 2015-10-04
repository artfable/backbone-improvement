/**
 * LICENSE https://raw.githubusercontent.com/artfable/backbone-improvement/master/LICENSE
 * @author a.veselov
 * 02/10/2015
 */
(function() {
	'use strict';

    if (window.logger === undefined) {
        window.logger = console;
    }

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