angular.module('fiddio')
  .directive('votes', ['$http', '$rootScope', function($http, $rootScope) {
    return {
      restrict: 'E',
      template: '<div><span ng-if="userData.authenticated"><i class="fa fa-chevron-circle-up" ng-click="vote(1)"></i> <i class="fa fa-chevron-circle-down" ng-click="vote(-1)"></i></span></div>',
      replace: true,
      scope: {
        responseId: '@'
      },
      link: function(scope, elm, attr) {
        // fetch current vote from server and store it on $scope
        $http({ method: 'GET', url: '/api/response/' + attr.responseId + '/vote' })
        .then(function(response){
          scope.currentVote = response.data.vote;
        },function(response){});

        scope.userData = $rootScope.userData;

        // set up function to up- and downvote
        scope.vote = function(value) {
          var newVote = value === scope.currentVote ? 0 : value;
          $http({ method: 'POST',
            url: '/api/response/' + attr.responseId + '/vote',
            data: { vote: newVote } })
          .then(function(response){
            scope.currentVote = newVote;
            scope.updateStyle();
          }, function(response){});
        };

        scope.updateStyle = function() {
          //Update style based on scope.currentVote
        };
      }
    };
  }]);