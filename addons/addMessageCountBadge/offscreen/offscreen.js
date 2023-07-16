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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
    sendResponse({ response: 'Response from offscreen script' })
    const socket = io('https://api.wasteof.money', { transports: ['websocket'], auth: { token: request.token } })

    socket.on('updateMessageCount', function (count) {
      myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')
      // Play sound with access to DOM APIs
      playAudio({ source: chrome.runtime.getURL('assets/sounds/notify.mp3'), volume: 1 })
      chrome.runtime.sendMessage({
        type: 'new_messages',
        count
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
    })
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
  }
})

setInterval(async () => {
  (await navigator.serviceWorker.ready).active.postMessage('keepAlive')
}, 20e3)
