/**
 * LICENSE https://raw.githubusercontent.com/artfable/backbone-improvement/master/LICENSE
 * @author a.veselov
 * 23.03.2015.
 */

$(function() {

    // If logger not set, will use common console
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
     * Backbone events work not as we would like, so some changes
     * In Backbone, if add templates cascade - default way of events won't be work
     *
     * Events shouldn't be set for any child {@link View}.
     * @deprecated
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
     * Load template of a view
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
     * Render of view, load template and after it call {@link Backbone.View#resolve}
     */
    Backbone.View.prototype.render = function() {
        var that = this;
        var thatArguments = arguments;

        var render = function() {
            logger.debug('[Backbone.View] Start resolve view "' + that.templateUrl + '".');
            that.resolve.apply(that, thatArguments);
            if (!_.isUndefined(that.title)) {
                that.setTitle(that.title);
            }
        };
        if (this.template) {
            render();
        } else {
            this.load(render);
        }

        return this;
    };

    /**
     * Configuration for common part of the title, for all views. Change it only for prototype.
     *
     * @type {{on: boolean, front: boolean, separator: string, text: string}}
     * @private
     */
    Backbone._commonTitleConfig = {
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
        var commonTitleConfig = this._commonTitleConfig || Backbone._commonTitleConfig;
        if (commonTitleConfig.on) {
            if (title) {
                var separator = ' ' + commonTitleConfig.separator + ' ';
                title = commonTitleConfig.front ? commonTitleConfig.text + separator + title : title + separator + commonTitleConfig.text;
            } else {
                title = commonTitleConfig.text;
            }
        }
        if (title) {
            document.title = title;
        }
    };

    /**
     * Initialization of {@link Backbone.View}
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

    Backbone.Page.prototype.setTitle = Backbone.View.prototype.setTitle;

    Backbone.Page.prototype.render = function() {
        var that = this;
        var thatArguments = arguments;

        this.setTitle();

        var layoutOptions = this.layoutOptions instanceof Backbone.Model ? this.layoutOptions.toJSON() : this.layoutOptions;

        this.layout.render(layoutOptions, function () {
            _.each(that.views, function (metadata) {
                metadata.view.render.apply(metadata.view, thatArguments);
                that.layout.setRegion(metadata.region, metadata.view);
            });
        });

        return this;
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
            if (extraOptions.views && options.views) {
                extraOptions.views = _.union(extraOptions.views, options.views); // not exclude duplicates!
            }
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
            that._$content = $('<div></div>').append(that.template({options: options}));
            callback();
            that.resolve();
        };
        if (this.template) {
            render();
        } else {
            this.load(render)
        }
    };

    /**
     * Add view to chosen region
     * @param {string} region - selector of DOM element
     * @param {Backbone.View} view
     */
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

        if (this.afterRender) {
            this.afterRender.apply(this, arguments);
        }
    };

    Backbone.Layout.extend = function(options) {
        var layout = new Backbone.Layout(options);
        return function(options) {
            var initialized = _.extend(layout, options).initialize();
            initialized._ensureElement();
            return initialized;
        }
    };


    Backbone.History.prototype.restart = function() {
        if (Backbone.History.started) {
            this.stop();
            this.start();
        }
    };

    /**
     * Simplified way to configure {@link Backbone.Router}
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
            },
            routeStartView: function(name, view) {
                var that = this;
                _.each(['', '!', '!/', '/'], function(route) {
                    that.routeByView(route, name, view);
                });
            },
            route: function() {
                var router = Backbone.Router.prototype.route.apply(this, arguments);
                Backbone.history.restart();
                return router;
            }
        };

        return {
            /**
             * Will keep id of open page.
             * @param {Backbone.Model} stateHolder
             */
            addStateHolder: function(stateHolder) {
                state = stateHolder;
                return this;
            },

            addBeginRoute: function(actionName, action) {
                var startRoutes = ['', '!/', '/'];
                if (action.render) {
                    action = _.bind(action.render, action);
                }
                routeOptions[actionName] = action;
                _.each(startRoutes, function(route) {
                    routes[route] = actionName;
                });
                return this;
            },

            /**
             * Add path.
             * @param {string} path
             * @param {string} actionName - page's id
             * @param {Function | Backbone.View} action - action or view that must be starts
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
             * Additional options for {@link Backbone.Router}
             * @param {=} options
             */
            addAdditionalOptions: function(options) {
                _.extend(routeOptions, options);
                return this;
            },

            /**
             * Ends build of {@link Backbone.Router} and starts it
             * @returns {Function|void|*}
             */
            build: function() {
                if (!state) {
                    logger.error('[Backbone.routerBuilder] Can\'t start router, because there is no stateHolder');
                    return undefined;
                }

                var router = new (Backbone.Router.extend(routeOptions))();
                Backbone.history.start();
                return router;
            }
        }
    })();
});
