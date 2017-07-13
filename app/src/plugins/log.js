var log = require('choo-log')

if (process.env.NODE_ENV !== 'production') {
  module.exports = log()
} else {
  module.exports = function () { }
}
