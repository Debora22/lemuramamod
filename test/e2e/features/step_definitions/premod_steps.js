'use strict';

var PremodPage = require('./../../pages/PremodPage');

module.exports = function() {
    var premodPage;

    this.Before(function() {
        premodPage = new PremodPage();
    });

    /*WHEN*/
    this.When(/^user clicks on Blacklist button on premod$/, function(done) {
        premodPage.blacklistButton.click().then(done);
    });

    /*THEN*/
    this.Then(/^Blacklist button is "(enabled|disabled)"$/, function(status, done) {
        switch (status) {
            case 'enabled':
                expect(premodPage.blacklistButton.isEnabled())
                .to.eventually.be.equal(true).and.notify(done);
            break;
            case 'disabled':
                expect(premodPage.blacklistButton.isEnabled())
                .to.eventually.be.equal(false).and.notify(done);
            break;
        }
    });
};
