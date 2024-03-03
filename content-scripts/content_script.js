console.log('content script loaded')

window.addEventListener(
  'PassToBackgroundRoute',
  function (evt) {
    console.log('content script route changed!')
    //   chrome.runtime.sendMessage(evt.detail)
    chrome.runtime.sendMessage(
      {
        type: 'route-changed'
      },
      function (response) {
        // console.log('Response: ', response)
      }
    )
    // console.log('got window event')
  },
  false
)

window.addEventListener(
  'PassToBackgroundToken',
  function (evt) {
    //   chrome.runtime.sendMessage(evt.detail)
    chrome.runtime.sendMessage(
      {
        type: 'login-token',
        token: document.querySelector('body').dataset.token
      },
      function (response) {
        // console.log('Response: ', response)
      }
    )
    // console.log('got window event')
  },
  false
)
// document.body.style.backgroundColor = 'red'
const getTokenScript = document.createElement('script')
getTokenScript.id = 'getTokenScript1'
getTokenScript.src = chrome.runtime.getURL('content-scripts/lib/getToken.js')
// getTokenScript.dataset.extensionId = chrome.runtime.id

document.body.appendChild(getTokenScript)

const routeChangeScript = document.createElement('script')
routeChangeScript.id = 'routeChangeScript1'
routeChangeScript.src = chrome.runtime.getURL(
  'content-scripts/lib/routeChange.js'
)
// getTokenScript.dataset.extensionId = chrome.runtime.id

document.body.appendChild(routeChangeScript)

// By the way, this could just be
//   var win = content;
// or
//   var win = gBrowser.contentWindow;
// voila!
