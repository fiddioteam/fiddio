angular.module('fiddio')

.directive('commentSection', [
  function() {
    return {
      restrict: 'E',
      replace: false,
      transclude: true,
      link: function(scope, elem, attr) {
        scope.$on('comment:posted', function(event, comment) {
          scope.$broadcast('comments:updateDisplay', comment);
        });
      }
    };
  }
]);