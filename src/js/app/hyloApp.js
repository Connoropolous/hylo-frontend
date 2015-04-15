require('./auth_module');
require('./directives');
require('./controllers');
require('./services');

var dependencies = [
  'angular-growl',
  'angulartics',
  'angulartics.segment.io',
  'http-auth-interceptor',
  'hylo-auth-module',
  'hyloControllers',
  'hyloDirectives',
  'hyloServices',
  'infinite-scroll',
  'mentio',
  'newrelic-timing',
  'ngAnimate',
  'ngIdle',
  'ngResource',
  'ngSanitize',
  'ngTagsInput',
  'ngTouch',
  'ui.bootstrap',
  'ui.router'
];

if (hyloEnv.environment == 'test') {
  dependencies.push('ngMock');
  dependencies.push('ngMockE2E');
  dependencies.push('ngAnimateMock');
}

var app = angular.module('hyloApp', dependencies);

require('./routes')(app);
require('./animations')(app);
require('./filters')(app);
require('./features/mentions/userMentions')(app);
require('./services/removeTrailingSlash')(app);
require('./services/myHttpInterceptor')(app);

app.factory('$exceptionHandler', function ($log) {
  return function (exception, cause) {
    if (!hyloEnv.isProd) {
      throw exception;
    }

    try {
      // Pass off the error to the default error handler
      // on the AngularJS logger. This will output the
      // error to the console (and let the application
      // keep running normally for the user).
      $log.error.apply($log, arguments);
      Rollbar.error(exception);
    } catch (loggingError) {
      // For Developers - log the log-failure.
      $log.warn("Error logging failed");
      $log.log(loggingError);
    }
  };
});

app.config(function ($locationProvider, growlProvider, $idleProvider) {
  $locationProvider.html5Mode(true);
  growlProvider.globalTimeToLive(5000);

  $idleProvider.idleDuration(45); // in seconds
  $idleProvider.warningDuration(1); // in seconds
});

app.run(function($rootScope, $state, Community, growl, $bodyClass, clickthroughTracker) {

  clickthroughTracker.track(location);

  $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error) {
      if (!hyloEnv.isProd) {
        console.error("$stateChangeError", event, toState, toParams, fromState, fromParams, error);
      } else {
        Rollbar.error("$stateChangeError", {
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams,
          error: error
        });
        growl.addErrorMessage("Oops! An error occurred. The Hylo team has been notified. (SCE)", {ttl: 5000});
      }
    }
  );

  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    if (!$rootScope.community) {
      $rootScope.community = Community.default();
    }
  });

  // Set a variable so we can watch for param changes
  $rootScope.$state = $state;
  $rootScope.$bodyClass = $bodyClass;

});
