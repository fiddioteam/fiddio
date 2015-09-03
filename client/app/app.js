angular.module( 'fiddio', [ 'ui.ace', 'ui.router' ] )
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '../templates/home.html'
      })
      .state('browse-questions', {
        url: '/questions',
        templateUrl: '../templates/browseQuestions.html',
        controller: 'BrowseQuestions'
      })
      .state('browse-questions.question', {
        url: '/questions/:id',
        templateUrl: '../templates/questionView.html',
        controller: 'QuestionView as question'
      })
      .state('submit-question', {
        url: '/ask',
        templateUrl: '../templates/submitQuestion.html',
        controller: 'SubmitQuestion as submit'
      })
      .state('record-response', {
        url: '/answer',
        templateUrl: '../templates/recordResponse.html',
        controller: 'AceController as ace'
      });

  });
