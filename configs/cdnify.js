'use strict';

var data = require('google-cdn-data');
// Temporal until npm use the tag:
// https://github.com/shahata/google-cdn-data/releases/tag/0.1.20
data.jquery.versions.push('2.1.4');
data['jquery-ui'].versions.push('1.11.4');

// Let's us cdnjs for big libs;
// Use the the lib's name as index;
// respect the same name from the file bowser.json
data.d3 = {
    // versions should contain all the valid version of the lib
    versions: ['3.3.13'],
    // url should return the final url of the cdn; you can use
    // the first argument of the function will be the version of the lib
    // you can use it to indicate diferents urls.
    url: function () {
        return '//cdnjs.cloudflare.com/ajax/libs/d3/3.3.13/d3.min.js';
    }
};

module.exports = data;
