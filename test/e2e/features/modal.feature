@modal
Feature: Modal
    As a logged customer
    I want to be able to perform actions on media from the modal

    Background:
        Given user is on the login page
        And user sends correct access credentials
        And the user selects "enforcersqa" account on the list
        And user makes sure the session is not restored
        And user goes to "tagging" page
        And there is media available on tagging page
        And user goes to "tagging" page

    @regression
    @Lemurama-Modal-Look&Feel
    @C19743
    Scenario: Validate the look and feel of the modal when
        When user selects photo number "0"
        Then edit media box should open
        And the title Edit Media is displayed on the modal
        And available actions are displayed
        And more options actions are displayed
        And arrows are visible
        And X button is visible
        And media caption is displayed

    @sanity
    @Lemurama-Modal-BulkActions-AddingStreams
    @C19722
    Scenario: Validate user is able to tag several photos to multiple streams
        When user selects "3" photos for bulk
        And user clicks on bulk actions button
        And make sure there are no streams assigned
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        Then the "OlaProd #11" stream should be tagged correctly
        When user clears the search results
        And user search "OlaProd #7" stream in the tagging tab
        And user selects first stream in the stream list result
        Then the "OlaProd #7" stream should be tagged correctly
        When user closes the modal
        Then user "sees" streams on the "0" media

    @sanity
    @Lemurama-Modal-SingleMedia-SearchingStreams
    @C18669
    Scenario: Validate the proper fields appear when user searches for a determined stream
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user search "OlaProd #11" stream in the tagging tab
        Then the stream information is retrieved
        When user clicks on More button at the bottom of the page
        Then more streams are retrieved
        And user clears the search results
        And user closes the modal

    @regression
    @Lemurama-Modal-BulkActions-RemovingStreams-UserFirstLogIn
    @C19723
    Scenario: Validate user can remove streams tagged to several media at the same time
        When user selects "2" photos for bulk
        And user clicks on bulk actions button
        And make sure there are no streams assigned
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clears the search results
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        And user closes the modal
        And user selects photo number "2"
        And make sure there are no streams assigned
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clears the search results
        And user search "OlaProd #3" stream in the tagging tab
        And user selects first stream in the stream list result
        And user clears the search results
        And user search "OlaProd #8" stream in the tagging tab
        And user selects first stream in the stream list result
        And user closes the modal
        And user selects "3" photos for bulk
        And user clicks on bulk actions button
        Then the streams tagged to the media on the modal are "OlaProd #11, OlaProd #3"
        When user removes the stream "Olaprod #3"
        And user does not see the stream "Olaprod #3" in the modal
        And user closes the modal
        And user selects photo number "2"
        Then the streams tagged to the media on the modal are "OlaProd #11, OlaProd #8"
        And user does not see the stream "Olaprod #3" in the modal

    @sanity
    @C70460
    @hotspot
    @Lemurama-Modal-Hotspot-Creation-ByClick
    Scenario: Verify it is possible to create a hotspot clicking
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user creates a hotspot by clicking on the pic
        And user search "OlaProd #18" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #18" stream should be tagged correctly
        And user sees hotspots created for stream "OlaProd #18"

    @sanity
    @C70464
    @hotspot
    @Lemurama-Modal-Hotspot-Creation-RemoveSingleHotspot
    Scenario: Verify it is possible to remove stream related with created hotspot
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user creates a hotspot by clicking on the pic
        And user search "OlaProd #18" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #18" stream should be tagged correctly
        And user sees hotspots created for stream "OlaProd #18"
        When user removes the stream "Olaprod #18"
        Then user does not see the stream "Olaprod #18" in the modal

    @sanity
    @C70478
    @C70479
    @Lemurama-Modal-ZoomOut
    @Lemurama-Modal-ZoomIn
    @hotspot
    Scenario: Verify it is possible to zoom out and zoom in on a photo
        When user selects photo number "0"
        Then the zoom in button is displayed
        When user clicks on zoom in button
        Then the zoom out button is displayed
        When user clicks on zoom out button
        Then the zoom in button is displayed

    @smoke
    @C70554
    @Lemurama-Modal-Hotspot-Creation-TagAStream
    @hotspot
    Scenario: Verify it is possible to tag a photo by creating a hotspot
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user creates a hotspot by dragging and dropping on the pic
        And user search "OlaProd #18" stream in the hotspot input
        Then the stream "OlaProd #18" is visible in search input
        When user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #18" stream should be tagged correctly
        And user sees hotspots created for stream "OlaProd #18"
        When user closes the modal
        Then user "sees" streams on the "0" media

    @sanity
    @C70555
    @Lemurama-Modal-Hotspot-Deletion-RemoveHotspot
    @hotspot
    Scenario: Verify it is possible to remove a tag and a hotspot
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user creates a hotspot by dragging and dropping on the pic
        And user search "OlaProd #3" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the "OlaProd #3" stream should be tagged correctly
        And user sees hotspots created for stream "OlaProd #3"
        When user closes the modal
        And user selects photo number "0"
        And user removes the stream "Olaprod #3"
        Then user does not see the stream "Olaprod #3" in the modal

    @C70559
    @C70556
    @Lemurama-Modal-Hotspot-Creation-MultipleTagging
    @Lemurama-Modal-Hotspot-Deletion-RemoveTag
    @hotspot
    @sanity
    Scenario: Verify it is possible to remove all hotspots from a tagged photo from stream's carousel
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user creates a hotspot by dragging and dropping on the pic
        And user search "OlaProd #11" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user creates a hotspot by clicking on the pic
        And user search "OlaProd #8" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the streams tagged to the media on the modal are "OlaProd #11, OlaProd #8"
        And user sees hotspots created for stream "OlaProd #11, OlaProd #8"
        When user removes the stream "Olaprod #11"
        And user removes the stream "Olaprod #8"
        Then user "does not sees" streams on the "0" media

    @C70567
    @Lemurama-Modal-Hotspot-Deletion-RemoveStreamSearchBox
    @hotspot
    @sanity
    Scenario: Verify it is possible to remove all hotspots from a tagged photo from stream's search result section
        When user selects photo number "0"
        And make sure there are no streams assigned
        And user creates a hotspot by dragging and dropping on the pic
        And user search "OlaProd #11" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user creates a hotspot by clicking on the pic
        And user search "OlaProd #8" stream in the hotspot input
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And the streams tagged to the media on the modal are "OlaProd #11, OlaProd #8"
        And user sees hotspots created for stream "OlaProd #11, OlaProd #8"
        And user search "OlaProd #11" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        When user clears the search results
        And user search "Olaprod #8" stream in the tagging tab
        And user selects first stream in the stream list result
        Then user should see the "success notification"
        And user "does not sees" streams on the "0" media

    @regression
    @Lemurama-Modal-ClosingTheModal
    @C19745
    Scenario: Validate user is able to close the modal by clicking on X button
        When user selects photo number "0"
        Then edit media box should open
        When user closes the modal
        Then user sees that library is displayed
