var uuid = require('uuid')
var subtoilet = require('subtoilet')
var nanobus = require('nanobus')
var Archive = require('./archive')

module.exports = Api

// api here
function Api (server, options) {
  var wss = options.wss
  var db = options.db
  var archivesdb = subtoilet(db, 'archives')

  wss.on('connection', handleConnection)
  monitor(wss)

  function handleConnection (ws, req) {
    var id = uuid.v4()
    var bus = nanobus()
    var archivedb = subtoilet(archivesdb, id)
    var tracksdb = subtoilet(archivedb, 'tracks')
    var archive

    // keep it going
    ws.isAlive = true

    // sockets
    ws.on('pong', heartbeat)
    ws.on('message', (data) => handleMessage(JSON.parse(data)))
    ws.on('close', handleClose)

    // dat archive
    bus.on('ready', handleArchiveReady)
    bus.on('added', handleArchiveAdded)

    // setup state
    archivesdb.write(id, { })

    // updates
    function handleMessage (data) {
      try {
        archive = Archive({
          dest: './.tracks/' + id,
          url: data.url
        }, bus)
      } catch (err) {
        send({ error: 'No url available' })
      }
    }

    // out of here
    function handleClose () {
      ws.isAlive = false
      bus.emit('close')
    }

    function handleArchiveReady (data) {
      data.id = id
      db.read('total', function (err, data) {
        if (err) console.warn(err.message)
        var total = data || 0
        db.write('total', parseInt(total) + 1)
      })
      archivedb.write('url', data.url)
      archivedb.write('date', Date.now())
      send(data)
    }

    function handleArchiveAdded (data) {
      tracksdb.write(data.name, Date.now())
      send(data)
    }

    // communicate with our ws
    function send (data) {
      ws.send(JSON.stringify(data))
    }
  }
}

function heartbeat () {
  this.isAlive = true
}

// check for closed connections
function monitor (wss) {
  setInterval(function ping () {
    wss.clients.forEach(function each (ws) {
      if (ws.isAlive === false) return ws.terminate()

      ws.isAlive = false
      ws.ping('', false, true)
    })
  }, 30000)
}
