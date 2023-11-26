console.log('systemEmoji addon loaded')
// made by radi8 (https://github.com/radeeyate)
const emojiImages = document.querySelectorAll('img.emoji')
for (const emojiImage of emojiImages) {
  const altText = emojiImage.getAttribute('alt')
  const spanElement = document.createElement('span')
  spanElement.textContent = altText
  emojiImage.parentNode.replaceChild(spanElement, emojiImage)
}

async function func () {
  const utilsUrl = chrome.runtime.getURL('../utils.js')

  const utils = await import(utilsUrl)

  const debug = await import(chrome.runtime.getURL('../debug.js'))

  await utils.waitForElm('img.border-2', debug, async (addedNodesFromWait) => {
    console.log('systemEmoji post loaded')
    const emojiImages = document.querySelectorAll('img.emoji')
    for (const emojiImage of emojiImages) {
      const altText = emojiImage.getAttribute('alt')
      const spanElement = document.createElement('span')
      spanElement.textContent = altText
      emojiImage.parentNode.replaceChild(spanElement, emojiImage)
    }

    // addon(false)
  })
}

func()
