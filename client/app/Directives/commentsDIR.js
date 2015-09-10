angular.module('fiddio')
  .directive('comments', [ '$http', 'UserData', 'angularPlayer', '$timeout', function($http, UserData, angularPlayer, $timeout) {
    return {
      restrict: 'E',
      templateUrl: '/templates/comments.html',
      replace: true,
      scope: {
        responseId: '@'
      },
      link: function(scope, elm, attr) {

        $http({ method: 'GET', url: '/api/response/'+attr.responseId+'/comments'})
        .then(function(response){
          console.log('COMMENTS', response.data);
          scope.comments = response.data.comments;
        },
        function(response){
          console.log("Error ", response);
        });
        // comment should include: response_id, body, timeslice, user_id
        scope.comment = function() {
          $timeout(function() {
             return $http({ method: 'POST', url: '/api/response/'+attr.responseId+'/comment', data: {
                response_id: attr.responseId,
                body: scope.newComment.body, 
                timeslice: Math.max(angularPlayer.getPosition()|0, 0),
                user_id: UserData.getItem('userInfo').id
              } })
            .then(function(response){
              console.log("Response.data in POST then block", response.data);
              scope.comments.push(response.data);
              scope.newComment.body = '';
            }, function(response){
              console.log("Error ", response);
            });
          }, 0); 
        };

      }
    };
  }]);