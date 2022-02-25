# Simple Event Tracking for external services
Currently working with Google Analytics

## Event naming convention for **send** event type.
Subscriber/Feature you're tracking: `<subscriber>`

* Category: `<use case>_<kpi>`
* Action: `<section>_<ui component>_<action>_<status>`

### setField(field, value);
Set `ga` dimensions. Use this method whenever you need to set a custom dimensions for the events.

### trackEvent(obj);
Sends a single event. Param should be an `object` filled with event data described in naming convention section.

```javascript
tracking.trackEvent({
    category: '_tagging_productivity',
    action: '_tagging_modal_tagging_unavailable-suggestions'
});
```

### trackTimeWithTimer(string, obj);
Sends a time event. First param should be a `string` with the timer id and second one an `object` filled with event data.

First you need to start the timer:
```javascript
tracking.startTimer('untilFirstTag');
```

and this will stop the timer and send the elapsed time:
```javascript
tracking.trackTimeWithTimer('untilFirstTag', {
    category: '_tagging_productivity',
    action: '_tagging_modal_add-first-product-tag_from-search-result'
});
```

For convenience you have this self explained methods:
```javascript
tracking.restartTimer('untilFirstTag');
tracking.dismissTimer('untilFirstTag');
```

## Behaviour and logic behind the implementation:
All events are triggered from components, and subscribers listen to this events in `$rootScope`. So the comunication must be always upwards from a child `$scope` to the `$rootScope`.

Example of triggering an angular event:
```javascript
$scope.$emit(ROME_TAGGING_EVENTS.suggestions.available, {
    suggestions: [...]
});
```

## Event naming convention for **page view** event type.

It provides 3 dimensions: page, search term, category

* Page: used to identify the section and the subSection. i.e. section = 'tagging' subSection: 'modal'
* Search term: text searched to send.
* category: Identify the current customer.

## Usage

### trackSearch(string);
Sends a search event. This public method will send a pageView event to GA.

```javascript
tracking.trackSearch('/search/' +  section.current() + '/' + data.subSection + '?' + data.text);
```

Check GA [devguide](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages) in order to get more information about page view structure.
