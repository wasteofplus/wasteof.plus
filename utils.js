function waitForElm (selector, debug, callback) {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
      }

      const observer = new MutationObserver(mutations => {
        debug.log('mutation', mutations)

        if (document.querySelector(selector)) {
          let elementsThatDidntHaveClass = false
          for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
              if (!node.tagName) continue // not an element
              if (
                node.classList.contains('replyCount') ||
              node.classList.contains('actionDropdownItem') ||
              node.classList.contains('commentActionDropdown') ||
              node.classList.contains('readIndicator') ||
              node.classList.contains('replyIcon') ||
              node.classList.contains('dropdownIcon')
              ) {
                continue
              } else {
                elementsThatDidntHaveClass = true
              }
            }
          }
          if (elementsThatDidntHaveClass) {
            debug.log('observer ended up!')
            resolve(document.querySelector(selector))
            if (callback) {
              debug.log('mutations', mutations)
              for (const record of mutations) {
                debug.log('mutation record', record)
                const nodelist = []
                for (const node of record.addedNodes) {
                  debug.log('onenode', node, node.nodeType === Node.TEXT_NODE)
                  if (node.nodeType !== Node.TEXT_NODE) {
                    if (node.matches('div.border-2.mb-4')) {
                      debug.log('pushing node', node.querySelector('a > div.w-full > a > img.border-2'))
                      nodelist.push(node.querySelector('a > div.w-full > a > img.border-2'))
                    }
                  }
                }
                if (nodelist.length > 0) {
                  callback(nodelist)
                } else {
                  debug.log('can\'t call back')
                }
              }
            } else {
              observer.disconnect()
            }
          }
        }
      })
      if (callback) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      } else {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      }
    })
  })
}

function observeUrlChange (onUrlChange) {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    let oldHref = document.location.href
    const body = document.querySelector('body')
    const observer = new MutationObserver(mutations => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href
        debug.log('url changed!')
        onUrlChange(true)
        observer.disconnect()
      }
    })
    observer.observe(body, { childList: true, subtree: true })
  })
};

function generateSelector (elem) {
  const element = elem
  let str = ''

  function loop (element) {
    // stop here = element has ID
    if (element.getAttribute('id')) {
      str = str.replace(/^/, ' #' + element.getAttribute('id'))
      str = str.replace(/\s/, '')
      str = str.replace(/\s/g, ' > ')
      return str
    }

    // stop here = element is body
    if (document.body === element) {
      str = str.replace(/^/, ' body')
      str = str.replace(/\s/, '')
      str = str.replace(/\s/g, ' > ')
      return str
    }

    if (element.getAttribute('class')) {
      let elemClasses = '.'
      elemClasses += element.getAttribute('class')
      elemClasses = elemClasses.replace(/\s/g, '.')
      elemClasses = elemClasses.replace(/^/g, ' ')
      let newElemClasses = '.'
      for (const className in elemClasses.split('.')) {
        if (!className.includes('dark')) {
          newElemClasses += className
        }
      }
      elemClasses = newElemClasses
      let classNth = ''

      // check if element class is the unique child
      const childrens = element.parentNode.children

      if (childrens.length < 2) {
        return
      }

      const similarClasses = []

      for (let i = 0; i < childrens.length; i++) {
        if (
          element.getAttribute('class') === childrens[i].getAttribute('class')
        ) {
          similarClasses.push(childrens[i])
        }
      }

      if (similarClasses.length > 1) {
        for (let j = 0; j < similarClasses.length; j++) {
          if (element === similarClasses[j]) {
            j++
            classNth = ':nth-of-type(' + j + ')'
            break
          }
        }
      }

      str = str.replace(/^/, elemClasses + classNth)
    } else {
      // get nodeType
      let name = element.nodeName
      name = name.toLowerCase()
      let nodeNth = ''

      const childrens = element.parentNode.children

      if (childrens.length > 2) {
        const similarNodes = []

        for (let i = 0; i < childrens.length; i++) {
          if (element.nodeName === childrens[i].nodeName) {
            similarNodes.push(childrens[i])
          }
        }

        if (similarNodes.length > 1) {
          for (let j = 0; j < similarNodes.length; j++) {
            if (element === similarNodes[j]) {
              j++
              nodeNth = ':nth-of-type(' + j + ')'
              break
            }
          }
        }
      }

      str = str.replace(/^/, ' ' + name + nodeNth)
    }

    if (element.parentNode) {
      loop(element.parentNode)
    } else {
      str = str.replace(/\s/g, ' > ')
      str = str.replace(/\s/, '')
      return str
    }
  }

  loop(element)

  return str
}

function timeDifference (current, previous) {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = current - previous

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago'
  }
}

function getMessageSummary (message) {
  return 'Giving you a message'
}

export {
  waitForElm,
  observeUrlChange,
  getMessageSummary,
  generateSelector,
  timeDifference
}
