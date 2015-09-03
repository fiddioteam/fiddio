angular.module('fiddio')

.factory('DataPackager', [ '$http', function($http) {

  function uploadQuestion(){}

  function downloadQuestion(){}

  return {
    uploadQuestion: uploadQuestion,
    downloadQuestion: downloadQuestion
  };
}]);