// This sets up an extension object to be passed to showdown.
// The englishBlock extension sets the direction of text within to left-to-right
var englishBlock = function () {
  var myext1 = {
    type: 'lang',
    regex: /[\n\r]+[,|،]{3}([\s\S]+?)[,|،]{3}[\s]*?/gm,
    replace: '<div dir="ltr" class="ltr-div">$1</div>'
  };
  return [myext1];
}

showdown.extensions.englishblock = englishBlock

// setting up the main angular app
var urdown = angular.module('Urdown', ['ng-showdown'])
urdown.config(function($showdownProvider) {
    $showdownProvider.loadExtension('englishblock')
})

urdown.controller('urdownConverter', function($scope) {
    $scope.rawText = ''
    $scope.placeholder = '# خوش آمدید!!!  \n' +
        'اُرڈاوُن (`Urdown`) انٹرنیٹ پر مبنی ٹیکسٹ ایڈیٹر ہے۔ اِس کے ذریعے آپ اُردو متن کو `HTML` میں تبدیل کر سکتے ہیں۔  \n' +
        '  \n' +
        'مثال کے طور پر آپ: \n' +
        '* **متن کا وزن بڑھا سکتے ہیں**۔ \n' +
        '* *متن کو تِرچھا کر سکتے ہیں*۔ \n' +
        '* متن کو [دوسری وِیب سایٔٹ سے جوڑ سکتے ہیں۔](http://iahmed.me) \n' +
        '  \n' +
        'اِس کے علاوہ آپ ینگریزی میں بھی متن ڈال سکتے ہیں:  \n' +

        '،،، \n' +
        'This is some english text. English text, when enclosed in 3 commas on either side becomes left-aligned. It follows the same markdown rules as the Urdu text. For example, you can:  \n' +
        '* Make text **bold like this**. \n' +
        '* Or make it *slanted like this*. \n' +
        '* [Or add a hyperlink like this.](http://iahmed.me) \n' +
        '،،، \n' +
        '  \n' +
        'آپ اپنے متن میں تصاویر بھی شامل کر سکتے ہیں:  \n' +

        '![تصویر](https://avatars0.githubusercontent.com/u/22875856?v=3&s=200) \n';
})
