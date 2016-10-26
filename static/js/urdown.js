OPPOSITE_DIR = 'ltr'
// This sets up an extension object to be passed to showdown.
// The englishBlock extension sets the direction of text within to left-to-right
// myext1 wraps english text with %% markers, and lets the inner text be
// formatted as usual
// myext2 escapes 3 instances of comma characters
// myext3 converts %% wrapped text into left-to-right div
var oppositeBlock = function () {  // sd is now redundant
    var myext1 = {
      type: 'lang',
      regex: /[\n\r]+?[,|،]{3}([\s\S]+?)[\n\r]+[,|،]{3}[\s]+?/gm,
      replace: '%ENGBLOCKSTART%\n$1\n%ENGBLOCKEND%'
    };

    var myext2 = {
      type: 'output',
      regex: /\\([,|،]{3})/gm,
      replace: '$1'
    };

    var myext3 = {
        type: 'output',
        regex: /%ENGBLOCKSTART%([\s\S]+?)%ENGBLOCKEND%/gm,
        replace: function(match, capture) {
            return '\n<div dir="'+OPPOSITE_DIR+'" class="opp_dir_div '+OPPOSITE_DIR+'_div">'+capture+'</div>\n'
        }
    }
    return [myext1, myext2, myext3];
};

showdown.extensions.oppositeblock = oppositeBlock

// setting up the main angular app
var urdown = angular.module('Urdown', ['ng-showdown'])
urdown.config(function($showdownProvider) {
    $showdownProvider.loadExtension('oppositeblock')
});

// setting up controller
urdown.controller('urdownConverter', function($scope, $http, $location, $window, $showdown) {
    $scope.rawText = ''                 // contains whatever is in textarea
    $scope.nightMode = false            // control for .night style
    $scope.editMode = true              // show textarea or not
    $scope.showOpenPrompt = false       // prompt div shows open relevant content
    $scope.showHTMLPrompt = false       // prompt div shows HTML output content
    $scope.showOppDirPrompt = false     // prompt div shows opp dir text input
    $scope.defaultDir = 'rtl'
    $scope.outHTML = ''                 // HTML output shown through HTML button (includes style)
    $scope.uiLang = {'label':'اُردو', 'value': 'urdu'}
    $scope.uiLangs = [
                        {'label':'اُردو', 'value': 'urdu'},         // index 0
                        {'label': 'English', 'value':'english'}    // index 1
                    ]



    // checks /#?query=params for changes, and reloads markdown
    $scope.$watch(function() {
        return $location.search()
    }, function(x) {
        $scope.loadMarkdown()
        $scope.loadSettings()
    });

    // loads ui elements
    $scope.loadUI = function() {
        $http({
            method: 'GET',
            url: './static/ui/' + $scope.uiLang.value + '.json'
        }).then(function(response) {
            $scope.ui = response.data
            console.log('UI loaded: ' + $scope.uiLang.value)
        }, function(response) {
            console.log('Could not load ui.')
        });
    }

    // load placeholder text to be rendered
    $http.get('./static/placeholder.txt').success(function(response) {
        $scope.placeholder = response
    });
    // load default ui
    $scope.loadUI()

    // restores unintentional residual scroll during read mode
    $scope.restoreContainer = function() {
            if ($scope.editMode) {
                document.getElementById('data_container').scrollTop = 0;
            }
        }

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
    // called when loading markdown from a web address
    $scope.getMarkdown = function(path) {
        if (path!=undefined) {
            $http({
                method: 'GET',
                url: path
            }).then(function(response) {         // successful request:
                console.log('Markdown loaded from: ' + path)
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
                console.log('Markdown read from disk.')
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
        // if ($location.search().uiLang!=undefined) {
        //     switch ($location.search().uiLang) {
        //         case 'english':
        //             $scope.uiLang = $scope.uiLangs[1]
        //             break
        //         default:
        //             $scope.uiLang = $scope.uiLangs[0]
        //     }
        // }
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
            $scope.outHTML = '<div id="output_outer" dir="'+$scope.defaultDir+
                '"><style scoped>'+response.data+'</style>'+out+'</div>'
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

    // reverses default text entry direction
    $scope.reverseDir = function() {
        // invert opposite direction divs' dir attribute.
        // the dir attribute is automatically inverted the next time showdown
        // parses rawTest, but this makes the change instantaneous.
        var oppDivs = document.querySelectorAll('#output_inner .opp_dir_div')
        for (var i=0; i<oppDivs.length; i++) {
            oppDivs[i].setAttribute('dir', $scope.defaultDir)
        }
        // invert main text's dir attribute
        if ($scope.defaultDir=='rtl') {
            $scope.defaultDir = 'ltr'
            OPPOSITE_DIR = 'rtl'
        } else if ($scope.defaultDir=='ltr') {
            $scope.defaultDir = 'rtl'
            OPPOSITE_DIR = 'ltr'
        }
    }
});
