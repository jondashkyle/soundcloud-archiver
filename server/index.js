var minifyHTML = require('html-minifier')
var createHTML = require('create-html')
var assert = require('assert')
var merry = require('merry')
var xtend = require('xtend')
var npath = require('path')
var send = require('send')

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
    htmlMinify: false,
    site: {
      title: 'Starterkit',
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">'
    }
  }, opts)

  var api = Api({
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
      root: npath.join(process.cwd(), options.content)
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
      root: npath.join(process.cwd(), options.bundles)
    }).pipe(res)
  }

  // ssr view
  function view (route, render) {
    assert(typeof route === 'string', 'Please provide route')
    assert(typeof render === 'function', 'Please provide render function')

    var htmlOpts = xtend({
      script: '/bundles/bundle.js',
      css: '/bundles/bundle.css',
      body: render(route)
    }, options.site)

    var htmlOutput = createHTML(htmlOpts)

    // minification
    if (options.htmlMinify) {
      return minifyHTML.minify(htmlOutput, {
        minifyCSS: true,
        collapseWhitespace: true
      })
    } else {
      return htmlOutput
    }
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
