var gr8 = require('gr8')
var recsst = require('recsst')

var settings = require('./settings')
var css = gr8()

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
  css.toString(),
  recsst.toString()
].join('\n')

// export
process.stdout.write(output)
