// adapted from https://github.com/andoulla/angular-video

var directive = function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      source: '=ngModel',
      width: '@',
      height: '@'
    },
    replace: true,
    template: '<div class="anguvideo">' +
            '<iframe class="videoClass" type="text/html" width="{{width}}" height="{{height}}" ng-src="{{url}}" allowfullscreen frameborder="0"></iframe>' +
          '</div>',
    link: function (scope) {
      var youtubeParams = '?autoplay=0&showinfo=0&controls=0',
        embedFriendlyUrl = "",
        urlSections,
        index;

      scope.$watch('source', function (newVal) {
        if (newVal) {
          /*
          * Need to convert the urls into a friendly url that can be embedded and be used in the available online players the services have provided
          * for youtube: src="//www.youtube.com/embed/{{video_id}}"
          * for vimeo: src="http://player.vimeo.com/video/{{video_id}}
          */

          if (newVal.indexOf("vimeo") >= 0) { // Displaying a vimeo video
            if (newVal.indexOf("player.vimeo") >= 0) {
              embedFriendlyUrl = newVal;
            } else {
              embedFriendlyUrl = newVal.replace(/https?:/, "");
              urlSections = embedFriendlyUrl.split(".com/");
              embedFriendlyUrl = embedFriendlyUrl.replace("vimeo", "player.vimeo");
              embedFriendlyUrl = embedFriendlyUrl.replace("/" + urlSections[urlSections.length - 1], "/video/" + urlSections[urlSections.length - 1] + "");
            }
          } else if (newVal.indexOf("youtu.be") >= 0) {

            index = newVal.indexOf(".be/");

            embedFriendlyUrl = newVal.slice(index + 4, newVal.length);
            embedFriendlyUrl = "http://www.youtube.com/embed/" + embedFriendlyUrl + youtubeParams;

          } else if (newVal.indexOf("youtube.com") >= 0) { // displaying a youtube video

            if (newVal.indexOf("embed") >= 0) {
              embedFriendlyUrl = newVal;
            } else {
              embedFriendlyUrl = newVal.replace("/watch?v=", "/embed/");
            }

            embedFriendlyUrl += youtubeParams;
          }

          scope.url = $sce.trustAsResourceUrl(embedFriendlyUrl);
          //console.log("done",  scope.url, embedFriendlyUrl);
        }
      });
    }
  };
};

module.exports = function(angularModule) {
 angularModule.directive('anguvideo', directive);
};
