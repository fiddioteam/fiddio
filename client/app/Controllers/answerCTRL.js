angular.module('fiddio')

.controller( 'AnswerController', [ 'RecorderFactory', 'PlayerFactory', '$rootScope', function( RecorderFactory, PlayerFactory, $rootScope) {
  var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

  vm.currentlyRecording = RecorderFactory.getRecordingStatus;
  vm.recordOptions = RecorderFactory.recordOptions;
  vm.startRecording = function(){
    RecorderFactory.startRecording().then(function(success){
      RecorderFactory.setRecordingStatus(true);
    });
  };
  vm.stopRecording = function(){
    RecorderFactory.stopRecording(RecorderFactory.getRecordingStatus())
    .then(function(blob) {
      RecorderFactory.setRecordingStatus(false);
    });
  };
  vm.uploadChanges = function(){
    RecorderFactory.uploadEditorChanges(RecorderFactory.getRecordingStatus());
    // console.log($rootScope.$stateParams);
  };
  vm.playRecording = PlayerFactory.startPlayback;
  vm.setEditorText = RecorderFactory.setEditorText;

  vm.playbackOptions = PlayerFactory.playbackOptions;

  }]);
