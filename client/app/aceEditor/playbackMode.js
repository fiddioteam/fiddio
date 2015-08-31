angular.module('fiddio')

.factory('PlaybackMode', [ '$http', function($http) {

  var _aceEditor, _session, _document, _selection;

  var _recording = [];

  var editorActions = [
    insertText,
    removeText,
    moveCursor,
    highlightText
  ]; // list of possible actions on moment objects

  var playbackOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_light',
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
  }
  function playActions(recording,prevTime){
    // start/sync mp3 and start Editor action loop
    if (!recording.length){return;}
    var timeSlice = recording.shift();
    prevTime = prevTime || timeSlice[1];
    setTimeout(function(){
      editorActions[timeSlice[0]](timeSlice);
      playActions(recording, timeSlice[1]);
    },Math.max(0,timeSlice[1]-prevTime-10));
  }
  function pause(){
    // pause mp3 and Editor action loop
  }
  function reset(){
    // restart mp3 and start Editor action loop
  }

  function downloadRecording(dummyRecording){
    _recording = dummyRecording || []; // change later
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
      },
      end: {
        row: textObj[4],
        column: textObj[5]
      }
    });
  }

  function highlightText(cursorObj){
    _selection.setSelectionRange({
      start: {
        row: cursorObj[4],
        column: cursorObj[5]
      },
      end: {
        row: cursorObj[6],
        column: cursorObj[7]
      }
    }, false);
    moveCursor(cursorObj);
  }

  function moveCursor(cursorObj){
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
  }
}]);