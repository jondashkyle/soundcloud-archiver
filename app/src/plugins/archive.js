var mutate = require('xtend/mutable')
var xhr = require('xhr')

var ws
var wsPath = process.env.NODE_ENV === 'development'
  ? 'localhost:8081'
  : '127.0.0.1:1001'

module.exports = archive

function archive (state, emitter) {
  state.archive = {
    agree: false,
    url: '',
    error: false,
    id: '',
    key: '',
    tracks: [ ]
  }

  state.notifications = [ ]

  state.events.ARCHIVE_UPDATE = 'archive:update'
  state.events.ARCHIVE_CREATE = 'archive:create'

  emitter.on(state.events.ARCHIVE_UPDATE, function (data) {
    mutate(state.archive, data)
    if (data.render !== false) emitter.emit(state.events.RENDER)
  })

  emitter.on(state.events.ARCHIVE_CREATE, function (data) {
    try {
      ws = new WebSocket('ws://' + wsPath)

      ws.addEventListener('open', function (event) {
        ws.send(JSON.stringify({ url: state.archive.url }))
      })

      ws.addEventListener('message', function (data) {
        handleMessage(JSON.parse(data.data))
      })
    } catch (err) {
      alert('Can not create Archive, sorry!')
    }
  })

  function handleMessage (data) {
    // ready
    if (data.id && data.key) {
      state.archive.id = data.id
      state.archive.key = data.key
    }

    // track
    if (data.name) {
      state.archive.tracks.push(data.name)
      state.notifications.push(data.name)
      setTimeout(function () {
        state.notifications.splice(state.notifications.indexOf(data.name), 1)
        emitter.emit(state.events.RENDER)
      }, 5000)
    }

    emitter.emit(state.events.RENDER)
  }
}
