angular.module('fiddio', ['ui.ace', 'ui.router', 'ngFileUpload'])

  .run(['$rootScope', '$state', '$stateParams', 'UserData',
      function ($rootScope, $state, $stateParams, UserData) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        UserData.loadData();
      }]
  )

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('auth', {
        url: '/auth'
      })
      .state('home', {
        url: '/home',
        templateUrl: '../templates/home.html'
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
        templateUrl: '../templates/submitQuestion.html',
        controller: 'SubmitQuestion as submit'
      })
      .state('answer', {
        url: '/question/:questionID/answer',
        templateUrl: '../templates/recordResponse.html',
        resolve: {
          func: function() { console.log("Inside of answer resolve"); }
        },
        controller: 'AceController as ace'
      })
      .state('question', {
        url: '/question/:questionID',
        templateUrl: '../templates/questionView.html',
        resolve: {
          question: ['QuestionsData','$stateParams', function(QuestionsData, $stateParams) {
            return QuestionsData.downloadFullQuestion($stateParams.questionID);
          }]
        },
        controller: 'QuestionView as qv'
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
