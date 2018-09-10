import javascriptExtensions from "./javascript-extensions.js"
import { describe, it } from "mocha"
import { expect } from "chai"

describe("javascriptExtensions", function() {
  it("returns all supported JS extensions", function() {
    const result = javascriptExtensions()
    expect(result).to.include("coffee")
    expect(result).to.include("js")
    expect(result).to.include("ts")
  })
})
