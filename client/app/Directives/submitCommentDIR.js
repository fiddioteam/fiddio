angular.module('fiddio')
  .directive('submitComment', [ '$http', 'UserData', 'angularPlayer', '$timeout', function($http, UserData, angularPlayer, $timeout) {
    return {
      restrict: 'E',
      templateUrl: '/templates/submitComment.html', // change this up eventually
      replace: true,
      scope: true,
      require: '^commentSection',
      link: function(scope, elm, attr, commentSectionCTRL) {
        scope.comment = function() {
          $timeout(function() {
             return $http({ method: 'POST', url: '/api/'+commentSectionCTRL.parentType+'/'+commentSectionCTRL.parentId+'/comment', data: {
                // response_id: scope.parentId,
                body: scope.newComment.body,
                timeslice: Math.max(angularPlayer.getPosition()|0, 0),
                user_id: UserData.getItem('userInfo').id
              } })
            .then(function(response){
              commentSectionCTRL.$scope.$broadcast('newComment', response.data);
              scope.newComment.body = '';
            }, function(response){
              console.log("Error ", response);
            });
          }, 0);
        };

      }
    };
  }]);