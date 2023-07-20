let newNodes = 0

async function addon (reload) {
  console.log('executing addon function', chrome.runtime.getURL('../utils.js'))
  const utilsUrl = chrome.runtime.getURL('../utils.js')
  const utils = await import(utilsUrl)
  await utils.waitForElm('img.border-2')
  // utils.observeUrlChange(addon(true));
  console.log('pictures - waiting on feed', reload)
  if (reload) {
    await new Promise(resolve => setTimeout(resolve, 3000)) // 3 sec
  }
  await new Promise(resolve => setTimeout(resolve, 500)) // 3 sec
  console.log('images', document.querySelectorAll('img.border-2'))
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log('mutation', mutation.addedNodes.length, newNodes)
      if (mutation.addedNodes.length > 0) {
        newNodes += mutation.addedNodes.length
        if (newNodes > 14) {
          newNodes = 0
          addon(true)
          console.log('new posts added!!!')
        }
      }
    })
  })

  console.log('finished setting up observer')

  console.log('observe')
  // const loadMoreButton = document.querySelector("main > div > button.button-primary");
  // loadMoreButton.addEventListener("click", addon(true));

  const profilePictures = document.querySelectorAll('img.border-2')
  console.log('pictures', profilePictures)

  const onlineIndicator = document.createElement('div')
  onlineIndicator.classList.add('onlineindicator1')
  console.log('pictures')

  const setUserStatusesUrl = chrome.runtime.getURL('./addons/addUserStatuses/lib/setUserStatuses.js')
  const contentMain = await import(setUserStatusesUrl)
  contentMain.setUserStatuses(profilePictures, onlineIndicator)

  const config = { attributes: false, childList: true, characterData: false }
  observer.observe(document.querySelector('main > div.my-4'), config)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.greeting === 'addUserStatuses') { sendResponse({ message: 'hello' }) }
  })

window.addEventListener('message', function (event) {
  // We only accept messages from ourselves
  if (event.data.type && (event.data.type === 'FROM_PAGE')) {
    console.log('Content script received: ' + event.data.text)
  }
})

// const routeChangeScript = document.createElement('script')
// routeChangeScript.id = 'routeChangeScript'
// routeChangeScript.dataset.extensionId = chrome.runtime.id
// routeChangeScript.src = chrome.runtime.getURL('./addons/addUserStatuses/lib/routeChange.js')

// document.body.appendChild(routeChangeScript)

addon(false)
