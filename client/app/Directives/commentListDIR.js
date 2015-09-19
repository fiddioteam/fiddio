angular.module('fiddio')

.directive('commentList', [
  '$http',
  'angularPlayer',
  '$timeout',
  '$rootScope',
  function($http, angularPlayer, $timeout, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: '/templates/commentList.html',
      replace: true,
      link: function(scope, elm, attr) {
        scope.parentType = attr.parentType;
        scope.parentId = attr.parentId;
        scope.userData = $rootScope.userData;

        $http({ method: 'GET', url: '/api/' + attr.parentType + '/' + attr.parentId + '/comments' })
        .then( function(response) {
          scope.comments = response.data.comments;
        }, function(error) {
          console.error('Error', error);
        });

        scope.replyToComment = function(comment) {
          $timeout( function() {
            comment.reply = true;
          });
        };

        scope.$on('comments:updateDisplay', function(event, comment) {
          if (comment.parent_type === 'comment') {
            scope.comments.some( function(c) {
              if (c.id === comment.parent_id) {
                c.comments.push(comment);
                return true;
              }
              return false;
            });
          } else {
            comment.comments = [];
            scope.comments.push(comment);
          }
        });
      }
    };
  }
]);