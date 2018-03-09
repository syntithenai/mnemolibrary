'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = version;

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _clone = require('utilise/clone');

var _clone2 = _interopRequireDefault(_clone);

var _set = require('utilise/set');

var _set2 = _interopRequireDefault(_set);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _by = require('utilise/by');

var _by2 = _interopRequireDefault(_by);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Global Versioning and Time Travel
// -------------------------------------------
function version(ripple) {
  log('creating');

  var type = ripple.types['application/data'];
  ripple.on('change.version', commit(ripple));
  ripple.version = checkout(ripple);
  ripple.version.calc = calc(ripple);
  ripple.version.log = [];
  return ripple;
}

var commit = function commit(ripple) {
  return function (name, change) {
    return logged(ripple.resources[name]) && ripple.version.log.push((0, _values2.default)(ripple.resources).filter((0, _by2.default)(logged)).map(index));
  };
};

var index = function index(_ref) {
  var name = _ref.name;
  var body = _ref.body;
  return { name: name, index: body.log.length - 1 };
};

var checkout = function checkout(ripple) {
  return function (name, index) {
    return arguments.length == 2 ? resource(ripple)({ name: name, index: index }) : arguments.length == 1 && _is2.default.str(name) ? ripple.resources[name].body.log.length - 1 : arguments.length == 1 && _is2.default.num(name) ? application(ripple)(name) : arguments.length == 0 ? ripple.version.log.length - 1 : err('could not rollback', name, index);
  };
};

var application = function application(ripple) {
  return function (index) {
    return ripple.version.log[rel(ripple.version.log, index)].map(resource(ripple));
  };
};

var resource = function resource(ripple) {
  return function (_ref2) {
    var name = _ref2.name;
    var index = _ref2.index;
    return ripple(name, ripple.version.calc(name, index));
  };
};

var calc = function calc(ripple) {
  return function (name, index) {
    var log = ripple.resources[name].body.log,
        end = rel(log, index),
        i = end;

    if (log[end].cache) return log[end].cache;

    while (_is2.default.def(log[i].key)) {
      i--;
    }var root = (0, _clone2.default)(log[i].value);
    while (i !== end) {
      (0, _set2.default)(log[++i])(root);
    }return (0, _def2.default)(log[end], 'cache', root);
  };
};

var rel = function rel(log, index) {
  return index < 0 ? log.length + index - 1 : index;
};

var logged = function logged(res) {
  return res.body.log && res.body.log.max > 0;
};

var log = require('utilise/log')('[ri/versioned]'),
    err = require('utilise/err')('[ri/versioned]');