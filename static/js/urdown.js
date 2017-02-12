OPPOSITE_DIR = 'ltr'
UILANGS = [
            {'label':'اُردو', 'value': 'urdu'},         // index 0
            {'label': 'English', 'value':'english'}    // index 1
        ]

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
    };
    return [myext1, myext2, myext3];
};

// This accepts hugo template for different direction text {{% ltr|rtl %}}BLAH BLAH{{%\ rtl|ltr %}}
var hugoWiki = function () {
    var myext1 = {
      type: 'lang',
      regex: /{{%\s*rtl\s*%}}([\s\S]+?){{%\s*\\rtl\s*%}}/gm,
      replace: '%RTLBLOCKSTART%\n$1\n%RTLBLOCKEND%'
    };

    var myext2 = {
      type: 'lang',
      regex: /{{%\s*ltr\s*%}}([\s\S]+?){{%\s*\\ltr\s*%}}/gm,
      replace: '%LTRBLOCKSTART%\n$1\n%LTRBLOCKEND%'
    };

    var myext3 = {
        type: 'output',
        regex: /%RTLBLOCKSTART%([\s\S]+?)%RTLBLOCKEND%/gm,
        replace: function(match, capture) {
            return '\n<div dir="rtl" class="rtl">'+capture+'</div>\n'
        }
    };

    var myext4 = {
        type: 'output',
        regex: /%LTRBLOCKSTART%([\s\S]+?)%LTRBLOCKEND%/gm,
        replace: function(match, capture) {
            return '\n<div dir="ltr" class="ltr">'+capture+'</div>\n'
        }
    };
    return [myext1, myext2, myext3, myext4];
};

showdown.extensions.oppositeblock = oppositeBlock
showdown.extensions.hugowiki = hugoWiki

// setting up the main angular app
var urdown = angular.module('Urdown', ['ng-showdown'])
urdown.config(function($showdownProvider) {
    $showdownProvider.loadExtension('oppositeblock')
    $showdownProvider.loadExtension('hugowiki')
});

// setting up controller
urdown.controller('urdownConverter', function($scope, $http, $location, $window, $showdown) {
    $scope.rawText = ''                 // contains whatever is in textarea
    $scope.nightMode = false            // control for .night style
    $scope.editMode = true              // show textarea or not
    $scope.showOpenPrompt = false       // prompt div shows open relevant content
    $scope.showHTMLPrompt = false       // prompt div shows HTML output content
    $scope.showOppDirPrompt = false     // prompt div shows opp dir text input
    $scope.defaultDir = 'rtl'           // direction (rtl | ltr) of main text body
    $scope.oppDir = 'ltr'               // mirrors OPPOSITE_DIR global variable
    $scope.ctrlPressed = false          // whether control key is pressed
    $scope.outHTML = ''                 // HTML output shown through HTML button (includes style)
    $scope.oppDirText = ''              // text entered in the opp_dir_div
    $scope.uiLangs = UILANGS
    $scope.uiLang = $scope.uiLangs[0]



    // checks /#?query=params for changes, and reloads markdown
    $scope.$watch(function() {
        return $location.search()
    }, function(x) {
        $scope.loadMarkdown()
        $scope.loadSettings()
    });

    // Starts watching output_inner for changes in DOM elements, scrolls to
    // position of the newest DOM element/change
    // TODO: refine this.
    // $scope.attachScroller = function() {
    //     var target = document.getElementById('output_inner')
    //     var observer = new MutationObserver(function(mutations) {
    //         mutations.forEach(function(mutation) {
    //             console.log(mutation)
    //             target.scrollTop = mutation.target.offsetTop
    //         });
    //     });
    //     var config = {subtree: false, childList: true, characterData: true}
    //     observer.observe(target, config)
    //     console.log('Scroller Attached!')
    // }

    // track shortcut key combinations, called on body ng-keypress
    $scope.shortcutHandler = function($event) {
        if (event.ctrlKey) {
            switch ($event.keyCode || $event.key) {
                case ',':   // ctrl+, or ctrl+،
                case '،':
                case 188:
                    $event.preventDefault()
                    $scope.showOppDirPrompt = !$scope.showOppDirPrompt
                    if ($scope.showOppDirPrompt) {
                        var start = document.getElementById('raw_text').selectionStart
                        var end = document.getElementById('raw_text').selectionEnd
                        $scope.oppDirText = $scope.rawText.slice(start, end)
                        $scope.focus('opp_input')
                    }
                    $scope.showHTMLPrompt = false
                    $scope.showOpenPrompt = false
                    break

                case 13:    // enter key
                    $event.preventDefault()
                    $scope.okHandler()
                    break

                case 'o':   // ctrl+o
                case 79:
                    $event.preventDefault()
                    $scope.openHandler()
                    break

                case 'm':   // ctrl+m
                case 77:
                    $event.preventDefault()
                    $scope.newMarkdown()
                    break

                case 's':   // ctrl+s
                case 83:
                    $event.preventDefault()
                    $scope.saveMarkdown()
                    break

                case 'h':   // ctrl+h
                case 72:
                    $event.preventDefault()
                    $scope.showOpenPrompt = false
                    $scope.showOppDirPrompt = false
                    $scope.showHTMLPrompt = !$scope.showHTMLPrompt
                    if ($scope.showHTMLPrompt) $scope.showHTML()
                    break

                case 'e':   // ctrl+e
                case  69:
                    $event.preventDefault()
                    $scope.editMode = !$scope.editMode
                    break

                case 'd':   // ctrl+d
                case  68:
                    $event.preventDefault()
                    $scope.nightMode = !$scope.nightMode
                    break

                // TODO: remove this after auto scrolling refined
                // case 'a':   //ctrl+a (attatches scroller - Dev only)
                // case 65:
                //     $event.preventDefault()
                //     $scope.attachScroller()
                //     break
            }
        } else if ((27==$event.keyCode) || ('Escape'==$event.key)) {  // escape key
            $event.preventDefault()
            $scope.escHandler()
        }
    }

    // focuses on element
    $scope.focus = function(id) {
        window.setTimeout(function() {
            document.getElementById(id).focus()
        }, 0)
    }

    // handles ctrl+enter/OK button
    $scope.okHandler = function() {
        if ($scope.showOpenPrompt) {
            $scope.getMarkdown()
        } else if ($scope.showOppDirPrompt) {
            var start = document.getElementById('raw_text').selectionStart
            var end = document.getElementById('raw_text').selectionEnd
            $scope.rawText = $scope.rawText.slice(0, start)+'\n,,,\n'+$scope.oppDirText+'\n,,,\n'+$scope.rawText.slice(end, $scope.rawText.length+1)
            $scope.oppDirText = ''
        }
        $scope.showOppDirPrompt = false
        $scope.showOpenPrompt = false
        $scope.focus('raw_input')
    }

    // handles escape/cancel button
    $scope.escHandler = function() {
        $scope.showHTMLPrompt = false
        $scope.showOppDirPrompt = false
        $scope.showOpenPrompt = false
        $scope.outHTML = ''
        $scope.focus('raw_text')
    }

    // handles open button
    $scope.openHandler = function() {
        $scope.showHTMLPrompt = false
        $scope.showOppDirPrompt = false
        $scope.showOpenPrompt = !$scope.showOpenPrompt
        if ($scope.showOpenPrompt) $scope.focus('open_link_text')
    }

    // load placeholder text to be rendered
    $http.get('./static/placeholder.txt').success(function(response) {
        $scope.placeholder = response
    });

    // loads ui elements, called at initialization, when selection changes
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
        if ($location.search().dir!=undefined) {
            if ($scope.defaultDir!=$location.search().dir) {
                $scope.reverseDir()
            }
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
        }
        $scope.rawText = ''
    }

    // reverses default text entry direction
    $scope.reverseDir = function() {
        // invert opposite direction divs' dir attribute.
        // the dir attribute is automatically inverted the next time showdown
        // parses rawText, but this makes the change instantaneous.
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
        $scope.oppDir = OPPOSITE_DIR
    }
});
