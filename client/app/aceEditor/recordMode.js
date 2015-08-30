angular.module('fiddio')

.factory('RecordMode', [ '$http', function($http) {

  var _aceEditor, _session, _document, _selection;
  var _recording = [];
  var currentlyRecording = false;
  var recordOptions = {
    useWrapMode: true,
    showGutter: true,
    theme: 'solarized_dark',
    mode: 'javascript',
    onLoad: aceLoaded,
    onChange: updateText
  };

  function aceLoaded(_editor) {
    window.aceEd = _editor.env.editor;
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue('',-1);
    _aceEditor.setReadOnly(true);
    // _session.on('change', updateText);
    _selection.on('changeCursor', updateCursor);
  }

  function setEditorText(lines){
    // clear everything
    _aceEditor.setValue('',-1);
    // loop through lines array
    // place each elem(string) on its own line
  }

  function updateText(event) {
    if (!currentlyRecording) { return; }
    console.log('updateText');
    var textMoment = {
      action    : event[0].action, // 'insert'  or 'remove'
      startR    : event[0].start.row,
      startC    : event[0].start.column,
      endR      : event[0].end.row,
      endC      : event[0].end.column,
      lines     : event[0].lines, // an array - each row is a line of text
      timeStamp : Date.now()
    };
    // _recording.pop(); // pop redundant cursor change
    _recording.push(textMoment); // then push to an array
  }

  function updateCursor(event){
    if (!currentlyRecording) { return; }
    console.log('updateCursor', currentlyRecording);
    var cursorPos = _selection.getCursor();
    var range = _selection.getRange();
    var cursorAction;
    if (range.start.row===range.end.row && range.start.column===range.end.column){
      cursorAction = "cursor";
    } else {
      cursorAction = "selection";
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

  function startRecording(currentlyRecording){
    console.log('START', currentlyRecording);
    if (currentlyRecording) { return; }
    _aceEditor.setReadOnly(false);

  }

  function stopRecording(currentlyRecording){
    console.log('STOP', currentlyRecording);
    if (!currentlyRecording) { return; }
    _aceEditor.setReadOnly(true);
  }

  function setRecordingStatus(value){
    currentlyRecording = !!value;
  }

  function getRecordingStatus(){
    return currentlyRecording;
  }

  function uploadEditorChanges(currentlyRecording){
    console.log('upload', currentlyRecording);
    if (currentlyRecording) { return; }
    console.log('Uploading '+_recording.length+' changes to db');
    console.log(_recording);
    // upload array to db
    var result = _recording;
    _recording = [];// clear array
    return result;
  }

  return {
    recordOptions: recordOptions,
    setEditorText: setEditorText,
    startRecording: startRecording,
    stopRecording: stopRecording,
    getRecordingStatus: getRecordingStatus,
    setRecordingStatus: setRecordingStatus,
    uploadEditorChanges: uploadEditorChanges
  };
}]);
