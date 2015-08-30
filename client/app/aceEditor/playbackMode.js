angular.module('fiddio')

.factory('PlaybackMode', [ '$http', function($http) {

  var _session, _document, _selection;

  var _recording = [];

  var editorActions = {
    insert: insertText,
    remove: removeText,
    cursor: moveCursor,
    selection: highlightText
  }; // list of possible actions on moment objects

  var playbackOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_light',
    mode: 'javascript',
    onLoad: aceLoaded,
    onChange: function(){}
  };
  function aceLoaded(_editor){
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    console.log('playback selection', _selection)


  }
  function play(recording){
    // start/sync mp3 and start Editor action loop
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
  function queueEditorAction(dummyRecording){
    _recording = dummyRecording || []; // change later
    // shift obj from queue
    var nextAction = _recording.shift();
    // decide action type, then act accordingly
    setTimeout(editorActions[nextAction.action](nextAction),50);
  }
  function insertText(textObj){
    // parse text object and add lines onto editor
    // _document.insertFullLines(textObj.startR, textObj.lines);
    var position;
    for (var i=textObj.startR; i<=textObj.endR; i++){
      position = {
        row: i,
        column: i === textObj.startR ? textObj.startC : 0
      };
      _document.insert(position, textObj.lines[0]); // for loop later
    }
  }
  function removeText(textObj){
    // parse text object and remove lines from editor
    var range = {
      start: {
        row: textObj.startR,
        column: textObj.startC
      },
      end: {
        row: textObj.endR,
        column: textObj.endC
      }
    }; // creates the range object that _document.remove expects
    _document.remove(range);
  }
  function highlightText(cursorObj){
    // parse cursor object and update text selection
    var range = {
      start: {
        row: cursorObj.selectStartR,
        column: cursorObj.selectStartC
      },
      end: {
        row: cursorObj.selectEndR,
        column: cursorObj.selectEndC
      }
    };
    _selection.setSelectionRange(range, false); // Boolean sets whether highlight direction is reversed
    // if hightlight selections are off on playback, return to this Boolean value
    moveCursor(cursorObj);
  }
  function moveCursor(cursorObj){
    // parse cursor object and move cursor to indicated area
    var position = {
      row: cursorObj.cursorPosR,
      column: cursorObj.cursorPosC
    };
    _selection.moveCursorToPosition(position);
  }
  function leaveComment(){
    // make sure player is paused and leave text at video timestamp
  }


  return {
    playbackOptions: playbackOptions,
    queueEditorAction: queueEditorAction,
    play: play
  }
}]);