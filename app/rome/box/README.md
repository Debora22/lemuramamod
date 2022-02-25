# Box
This directive allow you create an box from an entity


## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="src/statics/styles/styles.css"/>
```

```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>

<script src="src/box.js"></script>
<script src="src/services/boxService.js"></script>
<script src="src/directives/boxDirective.js"></script>
```

Add the box module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.box'])
```

Entity for full the box:

```javascript
$scope.entity = {...}
```

Apply the directive to your html:
```html
<op-box></op-box>
```

If you can't add to scope the vars box or entity, you can pass these how to attr to the element
```html
<op-box box="box" entity="entity"></op-box>
```

## Box Service Options

| Option                        | Type            | Default            | Description                                                                                                                                                                                                                                                                                        |
| ------                        | ----            | -------            | -----------                                                                                                                                                                                                                                                                                        |
| type                          | String          | ```'media'```      | Load diferent box templates                                                                                                                                                                                                                                                                        |
| carousel                      | Array, Function | ```[]```           | Works with an array that contains objects like ```{title: 'title', image: 'image.jpg'}```. Also you can pass a function with a prommise                                                                                                                                                            |
| headerActions                 | Object          | ```{}```           | Let you add a custom template for render in the header box. The expected objects is ```{directive: '<op-actions>', scope: $scope}```, note that scope can be a function, the idea of the scope is always return the implemention scope so the directive in there will be compiled with that scope. |
| templatePath                  | String          | ```''```           | Allow you add a prefix for load the module                                                                                                                                                                                                                                                         |
| templateUrl                   | String          | ```false```        | Allow you use your own template                                                                                                                                                                                                                                                                    |
| showCheckbox                  | Boolean          | ```true```        | Show/Hide the checkbox for mutiselect boxes. Disable in case you don't have bulk actions                                                                                                                                                                                                                                                                    |
| callbacks.afterRender         | Function        | ```function(){}``` | Let you add a custom callback when the element is rendered; params: entity, element                                                                                                                                                                                                               |
| callbacks.afterPhotoClick     | Function        | ```function(){}``` | Let you add a custom callback when the user clicks over the photo box                                                                                                                                                                                                                               |
| callbacks.afterCheckboxChange | Function        | ```function(){}``` | Let you add a custom callback when the checkbox status changes                                                                                                                                                                                                                                      |
| callbacks.afterCarouselPhotoClick     | Function        | ```function(){}``` | Let you add a custom callback when the user clicks an item from the carousel                                                                                                                                                                                                                               |

## Examples

The [Demos](demo/box.html) are based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- box
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
