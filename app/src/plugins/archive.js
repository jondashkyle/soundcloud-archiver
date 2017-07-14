var mutate = require('xtend/mutable')
var xhr = require('xhr')

var ws

// hax
var wsPath = process.env.NODE_ENV === 'development'
  ? 'localhost:8081'
  : 'soundsalvage.jon-kyle.com/ws'

module.exports = archive

function archive (state, emitter) {
  state.archive = {
    agree: false,
    finished: false,
    url: '',
    error: '',
    id: '',
    key: '',
    tracks: [ ]
  }

  state.notifications = [ ]

  state.events.ARCHIVE_UPDATE = 'archive:update'
  state.events.ARCHIVE_CREATE = 'archive:create'
  state.events.ARCHIVE_NOTIFY = 'archive:notify'

  emitter.on(state.events.ARCHIVE_UPDATE, function (data) {
    mutate(state.archive, data)
    if (data.render !== false) emitter.emit(state.events.RENDER)
  })

  emitter.on(state.events.ARCHIVE_CREATE, function (data) {
    try {
      // open a connection
      if (!ws) {
        ws = new WebSocket('ws://' + wsPath)

        ws.addEventListener('open', function (event) {
          ws.send(JSON.stringify({ url: state.archive.url }))
        })

        ws.addEventListener('message', function (data) {
          handleMessage(JSON.parse(data.data))
        })
      } else {
        ws.send(JSON.stringify({ url: state.archive.url }))
      }

      // reset the errors
      state.archive.error = ''
    } catch (err) {
      notify('can not create archive, sorry!')
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
      notify('synced ' + data.name)
    }

    // finished
    if (data.finished) {
      state.archive.finished = true
      notify(data.finished)
    }

    // errors
    if (data.error) {
      state.archive.id = ''
      state.archive.key = ''
      state.archive.error = data.error
      notify(data.error)
    }

    emitter.emit(state.events.RENDER)
  }

  emitter.on(state.events.ARCHIVE_NOTIFY, function (data) {
    if (data.message) {
      notify(data.message)
    }
  })

  function notify (str) {
    state.notifications.push(str)
    emitter.emit(state.events.RENDER)
    setTimeout(function () {
      state.notifications.splice(state.notifications.indexOf(str), 1)
      emitter.emit(state.events.RENDER)
    }, 5000)
  }
}
