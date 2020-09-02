Feature: active code tags

  Background:
    Given the source code contains the HelloWorld action

  Scenario: code tag
    Given the source code contains a file "1.md" with content:
      """
      <details type="HelloWorld">foo</details>
      """
    When running Text-Runner
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |
