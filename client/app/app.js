angular.module( 'fiddio', [ 'ui.ace' ] )

  .controller( 'AceController', [ function() {
    var vm = this; // initializes the view-model var (`vm`) for use in the controllerAs syntax

    vm.editorOptions = { // ui-ace provides access to some config options
      useWrapMode: true,
      showGutter: false,
      theme: 'solarized_dark',
      mode: 'javascript',
      firstLineNumber: 1,
      onLoad: vm.aceLoaded,
      onChange: vm.aceChanged
    }; // other options must be set with a function; see API docs

    vm.aceLoaded = function( _editor ) {
      // ...
    };

    vm.aceChanged = function( e ) {
      // ...
    };

  }]);