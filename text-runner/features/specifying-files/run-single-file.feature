Feature: running a single MarkDown file

  Background:
    Given the source code contains a file "1.md" with content:
      """
      <a type="test"></a>.
      """
    And the source code contains a file "2.md" with content:
      """
      <a type="test"></a>.
      """

  Scenario: testing a single file via the complete CLI form
    When running "text-run run 2.md"
    Then it runs only the tests in "2.md"

  Scenario: testing a single file via the short CLI form
    When running "text-run 2.md"
    Then it runs only the tests in "2.md"

  Scenario: testing a non-existing file via the CLI
    When trying to run "text-run zonk.md"
    Then the test fails with:
      | ERROR MESSAGE | file or directory does not exist: zonk.md |
      | EXIT CODE     | 1                                         |