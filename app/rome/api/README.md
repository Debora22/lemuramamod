# API
Olapic's API wrapper.


## Usage
Include files:

```html
<script src="api/src/api.js"></script>
<script src="api/src/services/apiService.js"></script>
<script src="api/src/services/photorankAPIService.js"></script>
<script src="api/src/services/curationAPIService.js"></script>
<script src="api/src/services/authServerAPIService.js"></script>
<script src="api/src/services/adminAPIService.js"></script>
<script src="api/src/services/trackingAPIService.js"></script>
```

Add the api module as a dependency to your application module and define the following constants:

```javaScript
var myAppModule = angular.module('app', ['op.api'])
.constant('appConstant', {
    photorankAPI: {
        url: 'http://rest.local.photorank.me'
    },
    authServer: {
        url: 'https://oauth.local.photorank.me'
    },
    adminAPI :{
        url: 'https://admin-api.local.photorank.me'
    },
    madagascar :{
        url: 'http://localhost:3400'
    }
})
```

In curationAPIService we have a constant called ```API_MEDIA_STATUSES_ID``` with the list of media status id.

To consume methods from `adminAPIService, trackingAPIService` the token is needed.
Please use this method:

```javaScript
ApiService.setToken('TOKEN');
```

## Bower dependencies
```json
{
  "devDependencies": {
    "angularjs": "1.5"
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
