# Loading
This directive allow you create an full screen loading


## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
```

```javascript
<script src="node_modules/angular/angular.min.js"></script>
<script src="node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.min.js"></script>
<script src="node_modules/angular-bootstrap/dist/ui-bootstrap.min.js"></script>

<script src="src/loading.js"></script>
<script src="src/services/loadingService.js"></script>
<script src="src/directives/loadingDirective.js"></script>
```

Add the loading module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.loading'])
```

Apply the directive to your html

```html
<op-loading></op-loading>
```

## Loading Services methods

| Option    | Description      |
| ------    | -----------      |
| on        | show the loading |
| off       | hide the loading |

## Examples

The [Demo](demo/loading.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- loading
``

## Testing

You can run the unit test suit from the root path of Rome with:

```bash
npm test -- loading
```

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

