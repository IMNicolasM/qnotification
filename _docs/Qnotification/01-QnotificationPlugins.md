# Qnotification | Plugins

## laravel-echo
Use [laravel-echo](https://github.com/laravel/echo) exteral package to listen pusher notifications

- **getKeys** Requets pusher keys to notification providers module
- **doConnection** Instance Laravel Echo
- **openChannel** Open channel `imagina.notifications` and listen `.notification.new.{userId}` 
    - If body notification contain `frontEvent` parameter, will be dispath a local event with that name
    - If body notification no contains `isAction` parameter, dispath local event `inotification.notifications.new` to add it to drawer notification