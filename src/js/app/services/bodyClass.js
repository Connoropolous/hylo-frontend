// generate a list of classes to add to the body tag,
// based on the current ui-router state
//
// add the state name, but also the parent's name if
// the state is a sub-view
//

var extractClassName = function(stateName) {
  if (stateName.match(/\./)) {
    return [stateName.split('.', 1)[0], stateName.replace(/\./g, '-')];
  }

  return stateName;
};

module.exports = function(angularModule) {
  angularModule.factory('$bodyClass', function($state) {
    return function() {
      return extractClassName($state.current.name);
    };
  });
};
