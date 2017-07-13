var html = require('choo/html')
var md = require('nano-markdown')

module.exports = mainView

function mainView (state, emit) {
  var content = html`<div></div>`
  content.innerHTML = md(state.content || '')

  return html`
    <body>
      <div class="p1 ffsans">
        ${content}
        <h1 class="test">count is ${state.count}</h1>
        <button onclick=${onclick}>Increment</button>
        <a href="/test">testing yo</a>
      </div>
    </body>
  `

  function onclick () {
    emit(state.events.COUNT_INCRIMENT, 1)
  }
}
