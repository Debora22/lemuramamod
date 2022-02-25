# Autocomplete
Decorates a textbox and display an autocomplete box with suggestions. This is based on typeahead module, so, most of its options and callbacks matches this module.


## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/sidebar.css"/>
```

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-bootstrap/dist/ui-bootstrap.min.js"></script>
<script src="bower_components/angular-bootstrap/dist/ui-bootstrap-tpls.min.js"></script>

<script src="autocomplete/src/autocomplete.js"></script>
<script src="autocomplete/src/services/autocompleteService.js"></script>
<script src="autocomplete/src/directives/autocompleteDirective.js"></script>
```

Add the autocomplete module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.autocomplete'])
```
Init autocomplete:
```javascript
$scope.myAc = new AutocompleteService({
    callbacks: {
        getData: function(term) {
            // must return a promise
            return repository.search(query);
        },
        formatData: function(data, push) {
            angular.forEach(data.data.hits.hits, function(item){
                // must fire push(type, title) | push(type, title, rawItem)
                push('tags', item.fields.stream_name[0], item._id);
            });
        },
        onSelect: function(item) {
            // do whatever you need here
            $scope.selected = item.id;
        }
    }
});
```

Apply the directive to your html as an attribute. Note: it doesn't replace the original element and doesn't support tag format.

```html
<input type='text' op-autocomplete="myAc">
```

## Autocomplete Services options

| Option               | Type     | Default          | Description
| ------               | ----     | -------          | -----------
| templatePath         | String   | `/autocomplete/` | *optional* Directory in where the module is installed.                       |
| templateUrl          | String   | `undefined`      | *optional* Full path to an html where the item template is located           |
| minimumTermLength    | Integer  | `3`              | *optional* Minimum length where the search is triggered                      |
| callbacks.getData    | function | `function(){}`   | *mandatory*.Receives the current term typed into the box. Must return a promise that when is fulfilled returns the suggestions data |
| callbacks.formatData | function | function(){}     | *optional*. Receives a data and a push. Data must be iterated accordingly and push(type, title, id) must be fired for each item |
| callbacks.onSelect   | function | `function(){}`   | *optional* Is fired any time an item is selected. Receives the item selected |

## Examples

The [Demo](demo/autocomplete.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- autocomplete
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
