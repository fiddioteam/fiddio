angular.module( 'fiddio', [ 'ui.ace' ] )

.controller( 'AceController', [ 'RecordMode', 'PlaybackMode', function(RecordMode, PlaybackMode) {
  var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

  var recording;

  vm.currentlyRecording = RecordMode.getRecordingStatus;
  vm.recordOptions = RecordMode.recordOptions;
  vm.startRecording = function(){
    // RecordMode.startRecording(RecordMode.getRecordingStatus());
    RecordMode.startRecording().then(function(success){
      RecordMode.setRecordingStatus(success);
    });

    // RecordMode.setRecordingStatus(true);
    console.log('started recording...');
  };
  vm.stopRecording = function(){
    RecordMode.stopRecording(RecordMode.getRecordingStatus());
    RecordMode.setRecordingStatus(false);
  };
  vm.uploadChanges = function(){
    recording = RecordMode.uploadEditorChanges(RecordMode.getRecordingStatus());
    RecordMode.setEditorText();

  };
  vm.playRecording = function(){
    PlaybackMode.playActions(recording);
  };
  vm.setEditorText = RecordMode.setEditorText;

  vm.playbackOptions = PlaybackMode.playbackOptions;

  console.log('GET USER MEDIA?',navigator.getUserMedia);
  console.log('SUCCESS FUNCTION?',RecordMode.success);

}]);
