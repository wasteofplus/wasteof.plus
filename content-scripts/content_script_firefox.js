console.log('1hello from the content script!!!')
// console.log('going to need to manage routes', XPCNativeWrapper(window.wrappedJSObject), window.wrappedJSObject.$nuxt.$router)
// console.log('jso is', window.content.document.defaultView.wrappedJSObject)
// console.log('jso2 is ', window.top.getBrowser().selectedBrowser.contentWindow)

// function test (window) {
//   console.log('unsafe lambda', window)
// }
// // test(window.unsafeWindow)
// const testnewfunction = window.wrappedJSObject.$nuxt.$router
// console.log(testnewfunction)
// function testfunction () {
//   console.log('hello route may have changed from content script')
// }
// window.wrappedJSObject.$nuxt.$router = cloneInto(testfunction, window, {
//   cloneFunctions: true
// })
// testnewfunction.afterEach((to, from) => {
//   console.log('hello from content script again!!!')
// })
// window.wrappedJSObject.$nuxt.$router.afterEach((to, from) => {
//   console.log('hello from content script again!!!')
// })
window.addEventListener(
  'PassToBackgroundRoute',
  function (evt) {
    console.log('content script got route change window event')
    //   chrome.runtime.sendMessage(evt.detail)
    chrome.runtime.sendMessage(
      {
        type: 'route-changed'
      },
      function (response) {
        console.log('Response: ', response)
      }
    )
    console.log('got window event2')
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
        console.log('Response: ', response)
      }
    )
    console.log('got window event')
  },
  false
)

console.log('send message for tabid')
chrome.runtime.sendMessage({ text: 'what is my tab_id?' }, tabId => {
  console.log('My tabId is', tabId)
})
// document.body.style.backgroundColor = 'red'
// const getTokenScript = document.createElement('script')
// getTokenScript.id = 'getTokenScript1'
// getTokenScript.src = chrome.runtime.getURL('content-scripts/lib/getToken.js')
// // getTokenScript.dataset.extensionId = chrome.runtime.id

// document.body.appendChild(getTokenScript)

// const routeChangeScript = document.createElement('script')
// routeChangeScript.id = 'routeChangeScript1'
// routeChangeScript.src = chrome.runtime.getURL('content-scripts/lib/routeChange.js')
// // getTokenScript.dataset.extensionId = chrome.runtime.id

// document.body.appendChild(routeChangeScript)

// By the way, this could just be
//   var win = content;
// or
//   var win = gBrowser.contentWindow;
// voila!
