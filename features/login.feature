@login
Feature: Customer login validation

  Scenario: Invalid credentials are rejected
    Given I open the customer login page
    When I submit email "nobody@example.com" and password "definitely-wrong"
    Then a login error should be displayed
