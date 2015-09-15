var RsInfiniteScroll =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// rs-infinite-scroll.js

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var MODULE_NAME = 'rsInfiniteScroll';
	var DIRECTIVE_NAME = MODULE_NAME;

	var rsInfiniteScroll = _angular2['default'].module(MODULE_NAME, []);

	/*@ngInject*/
	rsInfiniteScroll.directive(DIRECTIVE_NAME, function ($q, $timeout) {
	  return {
	    restrict: 'A',
	    transclude: true,
	    template: '<div ng-transclude></div>',
	    scope: {
	      proxy: '='
	    },
	    link: function link(scope, element) {
	      var lastScroll = 0;
	      var isLoading = 0;

	      element.ready(initPaginator);

	      scope.$on('$destroy', function () {
	        element.off('scroll');
	      });

	      function initPaginator() {
	        var FORWARD = 1;
	        var BACKWARD = -1;

	        var _getContainerProps = getContainerProps();

	        var containerHeight = _getContainerProps.containerHeight;
	        var contentHeight = _getContainerProps.contentHeight;

	        element.on('scroll', function () {
	          // handle scroll events to update content

	          var _getContainerProps2 = getContainerProps();

	          var containerHeight = _getContainerProps2.containerHeight;
	          var contentHeight = _getContainerProps2.contentHeight;
	          var scrollPos = _getContainerProps2.scrollPos;

	          var direction = scrollPos > lastScroll ? FORWARD : BACKWARD;

	          if (direction === FORWARD) {
	            if (scrollPos >= 0.9 * (contentHeight - containerHeight)) {
	              if (isLoading == 0) applyLoadFollowing();
	            }
	          }
	          if (direction === BACKWARD) {
	            if (scrollPos <= 0.1 * containerHeight) {
	              if (isLoading == 0) applyLoadPrevious();
	            }
	          }

	          lastScroll = scrollPos;
	        });

	        if (containerHeight > contentHeight) {
	          applyLoadFollowing().then(function () {
	            $timeout(function () {
	              setScrollPos(1);
	            });
	          });
	        }
	      }

	      function applyLoadFollowing() {
	        var deferred = $q.defer();
	        isLoading = 1;
	        $timeout(function () {
	          scope.proxy.loadFollowing().then(function () {
	            isLoading = 0;
	            deferred.resolve();
	          });
	        });
	        return deferred.promise;
	      }

	      function applyLoadPrevious() {
	        var deferred = $q.defer();
	        var beforeHeight = element.find('div').prop('offsetHeight');
	        isLoading = 1;
	        $timeout(function () {
	          scope.proxy.loadPrevious().then(function () {
	            $timeout(function () {
	              var afterHeight = element.find('div').prop('offsetHeight');
	              setScrollPos(afterHeight - beforeHeight);
	              isLoading = 0;
	              deferred.resolve();
	            });
	          });
	        });
	        return deferred.promise;
	      }

	      function getContainerProps() {
	        var containerHeight = element.prop('offsetHeight');
	        var contentHeight = element.find('div').prop('offsetHeight');
	        var scrollPos = element[0].scrollTop;
	        return { containerHeight: containerHeight, contentHeight: contentHeight, scrollPos: scrollPos };
	      }

	      function setScrollPos() {
	        var scrollPos = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	        element[0].scrollTop = scrollPos;
	      }
	    }
	  };
	});

	exports['default'] = MODULE_NAME;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ }
/******/ ]);