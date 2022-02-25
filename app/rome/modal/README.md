# Modal
This directive allows to create any type of modal.

## Usage
Include files:

```HTML
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="bower_components/johnny/css/olapic-icons.css"/>
<link rel="stylesheet" type="text/css" href="src/statics/css/modal.css"/>
```

```HTML
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-bootstrap/dist/ui-bootstrap-tpls.min.js"></script>
<script src="bower_components/angular-bootstrap/dist/ui-bootstrap.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="bower_components/jquery-zoom/jquery.zoom.min.js"></script>

<script src="modal/src/modal.js"></script>
<script src="modal/src/services/modalService.js"></script>
<script src="modal/src/services/modalToolService.js"></script>
<script src="modal/src/directives/modalDirective.js"></script>
<script src="modal/src/directives/modalExtrasDirective.js"></script>
<script src="modal/src/directives/modalMediaDirective.js"></script>
<script src="modal/src/directives/modalMediaPreviewDirective.js"></script>
<script src="modal/src/controllers/ModalController.js"></script>
```

Add the modal module as a dependency to your application module:

```JavaScript
$scope.modal = new ModalService();
```

Add the directive

```HTML
<op-modal></op-modal>
```

Using `$scope.modal.open(data);` will open the modal, the argument of this function should be the object that we need in the template, most of the case will be a media entity.

## Options

| Option                      | Type     | Default                         | Description                                                                                                                    |
| :------                     | :----    | :------                         | :----------                                                                                                                    |
| template                    | String   | ```media```                     | Use one of the created templates, the options are ```[media, text]```                                                          |
| templatePath                | String   | ```''```                        | Change the base path of the template                                                                                           |
| templateUrl                 | String   | ```false```                     | Allow to consume your own templates                                                                                            |
| fullscreen                  | Boolean  | ```true```                      | Set if the modal will be fullscreen or not, the media template is fullscreen                                                   |
| zoom                        | Boolean  | ```false```                     | Zoom on hover for the main image                                                                                               |
| extras                      | Array    | ```[]```                        | Define all the directives that we want to use in the right side of the modal                                                   |
| directives                  | Array    | ```[]```                        | Define a list of directive that will be used in the modal. Eg. Actions                                                         |
| actions.open                | Function | ```function(data, options){}``` | Open the modal, as parameter the data object. options.activeTab to open with a tab index already active (e.g., {activeTab: 1}) |
| actions.close               | Function | ```function(){}```              | Close the modal                                                                                                                |
| actions.navigation          | Function | ```function(list){}```          | Set the list of photos to generate the pagination in the modal                                                                 |
| actions.setTitle            | Function | ```function(text){}```          | Update the title of the Modal                                                                                                  |
| actions.isOpen              | Function | ```function(){}```              | Return if the modal is opened or not                                                                                           |
| actions.next                | Function | ```function(){}```              | Trigger the next navigation                                                                                                    |
| actions.prev                | Function | ```function(){}```              | Trigger the prev navigation                                                                                                    |
| callbacks.afterOpen         | Function | ```function(){}```              | Callback triggered each time the open is open                                                                                  |
| callbacks.afterClose        | Function | ```function(){}```              | Callback triggered each time the modal is closed                                                                               |
| callbacks.afterMove         | Function | ```function(direction)```       | Callback triggered when the navigation is used                                                                                 |
| callbacks.afterRemovingItem | Function | ```function()```                | Callback triggered when a photo is removed from the bulk modal                                                                 |
| showIf                      | Function | ```function(entity){}```        | it's an optional function. It should return a boolean for showing/hidding the tab                                              |
| preview.update              | Function | ```function(image){}```         | Updating the image of the preview                                                                                              |
| preview.show                | Function | ```function(){}```              | Display the image preview and hide the current media detail                                                                    |
| preview.hide                | Function | ```function(){}```              | Hide the image preview                                                                                                         |

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
    "jquery-zoom": "~1.7.14",
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
