console.log('injected script running1')
console.log('getting wrapped object', window.wrappedJSObject.$nuxt)
console.log('getting token1', window.wrappedJSObject.$nuxt)
console.log('getting token', window.wrappedJSObject.$nuxt.$auth.token)

document.querySelector('body').dataset.token = window.wrappedJSObject.$nuxt.$auth.token
console.log('getting token', window.wrappedJSObject.$nuxt.$auth.token)
const event = new CustomEvent('PassToBackgroundToken', { detail: 'HELLO!!!' })
window.dispatchEvent(event)
// chrome.runtime.sendMessage(document.querySelector('#getTokenScript1').dataset.extensionId, { type: 'login-token', token: document.querySelector('body').dataset.token }, function (response) {
//   console.log('Response: ', response)
// })

// console.log("token and theme being retrieved")
// document.querySelector("body").dataset.theme = $nuxt.$colorMode._scope.effects[1].value;
