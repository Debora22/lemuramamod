#  Tracking for internal events
This module is used for internal tracking.
It supports persisting tracking counters for any user-defined action during the application lifecycle.
When the Init method is called, the counters are retrieved from the backend, the the counters are being updated
client side

## Usage

### trackAction(string, int);
First parameter is the actions you want to track
Second parameter is the quantity to increase the counter of that action.

```javascript
internalTrackingService.trackAction('approved', 12);
```

### onCounterChange(callback)
Include a callback to be called when some of the tacking counter are modified.
It returns the complete list of counters and values.

### getCountersData();
Retrieve an object with the list of counters and values.

### init();
Get the values from backend and set the counter values
