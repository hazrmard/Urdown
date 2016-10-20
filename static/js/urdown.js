// This sets up an extension object to be passed to showdown.
// The englishBlock extension sets the direction of text within to left-to-right
var englishBlock = function () {
  var myext1 = {
    type: 'lang',
    regex: /[\n\r]+[,|،]{3}([\s\S]+?)[,|،]{3}[\s]*?/gm,
    replace: '<div dir="ltr" class="ltr-div">$1</div>'
  };
  return [myext1];
};

showdown.extensions.englishblock = englishBlock

// setting up the main angular app
var urdown = angular.module('Urdown', ['ng-showdown'])
urdown.config(function($showdownProvider) {
    $showdownProvider.loadExtension('englishblock')
});

urdown.controller('urdownConverter', function($scope, $http) {
    $scope.rawText = ''
    $scope.nightMode = false

    $http.get('./static/placeholder.txt').success(function(response) {
        $scope.placeholder = response
    });
});
