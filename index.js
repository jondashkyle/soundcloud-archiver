var toiletdb = require('toiletdb')
var assert = require('assert')
var yaml = require('js-yaml')
var xtend = require('xtend')
var npath = require('path')
var path = require('path')
var fs = require('fs')

var routes = require('./app/src/routes')
var client = require('./app/src')
var server = require('./server')

var config = options({
  port: process.env.PORT,
  wsport: parseInt(process.env.PORT) + 1,
  domain: 'localhost',
  db: '.db.json',
  bundles: 'app/dist/',
  content: 'content/'
})

var db = toiletdb(path.join(__dirname, config.db))

var app = server({
  db: db,
  routes: routes,
  render: render,
  port: config.port,
  wsport: config.wsport,
  bundles: config.bundles,
  content: config.content,
  domains: config.domains,
  site: config.site
})

// init
app.start({
  port: config.port,
  db: db
})

// read defaults and get going
function options (defaults) {
  var config = fs.readFileSync(npath.join(__dirname, 'config.development.yml'), 'utf8')
  var options = xtend(defaults, yaml.safeLoad(config))

  assert(typeof options === 'object', 'Can not parse configuration file')
  assert(typeof config === 'string', 'No configuration file found')
  return options
}

// handle client routes
function render (req, res, ctx) {
  var state = { }

  return function (route) {
    assert(typeof route === 'string', 'Invalid route')
    try {
      var viewState = xtend(client.state, state)
      return client.toString(route, viewState)
    } catch (err) {
      return '404'
    }
  }
}

module.exports = config