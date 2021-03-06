var test = require('tape')
var remark = require('remark')
var markdown = require('remark-parse')
var altProt = require('../index')
var html = require('rehype-stringify')
var remark2rehype = require('remark-rehype')
var vfile = require('to-vfile')

var pWithHyperLink = 'This link hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/ blah blah.  Some more words then a 2nd '
var twoHyperLinksInParagraph = 'This link hyper://7dc9c5dac58780ecbfbae14db585334c28ef98aba928d31cbf9b50f8dfa5cc86/ blah blah.  Some more words then a 2nd ' +
'link just for trouble hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/ \n'
var paragraphHttpLink = 'Also a reg https://github.com/unifiedjs/unified#processorparser/ '
var paragraphHttpLinkMarkup = 'Also a markup [link](https://github.com/unifiedjs/unified#processorparser) '
var pWithCabalLink = 'Have you been to cabal public? cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/ '
var pWithDatLink = 'a data link dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4'
var pWithAllLinkTypes = 'This link hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/ blah blah.' +
'\nHave you been to cabal public? cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/ ' +
'a data link dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4'

var pWithAllLinkTypesAndQueryStrings = 'cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74?admin=115e3e33e2ea7b7a4bb4eb0f31344a79fd8e8c0f8b955ea7f6b941d79f9e8a2f ' +
'also a hyperlink to hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/README.md ' +
'and finally a dat with params dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat_intro.gif'

test('When a hyperlink is present is is converted to a link.', function (t) {
  t.plan(1)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithHyperLink, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/</a>') > -1)
  })
})

test('Make sure http links are not being messed up', function (t) {
  t.plan(2)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(paragraphHttpLink, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="https://github.com/unifiedjs/unified#processorparser/">https://github.com/unifiedjs/unified#processorparser/</a>') > -1)
  })

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(paragraphHttpLinkMarkup, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="https://github.com/unifiedjs/unified#processorparser">link</a>') > -1, 'An html link for dat should be present')
  })
})

test('When a Cabal link is present is is converted to a link.', function (t) {
  t.plan(1)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithCabalLink, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/">cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/</a>') > -1, 'An html link for cabal should be present')
  })
})

test('When a dat link is present is is converted to a link.', function (t) {
  t.plan(1)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithDatLink, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4">dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4</a>') > -1, 'An html link for dat should be present')
  })
})

test('When 2 of the same links are in a paragraph both still get converted.', function (t) {
  t.plan(2)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(twoHyperLinksInParagraph, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="hyper://7dc9c5dac58780ecbfbae14db585334c28ef98aba928d31cbf9b50f8dfa5cc86/">hyper://7dc9c5dac58780ecbfbae14db585334c28ef98aba928d31cbf9b50f8dfa5cc86/</a>') > -1, 'An html link for hyper should be present')
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/</a>') > -1, 'A 2nd html link for hyper should be present')
  })
})

test('When all 3 types of protocol are in a paragraph all still get converted.', function (t) {
  t.plan(4)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithAllLinkTypes, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    console.log(outPutString)
    t.true(outPutString.indexOf('<p>This link') === 0, 'The Paragraph starts correctly')
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/</a>') > -1, 'An html link for hyper should be present')
    t.true(outPutString.indexOf('<a href="cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/">cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/</a>') > -1, 'An html link for cabal should be present')
    t.true(outPutString.indexOf('<a href="dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4">dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4</a>') > -1, 'An html link for dat should be present')
  })
})

test('Test reading markdown from a file like the example in readme.', function (t) {
  t.plan(8)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(vfile.readSync('test/example.md'), function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    console.log(outPutString)
    t.true(outPutString.indexOf('<h1>Here\'s some great links') === 0, 'File starts with a Header')
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/</a>') > -1, 'An html link for hyper should be present')
    t.true(outPutString.indexOf('<a href="cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/">cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/</a>') > -1, 'An html link for cabal should be present')
    t.true(outPutString.indexOf('<a href="dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4">dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4</a>') > -1, 'An html link for dat should be present')
    t.true(outPutString.indexOf('<a href="hypergraph://620794a6b46d1235f245acdad2cc9e5e4f3e63f2396cc6f8655e1a30dfa09669">hypergraph://620794a6b46d1235f245acdad2cc9e5e4f3e63f2396cc6f8655e1a30dfa09669</a>') > -1, 'An html link for hypergraph should be present with file name')
    t.true(outPutString.indexOf('<a href="hypermerge://GqEuyCPZ8fKPaJNobgRT3QFnRVHBcsK86VzxBkU1Rnnw?pushpinContentType=board">hypermerge://GqEuyCPZ8fKPaJNobgRT3QFnRVHBcsK86VzxBkU1Rnnw?pushpinContentType=board</a>') > -1, 'An html link for hypermerge should be present with file name')
    t.false(outPutString.indexOf('<a href="blah://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74">blah://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74</a>') > -1, 'An html link for blah should NOT be present with file name')
    t.true(outPutString.indexOf(' blah://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74 ') > -1, 'The fake link should be present and unmanipulated')
  })
})

test('Test that all link types also work if they have some sort of query param or path', function (t) {
  t.plan(3)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithAllLinkTypesAndQueryStrings, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    console.log(outPutString)
    t.true(outPutString.indexOf('<a href="cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74?admin=115e3e33e2ea7b7a4bb4eb0f31344a79fd8e8c0f8b955ea7f6b941d79f9e8a2f">cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74?admin=115e3e33e2ea7b7a4bb4eb0f31344a79fd8e8c0f8b955ea7f6b941d79f9e8a2f</a>') > -1, 'An html link for cabal should be present with query string included.')
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/README.md">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/README.md</a>') > -1, 'An html link for a hyper link to a .md file should be present')
    t.true(outPutString.indexOf('<a href="dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat_intro.gif">dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat_intro.gif</a>') > -1, 'An html link for dat should be present with file name')
  })
})
