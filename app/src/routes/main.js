var html = require('choo/html')
var md = require('../methods/md')

module.exports = mainView

function mainView (state, emit) {
  return html`
    <main class="c12 oh">
      <div class="ffsans psf t0 r0 z2 m0-5 ${state.archive.id ? 'db' : 'dn'}" sm="l0">
        ${state.notifications.length > 0
          ? elNotifications(state.notifications)
          : html`<div class="m0-5"><div class="loader"></div></div>`
        }
      </div>
      <div class="fs4 lh1-1">
        <div class="ffsans p2" style="min-height: 50vh">
          sound salvage 
        </div>
        <div class="ffserif p2">
          ${md(state.content.home)}
        </div>
        <form
          class="db m1 usn fs2 ffsans psr" sm="fs2"
          onsubmit=${handleSubmit}
        >
          <div class="${state.archive.id ? 'op25 pen' : ''}">
            ${[
              elUrl(state.archive.url, handleInput),
              state.archive.url
                ? elAgree(state.archive.agree, handleInput)
                : html`<div></div>`,
              state.archive.agree && state.archive.url
                ? elSubmit()
                : html`<div></div>`
            ].map(el => html`<div class="p1">${el}</div>`)}
          </div>
          <div class="psa t0 l0 r0 b0 x xjc xac ${state.archive.id ? 'x' : 'dn'}">
          </div>
        </form>
        ${state.archive.key
          ? elPrepairing(state.content.prepairing, state.archive.key)
          : html`<div></div>`
        }
      </div>
      <div style="height: 25vh"></div>
    </main>
  `

  function handleSubmit (event) {
    var approved = verifyArchive(state.archive)
    event.preventDefault()
    if (approved === true) {
      emit(state.events.ARCHIVE_CREATE, { url: state.archive.url })
    } else {
      alert('Please enter a valid URL and agree to the terms!')
    }
  }

  function handleInput (event) {
    emit(state.events.ARCHIVE_UPDATE, event)
  }
}

function elUrl (url, oninput) {
  return html`
    <input
      placeholder="soundcloud.com/your-url-here"
      type="text"
      value="${url}"
      oninput=${handleInput}
      style="border: 0; outline: 0;"
      class="fs2 ffsans bgblack tcwhite c12 p2"
      sm="fs2"
    />
  `

  function handleInput (event) {
    oninput({ url: event.target.value })
  }
}

function elAgree (agree, onchange) {
  var text = agree
    ? 'cool, thanks.'
    : 'are these your tracks?'

  var value = agree
    ? '👍'
    : '🤷'

  return html`
    <div>
      <label class="bgblack tcwhite p2 c12 curp x xjb" for="agree">
        <div>${text}</div>
        <div>${value}</div>
      </label>
      <input
        id="agree"
        type="checkbox"
        class="dn"
        onchange=${handleChange}
        checked="${agree}"
      />
    </div>
  `

  function handleChange (event) {
    onchange({ agree: event.target.checked })
  }
}

function elSubmit () {
  return html`
    <button
      type="submit"
      class="curp db c12 p2 fs2 ffsans bgblack tcwhite"
    >let’s get started!</button>
  `
}

function elPrepairing (content, key, track) {
  content = content.replace(/{{DATURL}}/g, key)
  return html`
    <div class="ffserif p2">
      ${md(content)}
    </div>
  `
}

function elNotifications (notifications) {
  return notifications.map(function (name) {
    return html`<div class="tar"><span class="dib m0-5 p1 bgblack tcwhite">added ${name}</span></div>`
  })
}

function verifyArchive (data) {
  if (!data.url) {
    return 'Please enter a valid URL'
  }

  if (!data.agree) {
    return 'Please agree to the terms'
  }

  return true
}
