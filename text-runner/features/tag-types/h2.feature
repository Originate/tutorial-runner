Feature: active h2 tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: H2 tag
    Given the source code contains a file "1.md" with content:
      """
      <h2 type="HelloWorld">hello</h2>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |