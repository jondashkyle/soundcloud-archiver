module.exports = {
  content: require('./content'),
  archive: require('./archive')
}

if (process.env.NODE_ENV === 'development') {
  module.exports.log = require('./log')
}
