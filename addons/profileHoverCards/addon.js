let hovering = false
let hoveringArea = false

function greyOutFollowButton (button) {
  // remove classes: text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-primary-500
  // text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-gray-500
  button.classList.remove('bg-primary-500')
  button.classList.add('bg-gray-500')
  button.querySelector('span.hidden').innerText = 'Unfollow'
  button.style.width = '110px'
  button.style.left = '225px'
}

function unGreyOutFollowButton (button) {
  // remove classes: text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-primary-500
  // text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-gray-500
  button.classList.add('bg-primary-500')
  button.classList.remove('bg-gray-500')
  button.querySelector('span.hidden').innerText = 'Follow'
  button.style.width = '105px'
  button.style.left = '230px'
}

async function fillInHoverCardTemplate (hovercard, postHeader, utils) {
  const theme = document.querySelector('html').classList.contains('dark') ? 'dark' : 'light'
  const debug = await import(chrome.runtime.getURL('../debug.js'))

  debug.log('the theme is', theme, postHeader)
  let username = postHeader.querySelector('span.ml-1.inline-block').innerText
  const userTheme = postHeader.querySelector('span.ml-1.inline-block').classList[2]
  debug.log('user theme is ', userTheme)
  username = username.replace(/\s/g, '')
  username = username
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    )
    .trim()
  const apiUrl = 'https://api.wasteof.money/users/' + username.slice(1)
  const userUrl = 'https://wasteof.money/users/' + username.slice(1)
  const user = await fetch(apiUrl).then((response) => response.json())
  const loggedInUser = document.querySelector(
    'span.flex > li > a.inline-block.font-semibold > span'
  )
  const followButton = hovercard.querySelector('.followButton')

  let meFollowing = false
  if (!loggedInUser) {
    followButton.style.display = 'none'
    debug.log('USER IS NOT LOGGED IN!!!!')
  } else {
    const actualUserUsername = loggedInUser.innerText

    debug.log('the currently logged in user is ', actualUserUsername)
    debug.log('the url of me is ', 'https://wasteof.money/users/' + actualUserUsername + '/followers/' + username.slice(1))
    const followingMe = await fetch('https://api.wasteof.money/users/' + actualUserUsername + '/followers/' + username.slice(1)).then(response => response.json())
    meFollowing = await fetch(apiUrl + '/followers/' + actualUserUsername).then(response => response.json())

    debug.log('following me', followingMe)
    if (followingMe) {
      hovercard.querySelector('.userFollowingMe').style.display = 'block'
    } else {
      hovercard.querySelector('.userFollowingMe').style.display = 'none'
    }
    if (meFollowing) {
      greyOutFollowButton(followButton)
    }

    followButton.addEventListener('click', async () => {
      fetch(
        'https://api.wasteof.money/users/' + username.slice(1) + '/followers',
        {
          method: 'POST',
          headers: {
            Authorization: document.querySelector('body').dataset.token
          }
        }
      ).then(response => response.json()).then(data => {
        debug.log('finished following/unfollowing', data)
        if (data.error) {
          alert(data.error)
          return
        }
        if (data.ok === 'followed') {
          greyOutFollowButton(followButton)
        } else if (data.ok === 'unfollowed') {
          unGreyOutFollowButton(followButton)
        }
        stats.followers = data.new.followers
        stats.following = data.new.following
        meFollowing = data.new.isFollowing
      })
    })
  }

  hovercard.querySelector('.userUsername').innerText = username
  debug.log('username', username)

  const profilePicture = postHeader.querySelector('img.border-2').src
  hovercard.querySelector('.userPfp').src = profilePicture
  hovercard.querySelector('.userPfp').alt =
    username.slice(1) + "'s Profile Picture"

  const banner = apiUrl + '/banner'
  hovercard.querySelector('.userBanner').src = banner

  const bio = user.bio
  const stats = user.stats
  hovercard.querySelector('.userBio').innerText = bio
  hovercard.querySelector('.userFollowers').innerText = stats.followers + ' Followers'
  hovercard.querySelector('.userFollowing').innerText = stats.following + ' Following'
  debug.log('user joined', user)
  if (user.history != null) {
    const joined = utils.timeDifference(new Date(), user.history.joined)
    hovercard.querySelector('.userJoined').innerText = 'Joined ' + joined
  } else {
    hovercard.querySelector('.userJoined').innerText = 'Joined Unknown'
  }

  const wallUrl = userUrl + '/wall'
  hovercard.querySelector('.userWallUrl').href = wallUrl

  for (const userUrlElem of hovercard.querySelectorAll('.userUrl')) {
    userUrlElem.href = userUrl
  }
  const verified = user.verified
  const admin = user.permissions.admin
  const beta = user.beta
  if (verified) {
    hovercard.querySelector('.userVerified').style.display = 'block'
  } else {
    hovercard.querySelector('.userVerified').style.display = 'none'
  }
  if (admin) {
    hovercard.querySelector('.userAdmin').style.display = 'block'
  } else {
    hovercard.querySelector('.userAdmin').style.display = 'none'
  }
  if (beta) {
    hovercard.querySelector('.userBeta').style.display = 'block'
  } else {
    hovercard.querySelector('.userBeta').style.display = 'none'
  }

  if (theme === 'light') {
    hovercard.querySelector('.userBeta').style.fill = '#6366f1'
    hovercard.querySelector('.userFollowingMe').style.color =
      'var(--primary-500)'
  }

  if (verified && !admin) {
    hovercard.querySelector('.userVerified').style.left = '0px'
  }
  if (beta && (!admin || !verified) && !(!admin && !verified)) {
    hovercard.querySelector('.userBeta').style.left = '25px'
  } else if (!admin && !verified) {
    hovercard.querySelector('.userBeta').style.left = '0px'
  }

  hovercard.classList.add(userTheme)
  hovercard.style.borderColor = 'var(--primary-500)'
  hovercard.querySelector('div.mt-3.mb-5').classList.add('theme-indigo')
  hovercard.querySelector('.userFollowingMe').classList.add('theme-indigo')
  hovercard.querySelector('.followButton').classList.add('theme-indigo')
  hovercard.querySelector('.followAction').addEventListener('click', function (e) {
    e.preventDefault() // this line prevents changing to the URL of the link href
    e.stopPropagation() // this line prevents the link click from bubbling
    debug.log('child clicked')
  })

  const online = user.online
  if (online) {
    hovercard.querySelector('.userOnlineDot').style.display = 'block'
  } else {
    hovercard.querySelector('.userOnlineDot').style.display = 'none'
  }
}

async function addon () {
  const debug = await import(chrome.runtime.getURL('../debug.js'))

  debug.log('executing addon , profileHoverCards', 'alwayslog')
  const htmlFileContent = await fetch(chrome.runtime.getURL('./addons/profileHoverCards/templates/hovercard.html')).then(response => response.text())
  // console.log("htmlFileContent", htmlFileContent)
  const utilsUrl = chrome.runtime.getURL('../utils.js')
  const utils = await import(utilsUrl)

  if (!document.querySelector('div.border-2.rounded-xl')) {
    await utils.waitForElm('div.border-2.rounded-xl', debug)
  }

  debug.log('navigation bar is ')
  document.querySelector('nav').style.zIndex = '10000'

  debug.log('all posts list', document.querySelectorAll('div.border-2.rounded-xl'))
  for (const post of document.querySelectorAll('div.border-2.rounded-xl')) {
    debug.log('looping post')

    const postHeader = post.querySelector('a.w-full')
    if (!postHeader.parentElement.classList.contains('truncate')) {
      postHeader.parentElement.style.position = 'relative'
      debug.log('post1', postHeader.parentElement.querySelectorAll('div.hoverCard'))
      if (!postHeader.parentElement.querySelector('div.hoverCard')) {
        postHeader.parentElement.insertAdjacentHTML(
          'beforeend',
          await htmlFileContent
        )
        const hovercard =
          postHeader.parentElement.querySelector('div.hoverCard')
        hovercard.style.display = 'none'
        const hoverArea = document.createElement('div')
        hoverArea.classList.add('hoverArea')
        postHeader.appendChild(hoverArea)

        fillInHoverCardTemplate(hovercard, postHeader.parentElement, utils)
        hovercard.onmouseover = function () {
          hovering = true
          hovercard.style.display = 'block'
        }
        hovercard.onmouseout = function () {
          hovering = false
          if (!hoveringArea) {
            hovercard.style.display = 'none'
          }
        }
        hoverArea.onmouseover = function () {
          hoveringArea = true
          hovercard.style.display = 'block'
        }
        hoverArea.onmouseout = function () {
          hoveringArea = false
          debug.log('hoverArea.onmouseout', hovering)
          if (!hovering) {
            hovercard.style.display = 'none'
          }
        }
      }
    }
  }

  // chrome.runtime.sendMessage({ type: 'login-token', token: document.querySelector('body').dataset.token }, function (response) {
  //   console.log('Response: ', response)
  // })
}
async function addonTwo () {
  const debug = await import(chrome.runtime.getURL('../debug.js'))

  debug.log('executing addon , profileHoverCards2')
  const htmlFileContent = await fetch(chrome.runtime.getURL('./addons/profileHoverCards/templates/hovercard.html')).then(response => response.text())
  // console.log("htmlFileContent", htmlFileContent)
  const utilsUrl = chrome.runtime.getURL('../utils.js')
  const utils = await import(utilsUrl)

  if (!document.querySelector('div.border-2.rounded-xl')) {
    await utils.waitForElm('div.border-2.rounded-xl', debug)
  }

  debug.log('navigation bar is ')
  document.querySelector('nav').style.zIndex = '10000'

  debug.log('all posts list', document.querySelectorAll('div.border-2.rounded-xl'))
  for (const post of document.querySelectorAll('div.border-2.rounded-xl')) {
    debug.log('looping post')

    const postHeader = post.querySelector('a.w-full')
    debug.log('post header is ', postHeader)
    if (!postHeader.parentElement.classList.contains('truncate')) {
      postHeader.parentElement.style.position = 'relative'
      debug.log('post1', postHeader.parentElement, postHeader.parentElement.querySelectorAll('div.hoverCard'))
      if (postHeader.parentElement.querySelectorAll('.hoverCard').length === 0) {
        postHeader.parentElement.insertAdjacentHTML('beforeend', await htmlFileContent)
        const hovercard = postHeader.parentElement.querySelector('div.hoverCard')
        hovercard.style.display = 'none'
        const hoverArea = document.createElement('div')
        hoverArea.classList.add('hoverArea')
        postHeader.appendChild(hoverArea)

        fillInHoverCardTemplate(hovercard, postHeader.parentElement, utils)
        hovercard.onmouseover = function () {
          hovering = true
          hovercard.style.display = 'block'
        }
        hovercard.onmouseout = function () {
          hovering = false
          if (!hoveringArea) {
            hovercard.style.display = 'none'
          }
        }
        hoverArea.onmouseover = function () {
          hoveringArea = true
          hovercard.style.display = 'block'
        }
        hoverArea.onmouseout = function () {
          hoveringArea = false
          debug.log('hoverArea.onmouseout', hovering)
          if (!hovering) {
            hovercard.style.display = 'none'
          }
        }
      }
    }
  }
}

const getTokenScript = document.createElement('script')
getTokenScript.id = 'getTokenScript'
getTokenScript.src = chrome.runtime.getURL('./addons/profileHoverCards/lib/getToken.js')

// document.body.appendChild(getTokenScript)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('message', message)
    sendResponse({ message: 'hello' })

    if (message.action === 'reload') {
      debug.log('RELOADING!!! profile hover cards')
      hovering = false
      hoveringArea = false
      if (document.querySelectorAll('div.hoverCard').length === 0) {
        addonTwo()
      }
    }
  })
})
// window.addEventListener(
//   'PassToBackgroundRoute',
//   function (evt) {
//     //   chrome.runtime.sendMessage(evt.detail)
//     addon()
//   },
//   false
// )

addon().then(async () => {
  const utilsUrl = chrome.runtime.getURL('../utils.js')

  const utils = await import(utilsUrl)

  const debug = await import(chrome.runtime.getURL('../debug.js'))

  await utils.waitForElm('img.border-2', debug, async (addedNodesFromWait) => {
    addonTwo()

    // addon(false)
  })
})
