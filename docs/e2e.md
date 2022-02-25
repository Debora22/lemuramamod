# End to end documentation - WIP
> Hold the door, hold the door!

Functional tests are one of the bigger bug catchers we have nowadays for this project; our amazing QA team developed a robust 'framework' to support and extend the end to end test suite; this document explains how this framework works, its dependencies and which are the tasks that are fired when a PR or TAG is is created in the repository.

##Testing Fundamentals

Please read the following links to know how we implement our testing process:

* [Testing Approach] (https://photorank.atlassian.net/wiki/display/EN/Overall+testing+approach)
* [Internal QA WF] (https://photorank.atlassian.net/wiki/display/EN/Internal+QA+Workflow)
* [Our Done Criteria] (https://photorank.atlassian.net/wiki/display/EN/Ensuring+Quality+of+Deliverables+-+Done+Criteria)
* [Test Automation Strategy] (https://photorank.atlassian.net/wiki/display/EN/Test+Automation+Strategy)
* [FE Automation Starter] (https://photorank.atlassian.net/wiki/display/EN/Front+End+Automation+Testing+-+Starter+Guide)

## Manifesto
* **Few crucial tests** over tons of useless tests.
* **Reliable, robust and clean tests** over quick development.
* **Critical Paths with huge value** over high coverage.
* **Test Like a User**

## Project Structure
Structure:

```
.../scripts/
    start-selenium.sh                       #Starts the selenium server
    e2e_test.sh                             #Calls the grunt task
.../test/
    protractor-<env>-conf.js                # Protractor config File
    e2e
        /pages                              # Pages Objects
            <PageName>.js
        /features                           # Cucumber histories
            <FatureToTest>.feature
            /Steps_Definitions              # Cucumber steps
                <FeatureToTest>_steps.js
Gruntfile.js                                # Holds the grunt config and tasks
package.json                                # Dependencies and scripts calls

```

##Framework Architecture

### Webdriver manager
Our framework uses Selenium Web Driver to interact with the application's components; it was developed to better support dynamic web pages where elements of a page may change without the page itself being reloaded.
Selenium-WebDriver makes direct calls to the browser using each browser’s native support for automation. How these calls are made, and the features they support depends on the browser you are using.

### Protractor
Protractor is an end-to-end testing framework for AngularJS applications and works as a solution integrator - combining powerful tools and technologies such as NodeJS, Selenium, webDriver, Jasmine, Cucumber and Mocha.
It has a bunch of customizations from Selenium to easily create tests for AngularJS applications.
Protractor also speeds up your testing as it avoids the need for a lot of “sleeps” and “waits” in your tests, as it optimizes sleep and wait times.

It runs on top of the Selenium, and this provides all the benefits and advantages from Selenium. In addition, it provides customizable features to test AngularJS applications. It is also possible to use some drivers which implement WebDriver's wire protocol like ChromeDriver and GhostDriver, as Protractor runs on top of the Selenium.

The file that tells protractor how to run is the `/OLAPIC/LemuramaAdmin/test/protractor-<env>-conf.js`. We say `<env>` because we currently have two `.conf` files, one for running the tests on a local environment and another for running them on live environment. We are going to explain some sections that tell protractor where to look for the `.features` files (the ones that describe the scenarios to be tested) and tell which framework to use (here's where we see the link between Protractor and CucumberJS)

```
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    specs: [
        #Here is where we indicate the path to the .feature files
        'e2e/features/*.feature'        
    ],
    cucumberOpts: {
        #Here is where we indicate the path to the .js files holding the page object patterns and the coded steps
        require: './e2e/features/*/*.js',
        format: 'pretty',
        keepAlive: true
    }
```    
In the next section you can see that there are seveal libraries being initialized, the most relevants, are the ones in charge of assertions (chai, chaiAsPromised, expect), they are being initialize here so they can be globally accesed from all the steps files (i.e: `library_steps.js`) allowing us to verify expected behaviour; You may also notice, that there are some selenium commands to increase browser's timeout and to also maximize browser window during test execution.
Basically, you can think as this section as a environment preparation for the tests, please check [Reference Config](https://github.com/angular/protractor/blob/master/docs/referenceConf.js) for futher explanantion.

```
    onPrepare: function () {
        // All imports
        fs = require('fs');
        path = require('path');
        util = require('util');
        chai = require('chai');
        chaiAsPromised = require('chai-as-promised');
        chai.use(chaiAsPromised);
        expect = chai.expect;
        // Disable animations so e2e tests run more quickly
        browser.addMockModule('disableNgAnimate', function() {
            angular.module('disableNgAnimate', []).run(function($animate) {
                $animate.enabled(false);
            });
        });
        global.isAngularSite = function(flag) {
            browser.ignoreSynchronization = !flag;
        };
        browser.manage().timeouts().implicitlyWait(30000);
        browser.driver.manage().window().maximize();

    }
```

### Grunt
Grunt allows us to automate tasks related to start the application and certain dependencies that need to up and running in order to execute the tests.
All the necesary configuration is located in the file `Gruntfile.js`.
This file holds a lot of information, but in order tu understand how test cases are executed take a look at the following sections:

* **Grunt server settings:** Here is where we specify the parameters that will be read and taken as input for certain tasks involved in the execution of the tests.
The server settings section belongs to the `init.Config()` function of grunt (allows to define everything you want to load or use while running the automated tasks).
You have different configurations:  `default`, `standard`, `test`, `e2e`. These configurations are sent as parameters to a grunt task, but we'll talk about that later. Here's an example of what you can see on the section:

```
 connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            e2e: {
                options: {
                    port: 9003,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/app/components',
                                connect.static('./app/components')
                            ),
                            connect.static(appConfig.app)
                            ];
                    }
                }
            }
```

* **Functional test configuration:** Here you define where you want to execute your tests: locally or against live environment. The information that protractor needs about the browser to load, which port to use, where are the .features files located that hold the testing steps, etc, is located on the file `protractor-<env>-conf.js`. In addition we have information about the source and destination of the html report which is generated after the test were executed.
This section also belongs to the `init.Config()` function.

```
protractor: {
            ...
            },
            local: {
                options: {
                    configFile: 'test/protractor-devel-conf.js'
                }
            },
            live: {
                options: {
                    configFile: 'test/protractor-live-conf.js'
                }
            }
        },
        cucumber_html_report: {
            options: {
                src: 'test/e2e/report/src/e2e-test-results.json', // input file
                dst: 'test/e2e/report/e2e-test-results' // output directory
            },
            files: {
            }
        },
```
This is the last that we need to see on the `init.Config()` function, now we are going to move to the `grunt.registerTask()` function.

* **Tasks to execute the tests:** The `registerTask()` function is usefull to do a combination of tasks, these are the ones that we care in order to know how our tests are executed:

```
    grunt.registerTask('test:e2e:local', [
        'connect:e2e',
        'protractor:local'
    ]);

    grunt.registerTask('test:e2e:live', [
        'protractor:live'
    ]);

    grunt.registerTask('test:build', 'Run functional test', function(target) {
        if (target === 'local') {
            return grunt.task.run(['test:unit','test:e2e:local']);
        } else if (target === 'e2e') {
            // Temporal task for run the test in pull requests
            return grunt.task.run(['test:unit','test:e2e:live']);
        } else {
            return grunt.task.run(['test:unit']);
        }
    });
```
Let's analyze the task so we can understand what we are dealing with:

```
grunt.registerTask('test:e2e:local', [
        'connect:e2e',
        'protractor:local'
    ]);

```
The task `test:e2e:local` tells protractor which configuration has to read to run the tests locally (defined in the `init.Config()` function).

So in order to **wrap things up**, when you execute the command to execute the tests:
`npm run e2e-local --tags @<name_of_the_tag>` what you actually do is:

* Read the `package.json` that searches for the script to execute when receives the parameter: e2e-local.
* The script to execute (according to the package.json)is: `e2e_test.sh local`
* Now if you go to `scripts/e2e_test.sh` you will find the grunt task to execute, which is `test:e2e`
* And if you search for the task on the grunt file you will see:

```
grunt.registerTask('test:e2e:local', [
        'connect:e2e',
        'protractor:local'
    ]);
```
The body of the function holds 'calls' to the configurations defined in the server settings section and in the functional test configuration section.


### Cucumber JS
It is a framework used for BDD, based on Gherkin. It allows you to write the tests as .feature files using the "given-when-then" syntax and match each step with the code that is going to be executed by protractor.

#### .feature sample test:

```
@smoke
Scenario: Authenticated user select an account
        Given user is on the login page
        When user sends correct access credentials
        And the user selects "modsquadqa" account on the list
        Then user sees that library is displayed
```
Each of these steps has to be coded so that Protractor can execute it via the web driver, so here is an example:

The @smoke is a tag, we have tags defined per feature and for test type (smoke or regression). While coding the tests you can add the tag that you want: @current, @wip, @blabla in order to only execute the tests you are currently working on.

#### sample step coded:
```
this.Then(/^user sees that library is displayed$/, function(done) {
expect(libraryPage.libraryBoxContainer.get(0).isDisplayed()).to.eventually.be.true.and.notify(done);
});
```
The **"expect"** is where you can see Protractor and Chai in action: this method basically resolves a promise that evetually the Media Library with the grid of photos is going to be visible.

### Page Objects Pattern
The functional tests follows the **Page-Object pattern**. In simple words:
The Page Object pattern represents the screens of your web app as a series of objects
and encapsulates the features represented by a page. It allows us to model the UI in our tests.

It Reduces the duplication of code,  makes tests more readable and robust and improves the maintainability of tests.

### Naming convention

#### Page Object:

```
javascript
'use strict';

var XXXXPage  = function() {
    // Mapping elements
    this.<PAGE_ELEMENT> = element.<SELECTOR>;

    // Methods
    /**
     * DESCRIPTION OF WHAT THE METHOD DOES
     * @param element
     * @returns {*}
     */

    this.<METHOD_NAME_BY_ACTION> = function(element) {
      .
      .
      .
      .

    };

};
module.exports = XXXXPage;
```

#### Steps:
File name `XXXX_steps.js`

```
javascript
'use strict';

var xxxxPage = require('../../pages/xxxxPage');

var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating of errors on console

module.exports = function() {
    var xxxxPage;

    this.Before(function() {
        xxxxPage = new xxxxPage();
    });

    /*Given*/
    this.Given(/^<DESCRIPTION_OF_GIVEN_STEP>$/, function(done) {
        xxxxPage.go();
        browser.driver.wait(EC.visibilityOf(loginPage.emailInput));
        done();
    });

    /*When*/
    this.When(/^<DESCRIPTION_OF_WHEN_STEP>$/, function(done) {
        <METHODS_HERE>
        done();
    });

    /*Then*/
    this.Then(/^<DESCRIPTION_OF_THEN_STEP>$/, function(done) {
        expect(accountsPage.accountsList.get(0).isDisplayed()).
            to.eventually.be.equal(true, 'The account screen is not present').and.notify(done);
    });
};

```

### Test Data
```bash
Customer template name: modsquadqa
Customer id: 217950
```
The customer has media that has/is being collected by following instagram and twitter public profiles, enabling certain hashtags (they are disabled at the moment) and also using Places collector.

There are a few streams created for different testing purposes according to business rules we'd like to test.
They'll be used according to the testing scope defined during certain plannings.


### Reporting
Test reports with errors and its corresponding image are generated with the grunt task `cucumber_html_report`, it uses previously generated JSON output file from hook, on `../support/JsonOutputhook.js`

```
javascript
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

```

## HowTo Execute tests

### Server execution

First of all the selenium server needs to be up and running, so:

`npm run selenium`

To run the tests:

`npm run e2e:live --tags @<name_of_the_tag>`

The command indicates protractor that has to execute the tests against live env. This means that has to use the live url.

### Local execution

First of all the selenium server needs to be up and running, so:

`npm run selenium`

To run the tests:

`npm run e2e:local --tags @<name_of_the_tag>`

The command indicates protractor that has to execute the tests locally.

### Staging execution

First of all the selenium server needs to be up and running, so:

`npm run selenium`

To run the tests:

`npm run e2e:live --baseUrl <stg_url> --tags @<name_of_the_tag> --seleniumAddress http://localhost:4444/wd/hub`

The command indicates protractor that has to execute the tests locally but pointing to a STG environment. The parameter `seleniumAddress` tells protractor to use the local selenium.

## Project Fundamentals
Usefull links for more information:
- [Protractor](http://angular.github.io/protractor/) *Test Platform*
- [Chai](http://http://chaijs.com/) *Assertion and language*
- [Cucumber](https://github.com/cucumber/cucumber-js)
- [Web Driver](http://www.seleniumhq.org/projects/webdriver/)
