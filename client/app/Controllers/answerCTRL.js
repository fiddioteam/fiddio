angular.module('fiddio')

.controller( 'AnswerController', [ 'RecorderFactory', 'PlayerFactory', '$rootScope', 'question', function( RecorderFactory, PlayerFactory, $rootScope, question) {
  var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

  vm.currentlyRecording = RecorderFactory.getRecordingStatus;
  vm.recordOptions = RecorderFactory.recordOptions;
  vm.question = question.data; // exposes to view-model question data fetched from resolve block
  RecorderFactory.setCode(vm.question.code); // set the ask code in the answer editor

  vm.startRecording = function(){
    RecorderFactory.startRecording().then(function(success){
      RecorderFactory.setRecordingStatus(true);
    });
  };

  vm.pauseRecording = function(){
    RecorderFactory.pauseRecording();
    RecorderFactory.setRecordingStatus(false);
  };

  vm.stopRecording = function(){
    RecorderFactory.stopRecording(RecorderFactory.getRecordingStatus())
    .then(function(blob) {
      RecorderFactory.setRecordingStatus(false);
    });
  };

  vm.uploadChanges = function(){
    RecorderFactory.uploadEditorChanges(RecorderFactory.getRecordingStatus());
  };


  vm.playRecording = PlayerFactory.startPlayback;
  vm.setEditorText = RecorderFactory.setEditorText;

  vm.playbackOptions = PlayerFactory.playbackOptions;

  }]);
