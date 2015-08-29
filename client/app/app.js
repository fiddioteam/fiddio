angular.module( 'fiddio', [ 'ui.ace' ] )

  .controller( 'AceController', [ function() {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

    var _session, _document, _selection;

    vm.aceLoaded = function(_editor) {
      _session = _editor.getSession();
      _document = _session.getDocument();
      _selection = _session.selection;

      _selection.on('changeCursor', changeCursorHandler);
    };

    vm.aceChanged = function(event) {
      var textMoment = {
        action: event[0].action,
        startR    : event[0].start.row,
        startC    : event[0].start.column,
        endR      : event[0].end.row,
        endC      : event[0].end.column,
        lines     : event[0].lines, // an array - each row is a line of text
        timeStamp : Date.now()
      };
      // pop redundant cursor change
      // then push to an array

    };

    vm.editorOptions = { // ui-ace provides access to some config options
      useWrapMode: true,
      showGutter: true,
      theme: 'solarized_dark',
      mode: 'javascript',
      firstLineNumber: 1,
      onLoad: vm.aceLoaded,
      onChange: vm.aceChanged
    }; // other options must be set with a function; see API docs

    function changeCursorHandler(change){
      var cursorPos = _selection.getCursor();
      var range = _selection.getRange();

      var cursorMoment = {
        action       : (range.start.row===range.end.row && range.start.column===range.end.column)
                         ? "cursorChange" : "SelectionChange",
        cursorPosR   : cursorPos.row,
        cursorPosC   : cursorPos.column,
        selectStartR : range.start.row,
        selectStartC : range.start.column,
        selectEndR   : range.end.row,
        selectEndC   : range.end.column,
        timeStamp    : Date.now()
      };
      // push to array

    };
  }]);
