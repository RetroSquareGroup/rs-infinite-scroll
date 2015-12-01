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
      $timeout(function() {
        ctrl.dummyList = [
          {index: 1},
          {index: 2},
          {index: 3},
          {index: 4},
          {index: 5},
          {index: 6},
          {index: 7},
          {index: 8},
          {index: 9},
          {index: 10}
        ];
        loadFollowing();
      }, 5000);
    };
    init();

    function loadPrevious() {
      let first = ctrl.dummyList[0];
      return addBefore(first);
    }

    function loadFollowing() {
      let last = ctrl.dummyList[ctrl.dummyList.length-1]; // should be safe after initialization
      if (!last) {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }
      return addAfter(last);
    }

    function addAfter(last) {
      var deferred = $q.defer();
      deferred.resolve();
      $timeout(() => {
        if (last.index > 1000) {
          deferred.resolve();
          return;
        }
        for (let i = last.index+1; i < last.index+10; i++) {
          ctrl.dummyList.push({index: i});
        }
        deferred.resolve();
      }, 200);
      return deferred.promise;
    }

    function addBefore(first) {
      var deferred = $q.defer();
      deferred.resolve();
      $timeout(() => {
        if (first.index < -1000) {
          deferred.resolve();
          return;
        }
        for (let i = first.index-1; i > first.index-10; i--) {
          ctrl.dummyList.unshift({index: i});
        }
        deferred.resolve();
      }, 200);
      return deferred.promise;
    }
  }]);
