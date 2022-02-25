'use strict';

const fs = require('fs');
const defaultConfig = require('../../../../etc/config.js');

module.exports = {
  register: (c) => {
    c.set('settings', (c) => {
      const path = c.get('appPath');
      const env = c.get('env');
      let result;
      if (env) {
        const settingsFile = `${path}/etc/${env}.json`;
        console.log(`Reading settings from ${settingsFile}`);
        result = JSON.parse(fs.readFileSync(settingsFile));
      } else {
        console.log('Using settings from the environment');
        result = defaultConfig;
      }

      return result;
    });
  }
};
