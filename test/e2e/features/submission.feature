@submission
Feature: Submission form
    As a logged moderator
    I want to be able to submit the work I performed on a moderation session

    Background:
        Given user is on the login page
        When user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored

    @smoke
    @Lemurama-Submission-SwitchAccount
    @Lemurama-NavBar-Counters-SwitchAccount
    @Lemurama-NavBar-Timing-SwitchAccount
    @C41003
    @C23921
    @C23910
    Scenario: Verify the proper values appear on the submission form when clicking on switch account option
        When user goes to "premod" page
        And user perform random moderation actions for "1" minute
        And user pauses the timer
        And user attempts to Submit and Switch Account
        Then the form values match with the counters
        And cancel and submit buttons are "enabled"
        And the reason input field is hidden
        When user confirms submit the work and switch account
        And the user selects "enforcersqa" account on the list
        And user goes to "premod" page
        Then the "tagged" counter value is "0"
        And the "rejected" counter value is "0"
        And the "approved" counter value is "0"
        And the "moderation time" counter value is "0hs:0min"
        When user attempts to Submit and Switch Account
        Then the form values match with the counters
        And user clicks on cancel button

    @sanity
    @Lemurama-Submission-LogOut
    @Lemurama-NavBar-Counters-LogOut
    @Lemurama-NavBar-Timing-LogOut
    @C23909
    @C41004
    @C23922
    Scenario: Verify the proper values appear on the submission form when clicking on log out option
        When user goes to "premod" page
        And user perform random moderation actions for "1" minute
        And user pauses the timer
        And user attempts to Logout
        Then the form values match with the counters
        And cancel and submit buttons are "enabled"
        And the reason input field is hidden
        When user confirms submit the work and logout
        And user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user goes to "premod" page
        Then the "tagged" counter value is "0"
        And the "rejected" counter value is "0"
        And the "approved" counter value is "0"
        And the "moderation time" counter value is "0hs:0min"
        When user attempts to Logout
        Then the form values match with the counters
        And user clicks on cancel button

    @smoke
    @Lemurama-Submission-EditInformation
    @C41005
    Scenario: Verify it is possible to edit the values from the submission form and save the edition
        When user attempts to Submit and Switch Account
        And user edits the "approved" input with "20" value
        And user edits the "rejected" input with "10" value
        And user edits the "tagged" input with "5" value
        And user edits the "hours" input with "12" value
        And user edits the "minutes" input with "23" value
        Then the reason field is displayed empty
        When user edits the "reason" input with "I took my dog outside" value
        And user confirms submit the work and switch account
        Then user should see the "success notification"

    @regression
    @Lemurama-Submission-MaxValues
    @C41006
    Scenario: Validate the fields have the proper max and min values
        When user attempts to Submit and Switch Account
        And user edits the "hours" input with "28" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "hours" input with "15" value
        And user edits the "minutes" input with "89" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "minutes" input with "30" value
        And user edits the "approved" input with "35647" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "approved" input with "3564" value
        And user edits the "rejected" input with "617289320" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "rejected" input with "7654" value
        And user edits the "tagged" input with "98273849912" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "tagged" input with "765" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "reason" input with "I took my dog outside" value
        And user confirms submit the work and switch account
        Then user is redirected to account page

    @regression
    @Lemurama-Submission-FieldsValuesTypes
    @C41007
    Scenario: Validate the fields allow only numeric values
        When user attempts to Submit and Switch Account
        And user edits the "hours" input with "&&&&" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "hours" input with "15" value
        And user edits the "minutes" input with "abcd" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "minutes" input with "35" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "approved" input with "=)(&^" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "approved" input with "79" value
        And user edits the "rejected" input with "<>,*7&&" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "rejected" input with "90" value
        And user edits the "tagged" input with "123@@" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "tagged" input with "123" value
        And user confirms submit the work and switch account
        Then the submission form remains displayed
        When user edits the "reason" input with "I took my dog outside" value
        And user confirms submit the work and switch account
        Then user is redirected to account page

    @regression
    @Lemurama-Submission-Edit-NotConfirming-Cancel
    @C41008
    @defect
    #LEM-420
    Scenario: Validate user can cancel the submission after editing all the fields from the form
        When user goes to "premod" page
        And user perform random moderation actions for "1" minute
        And user pauses the timer
        And user attempts to Submit and Switch Account
        And user edits the "approved" input with "129" value
        And user edits the "rejected" input with "450" value
        And user edits the "tagged" input with "47" value
        And user edits the "hours" input with "5" value
        And user edits the "minutes" input with "48" value
        Then the reason field is displayed empty
        When user edits the "reason" input with "I took my dog outside" value
        And user clicks on cancel button
        When user attempts to Logout
        Then the reason input field is hidden
        And the form values match with the counters
        And user clicks on cancel button

    @regression
    @Lemurama-Submission-NotAddingReason
    @C41009
    Scenario: Validate the user is required to specify a reason when editing the counter values
        When user attempts to Submit and Switch Account
        And user edits the "approved" input with "129" value
        And user edits the "rejected" input with "450" value
        And user edits the "tagged" input with "47" value
        And user edits the "hours" input with "5" value
        And user edits the "minutes" input with "48" value
        Then the reason field is displayed empty
        When user confirms submit the work and switch account
        And user edits the "reason" input with "I took my dog outside" value
        And user confirms submit the work and switch account
        Then user is redirected to account page

    @sanity
    @Lemurama-SwitchAccount-Cancel-Without-Submission
    @Lemurama-NavBar-Counters-Look&Feel
    @C46696
    @C46697
    @C23918
    Scenario: Validate the user can switch account and cancel without submission
        When user attempts to Switch Account
        And cancel and switch account buttons are "enabled"
        And user confirms switch account before submitting
        And the user selects "enforcersqa" account on the list
        And user goes to "premod" page
        Then the "tagged" counter value is "0"
        And the "rejected" counter value is "0"
        And the "approved" counter value is "0"
        And the "moderation time" counter value is "0hs:0min"
        When user attempts to Switch Account
        And user clicks on cancel button on the switch account modal
        Then the "tagged" counter value is "0"
        And the "rejected" counter value is "0"
        And the "approved" counter value is "0"
        And the "moderation time" counter value is "0hs:0min"

    @regression
    @Lemurama-Submission-SwitchAccount-Cancel
    @C48565
    Scenario: Validate the timer is paused when the user clicks on switch account
        When user attempts to Switch Account
        Then the timer is paused
        When user clicks on cancel button on the switch account modal
        Then the timer is running

    @regression
    @Lemurama-Submission-SwitchAccount-Paused
    @Lemurama-NavBar-Timing-NotConfirming
    @C48568
    @C23911
    Scenario: Validate the timer remains paused after the user clicks on submit and switch account/logout
        When user pauses the timer
        And user attempts to Submit and Switch Account
        Then the timer is paused
        When user clicks on cancel button
        Then the timer remains paused with the proper values
        When user attempts to Logout
        Then the timer is paused
        When user clicks on cancel button
        Then the timer remains paused with the proper values
