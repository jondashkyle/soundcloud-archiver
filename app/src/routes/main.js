var html = require('choo/html')
var md = require('../methods/md')

module.exports = mainView

function mainView (state, emit) {
  return html`
    <main class="c12 oh">
      <div class="ffsans psf t0 r0 z2 m0-5 pen" sm="l0">
        ${state.notifications.length > 0
          ? elNotifications(state.notifications)
          : html`<div class="m0-5 ${state.archive.id && !state.archive.finished ? 'db' : 'dn'}"><div class="loader"></div></div>`
        }
      </div>
      <div class="fs4 lh1-1">
        <div class="ffsans p2" style="min-height: 50vh">
          sound salvage 
        </div>
        <div class="ffserif p2">
          ${md(state.content.home)}
          <span class="ffsans fs1 ttu">
            * please don’t abuse this, it’s made for personal use to archive only your tracks
          </div>
        </div>
        <form
          class="db m1 usn fs2 ffsans psr" sm="fs2"
          onsubmit=${handleSubmit}
        >
          <div class="${state.archive.id ? 'op25 pen' : ''}">
            ${[
              elUrl(state.archive.url, state.archive.error ,handleInput),
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
        ${state.archive.key && !state.archive.finished
          ? html`<div class="p2 ffserif">now, let’s wait for it to finish…</div>`
          : html`<div></div>`
        }
        ${state.archive.finished
          ? elFinished(state.content.finished)
          : html`<div></div>`
        }
        ${state.archive.finished
          ? html`<div class="fs1 ffsans psf b0 l0 r0 z2 bgblack tcwhite lh1 p1">dat://${state.archive.key}</div>`
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
      emit(state.events.ARCHIVE_NOTIFY, { message: 'please enter a url and agree!' })
    }
  }

  function handleInput (event) {
    emit(state.events.ARCHIVE_UPDATE, event)
  }
}

function elUrl (url, error, oninput) {
  return html`
    <input
      placeholder="soundcloud.com/your-url-here"
      type="text"
      value="${url}"
      oninput=${handleInput}
      style="border: 0; outline: 0;"
      class="fs2 ffsans tcwhite ${error ? 'bgred' : 'bgblack'} c12 p2"
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

function elFinished (content) {
  return html`
    <div class="ffserif p2">
      ${md(content)}
    </div>
  `
}

function elNotifications (notifications) {
  return notifications.map(function (name) {
    return html`
      <div class="tar"><span class="dib m0-5 p1 bgblack tcwhite">${name}</span></div>
    `
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
