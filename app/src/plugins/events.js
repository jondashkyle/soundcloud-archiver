var xtend = require('xtend')
module.exports = events

function events (state, emitter) {
  var app = { }

  // counter
  app.COUNT_INCRIMENT = 'app/count/incriment'

  // add our events
  state.events = xtend(state.events, app)
}
