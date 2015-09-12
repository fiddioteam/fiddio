angular.module('fiddio')
.directive('commentSection', [function(){
  return {
    restrict: 'E',
    /**
     * Revisit replace, transclude, controller, controllerAs, and determine if it can be simplified
     */
    replace: false,
    transclude: true,
    require: 'commentSection',
    controllerAs: 'commentSection',
    controller: ['$scope', '$http', function($scope, $http){

    }],
    link: function(scope, elem, attr, commentSection){
      //Might need to be changed to scope??
      commentSection.parentId = attr.parentId;
      commentSection.parentType = attr.parentType;

      // Listens for events from a child that gets emitted when a comment is posted to the server.
      scope.$on('comment:posted', function(event, comment) {
        scope.$broadcast('comments:updateDisplay', comment);
      });
    }
  };
}]);