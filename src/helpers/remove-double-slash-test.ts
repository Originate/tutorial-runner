import { expect } from "chai"
import { describe, it } from "mocha"
import removeDoubleSlash from "./remove-double-slash.js"

describe("removeDoubleSlash", function() {
  it("removes double slashes", function() {
    expect(removeDoubleSlash("/foo//bar/")).to.equal("/foo/bar/")
  })
})
