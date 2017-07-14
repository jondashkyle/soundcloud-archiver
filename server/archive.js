var proc = require('child_process')
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var hyperdrive = require('hyperdrive')
var mutexify = require('mutexify')
var mkdirp = require('mkdirp')
var hyperdiscovery = require('hyperdiscovery')

module.exports = Archive

function Archive (options, emitter) {
  var dest = options.dest || '.'
  var template = options.template || ''
  var archive = hyperdrive(path.join(dest, 'dat'))
  var music = path.join(dest, 'youtube-dl')
  var mutex = mutexify()
  var all = []

  var url = options.url

  if (!url) {
    emitter.emit('error', { message: 'No URL provided' })
    emitter.emit('finished')
  }

  archive.on('ready', function () {
    emitter.emit('ready', { key: archive.key.toString('hex') })
    hyperdiscovery(archive, {live: true})
    archive.readFile('music.json', 'utf-8', function (_, data) {
      if (data) all = JSON.parse(data)
      download(url, onfile, done)
    })
  })

  function onfile (name) {
    var hash = crypto.createHash('sha256').update(name).digest()
    var prefix = []

    for (var i = 0; i < 2; i++) {
      var n = hash[i]

      for (var j = 0; j < 4; j++) {
        var r = n & 3
        prefix.push(r)
        n -= r
        n /= 4
      }
    }

    var output = 'music/' + prefix.join('/') + '/' + name

    all.push({
      name: name,
      path: output,
      url: url
    })

    mutex(function (release) {
      fs.createReadStream(path.join(music, name))
        .pipe(archive.createWriteStream(output))
        .on('finish', function () {
          archive.writeFile('music.json', JSON.stringify(all, null, 2), function () {
            emitter.emit('added', { name: name })
            release()
          })
        })
    })
  }

  function done (err) {
    if (err) {
      emitter.emit('error', { message: err.message })
      return
    }
    mutex(function (release) {
      emitter.emit('finished', { message: 'Downloaded all music from Soundcloud' })
      release()
    })
  }

  function download (url, onfile, cb) {
    mkdirp(music, function () {
      var c = proc.spawn('youtube-dl', [url, '--quiet'], {cwd: music, stdio: 'inherit'})
      var emitted = null

      emitter.on('close', function () {
        if (c) c.kill()
        console.log('Killed ' + options.dest)
      })

      c.on('error', cb)
      c.on('exit', function (code) {
        c = null
        if (code) return cb(new Error('Bad exit code: ' + code))
        cb(null)
      })
      fs.watch(music, onchange)

      function onchange (event, name) {
        if (!/\.part$/.test(name) && !/\.f\d+\.\w+$/.test(name) && !/\.temp\.\w+$/.test(name)) {
          if (emitted === name) return
          emitted = name
          onfile(name)
        }
      }
    })
  }
}
