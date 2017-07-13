var html = require('choo/html')

module.exports = notfound

function notfound (state, emit) {
  return html`
    <body class="p1 ffsans">
      not found
    </body>
  `
}
