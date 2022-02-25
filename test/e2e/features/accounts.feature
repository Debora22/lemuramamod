    @accounts
    Feature: Accounts
    As a customer
    I want to be able to login and select an account for work
    So that I can access restricted features

    @regression
    Scenario: Authenticated user select an account
        Given user is on the login page
        When user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        Then user sees that library is displayed

    @smoke
    @Lemurama-SwitchAccounts-Look&Feel
    @Lemurama-SwitchAccounts-MediaDisplayed
    @C22959
    @C22960
    Scenario: User can switch between accounts by cliking on switch account button
        Given user is on the login page
        And user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        And user sees that library is displayed
        And user selects photo number "0"
        And user closes the modal
        When user attempts to Switch Account
        And user confirms switch account before submitting
        Then user is redirected to account page
        When the user selects "qalemuraccount" account on the list
        Then media should not be on the media list

    @regression
    @Lemurama-SwitchAccounts-MaintainTheSection
    @C23539
    Scenario: Validate the last section where the user was logged in to a brand is maintained
        Given user is on the login page
        And user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        And user goes to "tagging" page
        And user attempts to Switch Account
        And user confirms switch account before submitting
        Then user is redirected to account page
        When the user selects "qalemuraccount" account on the list
        And user goes to "moderation" page
        And user attempts to Switch Account
        And user confirms switch account before submitting
        Then user is redirected to account page
        When the user selects "enforcersqa" account on the list
        Then user is redirected to tagging page
        And user attempts to Switch Account
        And user confirms switch account before submitting
        Then user is redirected to account page
        When the user selects "qalemuraccount" account on the list
        And user is redirected to moderation page
