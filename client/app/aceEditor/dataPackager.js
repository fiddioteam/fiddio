angular.module('fiddio')

.factory('DataPackager', [ '$http', 'Upload', '$timeout', '$rootScope', function($http, Upload, $timeout, $rootScope) {

  var _responseData;

  function uploadResponse(code, editorChanges, mp3Blob, blobLength){
    _responseData = {
      code_changes: editorChanges,
      //mp3Blob: mp3Blob,
      duration: blobLength,
      code: code,
      question_id: $rootScope.$stateParams.questionID
    };

    Upload.upload({
      url: '/api/response',
      method: 'POST',
      //headers: {},
      fields: _responseData,
      file: mp3Blob,
      fileFormDataName: 'response'
    })
    .then( function(res) {
      $timeout( function() {
        $rootScope.$state.go('response', { responseId: res.data.id });
      });
    }, function(res) {
      if (res.status > 0) { $scope.errorMsg = res.status + ': ' + res.data; }
    });
  }

  function downloadResponse(){
    // api GET
    return _responseData;
  }

  function uploadQuestion(question) {
    // api POST
    console.log("Inside DataPackager uploadQuestion method", question);
  }

  return {
    uploadResponse: uploadResponse,
    downloadResponse: downloadResponse,
    uploadQuestion: uploadQuestion
  };
}]);