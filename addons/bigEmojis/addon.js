function addon () {
  chrome.runtime.sendMessage({ type: 'getOptions', addon: 'bigEmojis' }, function (response) {
    document.querySelectorAll('.emoji').forEach((el) => {
      console.log(el.parentElement.textContent)
      if (el.parentElement.textContent === '') {
        console.log('its null')
        if (el.parentElement.querySelectorAll('.emoji').length < 2) {
          el.style.width = response.large.toString() + 'px'
          el.style.height = response.large.toString() + 'px'
          el.classList.add('bigEmoji')
        } else if (el.parentElement.querySelectorAll('.emoji').length < 4) {
          el.style.width = response.medium.toString() + 'px'
          el.style.height = response.medium.toString() + 'px'
          el.classList.add('bigEmoji')
        }
      }
    })
    console.log('response from offscreen', response)
  })
}

const observer2 = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // console.log(mutation)
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // element added to DOM
      const hasClass = [].some.call(mutation.addedNodes, function (el) {
        console.log(el)
        if (typeof (el.querySelectorAll) !== 'function') return false
        // console.log(el)

        return el.querySelectorAll('.emoji').length > 0 || el.classList.contains('emoji')
      })
      if (hasClass) {
        // element has class `emoji`
        console.log('element ".emoji" added')
        addon()
      }
    }
  })
})

const config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true
}

observer2.observe(document.body, config)

console.log('MAKE EMOJIS BIG')
addon()
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('big emojis addon loaded', message)
    addon()
  })
})
