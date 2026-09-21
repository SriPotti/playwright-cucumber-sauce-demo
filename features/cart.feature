@cart
Feature: Shopping cart

  @smoke
  Scenario: Empty cart displays a helpful message
    Given I open the cart
    Then the cart should be empty
    And I should see a continue shopping link
