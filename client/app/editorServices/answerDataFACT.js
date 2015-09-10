angular.module('fiddio')
  .factory('AnswerData', ['$http', function($http) {

    function downloadAnswerData(id){
      return $http({method: 'GET', url: '/api/response/'+id})
      .then(function(data){
        return data.data;
      },function(error){
        console.error(error);
      });
    }

    return {
      downloadAnswerData: downloadAnswerData
    };
  }]);