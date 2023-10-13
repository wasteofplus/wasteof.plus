function addon () {
  document.querySelectorAll('.emoji').forEach((el) => {
    console.log(el.parentElement.textContent)
    if (el.parentElement.textContent === '') {
      console.log('its null')
      if (el.parentElement.querySelectorAll('.emoji').length < 2) {
        el.style.width = '48px'
        el.classList.add('bigEmoji')
        el.style.height = '48px'
      } else if (el.parentElement.querySelectorAll('.emoji').length < 4) {
        el.style.width = '36px'
        el.classList.add('bigEmoji')
        el.style.height = '36px'
      }
    }
  })
}

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log(mutation)
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // element added to DOM
      const hasClass = [].some.call(mutation.addedNodes, function (el) {
        return el.classList.contains('emoji')
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
  characterData: true
}

observer.observe(document.body, config)

console.log('MAKE EMOJIS BIG')
addon()
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('big emojis addon loaded', message)
    addon()
  })
})
