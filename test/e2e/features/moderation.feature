@moderation
Feature: Moderation
    As a logged customer
    I want to be able to save for later/reject photos, flag them as spam and blacklist users, one by one or several at a time.
    Also I want to be able to filter and sort the photos and navigate and select photos with the keyboard.
    So that I can see moderate media correctly

    Background:
        Given user is on the login page
        And user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        And user goes to "moderation" page
        And there is media available on moderation page
        And user goes to "moderation" page

    @sanity
    @Lemurama-Moderation-Modal-AllowedActions
    @C19766
    Scenario: Verify it is possible to reject a media
        When user selects photo number "0"
        And user clicks on Reject button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And user closes the modal
        And "rejected" counter is increased on "1"
        And media should not be on the media list

    @Lemurama-Moderation-Modal-AllowedActions
    @C19766
    @regression
    Scenario: Verify it is possible to move a media to save for later
        When user selects photo number "0"
        And user clicks on SFL button from the modal
        Then user should see the "success notification"
        And "approved" counter is increased on "1"
        When user closes the modal
        And user filters by Save for Later status
        And user searches by Username on the search box
        Then media should be on the media list

    @blacklist
    @regression
    @Lemurama-Moderation-Modal-AllowedActions
    @C19766
    Scenario: Verify that the user can blacklist a user from the modal
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"

    @spam
    @regression
    @Lemurama-Moderation-Modal-AllowedActions
    @C19766
    Scenario: Verify that the user can flag as spam a user from the modal
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"

    @smoke
    @Lemurama-Moderation-Card-SingleActions-SFL
    @C19759
    Scenario: Verify user can save for later a media from moderation page
        When user "saves for later" the "0" media
        Then user should see the "success notification"
        And media should not be on the media list
        And "approved" counter is increased on "1"

    @smoke
    @Lemurama-Moderation-Card-SingleActions-Delete
    @C19757
    Scenario: Verify user can reject a media from moderation page
        When user "rejects" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"
        And media should not be on the media list

    @spam
    @sanity
    @Lemurama-Moderation-Card-SingleActions-FlagAsSpam
    @C26575
    Scenario: Verify user can flag as spam a single media from the card
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user scrolls to the top
        And user "flags as spam" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And media should not be on the media list
        And "rejected" counter is increased on "1"

    @sanity
    @Lemurama-Moderation-BulkActions-AllowedActions
    @C19808
    Scenario: Verify user can SFL several media using bulk actions
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on SFL button from the modal
        Then user should see the "success notification"
        And "approved" counter is increased on "3"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-BulkActions-Blacklist-Confirming
    @C28994
    Scenario: Verify user can blacklist users in bulk moderation
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"

    @regression
    @Lemurama-Moderation-BulkActions-AllowedActions
    @C19808
    Scenario: Verify user can reject several media using bulk actions
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on Reject button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "3"
        And media should not be on the media list

    @spam
    @regression
    @Lemurama-Moderation-BulkActions-AllowedActions
    @C19808
    Scenario: Verify user can flag as spam several media using bulk actions
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "3"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-Counters-Tagged-BulkActions-SFL
    @C32876
    Scenario: Verify approved counter is increased and tagged counter remains the same when media is moved to SFL state
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And make sure there are no streams assigned
        And user search "OlaProd #7" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #7" stream should be tagged correctly
        When user closes the modal
        And user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on SFL button from the modal
        Then user should see the "success notification"
        And "approved" counter is increased on "3"
        And "tagged" counter is increased on "0"
        And media should not be on the media list

    @sanity
    @Lemurama-Moderation-Counters-Tagged-SingleMedia-SFL
    @C32875
    Scenario: Verify approved counter is increased and tagged counter remains the same when media is moved to SFL state
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user closes the modal
        And user "saves for later" the "0" media
        Then user should see the "success notification"
        And "tagged" counter is increased on "0"
        And "approved" counter is increased on "1"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-BulkActions-AllowedActions
    @C19827
    @SFL
    Scenario: Verify it is possible to send several media back to Pending state
        And user filters by Save for Later status
        And there is media available on save for later page
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on Send to MQ button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-BulkActions-AllowedActions
    @C19827
    @SFL
    Scenario: Verify it is possible to reject media from SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on Reject button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "3"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-BulkActions-AllowedActions
    @C19827
    @SFL
    Scenario: Verify it is possible to flag a media as spam from SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "3"
        And media should not be on the media list

    @sanity
    @Lemurama-Moderation-SFL-Modal-AllowedActions
    @C19822
    @SFL
    Scenario: Verify it is possible to send a single media from the modal to the MQ
        And user filters by Save for Later status
        And there is media available on save for later page
        When user selects photo number "0"
        And user clicks on Send to MQ button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And user closes the modal
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-Modal-AllowedActions
    @C19822
    @SFL
    Scenario: Verify it is possible to reject a single media from the modal on SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        When user selects photo number "0"
        And user clicks on Reject button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And user closes the modal
        And "rejected" counter is increased on "1"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-Modal-AllowedActions
    @C19822
    @SFL
    Scenario: Verify it is possible to flag a media as spam from SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And user closes the modal
        And "rejected" counter is increased on "1"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-Card-Reject
    @C19816
    @SFL
    Scenario: Verify it is possible to reject a single media from the media card on SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        When user "rejects" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-Card-SendToMQ
    @C19815
    @SFL
    Scenario: Verify it is possible to send back a single media to MQ from SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        When user "sends to MQ" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-SFL-BulkActions-Blacklist-Confirming
    @C28999
    @SFL
    Scenario: Verify it is possible to flag a media as spam from SFL section
        And user filters by Save for Later status
        And there is media available on save for later page
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "3"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-Counters-Tagged-SingleMedia-Rejected
    @C32869
    Scenario: Verify tagged counter is not increased when rejecting a photo with streams tagged
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clicks on Reject button from the modal
        And user confirms the alert
        Then user should see the "success notification"
        And the "rejected" counter value is "1"
        And the "tagged" counter value is "0"

    @regression
    @Lemurama-Moderation-Counters-Tagged-SingleMedia-MultipleStreamsAdded
    @C32871
    Scenario: Verify counters are not increased if no action is performed on a photo
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clears the search results
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clears the search results
        And user search "OlaProd #5" stream in the tagging tab
        And user selects first stream in the stream list result
        And user closes the modal
        Then the "approved" counter value is "0"
        And the "tagged" counter value is "0"
        And the "rejected" counter value is "0"

    @regression
    @Lemurama-Moderation-Counters-Tagged-SingleMedia-Spam
    @C32873
    Scenario: Verify tagged counter is not incremented when flagging as spam a photo with streams tagged
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And the "rejected" counter value is "1"
        And the "tagged" counter value is "0"

    @regression
    @Lemurama-Moderation-Card-SingleActions-BlacklistUser
    @C19761
    Scenario: Verify it is possible to blacklist a user from the media card
        When user "blacklist user of" the "0" media
        And user confirms the alert
        Then user should see the "success notification"
        And the "rejected" counter value is "1"
        And media should not be on the media list

    @regression
    @Lemurama-Moderation-Card-SingleActions-LookAndFeel
    @C19762
    Scenario: Validate the look and feel of moderation single media card
        And datetime is displayed on media "0"
        And caption is displayed on media "0"
        And user refines media search by selecting the option "2" from the filter "Streams"
        Then user "sees" streams on the "0" media
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user closes the modal
        Then user "does not sees" streams on the "0" media

    @regression
    @Lemurama-Moderation-LoadMore
    @C19801
    Scenario: Verify scrolling to the bottom of the page, triggers a new set of pics being loaded
        When user goes to "moderation" page
        Then user verifies an initial set of pics is displayed
        When user scrolls to the bottom
        Then the library should have more photos loaded
        And user logs out

    @regression
    @Lemurama-Moderation-LoadMore-BulkActions
    @C19803
    Scenario: Verify no more than 30 pics can be selected at once for bulk actions
        When user goes to "moderation" page
        And user clicks on Select All button
        Then all available media are selected
        When user scrolls to the bottom
        Then the library should have more photos loaded
        When the user selects media till "31" are selected
        Then user should see the "error notification"

    @SFL
    @regression
    @Lemurama-Moderation-SFL-BulkActions-Blacklist-NotConfirming
    @C29002
    Scenario: Verify a user can cancel a blacklist bulk action
        When user filters by Save for Later status
        And there is media available on save for later page
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects "5" photos for bulk
        And user clicks on bulk actions button
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        And the confirmation modal should reads "Are you sure you want to add the given user(s) to the blacklist?"
        And user cancels the alert
        And user closes the modal
        Then the "rejected" counter value is "0"

    @regression
    @Lemurama-Moderation-SFL-Look&Feel
    @Lemurama-Moderation-SFL-Card-AllowedActions
    @C19812
    @C19813
    @SFL
    Scenario: Validate the moderation SFL look and feel
        When user filters by Save for Later status
        And there is media available on save for later page
        Then checkbox for bulk actions is "unchecked"
        And bulk actions button is "disabled"
        And send to MQ option is displayed

    @regression
    @Lemurama-Moderation-SFL-LoadMore
    @C19804
    @SFL
    Scenario: Valiate the load more behavior
        Then user verifies an initial set of pics is displayed
        When user "saves for later" the "0" media
        When user scrolls to the bottom
        Then the library should have more photos loaded

    @regression
    @Lemurama-Moderation-SFL-Modal-Look&Feel
    @C19823
    @SFL
    Scenario: Validate the modal SFL look and feel
        When user filters by Save for Later status
        And user selects photo number "0"
        Then edit media box should open
        And the title Edit Media is displayed on the modal
        And send to MQ option is displayed
        And more options actions are displayed
        And arrows are visible
        And X button is visible
        And media caption is displayed
        When user closes the modal

    @regression
    @Lemurama-Moderation-SFL-Modal-Next&Prev
    @C19825
    @SFL
    Scenario: Validate the next and previous behavior in modal using SFL filter
        When user filters by Save for Later status
        And user selects photo number "0"
        And user clicks on Next button from the modal
        And a different photo from the line is displayed
        And user clicks on Prev button from the modal
        Then a different photo from the line is displayed
        And user closes the modal

    @regression
    @Lemurama-Moderation-SFL-BulkActions-Look&Feel
    @C19826
    @SFL
    Scenario: Validate the bulk actions look and feel in modal
        When user filters by Save for Later status
        And user clicks on Select All button
        Then all available media are selected
        When user clicks on bulk actions button
        Then all medias are displayed on the left panel with an 'x' button in order to remove them
        And send to MQ option is displayed
        And more options actions are displayed
        And user closes the modal

    @SFL
    @regression
    @Lemurama-Moderation-SFL-Counters-Tagged-SingleMedia-GoBackToMQ
    @C32877
    Scenario: Verify allowed actions from moderation are displayed on media card on Save for Later status
        When user filters by Save for Later status
        And there is media available on save for later page
        And user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then the "OlaProd #3" stream should be tagged correctly
        And user clicks on Send to MQ button from the modal
        And the "confirmation alert" should show
        And the confirmation modal should reads "Are you sure you want to send 1 media back to Moderation Queue?"
        When user confirms the alert
        And user closes the modal
        Then the "approved" counter value is "0"
        And the "tagged" counter value is "0"
