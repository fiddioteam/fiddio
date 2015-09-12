angular.module('fiddio')
.directive('commentSection', [function(){
  return {
    restrict: 'E',
    replace: false,
    transclude: true,
    require: 'commentSection',
    scope: {
      parentId: '@',
      parentType: '@'
    },
    controllerAs: 'commentSection',
    controller: ['$scope', '$http', function($scope, $http){
      this.$scope = $scope;
    }],
    link: function(scope, elem, attr, commentSection){
      commentSection.parentId = attr.parentId;
      commentSection.parentType = attr.parentType;
    }
  };
}]);