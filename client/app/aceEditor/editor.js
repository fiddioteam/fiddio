angular.module( 'fiddio', [ 'ui.ace' ] )

  .controller( 'AceController', [ 'RecordMode', function(RecordMode) {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax
    console.log(RecordMode);

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
      RecordMode.uploadEditorChanges(RecordMode.getRecordingStatus());
    };
    vm.setEditorText = RecordMode.setEditorText;

    // vm.playbackOptions 

  }]);
