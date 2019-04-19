Feature: show unused steps

  When refactoring steps
  I want to see which steps are no longer used
  So that I can remove them.


  Scenario: the code base contains unused steps
    Given my workspace contains testable documentation
    And my workspace contains the HelloWorld activity
    When running "text-run unused"
    Then it prints:
      """
      Unused actions:
      - hello-world
      """
