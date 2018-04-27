// @flow

const parseAttributes = require('./parse-html-tag.js')
const { expect } = require('chai')

describe('parseAttributes', function () {
  it('parses opening HTML tags', function () {
    const result = parseAttributes('<h1>', 'file', 0)
    expect(result).to.eql(['h1', {}])
  })

  it('parses closing HTML tags', function () {
    const result = parseAttributes('</h1>', 'file', 0)
    expect(result).to.eql(['/h1', {}])
  })

  it('parses the attributes', function () {
    const result = parseAttributes(
      '<img src="1.png" width="100" height="100">',
      'file',
      0
    )
    expect(result).to.eql([
      'img',
      { src: '1.png', width: '100', height: '100' }
    ])
  })

  it('can handle spaces in attributes', function () {
    const result = parseAttributes('<img alt="foo bar">', 'filename', 0)
    expect(result).to.eql(['img', { alt: 'foo bar' }])
  })
})
