// @flow

import type {AstNodeList} from '../../parsers/ast-node-list.js'

const Searcher = require('./searcher.js')
const {expect} = require('chai')

describe('Searcher', function () {
  beforeEach(function () {
    const nodes: AstNodeList = [
      {type: 'image', content: 'image content'},
      {type: 'link', content: 'link content'}
    ]
    this.searcher = new Searcher(nodes)
  })

  context('string query', function () {
    beforeEach(function () {
      this.result = this.searcher.tagContent('link')
    })

    it('returns the content of the matching node', function () {
      expect(this.result).to.equal('link content')
    })
  })

  context('array query', function () {
    beforeEach(function () {
      this.result = this.searcher.tagContent(['heading', 'link'])
    })

    it('returns the content of the matching node', function () {
      expect(this.result).to.equal('link content')
    })
  })
})