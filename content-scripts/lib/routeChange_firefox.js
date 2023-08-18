console.log('route change script loaded/injected', window.$nuxt)

const testscript = document.createElement('script')
testscript.id = 'testscript'
testscript.src = chrome.runtime.getURL('content-scripts/lib/routeInjectedScript.js')
// testscript.innerText = 'try { console.log(\'route change test script loaded\', $nuxt); $nuxt.$router.afterEach((to, from) => { console.log(\'route changed\') }) } catch (err) { console.error(\'got error\', err); console.error(\'route changed!\');}'

document.body.appendChild(testscript)
