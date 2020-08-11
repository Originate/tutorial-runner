import { strict as assert } from "assert"
import fs from "fs-extra"
import path from "path"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { AstNodeList } from "../standard-AST/ast-node-list"
import { parseMarkdownFiles } from "./parse-markdown-files"

suite("MdParser.parseFile()", function () {
  const sharedFixtureDir = path.join("src", "parsers", "fixtures")
  const specificFixtureDir = path.join("src", "parsers", "markdown", "fixtures")
  for (const fixtureDir of [sharedFixtureDir, specificFixtureDir]) {
    for (const testDirName of fs.readdirSync(fixtureDir)) {
      const testDirPath = path.join(fixtureDir, testDirName)
      test(`parsing '${testDirName}'`, async function () {
        const expectedJSON = await fs.readJSON(path.join(testDirPath, "result.json"))
        const expected = new AstNodeList()
        for (const expectedNodeData of expectedJSON) {
          expectedNodeData.file = expectedNodeData.file.replace("*", "md")
          expected.push(AstNode.scaffold(expectedNodeData))
        }
        const actual = await parseMarkdownFiles([new AbsoluteFilePath(path.join(testDirPath, "input.md"))])
        assert.deepEqual(actual[0], expected)
      })
    }
  }
})