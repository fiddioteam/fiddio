angular.module('fiddio')

.factory('DataPackager', [ '$http', function($http) {

  var _responseData;

  function uploadResponse(editorChanges, mp3Blob, blobLength){
    _responseData = {
      editorChanges: editorChanges,
      mp3Blob: mp3Blob,
      blobLength: blobLength
    };
    // api POST
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