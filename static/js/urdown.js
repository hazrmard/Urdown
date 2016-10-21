// This sets up an extension object to be passed to showdown.
// The englishBlock extension sets the direction of text within to left-to-right
var englishBlock = function (sd) {
    return function() {
        var myext1 = {
          type: 'lang',
          regex: /[\n\r]+?[,|،]{3}([\s\S]+?)[\n\r]+[,|،]{3}[\s]+?/gm,
          replace: function(match, capture) {
              return '\n<div dir="ltr" class="ltr_div">'+sd.makeHtml(capture)+'</div>\n';
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

// setting up controller
urdown.controller('urdownConverter', function($scope, $http, $location) {
    $scope.rawText = ''
    $scope.nightMode = false
    $scope.editMode = true

    // restores unintentional residual scroll during read mode
    $scope.restoreContainer = function() {
            if ($scope.editMode) {
                document.getElementById('data_container').scrollTop = 0;
            }
        }

    // load placeholder text to be rendered
    $http.get('./static/placeholder.txt').success(function(response) {
        $scope.placeholder = response
    });

    // loads a markdown file using a GET request
    $scope.loadMarkdown = function() {
        if ($location.search().src!=undefined) {
            $http({
                method: 'GET',
                url: $location.search().src
            }).then(function(response) {         // successful request:
                $scope.rawText = response.data   // set content.
            }, function(response) {              // error:
                $scope.rawText = ''              // reset content.
            });
        } else {                                 // else .src==undefined:
            $scope.rawText = ''                  // reset content.
        }
    };

    // loads settings from URL
    $scope.loadSettings = function() {
        if ($location.search().nightMode!=undefined) {
            $scope.nightMode = ($location.search().nightMode=='true') ? true : false
        }
        if ($location.search().editMode!=undefined) {
            $scope.editMode = ($location.search().editMode=='true') ? true : false
        }
    };

    // checks /#?query=params for changes, and reloads markdown
    $scope.$watch(function() {
        return $location.search()
    }, function(x) {
        $scope.loadMarkdown()
        $scope.loadSettings()
    });

});
