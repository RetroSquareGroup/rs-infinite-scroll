var angular = require('angular');

angular.module('rsInfiniteScrollDemo', [require('rs-infinite-scroll')])
  .controller('RsDemoController', function() {
    var ctrl = this;

    ctrl.scrollProxy = {
      loadPrevious,
      loadFollowing
    };
    ctrl.dummyList = [];

    let init = function() {
      addAfter(0);
    };
    init();

    function loadPrevious() {
      addBefore(0);
    }

    function loadFollowing() {
      let last = ctrl.dummyList[ctrl.dummyList.length-1]; // should be safe after initialization
      addAfter(last);
    }

    function addAfter(last) {
      for (let i = last+1; i < last+10; i++) {
        ctrl.dummyList.push(i);
      }
    }

    function addBefore(first) {
      console.log('loading previous', first);
    }
  });
