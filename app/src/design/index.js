var fs = require('fs')
var path = require('path')
var gr8 = require('gr8')
var recsst = require('recsst')

var settings = require('./settings')
var custom = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8')
var css = gr8(settings)

css.add({
  prop: 'background-color',
  prefix: 'bg',
  vals: settings.colors
})

css.add({
  prop: 'color',
  prefix: 'tc',
  vals: settings.colors
})

css.add({
  prop: 'font-family',
  vals: settings.fonts
})

// concat
var output = [
  recsst.toString(),
  css.toString(),
  custom
].join('\n')

// export
process.stdout.write(output)
