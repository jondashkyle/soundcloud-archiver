var choo = require('choo')
var routes = require('./routes')
var plugins = require('./plugins')
var app = choo()

// plugins
Object.keys(plugins).forEach(function (plugin) {
  app.use(plugins[plugin])
})

// routes
Object.keys(routes).forEach(function (route) {
  app.route(route, routes[route])
})

// public
if (module.parent) {
  module.exports = app
} else {
  app.mount('main')
}
