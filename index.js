var Cookies = require('universal-cookie')
var assert = require('assert')
var yaml = require('js-yaml')
var level = require('level')
var xtend = require('xtend')
var npath = require('path')
var fs = require('fs')

var routes = require('./app/src/routes')
var client = require('./app/src')
var server = require('./server')

var config = options({
  port: process.env.PORT,
  db: '.db',
  bundles: 'app/dist/',
  content: 'content/'
})

var db = level(config.db)

var app = server({
  db: db,
  routes: routes,
  render: render,
  bundles: config.bundles,
  content: config.content,
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
  var state = {
    user: {
      authorized: authorized(req, res, ctx)
    }
  }

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

function authorized (req, res, ctx) {
  try {
    var cookies = new Cookies(req.headers.cookie)
    return cookies.get('authorized')
  } catch (err) {
    return false
  }
}
