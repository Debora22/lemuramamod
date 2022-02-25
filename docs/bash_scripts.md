# bash scripts
> But she is ready to become Someone Else. [*](quotes.md#bash)

The following is a list of available bash scripts in the repository; currently most of them are called from the [npm scripts](https://docs.npmjs.com/misc/scripts) but it doesn't mean that we can include new scripts to be called from somewhere else.

### Location and permissions
All the bash scripts are located inside the directory [./scripts](https://github.com/Olapic/LemuramaModsquad/tree/master/scripts);
As you may imagine by now, this scripts have execution permissions and can be run directly from the console; We **don't recommend** this because others developers may not notice of the existence of new scripts;
So, if you're going to introduce a new scripts, create and document an npm's script to run it;

There's always an exception to the rule; the script `install_hooks.sh` should by [manually run the first time](docs/local_enviroment_setup.md#lemurama_Modsquad_setup) you clone the repository.

Finally, it's important to keep update this document with the latest scripts. So please, if you introduced / modify / remove any script int the repository update this it.

### Available bash scripts
Date: 20/04/2017

* `build.sh`: run the Grunt task which build the AngularJS app.
* `cucumber_report.sh`: run the Grunt task to build a report based on previous execution of the script `e2e-test.sh` with environment `local`. More information in the [e2e reporting section](docs/e2e.md#reporting).
* `e2e_test.sh`: generate a build with environment `live` and run a Grunt task with the end to end suite case, more information in the [end to end scripts documentation](docs/e2e.md).
* `e2e_test_local.sh`: config and call the script `start_server_local.sh` to run on PORT 9003; run the end to end Grunt task with environment `local`, finally kill the NodeJS Server; more information on the [end to end suite test documentation](docs/e2e.md#grunt-task).
* `install-hooks.sh`: link the [Github hooks](docs/github_hooks.md) files to your local `.git/` directory and configure `git`'s commit template.
* `postinstall.sh`: run `bower install` to get the frontend dependencies and update the `webdriver-manager`.
* `start_server_local.sh`: run the NodeJS Server with local environment. This script allow and extra param to execute the tool `devtool`; which allows you to profile, debug and develop the NodeJS server; you can also tell the Server to run on a particular por by setting the environment variable `PORT` (default value 9000).
* `start_server.sh`: run the `middleware`'s server with `live` environment.
* `start-selenium.sh`: update and start the `webdriver-manager` to allow you to run the [end to end suite test](docs/e2e.md#webdriver-manager).
* `unit-test.sh`: run the unit test suite through the Grunt task. This script allow an extra para to watch changes on the test's source.  [end to end suite test](docs/e2e.md#webdriver-manager). If you want to create the coverage reporter after run the unit test add the `coverage` param.
* `build.sh`: build scss files to css files through grunt task.
* `install.sh`: install sass gem needed to build sass files.
* `watch.sh`: watch for sass files changes through grunt task.
