'use strict';

angular.module('op.rome', []);

angular.module('op.rome')
.provider('rome', function() {

    var settings = {
        basePath: '../'
    };

    return {
        set: {
            basePath: function(path) {
                settings.basePath = path;
            }
        },
        $get: [function() {
            return {
                getTemplatesPath: function(moduleName) {
                    var path = settings.basePath + '/' + moduleName + '/src/statics/partials/';
                    return path.replace(/[\/\/]+/g, '/').replace(/(\.\.\/[^\/]+\/)+/g, '');
                },
                getImagesPath: function(moduleName) {
                    var path = settings.basePath + '/' + moduleName + '/src/statics/img/';
                    return path.replace(/[\/\/]+/g, '/').replace(/(\.\.\/[^\/]+\/)+/g, '');
                }
            };
        }]
    };
});
