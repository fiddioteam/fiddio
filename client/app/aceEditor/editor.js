angular.module( 'fiddio', [ 'ui.ace' ] )

.controller( 'AceController', [ '$window', 'RecordMode', 'PlaybackMode', function( $window, RecordMode, PlaybackMode) {
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
    RecordMode.stopRecording(RecordMode.getRecordingStatus(),
      function(blob) {
        console.log('blob!!', blob);
        vm.playbackBlob = blob;
      });
    RecordMode.setRecordingStatus(false);
  };
  vm.uploadChanges = function(){
    recording = RecordMode.uploadEditorChanges(RecordMode.getRecordingStatus());
    RecordMode.setEditorText();

  };
  vm.playRecording = function(){
    if (!window.AudioContext) { window.AudioContext = window.webkitAudioContext; }
    vm.playbackCtx = new AudioContext();
    vm.player = new Audio();
    vm.player.src = $window.URL.createObjectURL(vm.playbackBlob);
    vm.playbackCtx.createMediaElementSource(vm.player).connect(vm.playbackCtx.destination);

    vm.player.play();
    PlaybackMode.playActions(recording, vm.playbackCtx);
  };
  vm.setEditorText = RecordMode.setEditorText;

  vm.playbackOptions = PlaybackMode.playbackOptions;

  console.log('GET USER MEDIA?',navigator.getUserMedia);
  console.log('SUCCESS FUNCTION?',RecordMode.success);

}]);
