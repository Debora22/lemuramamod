# Track
Event tracking implementation


## Usage v1 (deprecated)

```HTML
<script src="bower_components/angular/angular.min.js"></script>
<script src="track/src/track.js"></script>
<script src="track/src/provider/trackProvider.js"></script>
```

Add the track module as a dependency to your application module:

```JavaScript
module('app', ['op.track'])
```

Init the settings

```JavaScript
track.setSettings({});
```

How to send an event

```JavaScript
track.event({event});
```

### Options

| Option  | Type   | Default    | Description          |
| ------  | ----   | -------    | -----------          |
| url     | string | ```''```   | url for track events |
| enabled | bool   | ```true``` | Set on/off events    |


## Usage v2

```HTML
<script src="bower_components/angular/angular.min.js"></script>
<script src="track/src/track.js"></script>
<script src="track/src/provider/trackv2Provider.js"></script>
```

Add the track module as a dependency to your application module:

```JavaScript
module('app', ['op.track'])
```

Init the settings

```JavaScript
track.setSettings({
    appName: "lemuramav2"
});
```

How to send an event

```JavaScript
context = 'premod'; // only \w characters
eventType = 'delete-on-premod' // only \w characters
track.addEvent(context, eventType, {Entity}, {relatedEntity});
// all the track.addEvent() you need ...
track.flush().then(function(httpResponses){
    console.log(httpResponses);
}); // send the events to backend
```

### Options

| Option  | Type   | Default    | Description                                                                |
| ------  | ----   | -------    | -----------                                                                |
| url     | string | ```''```   | Mandatory. Base url for track events, usually https://data.photorank.me    |
| appName | string | ```null``` | Mandatory. Set on/off events                                               |
| enabled | bool   | ```true``` | Optional. Set on/off events                                                |
| bulkLimit | int  | ```10```   | Optional. For now it must be set to 10 or lower due limitations on backend |

## Examples

The demo's [track](demo/track.html) and [trackv2](demo/trackv2.html) are based on the Rome's ``bower.json``; you can run them from the root path of Rome with:

``bash
npm start -- track
``

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
    "http-server": "^0.8.0",
    "jshint-stylish": "^0.2.0",
    "karma-chrome-launcher": "~0.1.3",
    "karma-firefox-launcher": "~0.1.3",
    "karma-jasmine": "~0.2.2",
    "karma-ng-html2js-preprocessor": "~0.1",
    "karma-phantomjs-launcher": "^0.1.4",
    "load-grunt-tasks": "~0.2.0",
  }
}
```
