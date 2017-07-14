module.exports = countStore

function countStore (state, emitter) {
  state.count = 10

  // emitter.on(state.events.COUNT_INCRIMENT, function (count) {
  //   state.count += count
  //   emitter.emit('render')
  // })
}
