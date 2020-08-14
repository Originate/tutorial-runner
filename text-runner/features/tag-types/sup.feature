Feature: active SUP tags

  When writing active blocks in a Markdown document
  I want to be able to make SUP tags active
  So that I don't have to litter my document with <a> tags


  Background:
    Given the source code contains the HelloWorld action


  Scenario: active tag
    Given the source code contains the file "1.md" with content:
      """
      <sup textrun="HelloWorld">foo</sup>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: passive tag
    Given the source code contains the file "1.md" with content:
      """
      <sup>foo</sup>
      """
    When running text-run
