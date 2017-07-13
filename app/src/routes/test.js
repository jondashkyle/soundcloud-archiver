var html = require('choo/html')

module.exports = mainView

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Decrement</button>
    </body>
  `

  function onclick () {
    emit(state.events.COUNT_INCRIMENT, -1)
  }
}