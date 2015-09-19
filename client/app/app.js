angular.module('fiddio', [
  'ui.ace',
  'ui.router',
  'ngFileUpload',
  'angularSoundManager'
  ])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: '../templates/home.html'
  })
  .state('auth', {
    url: '/auth',
    template: '<div ui-view />',
    doNotRedirect: true
  })
  .state('login', {
    url: '/login',
    templateUrl: '../templates/login.html',
    doNotRedirect: true
  })
  .state('logout', {
    url: '/logout',
    templateUrl: '../templates/logout.html',
    doNotRedirect: true,
  })
  .state('browse-questions', {
    url: '/questions',
    templateUrl: '../templates/browseQuestions.html',
    resolve: {
      questions: ['QuestionsData', function(QuestionsData) {
        return QuestionsData.downloadQuestionsData();
      }]
    },
    controller: 'BrowseQuestions as browse'
  })
  .state('ask', {
    url: '/ask',
    authenticate: true,
    templateUrl: '../templates/askQuestion.html',
    controller: 'AskQuestion as ask',
  })
  .state('answer', {
    url: '/question/:questionID/answer',
    authenticate: true,
    templateUrl: '../templates/answerQuestion.html',
    resolve: {
      question: ['QuestionsData','$stateParams', 'DataPackager', function(QuestionsData, $stateParams, DataPackager) {
        return QuestionsData.downloadFullQuestion($stateParams.questionID);
      }]
    },
    controller: 'AnswerController as answer'
  })
  .state('question', {
    url: '/question/:questionID',
    templateUrl: '../templates/questionView.html',
    resolve: {
      question: ['QuestionsData','$stateParams', 'DataPackager', function(QuestionsData, $stateParams, DataPackager) {
        return QuestionsData.downloadFullQuestion($stateParams.questionID);
      }]
    },
    controller: 'QuestionController as qv'
  })
  .state('watch', {
    url: '/question/:questionID/answer/:answerID',
    templateUrl: '../templates/watchAnswer.html',
    resolve: {
      answer: ['AnswerData', '$stateParams', function(AnswerData, $stateParams) {
        return AnswerData.downloadAnswerData($stateParams.answerID);
      }]
    },
    controller: "WatchAnswer as watch"
  })
  .state('faq', {
    url: '/faq',
    templateUrl: '../templates/faq.html'
  })
  .state('about', {
    url: '/about',
    templateUrl: '../templates/about.html'
  });

});
