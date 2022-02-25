@taggingSuggestions
@pbl-2687
Feature: tagging suggestions (PBL-2687)
    As a moderator
    I'd like to see suggestions section of products on a photo when I'm tagging
    so I can tag them faster and with less errors.

    Rules:
    - User has tagging suggestion feature set to ON on customer ModSquaSugTag

    Background:

    #@regression
    #@Lemurama-Tagging-Modal-Look&Feel
    #@C18456
    Scenario: Verify that user can see the tagging suggestions section empty
        Given user is on the login page
        And user sends correct access credentials
        And the user selects "ModSquaSugTag" account on the list
        And user goes to "tagging" page
        When user refines media search by selecting the option "Untagged" from the filter "Streams"
        And user selects photo number "0"
        Then user sees that the tagging suggestions section shows empty
