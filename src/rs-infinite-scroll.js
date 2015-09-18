// rs-infinite-scroll.js

import angular from 'angular';

const MODULE_NAME = 'rsInfiniteScroll';

let rsInfiniteScroll = angular.module(MODULE_NAME, []);

/*@ngInject*/
rsInfiniteScroll.directive('rsInfiniteScroll', function($q, $timeout) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      proxy: '='
    },
    controller: function($scope, $element) {
      var lastScroll = 0;
      var isLoading = 0;
      var children = [];
      var scrollTimeout;

      $element.ready(initPaginator);

      $scope.$on('$destroy', () => {
        $element.off('scroll');
      });

      function initPaginator() {
        const FORWARD  = 1;
        const BACKWARD = -1;
        let {containerHeight, contentHeight} = getContainerProps();

        $element.on('scroll', () => {
          $timeout.cancel(scrollTimeout);

          // handle scroll events to update content
          let {containerHeight, contentHeight, scrollPos} = getContainerProps();
          let direction = (scrollPos > lastScroll) ? FORWARD : BACKWARD;

          if (direction === FORWARD) {
            if (scrollPos >= 0.9*(contentHeight-containerHeight)) {
              if (isLoading == 0) applyLoadFollowing();
            }
          }
          if (direction === BACKWARD) {
            if (scrollPos <= 0.1*containerHeight) {
              if (isLoading == 0) applyLoadPrevious();
            }
          }

          lastScroll = scrollPos;

          scrollTimeout = $timeout(updateChildren, 300);
        });

        if (containerHeight > contentHeight) {
          applyLoadFollowing().then(() => {
            $timeout(() => {
              setScrollPos(1);
            });
          });
        }
      }

      function applyLoadFollowing() {
        if (!$scope.proxy.loadFollowing) return;

        let deferred = $q.defer();
        isLoading = 1;
        $timeout(() => {
          $scope.proxy.loadFollowing().then(() => {
            isLoading = 0;
            deferred.resolve();
          });
        });
        return deferred.promise;
      }

      function applyLoadPrevious() {
        if (!$scope.proxy.loadPrevious) return;

        let deferred = $q.defer();
        let beforeHeight = $element.find('div').prop('offsetHeight');
        isLoading = 1;
        $timeout(() => {
          $scope.proxy.loadPrevious().then(() => {
            $timeout(() => {
              let afterHeight = $element.find('div').prop('offsetHeight');
              setScrollPos(afterHeight-beforeHeight);
              isLoading = 0;
              deferred.resolve();
            });
          });
        });
        return deferred.promise;
      }

      function getContainerProps() {
        let containerHeight = $element.prop('offsetHeight');
        let contentHeight = $element.find('div').prop('offsetHeight');
        let scrollPos = $element[0].scrollTop;
        return {containerHeight, contentHeight, scrollPos};
      }

      function getBoundingBox() {
        return $element[0].getBoundingClientRect();
      }

      function setScrollPos(scrollPos=0) {
        $element[0].scrollTop = scrollPos;
      }

      function updateChildren() {
        let {top, bottom} = getBoundingBox();
        let containerTop = top;
        let containerBottom = bottom;
        for (let i = 0, l = children.length; i < l; i++) {
          let child = children[i];
          let {top, bottom} = child.getBoundingBox();
          let isVisible = ((bottom >= containerTop && bottom <= containerBottom) || (top <= containerBottom && top >= containerTop));
          child.setIsVisible(isVisible);
        }
      }

      // public controller
      this.addChild = (scope) => {
        children.push(scope);
      };
    }
  };
});

/*@ngInject*/
rsInfiniteScroll.directive('rsInfiniteScrollItem', function() {
  return {
    require: '^rsInfiniteScroll',
    restrict: 'A',
    scope: {
      isVisible: '='
    },
    link: (scope, element, attrs, scrollerCtrl) => {
      scrollerCtrl.addChild(scope);

      scope.getBoundingBox = () => {
        return element[0].getBoundingClientRect();
      };

      scope.setIsVisible = (visible) => {
        scope.isVisible = visible;
      };
    }
  };
});

export default MODULE_NAME;
