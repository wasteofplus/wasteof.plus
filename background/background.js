// import { io } from '../node_modules/socket.io-client/build/esm'

async function doesContentScriptExist (tabId, contentScript) {
  console.log('does content script exist', tabId)
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(tabId, { greeting: contentScript }, function (response) {
        if (response) {
          console.log('Already there')
          resolve(true)
        } else {
          console.log('Not there, inject contentscript')
          resolve(false)
        }
      })
    } catch {
      console.log('returning false1')
      resolve(false)
    }
  })
}

function runAddon (tabId, contentScript) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['addons/' + contentScript + '/addon.js']
  })
  chrome.scripting.insertCSS({
    target: { tabId },
    files: ['addons/' + contentScript + '/addon.css']
  })
}

const defaultEnabledAddons = [
  'addUserStatuses',
  // "showSeenPosts"
  'profileHoverCards'
]

// Cooldown variables
let lastTabId = 0
let lastAddedAddons = null

// chrome.storage.local.get(['login_token']).then((result) => {
//   if (result.login_token !== undefined) {
//     const socket = io('https://api.wasteof.money', { transports: ['websocket'], auth: { token: result.login_token } })

//     socket.on('updateMessageCount', async (count) => {
//       console.log('MEssage count updated')
//     })
//   }
// })

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  chrome.storage.local.get(['enabledAddons']).then((result) => {
    let enabledAddons = []
    if (result.enabledAddons === undefined) {
      console.log("couldn't find enabled addons")
      chrome.storage.local.set({ enabledAddons: defaultEnabledAddons })
      enabledAddons = defaultEnabledAddons
    } else {
      console.log('found enabled addons', result.enabledAddons)
      enabledAddons = result.enabledAddons
    }
    // Implement cooldown
    if (lastTabId !== details.tabId || lastAddedAddons == null || Date.now() - lastAddedAddons > 2000) {
      lastAddedAddons = Date.now()
      lastTabId = details.tabId
      for (const addon of enabledAddons) {
        console.log('enabling addon', addon)
        console.log(chrome.runtime.getURL('addons/' + addon + '/addon.json'))
        const addonSettings = fetch(chrome.runtime.getURL('addons/' + addon + '/addon.json'))
        addonSettings.then(response => response.json()).then(async (data) => {
          console.log('addon settings', data.urls)
          let dynamicEnableStatus = false
          for (const url of data.urls) {
            console.log(details.url, ' ', url, details.url === url)
            if (details.url === url) {
              dynamicEnableStatus = true
            }
          }
          for (const url of data.urlcontains) {
            if (details.url.includes(url)) {
              dynamicEnableStatus = true
            }
          }
          console.log('does current url', details.url, ' match addon url?', dynamicEnableStatus)
          if (dynamicEnableStatus) {
            // wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000)) // 3 sec
            // console.log("exists?", doesContentScriptExist(details.tabId, "feed"))
            const scriptExists = await doesContentScriptExist(details.tabId, addon)
            console.log(scriptExists)
            if (!scriptExists) {
              console.log('adding addon', addon)
              runAddon(details.tabId, addon)
            } else {
              console.log('script already exists. reloading tab')
              chrome.tabs.reload(details.tabId)
            }
          }
        })
      }
    }
  })
})

// function handleMessage(request, sender, sendResponse) {
//     console.log(`A content script sent a message:`);
//     console.log("background script received reload instruction!")

//     chrome.tabs.sendMessage(request.tabId, {
//         greeting: "reload",
//         addon: request.addon
//     }, function (response) {
//         console.log("finished sending message")
//     });
//     sendResponse({ response: "Response from background script" });
// }

// chrome.runtime.onMessage.addListener(handleMessage);

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type === 'login-token') {
    console.log('received message from content script', request.token)
    chrome.runtime.sendMessage({
      type: 'token-send',
      target: 'offscreen',
      token: request.token
    }, function (response) {
      console.log('response from offscreen', response)
    })
    //     await chrome.offscreen.createDocument({
    //       url: 'offscreen.html',
    //       reasons: ['DOM_SCRAPING'],
    //       justification: 'reason for needing the document'
    //     })
  } else if (request.type === 'new_messages') {
    chrome.action.setBadgeText({ text: request.count.toString() })
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' })
    chrome.action.setBadgeTextColor({ color: '#ffffff' })

    console.log('new messages found', request.count)
  } else {
    console.log('got message', request.type)
  }
})

async function createOffscreen () {
  await chrome.offscreen.createDocument({
    url: 'addons/addMessageCountBadge/offscreen/offscreen.html',
    reasons: ['BLOBS'],
    justification: 'keep service worker running'
  }).catch(() => {})
}
chrome.runtime.onStartup.addListener(createOffscreen)
self.onmessage = e => {} // keepAlive
createOffscreen()
