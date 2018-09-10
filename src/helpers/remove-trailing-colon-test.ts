import removeTrailingColon from './remove-trailing-colon.js'
import { expect } from 'chai'
import { describe, context, it } from 'mocha'

describe('removeTrailingColon', function() {
  context('with trailing colon', function() {
    it('removes the trailing colon', function() {
      expect(removeTrailingColon('foo:')).to.equal('foo')
    })
  })

  context('without trailing colon', function() {
    it('returns the string as-is', function() {
      expect(removeTrailingColon('foo')).to.equal('foo')
    })
  })
})
