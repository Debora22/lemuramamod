# Filters
This directive allow you create a filter component

## Usage
Include files:

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="src/statics/styles/filters.css"/>
```

```javascript
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-bootstrap/dist/ui-bootstrap-tpls.min.js"></script>
<script src="bower_components/angular-bootstrap/dist/ui-bootstrap.min.js"></script>

<script src="src/filters.js"></script>
<script src="src/services/filtersService.js"></script>
<script src="src/services/staticFiltersService.js"></script>
<script src="src/directives/filtersDirective.js"></script>
<script src="src/directives/staticDropdownFilterDirective.js"></script>
<script src="src/directives/staticDatesFilterDirective.js"></script>
```

Add the filters module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.filters'])
```

Init filters:

```javascript
var q = {
    q: 'olapic',
    size: 10,
    filter: [{'media_status.id': 20}],
    sort: 'oldest'
};

var filters = new filtersService({
    start: q,
    dataRepository: repository,
    templatePath: '/filters/',
    orderBy: [
        {title: 'Photorank', value: 'photorank'},
        {title: 'Click Through Rate', value: 'ctr'},
        {title: 'Oldest', value: 'oldest'},
        {title: 'Newest', value: 'newest'}
    ]
});

```
Fill the filters:

```javascript
filters.actions.fill(aggregations);
```

Apply the directive to your html

```html
<op-filters settings='settingService'>
    <op-static-dropdown-filter settings='uibDropdownServicedropDownService'></op-static-dropdown-filter>
    <op-static-dates-filter settings='datesSettingService'></op-static-date-filter>
</op-filters>

```

## Options

Some options couldn't be available for some type of filters. For example, afterClearAll on opStaticDropDownFilter

| Option | Type | Default | Description
| ------ | ---- | ------- | -----------
| templatePath                  | string   | ```''```                                        | Allow you add a prefix for load the module                |
| templateUrl                   | string   | ```''```                                        | Allow to use your own template                            |
| showTotal                     | boolean  | `false`                                         | Show total (must be filled in second parameters of action.fill) and also show a button "clear filters" (╯°□°）╯︵ ┻━┻  |
| itemsOrder                    | array    | ```[]```                                        | Array with the order that we can print the filters        |
| searchPlaceholder             | string   | ```Search for a caption, hashtag or username``` | Change the placeholder of the input search                |
| actions.fill                  | function | ```function(){}```                              | Fill the filter with data                                 |
| actions.fillTotal             | function | ```function(){}```                              | Fill total label from outside the directive               |
| actions.clear                 | function | ```function(){}```                              | Clear filters data                                        |
| actions.injectFilterCondition | function | ```function(){}```                              | Receives a filter type and a value, ej ('Stream', 123)    |
| callbacks.afterApplyFilter    | function | ```function(){}```                              | Callback when a filters is applied                        |
| callbacks.afterSearchPress    | function | ```function(){}```                              | Callback after search                                     |
| callbacks.afterClearAll       | function | ```function(){}```                              | Callback after clear all filters                          |
| callbacks.onChange            | function | ```function(){}```                              | Generic callback fired when any filter value change       |

## Examples

The [Demo](demo/filters.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- filters
``

## Bower dependencies
```json
{
  "devDependencies": {
    "angularjs": "1.5",
    "angular-bootstrap": "0.12.0",
    "angular-sanitize": "~1.3",
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
