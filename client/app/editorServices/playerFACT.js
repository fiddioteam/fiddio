angular.module('fiddio')

.factory('PlayerFactory', [ '$window', 'DataPackager','$rootScope', 'angularPlayer', function($window, DataPackager,$rootScope, angularPlayer) {

  var _aceEditor, _session, _document, _selection, _playbackContext, _player, _responseData, _code, _lastIndex = 0, _recording;

  var editorActions = [
    insertText,
    removeText,
    moveCursor
  ]; // list of possible actions on moment objects

  var playbackOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_dark',
    mode: 'javascript',
    onLoad: aceLoaded
  };

  $rootScope.$on('track:progress', function(event, args){
    if (!angularPlayer.isPlayingStatus()) {
      smashChanges();
    }

  });
  function aceLoaded(_editor){
    window.aceEd = _editor.env.editor;
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue(_code,-1);
    _aceEditor.$blockScrolling = Infinity;
    _aceEditor.setOption("showPrintMargin", false);
  }

  function setRecording(recording) {
    _recording = recording;
  }

  function playActions(){
    var timeOutSpeed = 5;
    if (!_recording.length) {
      return;
    }
    setTimeout(function(){
      var time = angularPlayer.getPosition()|0;
      var prevIndex = _recording[_lastIndex-1];
      if (prevIndex && prevIndex[1] > time) {
        smashChanges(_recording);
      } else {
        for (; _lastIndex < _recording.length && _recording[_lastIndex][1] <= time; _lastIndex++ ) {
          var timeSlice = _recording[_lastIndex];
          editorActions[timeSlice[0]](timeSlice);
        }
      }
      if (angularPlayer.isPlayingStatus()) {
        playActions(_recording);
      }
    }, timeOutSpeed);
  }

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

  function leaveComment(){
    // make sure player is paused and leave text at video timestamp
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