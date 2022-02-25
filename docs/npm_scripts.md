# npm scripts
> Go on. Do your Duty. [*](quotes.md#npm)

As you may notice at this point, we use [npm](https://www.npmjs.com/) as node package manager. Npm [allow scripts](https://docs.npmjs.com/misc/scripts) which are used to perform operations; the objective of this document is to describe the scripts this project has;

It's important to note that this document should keep updated with the latest scripts. So please, if you introduced / modify / remove any script on the `package.json`; update this document.

### Available npm scripts
Date: 08/05/2016

* `postinstall`: this task runs after `npm` installs all the dependencies, and it executes the script [`scripts/postinstall`](docs/bash_scripts.md#postinstall).
* `build:live`: Execute the bash script [scripts/build.sh](docs/bash_scripts.md#available-bash-scripts) which build the AngularJS. Used by the [Jenkins' task](docs/deployment.md). **TODO update Jenkins's task to call `npm run build:live`**
* `test`: Execute the script [scripts/unit-test.sh](docs/bash_scripts.md#available-bash-scripts) which run the unit tests suite; Used by the hook [pre-commit](docs/hooks.md#pre-commit).
* `test:unit:watch`: Execute the script [scripts/unit-test.sh](docs/bash_scripts.md#available-bash-scripts) with the param `watch` which run karma on non single mode. More information in the [unit test documentation](docs/unit_tests.md#watch_for_changes).
* `e2e:live`: **Currently not working** Execute the script [scripts/e2e_test.sh](docs/bash_scripts.md#available-bash-scripts) which build the AngularJS with `live` environment and run the end to end suite. Script **used by the [Jenkins' task](docs/deployment.md)**.
* `e2e:local`: **Currently not working** Execute the script [scripts/e2e_test_local.sh](docs/bash_scripts.md#available-bash-scripts) which run the end to end suite with local environment.
* `report`: Execute the script [scripts/cucumber_html_report.sh](docs/bash_scripts.md#available-bash-scripts) which create a cucumber report based on previous execution of the script `e2e-local`. More information in the [e2e reporting section](docs/e2e.md#reporting).
* `start`: Execute the script [scripts/start_server.sh](docs/bash_scripts.md#available-bash-scripts); **this script is called by Elastic Beanstalk to run the server**.
* `start:live`: Execute the script [scripts/start_server.sh](docs/bash_scripts.md#available-bash-scripts) with the environment constant `NODE_ENV` set as `local` to run the server locally consuming information from live.
* `start:local`: Execute the script [scripts/start_server_local.sh](docs/bash_scripts.md#available-bash-scripts) which start the server locally.
* `start:debug`: Execute the script [scripts/start_server_local.sh](docs/bash_scripts.md#available-bash-scripts) with the environment constant `RUN_DEVTOOL` set as `1` to allow you to profile, debug and develop the NodeJS server.
* `start:vagrant`: script not implemented yet.
* `selenium`: Execute the script [scripts/start-selenium.sh](docs/bash_scripts.md#available-bash-scripts) which start the selenium server.
* `scss:build`: Execute the script [scripts/scss/build](docs/bash_scripts.md#available-bash-scripts) which build sass files.
* `scss:install`: Execute the script [scripts/scss/install](docs/bash_scripts.md#available-bash-scripts) which install sass gem.
* `scss:watch`: Execute the script [scripts/scss/watch](docs/bash_scripts.md#available-bash-scripts) which watch scss files changes.
