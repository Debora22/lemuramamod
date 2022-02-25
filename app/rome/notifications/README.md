# Notification
This provider is a wrapper of notify and allow you fire notifications

```HTML
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-notify/angular-notify.min.js"></script>
<script src="notifications/src/notifications.js"></script>
<script src="notifications/src/providers/notificationProvider.js"></script>
```

Add the notifications module as a dependency to your application module:

```JavaScript
module('app', ['op.notifications'])
```

Init the settings

```JavaScript
.config(['notificationsProvider', function(notifications) {
    notifications.setSettings({
        position: 'right',
        duration: 8000
    });
}])
```

How to fire a notification

```JavaScript

notification.success('message');
```


## Bower dependencies
```json
{
  "devDependencies": {
    "angularjs": "1.5",
    "angular-notify": "~2.5.0",
  }
}
```
