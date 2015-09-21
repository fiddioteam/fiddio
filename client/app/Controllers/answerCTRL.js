angular.module('fiddio')

.controller('AnswerController', [
  'RecorderFactory',
  'PlayerFactory',
  '$rootScope',
  '$timeout',
  'question',
  function( RecorderFactory, PlayerFactory, $rootScope, $timeout, question) {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

    //vm.hasStartedAnswering = false;
    vm.error = '';
    vm.currentlyRecording = RecorderFactory.getRecordingStatus;
    vm.recordOptions = RecorderFactory.recordOptions;
    vm.question = question.data; // exposes to view-model question data fetched from resolve block
    RecorderFactory.setCode(vm.question.code); // set the ask code in the answer editor

    vm.startRecording = function(){
      RecorderFactory.startRecording().then( function(success) {
        RecorderFactory.setRecordingStatus(true);
        //vm.hasStartedAnswering = true;
      });
    };

    vm.pauseRecording = function() {
      RecorderFactory.pauseRecording();
      RecorderFactory.setRecordingStatus(false);
    };

    vm.submitRecording = function() {
      if (!vm.description || vm.description.length < 5) {
        vm.error = 'Please, enter a description with at least 5 characters.';
      } else if (RecorderFactory.recording.length === 0) {
        vm.error = 'You haven\'t made any changes in the editor.\n' +
        'Please, type out your solution while recording and explaining your answer.';
      } else {
        vm.error = '';
        RecorderFactory.stopRecording()
        .then( function(blob) {
          RecorderFactory.setRecordingStatus(false);
          RecorderFactory.uploadEditorChanges(RecorderFactory.getRecordingStatus(), vm.description);
        });
      }
    };

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
      if (fromState.name === 'answer') {
        if (RecorderFactory.recorder) {
          RecorderFactory.recorder.stop();
        }
      }
    });

    vm.playRecording = PlayerFactory.startPlayback;
    vm.setEditorText = RecorderFactory.setEditorText;
    vm.playbackOptions = PlayerFactory.playbackOptions;
}]);
