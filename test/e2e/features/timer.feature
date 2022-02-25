@timer
Feature: Timer
    As a logged customer
    I want to be able to pause or resume the timer
    So that I can validate the time counter actually stops and/or continues

     Background:
         Given user is on the login page
         When user sends correct access credentials
         And the user selects "enforcersqa" account on the list
         And user makes sure the session is not restored
         And user goes to "premod" page
         And user pauses the timer

    @regression
    @Lemurama-NavBar-Timing-HitPlay
    @Lemurama-NavBar-Timing-HitPause
    @Lemurama-NavBar-Timing-OtherValues
    @C23907
    @C23906
    @C23917
    Scenario: Verify user can pause or resume the timer while moderating and counters keep on increasing independently
        When user "approves" the "0" media
        And user selects "3" photos for bulk
        And the user clicks on approve selected and reject all other button
        Then the timer is paused
        And the "moderation time" counter value is "0hs:0min"
        And the counters have increased
        When user resumes the timer
        Then the timer is running
        And user perform random moderation actions for "1" minute
        And the "moderation time" counter value is "0hs:1min"
