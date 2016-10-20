// This sets up an extension object to be passed to showdown.
// The englishBlock extension sets the direction of text within to left-to-right
var englishBlock = function (sd) {
    return function() {
        var myext1 = {
          type: 'lang',
          regex: /[\n\r]+?[,|،]{3}([\s\S]+?)[\n\r]+[,|،]{3}[\s]+?/gm,
          replace: function(match, capture) {
              return '\n<div dir="ltr" class="ltr-div">'+sd.makeHtml(capture)+'</div>\n';
          }
        };
        return [myext1];
    }
};

showdown.extensions.englishblock = englishBlock(new showdown.Converter())

// setting up the main angular app
var urdown = angular.module('Urdown', ['ng-showdown'])
urdown.config(function($showdownProvider) {
    $showdownProvider.loadExtension('englishblock')
});

urdown.controller('urdownConverter', function($scope, $http) {
    $scope.rawText = ''
    $scope.nightMode = false
    $scope.editMode = true

    // restores unintentional residual scroll during read mode
    $scope.restoreContainer = function() {
            if ($scope.editMode) {
                document.getElementById('data_container').scrollTop = 0;
            }
        }

    $http.get('./static/placeholder.txt').success(function(response) {
        $scope.placeholder = response
    });
});
