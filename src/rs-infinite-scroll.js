// rs-infinite-scroll.js

import angular from 'angular';

const MODULE_NAME = 'rsInfiniteScroll';
const DIRECTIVE_NAME = MODULE_NAME;

let rsInfiniteScroll = angular.module(MODULE_NAME, []);

/*@ngInject*/
rsInfiniteScroll.directive(DIRECTIVE_NAME, function($timeout) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      proxy: '='
    },
    link: (scope, element) => {
      // var nextDataUrl;
      // var prevDataUrl;
      // var nextDataCache;
      // var prevDataCache;
      var lastScroll = 0;
      var isLoading = 0;
      // var hideOnLoad = false;

      function applyLoadFollowing() {
        isLoading = 1;
        $timeout(() => {
          scope.proxy.loadFollowing();
          isLoading = 0;
        });
      }

      function initPaginator() {
        const FORWARD  = 1;
        const BACKWARD = -1;
        let containerHeight = element.prop('offsetHeight');
        let contentHeight = element.find('div').prop('offsetHeight');

        element.on('scroll', () => {
          // handle scroll events to update content
          let container = element[0];
          let containerHeight = element.prop('offsetHeight');
          let contentHeight = element.find('div').prop('offsetHeight');
          let scrollPos = container.scrollTop;
          let direction = (scrollPos > lastScroll) ? FORWARD : BACKWARD;

          if (direction === FORWARD) {
            if (scrollPos >= 0.9*(contentHeight-containerHeight)) {
              if (isLoading == 0) applyLoadFollowing();
            }
          }
          if (direction === BACKWARD) {
            if (scrollPos <= 0.1*containerHeight) {
              if (isLoading == 0) scope.proxy.loadPrevious();
            }
          }

          lastScroll = scrollPos;
        });
        // $(document).ready(function () {
          // if we have enough room, load the next batch
          if (containerHeight > contentHeight) {
          //  if (next_data_url!="") {
              applyLoadFollowing();
          /*  } else {
              var filler = document.createElement("div");
              filler.id = "filler";
              filler.style.height = ($(window).height() -
                                     $("#scrollingcontent").height())+ "px";
              $("#scrollingcontent").after(filler);
              hide_on_load = "filler";
            }*/
          }
          // scroll down to hide empty room
        // });
      }

      element.ready(initPaginator);

      scope.$on('$destroy', () => {
        // TODO unregister junt
        element.off('scroll');
      });
    }
  };
});

export default MODULE_NAME;
