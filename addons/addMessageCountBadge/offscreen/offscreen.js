// const io = import('./socket/socket.io.js')
// chrome.extension.getBackgroundPage().console.log('foo')

// socket.on('time', function(data) {
//     addMessage(data.time);
// });
// socket.on('error', console.error.bind(console));
// socket.on('message', console.log.bind(console));

// console.log('loaded offscreen script')

function playAudio ({ source, volume }) {
  const audio = new Audio(source)
  audio.volume = volume
  audio.play()
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
    }).then(response => response.json()).then(async (data) => {
      if (data.count > 0) {
        playAudio({ source: chrome.runtime.getURL('assets/sounds/notify.mp3'), volume: 1 })

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
      let myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      let raw = JSON.stringify({
        message: 'Got message from Background!'
      })

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      fetch('https://mighty-push.vercel.app/api/log', requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
      sendResponse({ response: 'Response from offscreen script' + request.token })
      const socket = io('https://api.wasteof.money', { transports: ['websocket'], auth: { token: request.token } })
      websocketListening = true

      socket.on('updateMessageCount', function (count) {
        myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        raw = JSON.stringify({
          message: 'message count is ' + count.toString()
        })

        requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        }

        fetch('https://mighty-push.vercel.app/api/log', requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))

        function getStorageData () {
          return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: 'get_message_count' }, (response) => {
              resolve(response)
            })
          })
        }
        getStorageData()
          .then((storageData) => {
            // Handle the storage data
            if (storageData !== undefined) {
              if (count > storageData) {
                myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/json')
                // Play sound with access to DOM APIs
                playAudio({ source: chrome.runtime.getURL('assets/sounds/notify.mp3'), volume: 1 })

                chrome.runtime.sendMessage({
                  type: 'new_messages',
                  count,
                  token: request.token,
                  dontNotify: false
                })

                raw = JSON.stringify({
                  message: 'New Messages!!!' + count.toString()
                })

                requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                }

                fetch('https://mighty-push.vercel.app/api/log', requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error))
                sendResponse({ response: 'Response from offscreen script' })
                chrome.runtime.sendMessage({ count })
              } else {
                chrome.runtime.sendMessage({
                  type: 'new_messages',
                  count,
                  token: request.token,
                  dontNotify: true
                })
                myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/json')

                raw = JSON.stringify({
                  message: 'No new messages'
                })

                requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                }
                fetch('https://mighty-push.vercel.app/api/log', requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error))
              }
            } else {
              myHeaders = new Headers()
              myHeaders.append('Content-Type', 'application/json')

              raw = JSON.stringify({
                message: 'No new messages2' + JSON.stringify(storageData)
              })

              requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              }
              fetch('https://mighty-push.vercel.app/api/log', requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error))
            }
          })
          .catch((error) => {
            myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')

            raw = JSON.stringify({
              message: 'No new messages3' + JSON.stringify(error)
            })

            requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            }
            fetch('https://mighty-push.vercel.app/api/log', requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error))
          })
      })
      // chrome.runtime.sendMessage({ type: 'get_message_count' }, async function (response) {

      // })
      //     const opts = { transports: ['websocket'], auth: { token: request.login_token } }
      //     const socket = new WebSocket('https://api.wasteof.money', opts)

      //     socket.addEventListener('open', () => {
      //       // WebSocket connection established
      //     })

      //     socket.addEventListener('message', (event) => {
      //       // Handle incoming messages from the WebSocket server
      //     })

      //     socket.addEventListener('close', () => {
      //       // Handle WebSocket connection closed
      //     })
      //     // console.log('got login token', request.login_token)
      //     // console.log('login token')
      //     // const socket = io('https://api.wasteof.money', { transports: ['websocket'], auth: { token: request.login_token } })

      //     // socket.on('updateMessageCount', async (count) => {
      //     //   chrome.runtime.sendMessage({
      //     //     type: 'new_messages' + count.toString()
      //     //   })
      //     //   console.log('MEssage count updated')
      //     // })
      // })
    }
  }
})

setInterval(async () => {
  (await navigator.serviceWorker.ready).active.postMessage('keepAlive')
}, 20e3)
