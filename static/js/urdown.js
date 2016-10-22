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
urdown.controller('urdownConverter', function($scope, $http, $location, $window) {
    $scope.rawText = ''
    $scope.nightMode = false
    $scope.editMode = true
    $scope.showOpenPrompt = false
    $scope.showHTMLPrompt = false
    $scope.outHTML = ''

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

    // loads a markdown file using the src query parameter
    // called automatically when $location.search().src changes
    // this way a link to the site can automatically initialize it with data
    $scope.loadMarkdown = function() {
        if ($location.search().src!=undefined) {
            $scope.getMarkdown($location.search().src)
        } else {                                 // else .src==undefined:
            $scope.rawText = ''                  // reset content.
        }
    };

    // sends a get request to path and loads markdown
    // called when manually loading markdown from a web address
    $scope.getMarkdown = function(path) {
        if (path!=undefined) {
            $http({
                method: 'GET',
                url: path
            }).then(function(response) {         // successful request:
                $scope.rawText = response.data   // set content.
            }, function(response) {              // error:
                $scope.rawText = ''              // reset content.
            });
        }
    }

    // reads markdown from disk
    $scope.readMarkdown = function() {
        var reader = new FileReader()
        reader.onload = function(e) {
            $scope.$apply(function() {
                $scope.rawText = reader.result
            });
        };
        reader.onerror = function(e) {
            console.log('Error reading file.')
        }

        var f = document.getElementById('fileinput').files[0]
        reader.readAsText(f)
        $scope.showOpenPrompt = false
    }

    // loads settings from URL
    $scope.loadSettings = function() {
        if ($location.search().nightMode!=undefined) {
            $scope.nightMode = ($location.search().nightMode=='true') ? true : false
        }
        if ($location.search().editMode!=undefined) {
            $scope.editMode = ($location.search().editMode=='true') ? true : false
        }
    };

    // save markdown as plain text
    $scope.saveMarkdown = function() {
        var b = new Blob([$scope.rawText], {type: "text/plain;charset=utf-8"})
        saveAs(b, 'urdown.md')   // from FileSaver.js
    }

    // opens the print dialog where output can be saved as pdf
    $scope.printOutput = function() {
        $window.print()
    }

    // shows the html content (w/ style attributes) of output
    $scope.showHTML = function() {
        var out = document.getElementById("output_outer").innerHTML
        $http({
            method: 'GET',
            url: './static/css/output.css'
        }).then(function(response) {         // successful request:
            $scope.outHTML = '<div id="output_outer"><style scoped>'+response.data+
                '</style>'+out+'</div>'
        }, function(response) {              // error:
            console.log('Could not load CSS file')
        });
    }

    // resets document
    $scope.newMarkdown = function() {
        if ($location.search().src!=undefined) {
            $location.search('src',null)
        } else {
            $scope.rawText = ''
        }
    }

    // checks /#?query=params for changes, and reloads markdown
    $scope.$watch(function() {
        return $location.search()
    }, function(x) {
        $scope.loadMarkdown()
        $scope.loadSettings()
    });

});
