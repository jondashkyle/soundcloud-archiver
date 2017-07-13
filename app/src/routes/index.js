module.exports = {
  '*': require('./notfound'),
  '/': require('./main'),
  '/test': require('./test')
}
