'use strict';
module.exports = function() {
    /**
     * The setDefaultTimeOut function on env.js, is intended to add more time for
     * Scenarios that at verification takes more time than usual, this
     * is generally used because the application takes too long.
     */
    this.setDefaultTimeout(90 * 10000);
    /**
     * This before scenario, is in charge of being called by cucumber
     * to add scenario info.
     */
    this.Before(function(scenario, callback) {

        global.scenario = scenario;
        callback();
    });
    /**
     * This class is intended to log test message to a file that would be
     * later used for reporting
     * @param text
     */
    global.logg = function(text) {
        console.log(text);
        if (global) {
            global.scenario.attach(text);
        }
    };
};
