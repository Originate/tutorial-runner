Feature: active BR tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: bold tag
    Given the source code contains a file "1.md" with content:
      """
      <br textrun="HelloWorld">
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
