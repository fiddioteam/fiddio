angular.module('fiddio')

.controller('AnswerController', [
  'RecorderFactory',
  'PlayerFactory',
  '$rootScope',
  'question',
  function( RecorderFactory, PlayerFactory, $rootScope, question) {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

    vm.hasStartedAnswering = false;
    vm.currentlyRecording = RecorderFactory.getRecordingStatus;
    vm.recordOptions = RecorderFactory.recordOptions;
    vm.question = question.data; // exposes to view-model question data fetched from resolve block
    RecorderFactory.setCode(vm.question.code); // set the ask code in the answer editor

    vm.startRecording = function(){
      RecorderFactory.startRecording().then( function(success) {
        RecorderFactory.setRecordingStatus(true);
        vm.hasStartedAnswering = true;
      });
    };

    vm.pauseRecording = function() {
      RecorderFactory.pauseRecording();
      RecorderFactory.setRecordingStatus(false);
    };

    vm.submitRecording = function() {
      RecorderFactory.stopRecording(RecorderFactory.getRecordingStatus())
      .then( function(blob) {
        RecorderFactory.setRecordingStatus(false);
        RecorderFactory.uploadEditorChanges(RecorderFactory.getRecordingStatus(), vm.description);
      });
    };

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
      if (fromState.name === 'answer') {
        console.log('RecorderFactory', RecorderFactory);
        RecorderFactory.recorder.stop();
      }
    });

    vm.playRecording = PlayerFactory.startPlayback;
    vm.setEditorText = RecorderFactory.setEditorText;
    vm.playbackOptions = PlayerFactory.playbackOptions;
}]);
