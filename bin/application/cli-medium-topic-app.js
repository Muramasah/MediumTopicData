/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _child_process = __webpack_require__(1);

var _ApplicationCreator = __webpack_require__(2);

var _ApplicationCreator2 = _interopRequireDefault(_ApplicationCreator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mediumTopicService = (0, _child_process.fork)('bin/service/medium-topic.js');
var cliService = (0, _child_process.fork)('bin/interface/cli.js');
var cliMediumTopicApp = _ApplicationCreator2.default.create(cliService, mediumTopicService);

cliMediumTopicApp.start();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplicationCreator = function () {
    function ApplicationCreator() {
        _classCallCheck(this, ApplicationCreator);
    }

    _createClass(ApplicationCreator, [{
        key: 'create',
        value: function create(userInterface, mainService) {
            this.setUserInterface(userInterface);
            this.setMainService(mainService);

            return this;
        }
    }, {
        key: 'start',
        value: function start() {
            this.mainService.send('start');
            this.mainService.on('message', this.startUserInterfaceOnMainServiceReady.bind(this));
        }
    }, {
        key: 'startUserInterfaceOnMainServiceReady',
        value: function startUserInterfaceOnMainServiceReady(message) {
            if (message.state === 'ready') {
                this.userInterface.send('start');
            }
        }
    }, {
        key: 'setUserInterface',
        value: function setUserInterface(userInterface) {
            this.userInterface = userInterface;
        }
    }, {
        key: 'setMainService',
        value: function setMainService(mainService) {
            this.mainService = mainService;
        }
    }]);

    return ApplicationCreator;
}();

var applicationCreator = new ApplicationCreator();

exports.default = applicationCreator;

/***/ })
/******/ ]);