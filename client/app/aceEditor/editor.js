angular.module( 'fiddio', [ 'ui.ace' ] )

  .controller( 'AceController', [ 'RecordMode', function(RecordMode) {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

    vm.editorOptions = { // ui-ace provides access to some config options
      useWrapMode: true,
      showGutter: true,
      theme: 'solarized_dark',
      mode: 'javascript',
      onLoad: RecordMode.aceLoaded,
      onChange: RecordMode.updateText
    }; // other options must be set with a function; see API docs

    vm.uploadChanges = RecordMode.uploadEditorChanges;
  }]);
