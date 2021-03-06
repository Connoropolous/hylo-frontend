
// this is put into the global namespace for use by iframes and popups.
//
// iframe: `parent.popupDone(options)`
// popup:  `opener.popupDone(options)`
//
// since this couples the DOM with controller methods, it is being isolated
// in this file.
//
// if you want to add more use cases, define a new value for the 'context'
// key of the options argument, and create a new if-clause. also mention
// in a comment which controller is being called.
//
// don't forget to use $scope.$apply() as necessary in the controller method!
//
window.popupDone = function(opts) {

  if (opts.context == 'linkedin-profile') {
    // controllers/profile/edit.js
    var node = document.querySelector('[ui-view="main"]');
    angular.element(node).scope().finishLinkedinChange(opts.url);

  } else if (opts.context === 'oauth') {
    // controllers/user/{Login,Signup}Ctrl.js
    var node = document.querySelector('.login-signup-dialog');
    angular.element(node).scope().finishThirdPartyAuth(opts.error);
  }

};