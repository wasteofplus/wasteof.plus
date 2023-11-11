console.log('twemoji script loaded')

const twemojiScript = document.createElement('script')
twemojiScript.id = 'twemojiScript'
twemojiScript.src = chrome.runtime.getURL('../../node_modules/twemoji/dist/twemoji.min.js')
document.head.appendChild(twemojiScript)

const twemojiScript1 = document.createElement('script')
twemojiScript1.id = 'twemojiScript1'
twemojiScript1.src = chrome.runtime.getURL('addons/twemojiEverywhere/lib/twemojiSet.js')
document.head.appendChild(twemojiScript1)
