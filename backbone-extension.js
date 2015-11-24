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

    var logger = window.Logger ? new window.Logger('backboneExtension') : window.logger;

    // IE8 fix, better use sth like es5-shim (https://github.com/es-shims/es5-shim)
    // Thanks stackoverflow.com for that code))
    if (!Object.create) {
        Object.create = function(o, properties) {
            if (typeof o !== 'object' && typeof o !== 'function') throw new TypeError('Object prototype may only be an Object: ' + o);
            else if (o === null) throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");

            if (typeof properties != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

            function F() {}

            F.prototype = o;

            return new F();
        };
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
                var selector = element.selector;
                if (_.isFunction(selector)) {
                    selector = selector.apply(that);
                }
                var $element = selector == that.el ? that.$el : that.$el.find(selector);
                $element.on(element.event, params, that[element.call]);
                logger.log('[View] register ' + element.event + ' on ' + element.selector);
            });
        }
    };

    /**
     * Добавим к View отрисовку компонентов
     * @param data
     * @deprecated
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
            logger.debug('[Backbone.View] "' + that.templateUrl + '" loaded.');

            if (callback) {
                callback();
            }
        });
    };

    /**
     * Отрисовка страницы, обеспецивает загрузку шаблона, после чего вызывает {@link Backbone.View#resolve}
     */
    Backbone.View.prototype.render = function() {
        var that = this;
        var thatArguments = arguments;

        var render = function() {
            logger.debug('[Backbone.View] Start resolve view "' + that.templateUrl + '".');
            that.resolve.apply(that, thatArguments);
            that.setTitle(that.title);
        };
        if (this.template) {
            render();
        } else {
            this.load(render);
        }
    };

    /**
     * Configuration for common part of the title, for all views. Change it only for prototype.
     *
     * @type {{on: boolean, front: boolean, separator: string, text: string}}
     * @private
     */
    Backbone.View.prototype._commonTitleConfig = {
        on: false,
        front: false,
        separator: '|',
        text: ''
    };

    /**
     * Set page title and add common part to it, if it's turned on.
     *
     * @param {string} title
     */
    Backbone.View.prototype.setTitle = function(title) {
        if (this._commonTitleConfig.on) {
            if (title) {
                var separator = ' ' + this._commonTitleConfig.separator + ' ';
                title = this._commonTitleConfig.front ? this._commonTitleConfig.text + separator + title : title + separator + this._commonTitleConfig.text;
            } else {
                title = this._commonTitleConfig.text;
            }
        }
        if (title) {
            document.title = title;
        }
    };

    /**
     * Инициализация {@link Backbone.View}
     * @returns {Backbone.View}
     */
    Backbone.View.prototype.initialize = function() {
        logger.debug('[Backbone.View] Initialize view "' + this.templateUrl + '"');
        if (this.resolve) {
            this.resolve = _.bind(this.resolve, this);
        }
        if (this.afterInitialize) {
            this.afterInitialize = _.bind(this.afterInitialize, this);
            this.afterInitialize();
        }
        return this;
    };
//============= Page =====================
    Backbone.Page = function(views, layout, layoutOptions) {
        this.views = views;
        this.layout = layout;
        this.layoutOptions = layoutOptions;
    };

    Backbone.Page.prototype.render = function() {
        var that = this;
        var thatArguments = arguments;

        this.layout.render(this.layoutOptions, function () {
            _.each(that.views, function (metadata) {
                metadata.view.render.apply(metadata.view, thatArguments);
                that.layout.setRegion(metadata.region, metadata.view);
            });
        });
    };

    Backbone.Page.prototype.initialize = function() {
        if (this.afterInitialize) {
            this.afterInitialize = _.bind(this.afterInitialize, this);
            this.afterInitialize();
        }
        return this;
    };

    Backbone.Page.extend = function(options) {
        return function(extraOptions) {
            var opt = _.extend({}, options, extraOptions);
            return _.extend(new Backbone.Page(), opt).initialize();
        }
    };

//============= Layout ===================
    Backbone.Layout = function(options) {
        logger.log('[Backbone.Layout] Creating layout for "' + options.el + '"');
        _.extend(this, options);
    };

    Backbone.Layout.prototype = Object.create(Backbone.View.prototype);

    Backbone.Layout.prototype.render = function(options, callback) {
        var that = this;
        var render = function() {
            that._$content = $('<div></div>').append(that.template(options));
            callback();
            that.resolve();
        };
        if (this.template) {
            render();
        } else {
            this.load(render)
        }
    };

    Backbone.Layout.prototype.setRegion = function(region, view) {
        if (view.$el.length == 0) {
            logger.error('[Backbone.Layout] Incorrect el in view "' + view.cid + '" for "' + region + '" region');
            return;
        }
        this._$content.find(region).append(view.$el);
        logger.debug('[Backbone.Layout] Add view "' + view.cid + '" to region "' + region + '"');
    };

    Backbone.Layout.prototype.resolve = function() {
        logger.log('[Backbone.Layout] Resolving layout for "' + (_.isObject(this.el) ? this.$el.selector : this.el) + '"');
        this.$el.empty().append(this._$content.children());
        this.eventsApply();
    };

    Backbone.Layout.extend = function(options) {
        var layout = new Backbone.Layout(options);
        return function(options) {
            var initialized = _.extend(layout, options).initialize();
            initialized._ensureElement();
            return initialized;
        }
    };

//============= Component ================
    /**
     * По сути View, но предназначен для того чтобы быть частью во View, а не отдельной страницей
     * @constructor
     * @deprecated
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
            var component = that.$component = $('[component=' + that.name + ']');
            if (component.length > 0) {
                var render = function() {
                    component.html(that.template(_.extend(that.data, data)));
                    that.eventsApply();
                    that.afterRender();
                };
                if (_.isFunction(that.template)) {
                    render();
                } else {
                    if (!that.templateUrl) {
                        logger.error('[Backbone.Component] No "templateUrl" property for component "' + that.name + '"');
                        return;
                    }
                    $.get(that.templateUrl, function(template) {
                        that.template = _.template(template);
                        render();
                    });
                }
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
             * @returns {Function|void|*}
             */
            build: function() {
                if (!state) {
                    logger.error('[Backbone.routerBuilder] Can\'t start router, because there is no stateHolder');
                    return undefined;
                }

                return new (Backbone.Router.extend(routeOptions))();
            }
        }
    })();
});
