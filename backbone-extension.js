/**
 * LICENSE https://raw.githubusercontent.com/artfable/backbone-improvement/master/LICENSE
 * @author a.veselov
 * 23.03.2015.
 */

/**
 * Так как сам backbone инициализируется после document ready, то и нам нужно ждать, чтобы применить свою кастомизацию
 */
$(function() {

    // Если не объявлен свой логер, используем обычную консоль
    if (window.logger === undefined) {
        window.logger = console;
    }

    /**
     * backbone работает не так как хотелось бы, по этому кастомизируем.
     * Если добавляем шаблоны каскадно - стандартный механизм эвентов работать не будет
     *
     * Эвенты не должны распространяться на какие-либо элементы внутри дочерних {@link View} или {@link Component}
     */
    Backbone.View.prototype.eventsApply = function() {
        var that = this;
        // используем jquery, так как ie8 не знает forEach
        if (this.events) {
            $.each(this.events, function(key, element) {
                var params = {};
                if (element.params) {
                    params = element.params;
                }
                $(element.selector).on(element.event, params, that[element.call]);
                logger.log('[View] register ' + element.event + ' on ' + element.selector);
            });
        }
    };

    /**
     * Добавим к View отрисовку компонентов
     * @param data
     */
    Backbone.View.prototype.componentsRender = function(data) {
        _.each(this.components, function(component) {
            component.render(data);
        })
    };

    /**
     * Загрузка шаблона страницы
     * @param callback
     */
    Backbone.View.prototype.load = function(callback) {
        var that = this;
        $.get(this.templateUrl, function(html) {
            that.template = _.template(html);

            if (callback) {
                callback();
            }
        });
    };

    /**
     * Отрисовка страницы, обеспецивает загрузку шаблона, после чего вызывает {@link Backbone.View#resolve}
     */
    Backbone.View.prototype.render = function() {
		var mainView = this.mainView;
		var that = this;
		if (mainView && !mainView.template) {
			if (!mainView.template) {
				logger.debug('[Backbone.View] View "' + this.templateUrl + '" on "' + mainView.templateUrl + '".');
				mainView.load(function() {
					mainView.resolve();
					that.render.apply(that, arguments);
				});
				return;
			}
        }
        if (this.template) {
			if (mainView) {
				mainView.resolve();
			}
            logger.debug('[Backbone.View] Start resolve view "' + this.templateUrl + '".');
            this.resolve.apply(this, arguments);
        } else {
            var thatArguments = arguments;
            this.load(function() {
				logger.debug('[Backbone.View] "' + that.templateUrl + '" loaded.');
				if (mainView) {
					mainView.resolve();
				}
				that.render.apply(that, thatArguments);
			});
        }
    };

    /**
     * Инициализация {@link Backbone.View}
     * @returns {Backbone.View}
     */
    Backbone.View.prototype.initialize = function() {
        if (this.resolve) {
            this.resolve = _.bind(this.resolve, this);
        }
        if (this.afterInitialize) {
            this.afterInitialize = _.bind(this.afterInitialize, this);
            this.afterInitialize();
        }
        return this;
    };

//============= Component ================
    /**
     * По сути View, но предназначен для того чтобы быть частью во View, а не отдельной страницей
     * @constructor
     */
    Backbone.Component = function() {
        this.data = {};
    };

    /**
     * Переопределить если требуется выполнить какие либо действия сразу после создания компонента
     */
    Backbone.Component.prototype.afterInitialize = function() {
    };

    /**
     * Завершает создание компонента.
     */
    Backbone.Component.prototype.initialize = function() {
        _.bindAll(this, 'render', 'afterInitialize', 'beforeRender', 'afterRender');
        var that = this;
        this.getData(function() {
            that.data._componentId = that.getId();
            that.afterInitialize();
            that.loaded = true;
        });
    };

    /**
     * Если данные компонента не статичны, нужно получать их в данном методе
     * @param callback
     * @param params
     */
    Backbone.Component.prototype.getData = function(callback, params) {
        if (callback) {
            callback(params);
        }
    };

    /**
     * @returns {string} - уникальный id, необходим при использование нескольких однотипных компонентов на ui
     */
    Backbone.Component.prototype.getId = function() {
        if (!this.id) {
            this.id = _.uniqueId(this.name + '_');
        }
        return this.id;
    };

    /**
     * Переопределить если требуется выполнить дополнительные действия после рендоринга
     */
    Backbone.Component.prototype.afterRender = function() {
    };

    /**
     * Можно переопределить, если требуется выполнять какие либо действия до отрисовки компонента,
     * обязательно должен вызывать {@param callback}
     * @param callback
     */
    Backbone.Component.prototype.beforeRender = function(callback) {
        if (callback) {
            callback();
        }
    };

    /**
     * Отрисовывает компонент.
     *
     * @param data - дополнительные данные (например если компонент использует данные из View)
     */
    Backbone.Component.prototype.render = function(data) {
        var that = this;
        this.beforeRender(function() {
            logger.log('[Backbone.Component] Render component ' + that.name);
            if (!that.loaded) {
                that.getData(function(data) {
                    that.loaded = true;
                    that.render(data);
                }, data);
                return;
            }
            var component = $('[component=' + that.name + ']');
            if (component.length > 0) {
                $.get(that.template, function(template) {
                    component.html(_.template(template)(_.extend(that.data, data)));
                    that.eventsApply();
                    that.afterRender();
                });
            }
        });
    };

    /**
     * @see Backbone.View.prototype.eventsApply
     * @type {Function}
     */
    Backbone.Component.prototype.eventsApply = Backbone.View.prototype.eventsApply;

    /**
     * Предоставляет тот же интерфейс, но принцип отличается от Backbone, так как так удобней, и нет смысла в лишних сложностях
     * @param object
     * @returns {Function}
     */
    Backbone.Component.extend = function(object) {
        return function(options) {
            var newComponent = _.extend(new Backbone.Component(), object);
            _.extend(newComponent, options);
            logger.log('[Backbone.Component] Creating component ' + newComponent.name);
            newComponent.initialize();
            return newComponent;
        }
    };

    /**
     * Упрощеный способ конфигурации {@link Backbone.Router}
     * @type {{addStateHolder, addRoute, addAdditionalOptions, build}}
     */
    Backbone.routerBuilder = (function() {
        var state;
        var routes = {};
        var routeOptions = {
            routes: routes,
            execute: function(callback, args, name) {
                state.set({page: name});
                logger.debug('[Backbone.routerBuilder] Open page "' + name + '"');

                if (callback) {
                    callback.apply(this, args);
                }
            },
            routeByView: function(route, name, view) {
                this.route(route, name, function() {
                    view.render.apply(view, arguments);
                });
            }
        };

        return {
            /**
             * Будет хранить идентификатор открытой страницы
             * @param {Backbone.Model} stateHolder
             */
            addStateHolder: function(stateHolder) {
                state = stateHolder;
                return this;
            },

            addBeginRoute: function(actionName, view) {
                var startRoutes = ['', '!/', '/'];
                var startAction = function() {
                    // for save 'this'
                    view.render();
                };
                _.each(startRoutes, function(route) {
                    routes[route] = actionName;
                    routeOptions[actionName] = startAction;
                });
                return this;
            },

            /**
             * Добавляет путь
             * @param {string} path
             * @param {string} actionName - идентификатор страницы
             * @param {Function | Backbone.View} action -
             */
            addRoute: function(path, actionName, action) {
                routes[path] = actionName;
                if (action.render) {
                    action = _.bind(action.render, action);
                }
                routeOptions[actionName] = action;
                return this;
            },

            /**
             * Дополнительные опции для {@link Backbone.Router}
             * @param {=} options
             */
            addAdditionalOptions: function(options) {
                _.extend(routeOptions, options);
                return this;
            },

            /**
             * Заверщает сборку {@link Backbone.Router} и запускает его
             * @param {=} startOptions - опции для {@link Backbone.history.start}
             * @returns {Function|void|*}
             */
            build: function(startOptions) {
                if (!state) {
                    logger.error('[Backbone.routerBuilder] Can\'t start router, because there is no stateHolder');
                    return undefined;
                }

                var router = new (Backbone.Router.extend(routeOptions))();
                Backbone.history.start(startOptions);
                return router;
            }
        }
    })();
});
