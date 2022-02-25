# Streamlist
This directive allows to create a streamlist component.


## Usage

```HTML
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="../../bower_components/johnny/css/streamlist.css">
```

```HTML
<script src="../../bower_components/jquery/dist/jquery.min.js"></script>
<script src="../../bower_components/angular/angular.min.js"></script>
<script src="../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>

<script src="../../streamlist/src/streamlist.js"></script>
<script src="../../streamlist/src/services/streamlistService.js"></script>
<script src="../../streamlist/src/directives/streamlistDirective.js"></script>
```

Add the streamlist module as a dependency to your application module:

```javascript
var myAppModule = angular.module('app', ['op.streamlist'])
```

Setting for the streamlist:

```javascript
$scope.streamlist = StreamlistService();
```

Apply the directive to your html:

Add the directive into the HTML where do you want to consume the streamlist.

```HTML
<op-streamlist settings="settings" streams="streams" loaded="loaded"></op-streamlist>
```

## Options

| Option                      | Type     | Default                              | Description                                                      |
| ------                      | ----     | -------                              | -----------                                                     |
| templatePath                | String   | ```''```                             | Change the directory in where the module is installed                            |
| templateUrl                 | String   | ```false```                          | Change the path of the template                             |
| streamActions.selector      | String   | ```null```                           | Element where the directive should be appended.                            |
| streamActions.directive     | String   | ```null```                           | Directive to be appended.                            |
| streamActions.action        | Array    | ```[]```                             | List of actions.                             |
| actions:clear               | Function | ```function(){}```                   | Clear the contents in the streamlist.                          |
| actions:fill                | Function | ```function(){}```                   | Fill the streamlist with these data.                                |

## Examples


The [Demo](demo/streamlist.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- streamlist
``

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
