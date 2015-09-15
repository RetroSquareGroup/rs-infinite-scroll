var angular = require('angular');

angular.module('rsInfiniteScrollDemo', [require('rs-infinite-scroll')])
  /*@ngInject*/
  .controller('RsDemoController', ['$q', '$timeout', function($q, $timeout) {
    var ctrl = this;

    ctrl.scrollProxy = {
      loadPrevious,
      loadFollowing
    };
    ctrl.dummyList = [];

    let init = function() {
      ctrl.dummyList = [1,2,3,4,5,6,7,8,9,10];
    };
    init();

    function loadPrevious() {
      let first = ctrl.dummyList[0];
      return addBefore(first);
    }

    function loadFollowing() {
      let last = ctrl.dummyList[ctrl.dummyList.length-1]; // should be safe after initialization
      return addAfter(last);
    }

    function addAfter(last) {
      var deferred = $q.defer();
      $timeout(() => {
        if (last > 1000) {
          deferred.resolve();
          return;
        }
        for (let i = last+1; i < last+10; i++) {
          ctrl.dummyList.push(i);
        }
        deferred.resolve();
      }, 200);
      return deferred.promise;
    }

    function addBefore(first) {
      var deferred = $q.defer();
      $timeout(() => {
        if (first < -1000) {
          deferred.resolve();
          return;
        }
        for (let i = first-1; i > first-10; i--) {
          ctrl.dummyList.unshift(i);
        }
        deferred.resolve();
      }, 200);
      return deferred.promise;
    }
  }]);
