# Library
This Module allows you create a Library.

## Installation

```bash
npm install
```

## Usage
Include files:

```html
<link rel="stylesheet" type="text/css" href="/library/src/statics/styles/styles.css"/>
```

```html
<!-- Common -->
<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../node_modules/angular/angular.js"></script>
<script src="../../box/node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.min.js"></script>
<script src="../../box/node_modules/angular-bootstrap/dist/ui-bootstrap.min.js"></script>

<!-- Library -->
<script src="../node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js"></script>
<script src="../src/library.js"></script>
<script src="../src/services/libraryService.js"></script>
<script src="../src/directives/libraryDirective.js"></script>
```
Add the `op-library` module as a dependency to your application module:
```javascript
var myAppModule = angular.module('MyApp', ['op.library'])
```
Init Library:
```javascript
$scope.library = libraryService({
    dataRepository : repository,
    entityView: viewService,
    templateUrl : 'template.html',
    callbacks: {
        loadContent : function(finish) {
            // Request more content
        }
    }
});
```
Apply the directive to your form elements:
```html
<op-library></op-library>
```
## Options
Option | Type | Default | Description
------ | ---- | ------- | -----------
entityView | Object | *Required* | The `Service` that will render the items in the list. E.g: `boxService`
template | String | Optional | The library template content in a HTML string.
templateUrl | String | Optional | The library template partial url to use.
inifinteScroll | Boolean | true | The library will use the infinite scroll method to load more items.
actions | Object |  | Actions to execute in the library
callbacks | Object | | Library Callbacks

# Library Actions
Action | Parameters | Description
------ | ---------- | ------------
clear() | | Clear the content in the library. The list will be emtpy.
loadMore() | | Request and loads more content in the current library. The new items will be added to the current ones.

# Library item Actions

| Action   | Parameters | Description                                                                           |
| ------   | ------     | ------                                                                                |
| push()   | entity     | Using `$scope.library.actions.item.push(entity)` you can add a new entity to the list |
| pop()    | entity     | Remove an entity from the list                                                        |
| update() | id, entity | Update the entity using the id to get it and pass the new entity                      |

```
actions : {
    item : {
        push : function(entity){},
        pop : function(entity){},
        update : function(id, entity){}
    }
    ...
}
```

# Library Callbacks
## Extend the Loading
The loading object have two methods that can be used to extend the loading behaviour in your application.
```javascript
callbacks : {
    loading : {
        start : function(){},
        end : function(){}
    }
    ...
}
```
`start()` will be triggered every time that the library begins to execute an action.
The `end()` method will be triggered when the action is finished.
## Load more content
```javascript
callbacks: {
    loadContent : function(finish) {
        // finish(data);
    },
    ...
}
```
The `loadContent()` method is going to be called every time that the library request more dato to load. You should execute `finish` with the requested `data` as parameter. Eg: `finish(data);`. `Finish` will append the new data into the library items.


## Examples and Demos
- `cd Rome`
- Execute `python -m SimpleHTTPServer 1212`
- Open in the browser: `http://localhost:1212/library/demo/demo.html`
