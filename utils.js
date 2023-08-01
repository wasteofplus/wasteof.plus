function waitForElm (selector, callback) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(mutations => {
      console.log('mutation', mutations)
      if (document.querySelector(selector)) {
        console.log('observer ended up!')
        resolve(document.querySelector(selector))
        if (callback) {
          callback()
        } else {
          observer.disconnect()
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

function observeUrlChange (onUrlChange) {
  let oldHref = document.location.href
  const body = document.querySelector('body')
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href
      console.log('url changed!')
      onUrlChange(true)
      observer.disconnect()
    }
  })
  observer.observe(body, { childList: true, subtree: true })
};

export { waitForElm, observeUrlChange }
