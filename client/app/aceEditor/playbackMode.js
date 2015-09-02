angular.module('fiddio')

.factory('PlaybackMode', [ '$http', function($http) {

  var _aceEditor, _session, _document, _selection;

  var _recording = [];

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
  function aceLoaded(_editor){
    window.aceEd = _editor.env.editor;
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue('',-1);
    _aceEditor.$blockScrolling = Infinity;
  }
  function playActions(recording,time){
    time = time || 0;
    var timeOutSpeed = 5;
    // start/sync mp3 and start Editor action loop
    if (!recording.length){return;}
    setTimeout(function(){
      if (recording[0][1] <= time) {
        var timeSlice = recording.shift();
        editorActions[timeSlice[0]](timeSlice);
      }

      playActions(recording, time+=timeOutSpeed);
    },timeOutSpeed);
  }
  function pause(){
    // pause mp3 and Editor action loop
  }
  function reset(){
    // restart mp3 and start Editor action loop
  }

  function downloadRecording(dummyRecording){
    _recording = dummyRecording || []; // change later
    // api call
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
    playActions: playActions
  };
}]);