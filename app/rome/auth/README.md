# Auth

Olapic's auth wrapper


## Usage
Include files:

```html
<script src="bower_components/ngstorage/ngStorage.js"></script>
<script src="auth/src/auth.js"></script>
<script src="auth/src/services/authService.js"></script>
<script src="auth/src/services/profileService.js"></script>
<script src="auth/src/services/scopeAuthService.js"></script>
<script src="auth/src/services/sessionService.js"></script>
```

Add the actions module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['op.auth'])
```

Requeri the authService on your module:

```javascript
myAppModule.controller('myCtlr', ['$scope', 'authService', function($scope, authService){
}
```

## Auth Services methods

| Method          | Location |
| ------          | -------- |
| login           | [src/services/authService.js#L59](src/services/authService.js#L44)   |
| isAuthenticated | [src/services/authService.js#L87](src/services/authService.js#L87)   |
| isAuthorized    | [src/services/authService.js#L106](src/services/authService.js#L106) |
| isAuth          | [src/services/authService.js#L136](src/services/authService.js#L136) |
| getScopes       | [src/services/authService.js#L147](src/services/authService.js#L147) |
| getAccount      | [src/services/authService.js#L167](src/services/authService.js#L167) |
| logout          | [src/services/authService.js#L182](src/services/authService.js#L182) |
| loginWithToken  | [src/services/authService.js#L195](src/services/authService.js#L195) |

## Profile Services methods

| Method    | Location |
| ------    | -------- |
| init           | [src/services/profileService.js#L29](src/services/profileService.js#L29) |
| getAccount     | [src/services/profileService.js#L38](src/services/profileService.js#L38) |
| getCredentials | [src/services/profileService.js#L45](src/services/profileService.js#L45) |
| end            | [src/services/profileService.js#L52](src/services/profileService.js#L52) |

## AutScope Services methods

| Method    | Location |
| ------    | -------- |
| validate                 | [src/services/scopeAuthService.js#L26](src/services/scopeAuthService.js#L26) |
| getScopesFromCredential  | [src/services/scopeAuthService.js#L52](src/services/scopeAuthService.js#L52) |

## Session Services methods

| Method    | Location |
| ------    | -------- |
| init           | [src/services/sessionService.js#L28](src/services/sessionService.js#L28) |
| getAccount     | [src/services/sessionService.js#L35](src/services/sessionService.js#L35) |
| getCredentials | [src/services/sessionService.js#L42](src/services/sessionService.js#L42) |
| end            | [src/services/sessionService.js#L49](src/services/sessionService.js#L49) |


## Examples

The [Demo](demo/auth.html) is based on the Rome's ``bower.json``; you can run it from the root path of Rome with:

``bash
npm start -- auth
``

## Bower dependencies
```json
{
  "devDependencies": {
    "ngstorage": "~0.3.0",
    "angularjs": "1.5"
  }
}
```


## NPM dependencies
```json
{
  "devDependencies": {
    "angular": "1.2.27",
    "angular-mocks": "1.2.27",
    "bower": "^1.3.12",
    "grunt": "~0.4.4",
    "grunt-cli": "^0.1.13",
    "grunt-contrib-jshint": "~0.10.0",
    "grunt-conventional-changelog": "~1.0.0",
    "grunt-karma": "~0.8.3",
    "karma": "~0.12.9",
    "karma-chrome-launcher": "~0.1.3",
    "karma-firefox-launcher": "~0.1.3",
    "karma-jasmine": "~0.2.2",
    "karma-phantomjs-launcher": "^0.1.4",
    "load-grunt-tasks": "~0.2.0"
  }
}

```
