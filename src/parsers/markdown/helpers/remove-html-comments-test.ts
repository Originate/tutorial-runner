import removeHtmlComments from './remove-html-comments'
import { expect } from 'chai'
import { describe, it } from 'mocha'

describe('removeHtmlComments', function() {
  it('removes HTML comments', function() {
    const actual = removeHtmlComments('<!-- foo -->\none\n<!-- bar -->')
    expect(actual).to.equal('one')
  })

  it('leaves other content untouched', function() {
    const actual = removeHtmlComments('one')
    expect(actual).to.equal('one')
  })
})
