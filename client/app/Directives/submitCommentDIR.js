angular.module('fiddio')
  .directive('submitComment', [ '$http', 'angularPlayer', '$timeout', '$rootScope', function($http, angularPlayer, $timeout, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: '/templates/submitComment.html',
      link: function(scope, elm, attr) {
        scope.userData = $rootScope.userData;
        // Posts a comment to the server
        scope.postComment = function(commentBody) {
          // We are using $timeout as a safety to call $apply without causing errors.
          $timeout(function() {
             return $http({ method: 'POST', url: '/api/'+attr.parentType+'/'+attr.parentId+'/comment',
              data: {
                // We used elm.find because we did NOT want double binding/ ng-model due to the recycling of this directive.
                body: commentBody,
                timeslice: Math.max(angularPlayer.getPosition()|0, 0),
                user_id: $rootScope.userData.getItem('userInfo').id
              }
            })
            .then(function(response){
              // Upon a success from the server, emit an event to the parent commentSection
              scope.$emit('comment:posted', response.data);
            }, function(response){
              console.log("Error ", response);
            });
          });
        };

      }
    };
  }]);