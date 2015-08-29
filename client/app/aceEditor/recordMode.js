angular.module('fiddio')

.factory('RecordMode', [ '$http', function($http) {

  var _session, _document, _selection;

  var _recording = [];

  function aceLoaded(_editor) {
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;

    _selection.on('changeCursor', updateCursor);
  }

  function updateText(event) {
    console.log('updateText');
    var textMoment = {
      action: event[0].action, // 'Insert'  or 'Delete'
      startR    : event[0].start.row,
      startC    : event[0].start.column,
      endR      : event[0].end.row,
      endC      : event[0].end.column,
      lines     : event[0].lines, // an array - each row is a line of text
      timeStamp : Date.now()
    };
    _recording.pop(); // pop redundant cursor change
    _recording.push(textMoment); // then push to an array
  }

  function updateCursor(change){
    console.log('updateCursor');
    var cursorPos = _selection.getCursor();
    var range = _selection.getRange();
    var cursorAction;
    if (range.start.row===range.end.row && range.start.column===range.end.column){
      cursorAction = "cursorChange";
    } else {
      cursorAction = "SelectionChange";
    }
    var cursorMoment = {
      action       : cursorAction,
      cursorPosR   : cursorPos.row,
      cursorPosC   : cursorPos.column,
      selectStartR : range.start.row,
      selectStartC : range.start.column,
      selectEndR   : range.end.row,
      selectEndC   : range.end.column,
      timeStamp    : Date.now()
    };
    _recording.push(cursorMoment); // push to array
  }

  function uploadEditorChanges(){
    console.log('Uploading '+_recording.length+' changes to db');
    // upload array to db

    _recording = [];// clear array
  }

  return {
    aceLoaded: aceLoaded,
    updateText: updateText,
    updateCursor: updateCursor,
    uploadEditorChanges: uploadEditorChanges
  };
}]);