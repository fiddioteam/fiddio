angular.module('fiddio', ['ui.ace', 'ui.router', 'ngFileUpload'])

  .run(['$rootScope', '$state', '$stateParams', 'UserData',
      function ($rootScope, $state, $stateParams, UserData) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //UserData.loadData();
        $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
          console.log('$stateChangeStart, event, toState, toParams, fromState, fromParams', event, toState, toParams, fromState, fromParams);
        });
      }]
  )

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('site', {
        abstract: true,
        template: '<div ui-view />',
        resolve: {
          authenticate: ['Authentication', function(Authentication) {
            console.log('Attempting authentication');
            return Authentication.resolveAuth();
          }]
        },
      })
      // .state('auth', {
      //   url: '/auth',
      //   onEnter: function($rootScope, Authentication){
      //     Authentication.resolveAuth();
      //     //var nextState = UserData.getItem('authRedirect');
      //     //$rootScope.$state.go(nextState);
      //     // $rootScope.$state.go(UserData.getItem('authRedirect'));
      //   }
      // })
      .state('site.home', {
        url: '/home',
        parent: 'site',
        templateUrl: '../templates/home.html'
      })
      .state('site.browse-questions', {
        url: '/questions',
        parent: 'site',
        templateUrl: '../templates/browseQuestions.html',
        resolve: {
          questions: ['QuestionsData', function(QuestionsData) {
            return QuestionsData.downloadQuestionsData();
          }]
        },
        controller: 'BrowseQuestions as browse'
      })
      .state('site.ask', {
        url: '/ask',
        parent: 'site',
        templateUrl: '../templates/askQuestion.html',
        controller: 'AskQuestion as ask'
      })
      .state('site.answer', {
        url: '/question/:questionID/answer',
        parent: 'site',
        templateUrl: '../templates/answerQuestion.html',
        resolve: {
          question: ['QuestionsData','$stateParams', 'DataPackager', function(QuestionsData, $stateParams, DataPackager) {
            return QuestionsData.downloadFullQuestion($stateParams.questionID);
          }]
        },
        controller: 'AnswerController as answer'
      })
      .state('site.question', {
        url: '/question/:questionID',
        parent: 'site',
        templateUrl: '../templates/questionView.html',
        resolve: {
          question: ['QuestionsData','$stateParams', 'DataPackager', function(QuestionsData, $stateParams, DataPackager) {
            return QuestionsData.downloadFullQuestion($stateParams.questionID);
          }]
        },
        controller: 'QuestionController as qv'
      });

  });

// a RESTful factory for retrieving contacts from a .json file
  // .factory('questions', ['$http', function($http) {
  //   var path = 'questions.json';
  //   var questions = $http.get(path).then(function(response) {
  //     return response.data.questions;
  //   });
  //   var factory = {};

  //   factory.all = function() {
  //    return questions;
  //   };

  //   factory.findById = function(id) {
  //     return this.all().then(function(data) {
  //       for (var i = 0; i < data.length; i++) {
  //         if (data[i].id === id) {
  //           return data[i];
  //         }
  //       }
  //     });
  //   };

  //   return factory;
  // }]);
