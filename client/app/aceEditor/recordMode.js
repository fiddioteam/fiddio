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
  };

  function aceLoaded(_editor) {
    _aceEditor = _editor.env.editor;
    _session = _editor.getSession();
    _document = _session.getDocument();
    _selection = _session.selection;
    _aceEditor.setValue('',-1);
    _aceEditor.setReadOnly(true);
    _session.on('change', updateText);
    _selection.on('changeCursor', updateCursor);
  }

  function setEditorText(lines){
    // clear everything
    _aceEditor.setValue('',-1);
    // insert lines.join('\n')
  }

  function updateText(event) {
    if (!currentlyRecording) { return; }
    if (event.action === 'insert')
      { var action = 0; } else { var action = 1; }
    _recording.push([
      action, // 'insert-0'  or 'remove-1'
      Date.now(),
      event.start.row,
      event.start.column,
      event.end.row,
      event.end.column,
      event.lines
    ]); // then push to an array
  }

  function updateCursor(event){
    if (!currentlyRecording) { return; }
    var cursorPos = _selection.getCursor();
    var range = _selection.getRange();
    var cursorAction;
    if (range.start.row===range.end.row && range.start.column===range.end.column)
      { cursorAction = 2; } else { cursorAction = 3; }
    _recording.push([
      cursorAction, // "cursor-2" or "selection-3"
      Date.now(),
      cursorPos.row,
      cursorPos.column,
      range.start.row,
      range.start.column,
      range.end.row,
      range.end.column
    ]); // push to array
  }

  function startRecording(currentlyRecording){
    if (currentlyRecording) { return; }
    _aceEditor.setReadOnly(false);

  }

  function stopRecording(currentlyRecording){
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
