angular.module('fiddio')

.factory('QuestionsData', ['$http',function($http){

  function downloadQuestionsData(){
    return $http({method:'GET', url:'/api/questions'});
  }
  function downloadFullQuestion(id){
    console.log('Getting full data for', id);
    return $http({method:'GET', url:'/api/question/'+id})
    .success(function(data){
      console.log(data);
      return data;
    })
    .error(function(error){
      console.error(error);
    });
  }
  return {
    downloadQuestionsData: downloadQuestionsData,
    downloadFullQuestion: downloadFullQuestion
  };
}]);