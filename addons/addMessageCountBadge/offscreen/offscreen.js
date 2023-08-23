function playAudio ({ source, volume }) {
  const audio = new Audio(source)
  audio.volume = volume
  audio.play()
}

function logMessage (message, url) {
  if (url !== '' && url != null && url !== undefined) {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const raw = JSON.stringify({
      message
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }
}

let websocketListening = false

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'check-response') {
    if (websocketListening) {
      sendResponse('success')
    } else {
      sendResponse('failure')
    }
  } else if (request.type === 'token-send') {
    fetch('https://api.wasteof.money/messages/count', {
      headers: {
        Authorization: request.token
      }
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.count > 0) {
          if (request.playSound) {
            playAudio({ source: request.sound, volume: request.volume })
          }

          chrome.runtime.sendMessage({
            type: 'new_messages',
            count: data.count,
            dontNotify: true
          })
        } else {
          chrome.runtime.sendMessage({
            type: 'new_messages',
            count: 0
          })
        }
      })
    if (request.type === 'token-send') {
      logMessage('Token received: ' + request.token)
      const logUrl = request.logUrl
      sendResponse({
        response: 'Response from offscreen script' + request.token
      })
      const socket = io('https://api.wasteof.money', {
        transports: ['websocket'],
        auth: { token: request.token }
      })
      websocketListening = true

      socket.on('updateMessageCount', function (count) {
        localStorage.setItem('myCat', 'Tom')
        const cat = localStorage.getItem('myCat')

        logMessage('The message coun1t is ' + count.toString() + JSON.stringify(chrome.runtime.id) + cat, logUrl)

        function getStorageData () {
          return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
              chrome.runtime.id,
              { type: 'get_message_count' },
              (response) => {
                logMessage('resolving promise' + count.toString(), logUrl)

                resolve(response)
              }
            )
          })
        }
        getStorageData()
          .then((storageData) => {
            // Handle the storage data
            if (storageData.numberOfMessages !== undefined) {
              if (count > storageData.numberOfMessages) {
                // Play sound with access to DOM APIs
                logMessage(
                  'The sound we will play is ' +
                    storageData.sound +
                    ' with volume ' +
                    storageData.volume.toString(),
                  logUrl
                )
                if (storageData.playSound) {
                  playAudio({
                    source: storageData.sound,
                    volume: storageData.volume
                  })
                }
                logMessage('New message received!' + count.toString(), logUrl)
                chrome.runtime.sendMessage({
                  type: 'new_messages',
                  count,
                  token: request.token,
                  dontNotify: false
                })

                sendResponse({ response: 'Response from offscreen script' })
                chrome.runtime.sendMessage({ count })
              } else {
                chrome.runtime.sendMessage({
                  type: 'new_messages',
                  count,
                  token: request.token,
                  dontNotify: true
                })
                logMessage('No new messages', logUrl)
              }
            } else {
              logMessage(
                'No new messages' +
                  JSON.stringify(storageData.numberOfMessages),
                logUrl
              )
            }
          })
          .catch((error) => {
            logMessage('No new messages' + JSON.stringify(error), logUrl)
          })
      })
    }
  }
})

setInterval(async () => {
  ;(await navigator.serviceWorker.ready).active.postMessage('keepAlive')
}, 20e3)
