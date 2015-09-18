angular.module('fiddio', [
  'ui.ace',
  'ui.router',
  'ngFileUpload',
  'angularSoundManager'
  ])

  .run(['$rootScope', '$state', '$stateParams', '$window', 'Authentication', 'UserData',
      function ($rootScope, $state, $stateParams, $window, Authentication, UserData) {
        $rootScope.userData = UserData;

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        Authentication.loadAuth();

        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {

          $rootScope.toState = toState;
          $rootScope.toStateParams = toStateParams;
          $rootScope.fromState = fromState;
          $rootScope.fromStateParams = fromStateParams;

          var authenticated = $rootScope.userData.authenticated;

          if(!authenticated) {
            if ($rootScope.toState.authenticate) { event.preventDefault(); }

            Authentication.checkAuth()
            .then(function(response){
              if(!response.data.authenticated) {

                if($rootScope.toState.doNotRedirect) { // Login, auth, or logout
                  if ( $rootScope.toState.name === 'login' ) { // Automatically attempt to authenticate if possible
                    var profileId = Authentication.getProfileId();
                    if (profileId) { $window.location.href = '/api/' + profileId; }
                  }
                } else {
                  // executes only when doNotRedirect is undefined, which it is for all unauthed states
                  $rootScope.userData.setItem('authRedirect', $rootScope.toState.name);
                  $rootScope.userData.setItem('authRedirect_params', $rootScope.toStateParams);
                }

                if ($rootScope.toState.authenticate) { // executes when authenticate flag is true, which is it for authed states ('ask', 'answer')
                  $rootScope.$state.go('login');
                }

              } else if ($rootScope.toState.doNotRedirect) {
                var redirect = $rootScope.userData.getItem('authRedirect');
                var redirect_params = $rootScope.userData.getItem('authRedirect_params');
                if (redirect) {
                  $rootScope.$state.go(redirect, redirect_params);
                } else { $rootScope.$state.go('home'); }
              }
            },
            function(response){
              console.log("Error in authentication check ", response);
            });
          }

        }); // end of $rootScope.$on

      }]
  )

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
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
      .state('logout', {
        url: '/logout',
        templateUrl: '../templates/logout.html',
        doNotRedirect: true,
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
