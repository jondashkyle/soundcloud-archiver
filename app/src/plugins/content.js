var path = require('path')
var fs = require('fs')

var home = fs.readFileSync(path.join(__dirname, '../../../static/', 'content.md'), 'utf8')
var prepairing = fs.readFileSync(path.join(__dirname, '../../../static/', 'prepairing.md'), 'utf8')
var finished = fs.readFileSync(path.join(__dirname, '../../../static/', 'finished.md'), 'utf8')

module.exports = content

function content (state, emitter) {
  state.content = {
    home: home,
    prepairing: prepairing,
    finished: finished
  }
}
