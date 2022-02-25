/**
 * This creates a JSON file that it's later going to be consumed by the gulp task test-e2e-report
 */
var Cucumber = require('cucumber');
fs = require('fs-extra');
path = require('path');

var JsonFormatter = Cucumber.Listener.JsonFormatter();
var reportFile = '../../report/src/e2e-test-results.json';

module.exports = function JsonOutputHook() {
    JsonFormatter.log = function(json) {
        var destination = path.join(__dirname, reportFile);
        fs.open(destination, 'w+', function(err, fd) {
            if (err) {
                fs.mkdirsSync(destination);
                fd = fs.openSync(destination, 'w+');
            }
            fs.writeSync(fd, json);
            console.log('json file location: ' + destination);
        });
    };
    this.registerListener(JsonFormatter);
};
