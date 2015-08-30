angular.module( 'fiddio', [ 'ui.ace' ] )

  .controller( 'AceController', [ 'RecordMode', 'PlaybackMode', function(RecordMode, PlaybackMode) {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax
    console.log(RecordMode);
    console.log(PlaybackMode);

    var recording;

    vm.currentlyRecording = RecordMode.getRecordingStatus;
    vm.recordOptions = RecordMode.recordOptions;
    vm.startRecording = function(){
      RecordMode.startRecording(RecordMode.getRecordingStatus());
      RecordMode.setRecordingStatus(true);
    }
    vm.stopRecording = function(){
      RecordMode.stopRecording(RecordMode.getRecordingStatus());
      RecordMode.setRecordingStatus(false);
    }
    vm.uploadChanges = function(){
      recording = RecordMode.uploadEditorChanges(RecordMode.getRecordingStatus());
      RecordMode.setEditorText();

    };
    vm.queueAction = function(){
      PlaybackMode.queueEditorAction(recording);
    }
    vm.setEditorText = RecordMode.setEditorText;

    vm.playbackOptions = PlaybackMode.playbackOptions;

  }]);
