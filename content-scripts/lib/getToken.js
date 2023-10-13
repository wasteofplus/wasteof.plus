// console.log('injected script running')

document.querySelector('body').dataset.token = $nuxt.$auth.token
document.querySelector('body').dataset.username = $nuxt.$auth.user.name
console.log('getting token')

const event = new CustomEvent('PassToBackgroundToken', { detail: 'HELLO!!!' })
window.dispatchEvent(event)

document.querySelector('body').dataset.loggedIn = $nuxt.$auth.loggedIn
if ($nuxt.$auth.loggedIn) {
  document.querySelector('body').dataset.userId = $nuxt.$auth.user.id
  document.querySelector('body').dataset.username = $nuxt.$auth.user.name
  const permissions = { permissions: $nuxt.$auth.user.permissions }
  permissions.beta = $nuxt.$auth.user.beta
  permissions.verified = $nuxt.$auth.user.verified

  document.querySelector('body').dataset.permissions = JSON.stringify(permissions)
}

// console.log('getting token')
// chrome.runtime.sendMessage(document.querySelector('#getTokenScript1').dataset.extensionId, { type: 'login-token', token: document.querySelector('body').dataset.token }, function (response) {
//   console.log('Response: ', response)
// })

// console.log("token and theme being retrieved")
// document.querySelector("body").dataset.theme = $nuxt.$colorMode._scope.effects[1].value;
