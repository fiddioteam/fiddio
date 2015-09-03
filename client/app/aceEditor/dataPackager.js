angular.module('fiddio')

.factory('DataPackager', [ '$http', function($http) {

  var _questionData;

  function uploadQuestion(editorChanges, mp3Blob){
    _questionData = {
      editorChanges: editorChanges,
      mp3Blob: mp3Blob
    };
    // api POST
  }

  function downloadQuestion(){
    // api GET
    return _questionData;
  }

  return {
    uploadQuestion: uploadQuestion,
    downloadQuestion: downloadQuestion
  };
}]);