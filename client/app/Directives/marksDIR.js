angular.module('fiddio')
  .directive('marks', ['$http', '$rootScope', '$timeout', function($http, $rootScope, $timeout) {
    return {
      restrict: 'E',
      template: "<div><span ng-if=\"userData.authenticated\"><i class=\"fa\" ng-class=\"{'fa-check-circle-o': marked, 'fa-circle-o': !marked}\" ng-click=\"toggleMark()\"></i></span><a ui-sref=\"login\" ng-if=\"!userData.authenticated\">Login to bookmark</a></div>",
      replace: true,
      scope: {
        responseId: '@'
      },
      link: function(scope, elm, attr) {
        // fetch current mark from server and store it on $scope
        $http({ method: 'GET', url: '/api/question/' + attr.quesionId + '/answer' + attr.answerId})
        .then(function(response) {
          scope.currentMark = response.data.mark;
        }, function(response) {});

        // set up function to up- and downstar
        scope.toggleMark = function() {
          $timeout( $http({ method: 'POST',
            url: '/api/response/' + attr.questionId + '/star',
            data: { star: !scope.starred + 0 } })
          .then(function(response){
            scope.starred = !scope.starred;
          }, function(response){}));
        };
      }
    };
  }]);

// each markDIR needs to broadcast changes to other DIRs when changed