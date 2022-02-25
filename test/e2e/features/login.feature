@login
Feature: Login
    As a customer
    I want to be able to login
    So that I can access restricted features

    @regression
    Scenario: Unauthenticated user
        Given user is on the login page
        When user sends incorrect access credentials
        Then user is not logged in and an error message is shown

    @regression
    Scenario: Authenticated user
        Given user is on the login page
        When user sends correct access credentials
        Then user is correctly logged in
