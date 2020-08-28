var test = require('tape')
var remark = require('remark')
var markdown = require('remark-parse')
var altProt = require('./index')
var html = require('rehype-stringify')
var remark2rehype = require('remark-rehype')

var pWithHyperLink = 'This link hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/ blah blah.  Some more words then a 2nd '
var twoHyperLinksInParagraph = 'This link hyper://7dc9c5dac58780ecbfbae14db585334c28ef98aba928d31cbf9b50f8dfa5cc86/ blah blah.  Some more words then a 2nd ' + 
'link just for trouble hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/ \n'
var paragraphHttpLink = 'Also a reg https://github.com/unifiedjs/unified#processorparser/ '
var paragraphHttpLinkMarkup = 'Also a markup [link](https://github.com/unifiedjs/unified#processorparser) '
var pWithCabalLink = 'Have you been to cabal public? cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/ '
var pWithDatLink = 'a data link dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4'
var pWithAllLinkTypes = 'This link hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/ blah blah.' +
'Have you been to cabal public? cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/ ' +
'a data link dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4'

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
    t.true(outPutString.indexOf('<a href="https://github.com/unifiedjs/unified#processorparser">link</a>') > -1)
  })
})

test('When a Cabal link is present is is converted to a link.', function (t) {
  t.plan(1)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithCabalLink, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/">cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/</a>') > -1)
  })
})

test('When a dat link is present is is converted to a link.', function (t) {
  t.plan(1)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithDatLink, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4">dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4</a>') > -1)
  })
})

test('When 2 of the same links are in a paragraph both still get converted.', function (t) {
  t.plan(2)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(twoHyperLinksInParagraph, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    t.true(outPutString.indexOf('<a href="hyper://7dc9c5dac58780ecbfbae14db585334c28ef98aba928d31cbf9b50f8dfa5cc86/">hyper://7dc9c5dac58780ecbfbae14db585334c28ef98aba928d31cbf9b50f8dfa5cc86/</a>') > -1)
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/</a>') > -1)
  })
})

test('When ala 3 types of protocol are in a paragraph all still get converted.', function (t) {
  t.plan(3)

  remark().use(markdown).use(altProt).use(remark2rehype).use(html).process(pWithAllLinkTypes, function (err, file) {
    if (err) console.error(err)
    var outPutString = String(file)
    console.log(outPutString)
    t.true(outPutString.indexOf('<a href="hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/">hyper://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4/</a>') > -1)
    t.true(outPutString.indexOf('<a href="cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/">cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74/</a>') > -1)
    t.true(outPutString.indexOf('<a href="dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4">dat://6946d4631ea3dade5d26367b96afdf8e93be638349c536e0bd446393c78a61a4</a>') > -1)
  })
})
