angular.module('fiddio')
  .directive('votes', ['$http', '$rootScope', '$timeout', function($http, $rootScope, $timeout) {
    return {
      restrict: 'E',
      templateUrl: '/templates/votes.html',
      replace: true,
      scope: {
        answer: '='
      },
      link: function(scope, elm, attr) {
        scope.userData = $rootScope.userData;

        // set up function to up- and downvote
        scope.vote = function(value) {
          var newVote = value === scope.currentVote ? 0 : value;

          $timeout( function() {
            $http({ method: 'POST',
            url: '/api/response/' + scope.answer.id + '/vote',
            data: { vote: newVote } })
            .then(function(response) {
              if (response.data.result) {
                scope.answer.vote_count = response.data.vote_count;
              }
            });
          });
        };
      }
    };
  }]);