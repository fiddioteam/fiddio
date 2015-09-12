angular.module('fiddio')
  .directive('commentList', [ '$http', 'UserData', 'angularPlayer', '$timeout', function($http, UserData, angularPlayer, $timeout) {
    return {
      restrict: 'E',
      templateUrl: '/templates/commentList.html', // change this up too
      replace: true,
      // scope: true,
      require: '^commentSection',
      link: function(scope, elm, attr, commentSectionCTRL) {
        $http({ method: 'GET', url: '/api/'+commentSectionCTRL.parentType+'/'+commentSectionCTRL.parentId+'/comments'})
        .then(function(response){
          scope.comments = response.data.comments;
        },
        function(response){
          console.log("Error ", response);
        });
        commentSectionCTRL.$scope.$on('newComment', function(event, data){
          console.log('recieved a comment!!!', data);
          scope.comments.push(data);
        });
      }
    };
  }]);