angular.module('fiddio')

.factory('PlayerFactory', [ '$window', 'DataPackager','$rootScope', 'angularPlayer', function($window, DataPackager,$rootScope, angularPlayer) {

  var _aceEditor, _session, _document, _selection, _code, _lastIndex, _recording;

  var editorActions = [
    insertText,
    removeText,
    moveCursor
  ]; // list of possible actions on moment objects

  var playbackOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'idle_fingers',
    mode: 'javascript',
    onLoad: aceLoaded
  };

  // creates a listener for change in track progress to allow for seeking while paused
  $rootScope.$on('track:progress', function(event, args){
    if (!angularPlayer.isPlayingStatus()) {
      smashChanges();
    }
  });

  function aceLoaded(_editor){
    _recording = [];
    _lastIndex = 0;
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue(_code,-1);
    _aceEditor.$blockScrolling = Infinity;
    _aceEditor.setOption("showPrintMargin", false);
  }

  // convenience function to set the recording so it can be manipulated from controllers and is available to functions/methods that depend on it
  function setRecording(recording) {
    _recording = recording;
  }

  function playActions(){
    // smallest possible polling interval
    var timeOutSpeed = 5;

    if (!_recording.length) {
      return;
    }
    setTimeout(function(){
      // floors the decimal places off the time position of the recording
      var time = angularPlayer.getPosition()|0;
      var prevIndex = _recording[_lastIndex-1];
      // checks for backwards seeking using previous index marker
      if (prevIndex && prevIndex[1] > time) {
        smashChanges(_recording);
      } else {
        // checks for forward seeking by iterating over _recording and adding the accumulated changes to the editor
        for (; _lastIndex < _recording.length && _recording[_lastIndex][1] <= time; _lastIndex++ ) {
          var timeSlice = _recording[_lastIndex];
          editorActions[timeSlice[0]](timeSlice);
        }
      }
      // sets the editor to ReadOnly while playing to avoid distruption to keystroke events
      if (angularPlayer.isPlayingStatus()) {
        playActions(_recording);
      }
    }, timeOutSpeed);
  }

  // accumulates all editor changes into a single addition to the editor to allow for seeking
  function smashChanges() {
    var time = angularPlayer.getPosition()|0;
    _aceEditor.setValue(_code,-1);
    _recording.some(function(timeSlice, index) {
      if (timeSlice[1] <= time) {
        editorActions[timeSlice[0]](timeSlice);
        _lastIndex = index;
        return false;
      }
      return true; // continue iterating until timeSlice is greater than time
    });
  }

  function setCode(code){
    _code = code;
  }

  function setReadOnly(value){
    _aceEditor.setReadOnly(value);
  }

  function insertText(textObj){
    _document.insert({
      row: textObj[2],
      column: textObj[3]
    }, textObj[6].join('\n'));
  }

  function removeText(textObj){
    _document.remove({
      start: {
        row: textObj[2],
        column: textObj[3]
      }, end: {
        row: textObj[4],
        column: textObj[5]
      }
    });
  }

  function moveCursor(cursorObj){
    _selection.setSelectionRange({
      start: {
        row: cursorObj[4],
        column: cursorObj[5]
      }, end: {
        row: cursorObj[6],
        column: cursorObj[7]
      }
    }, cursorObj[3] === cursorObj[5]);
    _selection.moveCursorToPosition({
      row: cursorObj[2],
      column: cursorObj[3]
    });
  }

  return {
    playbackOptions: playbackOptions,
    playActions: playActions,
    setCode: setCode,
    smashChanges: smashChanges,
    setReadOnly: setReadOnly,
    setRecording: setRecording
  };

}]);