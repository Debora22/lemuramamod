module.exports = function TakeScreenshot() {
    this.setDefaultTimeout(100 * 1000);

    this.After(function(scenario, callback) {
        if (scenario.isFailed()) {
            browser.takeScreenshot().then(function(png) {
                var decodedImage = new Buffer(png, 'base64').toString('binary');
                scenario.attach(decodedImage, 'image/png');
                callback();
            });
        } else {
            callback();
        }
    });
};
