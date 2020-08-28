'use strict'

var visit = require('unist-util-visit')
var is = require('unist-util-is')

module.exports = altProt

const protocols = ['hyper', 'dat', 'cabal']
var protocolsUsed = protocols

function altProt (options) {
  var settings = options || {}
  var exclusions = settings.exclusions
  if (exclusions) {
    exclusions.forEach(function (item) {
      protocolsUsed.splice(protocolsUsed.indexOf(item), 1)
    })
  }

  return transformer

  function transformer (tree) {
    // console.dir(tree, { depth: null })
    visit(tree, 'paragraph', visitor)
    // console.log('After:')
    // console.dir(tree, { depth: null })
  }

  function visitor (node) {
    var children = node.children
    children.forEach(function (child, index) {
      if (is(child, 'text')) {
        // TODO: figure out why its skipping other protocols
        var protListStr = protocols.join('|')
        var ptrn = new RegExp('(' + protListStr + ')?://[-a-zA-Z0-9]{64}/*', 'g')
        var matches = child.value.matchAll(ptrn)
        var origVal = child.value
        var pos = 0
        var newChildren = []

        for (const match of matches) {
          newChildren.push({ type: 'text', value: origVal.substr(pos, match.index - pos) })
          var altLink = { type: 'link', url: match[0], children: [{ type: 'text', value: match[0] }] }
          newChildren.push(altLink)
          pos = match.index + match[0].length
        }
        // get any trailing text
        newChildren.push({ type: 'text', value: origVal.substr(pos) })

        children.splice(index, 1)
        // Merge into current and replace current
        for (const cn of newChildren) {
          children.splice(index, 0, cn)
        }
      }
    })
  }
}
