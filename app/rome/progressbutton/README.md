# Progressbutton
This directive allow you create a progressbutton.


## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>

<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/progressbutton.css">
```

```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>

<script src="src/progressbutton.js"></script>
<script src="src/services/progressbuttonService.js"></script>
<script src="src/directives/progressbuttonDirective.js"></script>
```

Add the progressbutton module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.progressbutton'])
```

Entity for full the progressbutton:

```javascript
$scope.progressButton = new ProgressbuttonService({});
```

Add the directive into the HTML where do you want to consume the directive.
```html
<op-progress-button></op-progress-button>
```

## Options

| Option                      | Type     | Default                              | Description                                                      |
| ------                      | ----     | -------                              | -----------                                                     |
| templatePath                | String   | ```''```                             | Change the directory in where the module is installed                            |
| templateUrl                 | String   | ```false```                          | Change the path of the template                             |
| callbacks.onInputChange     | Function | ```function(data){}```               | Receives scope and element                              |

## Examples

The [Demo](demo/intex.html) is based on Rome's ``bower.json``; and you can run it from the root path of Rome with:
``bash
npm start -- progressbutton
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
