angular.module('fiddio')

.factory('DataPackager', [ '$http', 'Upload', '$timeout', '$rootScope', function($http, Upload, $timeout, $rootScope) {

  var _responseData;

  function uploadResponse(code, editorChanges, mp3Blob, blobLength, description){

    _responseData = {
      code_changes: editorChanges,
      duration: blobLength,
      code: code,
      question_id: $rootScope.$stateParams.questionID,
      body: description
    };

    console.log('Body that will be sent to db', _responseData.body);

    Upload.upload({
      url: '/api/response',
      method: 'POST',
      fields: _responseData,
      file: mp3Blob,
      fileFormDataName: 'response'
    })
    .then( function(res) {
      $timeout( function() {
        $rootScope.$state.go('question', { questionID: $rootScope.$stateParams.questionID});
      });
    }, function(res) {
      console.log('Error!', res);
    });
  }

  function downloadResponses(id){
    // api GET
    return $http({method: 'GET', url: '/api/question/'+id+'/responses'});
  }

  function uploadQuestion(question) {
    return $http({method:'POST', url:'/api/question', data: question});

  }

  return {
    uploadResponse: uploadResponse,
    downloadResponses: downloadResponses,
    uploadQuestion: uploadQuestion
  };
}]);