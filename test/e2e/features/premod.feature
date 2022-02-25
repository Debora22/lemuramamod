@premod
Feature: Premoderation
    As a logged customer
    I want to be able to approve/reject photos, flag them as spam and blacklist users, one by one or several at a time.
    Also I want to be able to filter and sort the photos and navigate and select photos with the keyboard.
    So that I can see moderate media correctly

    Background:
        Given user is on the login page
        When user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        And user goes to "premod" page
        And there is media available on premod page
        And user goes to "premod" page


    @regression
    @Lemurama-Premod-SingleActions-HoverOnAMedia
    @C18792
    Scenario: Verify user can navigate thru photos
        When the user moves between medias using arrows keys
        Then the user should see that media is "highlighted"
        When the user press the spacebar key over a library media
        Then the user should see that media is "selected"

    @smoke
    @Lemurama-Premod-SingleActions-Approve
    @C17909
    Scenario: Verify user can approve a media
        When user "approves" the "0" media
        Then user should see the "success notification"
        And media should not be on the media list
        And "approved" counter is increased on "1"

    @smoke
    @Lemurama-Premod-SingleActions-Reject
    @C17907
    Scenario: Verify user can reject a media
        When user "rejects" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And media should not be on the media list
        And "rejected" counter is increased on "1"

    @spam
    @regression
    @Lemurama-Premod-SingleActions-MoreOptions
    @C17908
    Scenario: Verify user can flag a media as spam
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user "flags as spam" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And media should not be on the media list
        And "rejected" counter is increased on "1"

    @blacklist
    @regression
    @Lemurama-Premod-SingleActions-MoreOptions
    @C17908
    Scenario: Verify user can blacklist a social media user
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user "blacklist user of" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"

    @regression
    @Lemurama-Premod-Modal-Look&Feel
    @C18794
    Scenario: Verify that image viewer is opened when selecting a media
        When user selects photo number "0"
        Then edit media box should open

    @regression
    Scenario: Verify that medias are filtered when using filters
        When user refines media search by selecting the option "2" from the filter "Username"
        And user selects photo number "0"
        Then the media found should match the username filter criteria

    @smoke
    @Lemurama-Premod-Approve&Reject-MultipleMedia
    @C18941
    @defect
    #LEM-420
    Scenario: Verify that user can approve three media and reject other selecting three at a time
        When user selects "3" photos for bulk
        And the user clicks on approve selected and reject all other button
        Then user should see the "success notification"
        And "approved" counter is increased on "3"
        And "rejected" counter is increased on "27"
        And media should not be on the media list

    @regression
    @Lemurama-Premod-Modal-ClickOnNextPrev
    @C18795
    Scenario: Verify that the user can click on next and prev buttons from the modal
        When user selects photo number "0"
        And user clicks on Next button from the modal
        And user clicks on Next button from the modal
        And user clicks on Next button from the modal
        And user clicks on Prev button from the modal
        And user clicks on Prev button from the modal
        And user clicks on Prev button from the modal
        Then media should be on the media list

    @sanity
    @Lemurama-Premod-Modal-AllowedActions
    @C18797
    Scenario: Verify that the user can approve a photo from the modal
        When user selects photo number "0"
        And user clicks on Approve button from the modal
        Then user should see the "success notification"
        And media should not be on the media list
        And "approved" counter is increased on "1"

    @regression
    @Lemurama-Premod-Modal-AllowedActions
    @C18797
    Scenario: Verify that the user can reject a photo from the modal
        When user selects photo number "0"
        And user clicks on Reject button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And media should not be on the media list
        And "rejected" counter is increased on "1"

    @blacklist
    @regression
    @Lemurama-Premod-Modal-AllowedActions
    @C18797
    Scenario: Verify that the user can blacklist a user from the modal
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"

    @spam
    @regression
    @Lemurama-Premod-Modal-AllowedActions
    @C18797
    Scenario: Verify that the user can flag as spam a user from the modal
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"

    @regression
    @Lemurama-Premod-Modal-ClosingTheModal
    @C18796
    Scenario: Verify that user can close the modal by clicking on X option
        When user selects photo number "0"
        Then edit media box should open
        And user closes the modal

    @spam
    @smoke
    @Lemurama-Premod-FlagAsSpam-BulkActions-Confirming
    @C33695
    Scenario: Verify that the user can flag as spam three media
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects "3" photos for bulk
        And the user clicks on flag as spam button
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"

    @sanity
    @Lemurama-Premod-Blacklist-BulkActions-Confirming
    @C28987
    Scenario: Verify user can blacklist user in bulk action
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects "3" photos for bulk
        Then Blacklist button is "enabled"
        When user clicks on Blacklist button on premod
        And user confirms the alert
        Then user should see the "success notification"

    @sanity
    @Lemurama-Premod-Blacklist-BulkActions-ClickOnOnlyOnePic
    @C28991
    Scenario: Verify user can not click the blacklist button with one media selected
        When user selects "1" photo for bulk
        Then Blacklist button is "disabled"

    @regression
    @Lemurama-Premod-Counters-Tagged-SingleMedia-Approved
    @C32853
    Scenario: Verify approved counter is increased when a photo is approved and it has streams
        When user refines media search by selecting the option "2" from the filter "Streams"
        And user selects photo number "0"
        And user clicks on Approve button from the modal
        Then user should see the "success notification"
        And "approved" counter is increased on "1"
        And the "tagged" counter value is "0"
        And the "rejected" counter value is "0"

    @regression
    @Lemurama-Premod-Counters-Tagged-SingleMedia-Rejected
    @C32854
    Scenario: Verify rejected counter is increased when a photo is reject and it has streams
        When user refines media search by selecting the option "2" from the filter "Streams"
        And user selects photo number "0"
        And user clicks on Reject button from the modal
        Then the "confirmation alert" should show
        And the confirmation modal should reads "Are you sure you want to reject 1 media?"
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"
        And the "tagged" counter value is "0"
        And the "approved" counter value is "0"

    @regression
    @Lemurama-Premod-Counters-Tagged-BulkActions-Approved
    @Lemurama-Premod-Counters-Tagged-BulkActions-Rejected
    @C32855
    @C32856
    @defect
    #LEM-420
    Scenario: Verify tagged counter is not increased when approve selected and reject multiple photos with streams
        When user refines media search by selecting the option "2" from the filter "Streams"
        And user selects "4" photos for bulk
        And the user clicks on approve selected and reject all other button
        Then user should see the "success notification"
        And "approved" counter is increased on "4"
        And "rejected" counter is increased on "26"
        And the "tagged" counter value is "0"
