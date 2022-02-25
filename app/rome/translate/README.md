# Translate
This directive allow you create an translate


## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/olapic.theme.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/box.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/translate.css"/>
```

```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower_components/ngstorage/ngStorage.min.js"></script>

<script src="../../translate/src/translate.js"></script>
<script src="../../translate/src/config/translateConfig.js"></script>
<script src="../../translate/src/services/translateService.js"></script>
<script src="../../translate/src/services/translateAPIService.js"></script>
<script src="../../translate/src/directives/translateDirective.js"></script>
```

Add the translate module as a dependency to your application module:

```javascript
var myAppModule = angular.module('app', ['op.translate'])
```

Texttotranslate and setting for the translate:

```javascript
$scope.texttotranslate = 'Vanavond goede Avond met deze sterren @ The Grand vanaf 23:00! #crazyness #vodka #verkleden #bier';

$scope.translate = translateService({
    templatePath: '/translate/',
    showTransitionEffect: true
});
```

Apply the directive to your html:
```html
<div class="translateContainer" op-translate="translate" texttotranslate="texttotranslate" texttranslated="texttranslated" texttranslating="texttranslating" showtranslated="showtranslated" showicon="showicon"></div>
```

## Options

| Option                      | Type     | Default                              | Description                                                      |
| ------                      | ----     | -------                              | -----------                                                     |
| templatePath                | String   | ```''```                             | Change the directory in where the module is installed                         |
| templateUrl                 | String   | ```false```                          | Change the path of the template                             |
| translateOnload             | boolean  | ```false```                          | Whether to translate on load or at request                              |
| showIcon                    | boolean  | ```false```                          | Whether to show the icon or not                                  |
| showTransitionEffect        | boolean  | ```false```                          | Whether to show the transition effect or not                                  |
| showIconWhenTranslated      | boolean  | ```false```                          | Whether to show the icon or not when the translatedtext is present            |
| translateService            | object   | ```translateAPIService```      | Translate Service                              |
| actions.translate           | Function | ```function(){}```        | Perform the translation                               |
| callbacks.afterTranslate    | Function | ```function(translation){}```        | Called when translation is done                                 |
| callbacks.translationError    | Function | ```function(err){}```        | Called when the translation throws an error                                |

## Examples

The [Demos](demo/translate.html) are based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- translate
``

## Bower dependencies
```json
{
  "devDependencies": {
    "angularjs": "1.5",
    "angular-bootstrap": "0.12.0",
    "johnny": "git@github.com:Olapic/Johnny.git#~1.0.50",
  }
}
```

## NPM dependencies
```json
{
  "devDependencies": {
    "angular-mocks": "1.4.0",
    "bower": "^1.3.12",
    "grunt": "~0.4.4",
    "grunt-cli": "^0.1.13",
    "grunt-contrib-jshint": "^0.10.0",
    "grunt-conventional-changelog": "~1.0.0",
    "grunt-karma": "~0.8.3",
    "http-server": "^0.8.0",
    "jshint-stylish": "^0.2.0",
    "karma-chrome-launcher": "~0.1.3",
    "karma-firefox-launcher": "~0.1.3",
    "karma-jasmine": "~0.2.2",
    "karma-ng-html2js-preprocessor": "~0.1",
    "karma-phantomjs-launcher": "^0.1.4",
    "load-grunt-tasks": "~0.2.0"
  }
}
```
