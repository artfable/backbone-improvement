/**
 * LICENSE https://raw.githubusercontent.com/artfable/backbone-improvement/master/LICENSE
 * @author artfable
 * 20.09.15
 */

/**
 * Уровни error и trace выводят stacktrace. Для вывода действий использовать log, а не info.
 * В случае если консоль не проинициализирована (IE fix) устанавливает level = 0, тем самым отлючая вывод в консоль
 */

function Logger(name, level) {
	level = level ? level : 'info';
	name = name ? name : 'common';
	this._name = name;
	this.applyLogLevel(level);
}

Logger.prototype._loggersLevels = {};

Logger.prototype._levels = {
	error: {id: 1, name: 'error'},
	warning: {id: 2, name: 'warn'},
	info: {id: 3, name: 'info'},
	log: {id: 4, name: 'log'},
	debug: {id: 5, name: 'debug'},
	trace: {id: 6, name: 'trace'}
};
Logger.prototype.print = function(msg, level) {
	if (typeof msg === 'string') {
		msg = '[' + this._name + '] ' + msg;
	}
	if (level.id <= Logger.prototype._loggersLevels[this._name].id) {
		if (console[level.name]) {
			console[level.name](msg);
		}
	}
};
Logger.prototype.error = function(msg) {
	this.print(msg, this._levels.error);
};
Logger.prototype.warn = function(msg) {
	this.print(msg, this._levels.warning);
};
Logger.prototype.info = function(msg) {
	this.print(msg, this._levels.info);
};
Logger.prototype.log = function(msg) {
	this.print(msg, this._levels.log);
};
Logger.prototype.debug = function(msg) {
	this.print(msg, this._levels.debug);
};
Logger.prototype.trace = function(msg) {
	this.print(msg, this._levels.trace);
};

Logger.prototype.applyLogLevel = function(logLevel, name) {
	name = name ? name : this._name;
	if (window.console === undefined) {
		Logger.prototype._loggersLevels[name] = {id: 0, name: 'off'};
		return;
	}
	if (logLevel) {
		Logger.prototype._loggersLevels[name] = Logger.prototype._levels[logLevel];
		if (Logger.prototype._loggersLevels[name]) {
			this.log('log level for "' + name + '" set to "' + logLevel + '"');
		} else {
			Logger.prototype._loggersLevels[name] = Logger.prototype._levels.info;
			logger.error('invalid log level "' + logLevel + '", set to "' + Logger.prototype._levels.info.name + '"');
		}
	}
};

window.logger = new Logger();
