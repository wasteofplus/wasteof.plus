function addon () {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('executing addon , chatPresenceNotify', 'alwayslog')
    const SCRIPT_ID = 'chat-presence-notify'
    // HACK: inject the notify.js script (because that's the only solution I can find)
    if (document.getElementById(SCRIPT_ID) !== null) { // make sure this script isn't there already
      debug.log('script already exists')
      return
    }
    const element = document.createElement('script')
    element.id = SCRIPT_ID
    element.src = chrome.runtime.getURL('./addons/chatPresenceNotify/lib/notify.js')
    debug.log('injecting to', document.head, element)
    document.head.appendChild(element)
  })
}

addon()
