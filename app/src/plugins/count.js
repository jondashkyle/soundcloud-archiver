var xhr = require('xhr')

module.exports = countStore

function countStore (state, emitter) {
  state.count = 10

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    try {
      xhr('/testing.md', function (req, res, body) {
        state.content = body
        emitter.emit('render', 'content')
      })
    } catch (err) {
      console.warn('could not load content')
    }
  })

  emitter.on(state.events.COUNT_INCRIMENT, function (count) {
    state.count += count
    emitter.emit('render')
  })
}
