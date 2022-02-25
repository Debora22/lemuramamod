# Actions
This directive create a list of controllers to fire callbacks.


## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="src/statics/css/actions.css"/>
```

```html
<script src="node_modules/angular/angular.min.js"></script>
<script src="node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.min.js"></script>
<script src="node_modules/angular-bootstrap/dist/ui-bootstrap.min.js"></script>

<script src="src/actions.js"></script>
<script src="src/services/actionService.js"></script>
<script src="src/directives/actionsDirective.js"></script>
```

Add the actions module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.actions'])
```

Init the actions services

```javascript
$scope.actions = [
    new actionService({
        title : 'Action 1',
        iconClass : 'check',
        callback: function(entity){
            console.log('custom callback 1', entity);
        },
        showIf: null
    }),
    new actionService({
        title : 'Ask for Rights',
        iconClass : 'close',
        callback: function(media){
            console.log('asking for rights ...', media);
            // ask for rights
        },
        showIf: function(media) {
            return (media.rights === 'not-requested');
        }
    })
];
```

Add the directive

```html
<op-actions actions="actions" template-path="/" entity="entity"></op-actions>
```

## Action Services options

| Option    | Type     | Default            | Description                          |
| ------    | ----     | -------            | -----------                          |
| title     | String   | ```''```           | A descriptive text of the action     |
| iconClass | String   | ```''```           | A css class name to apply            |
| callback  | Function | ```function(entity){}``` | the default action the fire on click |
| showIf    | Function | ```function(entity){}``` | it's an optional function. It should return a boolean for showing/hidding the action from the menu. |

## Action Directive attributes

| Option       | Type   | Default          | Description                                                                              |
| ------       | ----   | -------          | -----------                                                                              |
| actions      | Array  | ```[]```         | The array of actionServices                                                              |
| entity       | Object | ```{}```         | The object entity to be used in the callback                                             |
| type         | String | ```actionlist``` | A valid type of controller, options: [select, actionlist, radio, link, checkbox, button] |
| name         | String | ```''```         | A name to apply on the types: 'select', 'radio', 'checkbox'                              |
| templatePath | String | ```''```         | Allow you add a prefix for load the module                                               |

## Examples

The [Demo](demo/actions.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- actions
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
