angular.module('fiddio')
.directive('commentSection', [function(){
  return {
    restrict: 'E',
    replace: false,
    transclude: true,
    require: 'commentSection',
    controllerAs: 'commentSection',
    controller: ['$scope', '$http', function($scope, $http){
    }],
    link: function(scope, elem, attr, commentSection){
      commentSection.parentId = attr.parentId;
      commentSection.parentType = attr.parentType;

      scope.$on('comment:posted', function(event, comment) {
        scope.$broadcast('comments:updateDisplay', comment);
      });
    }
  };
}]);