function addon () {
  console.log('executing addon , chatPresenceNotify')
  const SCRIPT_ID = 'chat-presence-notify'
  // HACK: inject the notify.js script (because that's the only solution I can find)
  if (document.getElementById(SCRIPT_ID) !== null) { // make sure this script isn't there already
    console.log('script already exists')
    return
  }
  const element = document.createElement('script')
  element.id = SCRIPT_ID
  element.src = chrome.runtime.getURL('./addons/chatPresenceNotify/lib/notify.js')
  console.log('injecting to', document.head, element)
  document.head.appendChild(element)
}

addon()
