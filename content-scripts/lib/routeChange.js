console.log('route change script loaded/injected', window.$nuxt)

const testscript = document.createElement('script')
testscript.id = 'testscript'
testscript.src = chrome.runtime.getURL('content-scripts/lib/test.js')
// testscript.innerText = 'try { console.log(\'route change test script loaded\', $nuxt); $nuxt.$router.afterEach((to, from) => { console.log(\'route changed\') }) } catch (err) { console.error(\'got error\', err); console.error(\'route changed!\');}'

document.body.appendChild(testscript)

// console.log('nuxt route', $nuxt)
// window.unwrapJSObject.$nuxt.$router.afterEach((to, from) => {
//   console.log('route changed')

//   const extensionId = document.querySelector('#routeChangeScript').dataset.extensionId
//   console.log('the extension id is ', extensionId)

//   chrome.runtime.sendMessage(extensionId, { recording_started: true },
//     function (response) {
//       console.log('sent@')
//     })

//   window.postMessage({
//     type: 'FROM_PAGE',
//     text: 'reload'
//   }, '*')

//   const event = new CustomEvent('PassToBackgroundRoute', { detail: 'HELLO!!!' })
//   window.dispatchEvent(event)
// })
