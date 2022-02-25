@tagging
Feature: tagging
    As a logged customer
    I want to able to tag/remove tag, approve/delete and ask for rights to photos

    Background:
        Given user is on the login page
        When user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        And user goes to "tagging" page
        And there is media available on tagging page
        And user goes to "tagging" page

    @sanity
    @Lemurama-Tagging-Counters-Tagged-BulkActions-MultipleStreamsAdded
    @C32862
    Scenario: Verify user can Approve 3 medias with multiple streams from the modal of tagging section
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        And user search "OlaProd #7" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clicks on Approve button from the modal
        Then user should see the "success notification"
        And "approved" counter is increased on "3"
        And "tagged" counter is increased on "3"
        And the "rejected" counter value is "0"

    @regression
    @Lemurama-Tagging-Modal-SingleMedia-AddingChildStreams
    @C18671
    Scenario: Verify that user can assign a media and its parent media
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #7" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #7" stream should be tagged correctly
        When user closes the modal
        Then user "sees" streams on the "0" media

    @smoke
    @Lemurama-Tagging-Modal-SingleMedia-AddingChildStreams
    @C18671
    Scenario: Verify that user can tag a media
        When user selects photo number "1"
        And make sure there are no streams assigned
        And user search "OlaProd #7" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #7" stream should be tagged correctly
        When user closes the modal
        Then user "sees" streams on the "1" media

    @regression
    @Lemurama-Tagging-Modal-SingleMedia-RemovingStreams
    @C18672
    Scenario: Verify that user can remove tag from media
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #5" stream in the tagging tab
        And user selects first stream in the stream list result
        And make sure there are no streams assigned
        And user should see the "success notification"
        And user closes the modal
        Then user "does not sees" streams on the "0" media

    @smoke
    @Lemurama-Tagging-Card-SingleActions-Approve
    @C17841
    Scenario: Verify user can approve a media from tagging page
        When user "approves" the "0" media
        Then user should see the "success notification"
        And "approved" counter is increased on "1"
        And media should not be on the media list

    @smoke
    @Lemurama-Tagging-Card-SingleActions-Delete
    @C17839
    Scenario: Verify user can reject a media from tagging page
        When user "rejects" the "0" media
        Then the "confirmation alert" should show
        And user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"
        And media should not be on the media list

    @smoke
    @Lemurama-Tagging-Counters-Tagged-BulkActions-Approved
    @C32859
    Scenario: Verify tagged counter is increased when approving multiple photos with streams
        When user selects "5" photos for bulk
        And user clicks on bulk actions button
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user clicks on Approve button from the modal
        Then user should see the "success notification"
        And "approved" counter is increased on "5"
        And "tagged" counter is increased on "5"

    @regression
    @Lemurama-Tagging-Counters-Tagged-BulkActions-Rejected
    @C32860
    Scenario: Verify tagged counter is not increased when rejecting multiple photos with streams
        When user selects "5" photos for bulk
        And user clicks on bulk actions button
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user clicks on Reject button from the modal
        And user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "5"
        And the "tagged" counter value is "0"

    @regression
    @Lemurama-Tagging-Counters-Tagged-BulkActions-Spam
    @C32868
    Scenario: Verify tagged counter is not increased when flag as spam multiple photos with streams
        When user selects "5" photos for bulk
        And user clicks on bulk actions button
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "5"
        And the "tagged" counter value is "0"

    @spam
    @sanity
    @Lemurama-Tagging-Card-SingleActions-FlagAsSpam
    @C26576
    Scenario: Verify user can flag as spam a media from tagging page
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user "flags as spam" the "0" media
        Then the "confirmation alert" should show
        And the confirmation modal should reads "Are you sure you want to flag 1 media as spam?"
        When user confirms the alert
        Then user should see the "success notification"
        And "rejected" counter is increased on "1"
        And the "tagged" counter value is "0"
        And the "approved" counter value is "0"
        And media should not be on the media list

    #@regression
    Scenario: Verify user can filter medias when using filters
        When user refines media search by selecting the option "Untagged" from the filter "Streams"
        Then user "does not sees" streams on the "1" media

    @regression
    @Lemurama-Tagging-Modal-AllowedActions
    @C19746
    Scenario: Verify user can Approve a media from the modal of tagging section
        When user selects photo number "0"
        And user clicks on Approve button from the modal
        And user should see the "success notification"
        And user closes the modal
        Then "approved" counter is increased on "1"
        And media should not be on the media list

    @regression
    @Lemurama-Tagging-Modal-AllowedActions
    @C19746
    Scenario: Verify user can Reject a media from the modal of tagging section
        When user selects photo number "0"
        And user clicks on Reject button from the modal
        And user confirms the alert
        And user should see the "success notification"
        And user closes the modal
        Then "rejected" counter is increased on "1"
        And media should not be on the media list

    @spam
    @regression
    @Lemurama-Tagging-Modal-AllowedActions
    @C19746
    Scenario: Verify user can can flag as spam a user from the modal of tagging section
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Spam button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        When user closes the modal
        Then "rejected" counter is increased on "1"
        And media should not be on the media list

    @regression
    @Lemurama-Tagging-Counters-Tagged-SingleMedia-Approved
    @C32857
    Scenario: Verify tagging counter is increased when a photo is approved and it has streams
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user closes the modal
        And user "approves" the "0" media
        Then user should see the "success notification"
        And "tagged" counter is increased on "1"
        And "approved" counter is increased on "1"

    @regression
    @Lemurama-Tagging-Counters-Tagged-SingleMedia-Rejected
    @C32858
    Scenario: Verify tagging counter is not increased when a photo is rejected and it has streams
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user closes the modal
        And user "rejects" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And the "tagged" counter value is "0"
        And "rejected" counter is increased on "1"

    @smoke
    @Lemurama-Tagging-Counters-Tagged-SingleMedia-MultipleStreamsAdded
    @C32861
    Scenario: Verify tagging and approved counter are increased only in 1 when a photo with more than one stream is approved
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user clears the search results
        And user search "OlaPord #1" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user closes the modal
        And user "approves" the "0" media
        Then user should see the "success notification"
        And "tagged" counter is increased on "1"
        And "approved" counter is increased on "1"

    @spam
    @regression
    @Lemurama-Tagging-Counters-Tagged-SingleMedia-Spam
    @C32867
    Scenario: Verify tagging counter is not increased when a photo is flagged as spam and it has streams
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user closes the modal
        And user "flags as spam" the "0" media
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"
        And the "tagged" counter value is "0"
        And "rejected" counter is increased on "1"

    @regression
    @Lemurama-Tagging-Counters-Tagged-SingleMedia-LogOut
    @C32863
    Scenario: Verify tagging counter is increased after user has tagged a photo, logged out and logged back in
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user closes the modal
        And user attempts to Logout
        And user confirms submit the work and switch account
        And user is on the login page
        And user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user goes to "tagging" page
        And user "approves" the "0" media
        Then user should see the "success notification"
        And "tagged" counter is increased on "1"
        And "approved" counter is increased on "1"

    @blacklist
    @regression
    @Lemurama-Tagging-Modal-AllowedActions
    @C19746
    Scenario: Verify that the user can blacklist a user from the modal
        And user refines media search by selecting the option "Instagram" from the filter "Media Source"
        When user selects photo number "0"
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"

    @blacklist
    @regression
    @Lemurama-Tagging-BulkActions-Blacklist-Confirming
    @C29004
    Scenario: Verify user can blacklist users in bulk mode
        When user refines media search by selecting the option "Instagram" from the filter "Media Source"
        And user selects "3" photos for bulk
        And user clicks on bulk actions button
        And user clicks on More button from the modal
        And user clicks on Blacklist button from the modal
        Then the "confirmation alert" should show
        When user confirms the alert
        Then user should see the "success notification"

    @regression
    @Lemurama-Tagging-Card-SingleActions-BlacklistUser
    @C17846
    Scenario: Verify user can blacklist user from tagging page
        When user "blacklist user of" the "0" media
        Then the "confirmation alert" should show
        And the confirmation modal should reads "Are you sure you want to add the given user(s) to the blacklist?"
        When user confirms the alert
        Then user should see the "success notification"
        And the "tagged" counter value is "0"
        And the "approved" counter value is "0"
        And "rejected" counter is increased on "1"
        And media should not be on the media list
