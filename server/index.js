var minifyHTML = require('html-minifier')
var createHTML = require('create-html')
var assert = require('assert')
var merry = require('merry')
var xtend = require('deep-extend')
var npath = require('path')
var send = require('send')
var WebSocket = require('ws')

var Api = require('./api')
var server = merry()

// public
if (module.parent) {
  module.exports = setup
} else {
  setup()
  start()
}

// configuration
function setup (opts) {
  var options = xtend({
    bundles: './app/dist',
    content: './content',
    routes: { },
    render: render,
    site: {
      title: 'Starterkit',
      head: '<link href="https://fonts.googleapis.com/css?family=Spectral:200|Work+Sans:200" rel="stylesheet"><meta name="viewport" content="width=device-width, initial-scale=1">'
    }
  }, opts)

  var wss = new WebSocket.Server({ port: options.wsport })

  var api = Api(server, {
    db: options.db,
    domains: options.domains,
    wss: wss,
    db: options.db
  })

  // setup routes
  Object.keys(options.routes)
    .filter(route => route !== '*')
    .forEach(function (route) {
      server.route('GET', route, function (req, res, ctx) {
        ctx.send(200, view(route, options.render(req, res, ctx)))
      })
    })

  // static / 404
  server.route('default', function (req, res, ctx) {
    send(req, req.url, {
      root: npath.join(__dirname, '../', options.content)
    })
      .on('error', error(req, res, ctx))
      .pipe(res)
  })

  // bundles
  server.route('GET', '/bundles/:asset', bundle)

  // public
  return {
    start: start
  }

  // view render default
  function render () {
    return 'No render function provided'
  }

  // spa redirect
  function error (req, res, ctx) {
    return function () {
      ctx.send(200, view('*', options.render(req, res, ctx)))
    }
  }

  // bundle assets
  function bundle (req, res, ctx) {
    send(req, ctx.params.asset, {
      root: npath.join(__dirname, '../', options.bundles)
    }).pipe(res)
  }

  // ssr view
  function view (route, render) {
    assert(typeof route === 'string', 'Please provide route')
    assert(typeof render === 'function', 'Please provide render function')
    var htmlOptions = xtend({
      script: '/bundles/bundle.js',
      css: '/bundles/bundle.css',
      body: render(route)
    }, options.site)
    return minifyHTML.minify(createHTML(htmlOptions), {
      minifyCSS: true,
      collapseWhitespace: true
    })
  }
}

// initialization
function start (opts) {
  var options = xtend({
    port: 8080
  }, opts)

  // listen up
  server.listen(parseInt(options.port))
  console.log(`Now serving on http://localhost:${options.port}`)
}
