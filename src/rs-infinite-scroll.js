// rs-infinite-scroll.js

import angular from 'angular';

const MODULE_NAME = 'rsInfiniteScroll';
const DIRECTIVE_NAME = MODULE_NAME;

let rsInfiniteScroll = angular.module(MODULE_NAME, []);

/*@ngInject*/
rsInfiniteScroll.directive(DIRECTIVE_NAME, function($q, $timeout) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      proxy: '='
    },
    link: (scope, element) => {
      var lastScroll = 0;
      var isLoading = 0;

      element.ready(initPaginator);

      scope.$on('$destroy', () => {
        element.off('scroll');
      });

      function initPaginator() {
        const FORWARD  = 1;
        const BACKWARD = -1;
        let {containerHeight, contentHeight} = getContainerProps();

        element.on('scroll', () => {
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
        let deferred = $q.defer();
        isLoading = 1;
        $timeout(() => {
          scope.proxy.loadFollowing().then(() => {
            isLoading = 0;
            deferred.resolve();
          });
        });
        return deferred.promise;
      }

      function applyLoadPrevious() {
        let deferred = $q.defer();
        let beforeHeight = element.find('div').prop('offsetHeight');
        isLoading = 1;
        $timeout(() => {
          scope.proxy.loadPrevious().then(() => {
            $timeout(() => {
              let afterHeight = element.find('div').prop('offsetHeight');
              setScrollPos(afterHeight-beforeHeight);
              isLoading = 0;
              deferred.resolve();
            });
          });
        });
        return deferred.promise;
      }

      function getContainerProps() {
        let containerHeight = element.prop('offsetHeight');
        let contentHeight = element.find('div').prop('offsetHeight');
        let scrollPos = element[0].scrollTop;
        return {containerHeight, contentHeight, scrollPos};
      }

      function setScrollPos(scrollPos=0) {
        element[0].scrollTop = scrollPos;
      }
    }
  };
});

export default MODULE_NAME;
