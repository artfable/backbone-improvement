/**
 * LICENSE https://raw.githubusercontent.com/artfable/backbone-improvement/master/LICENSE
 * @author artfable
 * 20.09.15
 */

/**
 * Уровни error и trace выводят stacktrace. Для вывода действий использовать log, а не info.
 * В случае если консоль не проинициализирована (IE fix) устанавливает level = 0, тем самым отлючая вывод в консоль
 */
window.logger = {
    levels: {
        error: {id: 1, name: 'error'},
        warning: {id: 2, name: 'warn'},
        info: {id: 3, name: 'info'},
        log: {id: 4, name: 'log'},
        debug: {id: 5, name: 'debug'},
        trace: {id: 6, name: 'trace'}
    },
    level: window.console !== undefined ? {id: 3, name: 'info'} : {id: 0, name: 'off'},
    print: function (msg, level) {
        if (level.id <= this.level.id) {
            if (console[level.name]) {
                console[level.name](msg);
            }
        }
    },
    error: function (msg) {
        this.print(msg, this.levels.error);
    },
    warn: function (msg) {
        this.print(msg, this.levels.warning);
    },
    info: function (msg) {
        this.print(msg, this.levels.info);
    },
    log: function (msg) {
        this.print(msg, this.levels.log);
    },
    debug: function (msg) {
        this.print(msg, this.levels.debug);
    },
    trace: function (msg) {
        this.print(msg, this.levels.trace);
    },

    applyLogLevel: function (logLevel) {
        if (window.console === undefined) {
            logger.level = {id: 0, name: 'off'};
            return;
        }
        if (logLevel) {
            logger.level = logger.levels[logLevel];
            if (logger.level) {
                logger.log('log level set to "' + logLevel + '"');
            } else {
                logger.level = logger.levels.info;
                logger.error('invalid log level "' + logLevel + '", set to "' + logger.levels.info.name + '"');
            }
        }
    }
};
