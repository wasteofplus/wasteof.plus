console.log('twemoji script loaded')

const twemojiScript = document.createElement('script')
twemojiScript.id = 'twemojiScript'
twemojiScript.src = chrome.runtime.getURL('../../node_modules/twemoji/dist/twemoji.min.js')
document.head.appendChild(twemojiScript)

const twemojiScript1 = document.createElement('script')
twemojiScript1.src = chrome.runtime.getURL('addons/twemojiEverywhere/lib/twemojiSet.js')
document.head.appendChild(twemojiScript1)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('twemoji everywhere message', message)
    sendResponse({ message: 'hello' })

    if (message.greeting === 'twemojiEverywhere') {
      const twemojiScript1 = document.createElement('script')
      twemojiScript1.src = chrome.runtime.getURL('addons/twemojiEverywhere/lib/twemojiSet.js')
      document.head.appendChild(twemojiScript1)
    }
  })
})
