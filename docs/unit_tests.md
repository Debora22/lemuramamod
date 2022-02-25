# Unit Tests
> Please don't eat the help!. [*](quotes.md#unit)

Unit tests are important part of an solid application but keep in mind that **Few crucial tests** are more important than tons of useless tests.

### Watch for changes
There is an `npm` script to start watching the unit tests file, when a file changes; `karma` will re run the test suite again.

Execute:
```bash
npm run test:watch
```

### Coverage report
There is an `npm` script to create a coverage reporter after run the unit test.

Execute:
```bash
npm run test:coverage
```

### Develop
Every time you create/edit a module/service/whatever, create a unit tests file for it.
You can mark it as `only` to execute skip all other tests with the `fit`. The f letter
allow us to to focus the spec

```javascript
fit('should...', function () {});
```

or in the case of the whole suite use `fdescribe`

```javascript
fdescribe('The API service:', function() {});
```
