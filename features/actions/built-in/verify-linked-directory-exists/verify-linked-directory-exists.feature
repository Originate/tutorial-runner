Feature: verifying directory exists

  As a tutorial writer
  I want to be able to point to directories in my source code
  So that my readers can see larger pieces of example code.

  - surround links to a local directory with the "verifyLinkedDirectoryExists" action
    to verify they exist in the source code


  Scenario: linked directory exists
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_verifyLinkedDirectoryExists">
      See the [examples](examples) for more details
      </a>
      """
    When running tut-run
    Then it signals:
      | FILENAME | 1.md                                    |
      | LINE     | 1                                       |
      | MESSAGE  | verifying the examples directory exists |


  Scenario: linked directory does not exists
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_verifyLinkedDirectoryExists">
      [zonk](zonk)
      </a>
      """
    When trying to run tut-run
    Then the test fails with:
      | FILENAME      | 1.md                          |
      | LINE          | 1                             |
      | ERROR MESSAGE | directory zonk does not exist |
      | EXIT CODE     | 1                             |
