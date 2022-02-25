@qa
Feature: QA
  As a logged customer
  I want to be able to approve/reject photos, flag them as spam and blacklist users, one by one or several at a time.
  Also I want to be able to filter and sort the photos and navigate and select photos with the keyboard.
  So that I can properly QA the media

  Background:
    Given user is on the login page
    And user sends correct access credentials
    And the user selects "enforcersqa" account on the list
    And user makes sure the session is not restored
    And user goes to "qa" page
    And there is media available on qa page
    And user goes to "qa" page

  @sanity
  @Lemurama-QA-Modal-AllowedActions
  @C87601
  Scenario: Verify it is possible to reject a media from the modal
    When user selects photo number "0"
    And user clicks on Reject button from the modal
    Then the "confirmation alert" should show
    When user confirms the alert
    Then user should see the "success notification"
    And user closes the modal
    And "rejected" counter is increased on "1"
    And media should not be on the media list

  @regression
  @Lemurama-QA-Modal-AllowedActions
  @C87601
  Scenario: Verify it is possible to approve a media from the modal
    When user selects photo number "0"
    And user clicks on Approve button from the modal
    Then user should see the "success notification"
    And "approved" counter is increased on "1"
    When user closes the modal
    Then media should not be on the media list

  @blacklist
  @regression
  @Lemurama-QA-Modal-AllowedActions
  @C87601
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
  @Lemurama-QA-Modal-AllowedActions
  @C87601
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
  @Lemurama-QA-Card-SingleActions-Approve
  @C87602
  Scenario: Verify user can approve a media from QA page
    When user "approves" the "0" media
    Then user should see the "success notification"
    And media should not be on the media list
    And "approved" counter is increased on "1"

  @smoke
  @Lemurama-QA-Card-SingleActions-Delete
  @C87576
  Scenario: Verify user can reject a media from QA page
    When user "rejects" the "0" media
    Then the "confirmation alert" should show
    When user confirms the alert
    Then user should see the "success notification"
    And "rejected" counter is increased on "1"
    And media should not be on the media list

  @spam
  @sanity
  @Lemurama-QA-Card-SingleActions-FlagAsSpam
  @C87581
  Scenario: Verify user can flag as spam a single media from the card
    When user refines media search by selecting the option "Instagram" from the filter "Media Source"
    And user "flags as spam" the "0" media
    Then the "confirmation alert" should show
    When user confirms the alert
    Then user should see the "success notification"
    And media should not be on the media list
    And "rejected" counter is increased on "1"

  @sanity
  @Lemurama-QA-BulkActions-AllowedActions
  @C87589
  Scenario: Verify user can approve several media using bulk actions
    When user selects "3" photos for bulk
    And user clicks on bulk actions button
    And user clicks on Approve button from the modal
    Then user should see the "success notification"
    And "approved" counter is increased on "3"
    And media should not be on the media list

  @regression
  @Lemurama-QA-BulkActions-Blacklist-Confirming
  @C87593
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
  @Lemurama-QA-BulkActions-AllowedActions
  @C87589
  Scenario: Verify user can reject several media using bulk actions
    When user selects "3" photos for bulk
    And user clicks on bulk actions button
    And user clicks on Reject button from the modal
    Then the "confirmation alert" should show
    When user confirms the alert
    Then user should see the "success notification"
    And "rejected" counter is increased on "3"
    And media should not be on the media list

  @regression
  @Lemurama-QA-BulkActions-AllowedActions
  @C87589
  Scenario: Verify user can approve several media using bulk actions
    When user selects "3" photos for bulk
    And user clicks on bulk actions button
    And user clicks on Approve button from the modal
    Then user should see the "success notification"
    And "approved" counter is increased on "3"
    And media should not be on the media list

  @spam
  @regression
  @Lemurama-QA-BulkActions-AllowedActions
  @C87589
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
  @Lemurama-QA-Counters-Tagged-BulkActions-Approve
  @C87585
  Scenario: Verify approved counter is increased and tagged counter remains the same when media is approved
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
    And user clicks on Approve button from the modal
    Then user should see the "success notification"
    And "approved" counter is increased on "3"
    And "tagged" counter is increased on "0"
    And media should not be on the media list

  @sanity
  @Lemurama-QA-Counters-Tagged-SingleMedia-Approved
  @C87603
  Scenario: Verify approved counter is increased and tagged counter remains the same when a single media is approved
    When user selects photo number "0"
    And make sure there are no streams assigned
    And user search "OlaProd #3" stream in the tagging tab
    And user selects first stream in the stream list result
    Then user should see the "success notification"
    When user closes the modal
    And user "approves" the "0" media
    Then user should see the "success notification"
    And "tagged" counter is increased on "0"
    And "approved" counter is increased on "1"
    And media should not be on the media list

  @regression
  @Lemurama-QA-Counters-Tagged-SingleMedia-Rejected
  @C87572
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
  @Lemurama-QA-Counters-Tagged-SingleMedia-MultipleStreamsAdded
  @C87573
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
  @Lemurama-QA-Counters-Tagged-SingleMedia-Spam
  @C87574
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
  @Lemurama-QA-Card-SingleActions-BlacklistUser
  @C87579
  Scenario: Verify it is possible to blacklist a user from the media card
    When user "blacklist user of" the "0" media
    And user confirms the alert
    Then user should see the "success notification"
    And the "rejected" counter value is "1"
    And media should not be on the media list

  @regression
  @Lemurama-QA-Card-SingleActions-LookAndFeel
  @C87580
  #revisar esto
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
  @Lemurama-QA-LoadMore
  @C87597
  Scenario: Verify scrolling to the bottom of the page, triggers a new set of pics being loaded
    Then user verifies an initial set of pics is displayed
    When user scrolls to the bottom
    Then the library should have more photos loaded

#  @regression
#  @Lemurama-QA-LoadMore-BulkActions
#  @C87599
#  Scenario: Verify no more than 30 pics can be selected at once for bulk actions
#    When user clicks on Select All button
#    Then all available media are selected
#    When user scrolls to the bottom
#    Then the library should have more photos loaded
#    When the user selects media till "31" are selected
#    Then user should see the "error notification"

  @regression
  @Lemurama-QA-LoadMore-Reject
  @C87600
  Scenario: Valiate the load more behavior when rejecting media
    Then user verifies an initial set of pics is displayed
    When user "rejects" the "0" media
    And user confirms the alert
    And user scrolls to the bottom
    Then the library should have more photos loaded

  @regression
  @Lemurama-QA-LoadMore-Approve
  @C88963
  Scenario: Valiate the load more behavior when rejecting media
    Then user verifies an initial set of pics is displayed
    When user "approves" the "0" media
    And user scrolls to the bottom
    Then the library should have more photos loaded

  @regression
  @Lemurama-QA-Card-SingleActions-MoreOptions
  @C87577
  Scenario: Validate more options is displayed
    And user selects photo number "0"
    Then edit media box should open
    And the title Edit Media is displayed on the modal
    And more options actions are displayed
    And arrows are visible
    And X button is visible
    And media caption is displayed
