
## SASS

After the Johnny unification, Lemurama started to use SCSS format, so it needs from SASS to compile the stylesheets.
All the commands runs from `npm`. Lemurama build their johhny css files in realtime after we run the application in local or in live.

### Installing SASS

Running the following command will install you the Ruby gem needed to build scss files:

```
npm run scss:install
```

### Watching for changes on Johnny's source

To activate the `watch` option from `SASS`:

```bash
npm run scss:watch
```

NOTE: In the future we are going to migrate all the lemurama css files to sass and we have to modify this grunt task

### Building without watching

If you want to make a build but without checking your directory for changes, just run this:

```bash
npm run scss:build
```
