# Tagging
This directive allows to create a tagging component.


## Usage

```HTML
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/modal.css"/>
```

```HTML
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="./bower_components/angular/angular.js"></script>
<script src="./bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
<script src="./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="./bower_components/jquery-ui/jquery-ui.js"></script>

<script src="tagging/src/tagging.js"></script>
<script src="tagging/src/services/taggingService.js"></script>
<script src="tagging/src/services/taggingToolService.js"></script>
<script src="tagging/src/directives/taggingDirective.js"></script>
```

Add the tagging module as a dependency to your application module:

```JavaScript
$scope.tagging = new taggingService();
```

Add the directive into the HTML where do you want to consume the tagging.

```HTML
<op-tagging streams="streamsForTagging" media="entity" is-suggestion-available="isSuggestionAvailable"></op-tagging>
```

## Tagging Directive Options

| Option                      | Type     | Default                  | Description                                                      |
| :------                     | :----    | :------                  | :----------                                                      |
| templatePath                | String   | ```''```                 | Change the base path of the template                             |
| searchLimit                 | Integer  | ```15```                 | Set the numer of results in the search                           |
| zoomOnHover                 | Boolean  | ```false```              | Define if we want to set the zoom by default                     |
| sorting                 | Boolean  | ```false```              | Define whether the drag and drop sorting it's enabled or not                     |
| callbacks.loadContent       | Function | ```function(finish){}``` | Search the content and trigger the finish callback with the data |
| callbacks.loadMoreContent   | Function | ```function(finish){}``` | Search the next content and trigger the finish callback with the data and concat this |
| callbacks.filterItemToAdd   | Function | ```function(item){ return item; }``` | Callback triggered before adding a new item. It can be used to filter some of the item properties. It supports a Promise as return value |
| callbacks.itemAdded         | Function | ```function(item){}``` | Callback triggered each time a new item is added to the entities |
| callbacks.itemRemoved       | Function | ```function(item){}``` | Callback triggered each time a item is removed from the list     |
| callbacks.resultItemOnHover | Function | ```function(item){}``` | If zoom is enabled on mouse enter we trigger this function       |
| callbacks.resultItemOnOut   | Function | ```function(item){}``` | If zoom is enabled on out enter we trigger this function         |
| callbacks.saveSorting   | Function | ```function(entities){}``` | If `sorting` is enabled, every time the entities order changes, we trigger this function         |

## Internal Tagging Suggestions Component
This component displays suggested streams to be used to tag media element.

## Examples

The [Demo](demo/tagging.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:
``bash
npm start -- tagging
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
