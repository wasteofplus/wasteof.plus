function setUserStatuses (profilePictures, onlineIndicator, shouldNotDelete) {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('setUserStatuses.js loaded')

    if (!shouldNotDelete) {
      if (document.querySelectorAll('.onlineindicator1')) {
        for (const indicator of document.querySelectorAll('.onlineindicator1')) {
          indicator.remove()
        }
      }
      if (document.querySelectorAll('.userstatusicon')) {
        for (const icon of document.querySelectorAll('.userstatusicon')) {
          debug.log('remove icon', icon)
          icon.remove()
        }
      }
    }

    //   let profilePictureNodes = []
    for (const profilePicture of profilePictures) {
      function showStatus (data, username, profilePicture) {
      // if (!profilePictureNodes.includes(profilePicture)) {
        if (!profilePicture.parentElement.querySelector('.userstatusicon')) {
          if (!profilePicture.parentElement.parentElement.parentElement.classList.contains('grid')) {
            debug.log(username, 'already has badges', profilePicture.parentElement.querySelectorAll('.userstatusicon'))

            debug.log('showing icons', data)
            if (data.online) {
              debug.log(username + ' is online')
              profilePicture.parentElement.appendChild(onlineIndicator.cloneNode(true))
            }
            if (data.beta) {
              debug.log(username + ' has beta')
              const betaIcon = `
                <span title="Beta tester" class="userstatusicon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clip-rule="evenodd"></path>
                </svg></span>`
              profilePicture.parentElement.insertAdjacentHTML('beforeend', betaIcon)
            }
            if (data.verified) {
              debug.log(username + ' is verified')
              const verifiedIcon = `
                <span title="Verified" class="userstatusicon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg></span>`
              profilePicture.parentElement.insertAdjacentHTML('beforeend', verifiedIcon)
            }
            if (data.permissions.admin) {
              debug.log(username + ' has admin')
              const adminIcon = `
                <span title="Admin" class="userstatusicon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg></span>`
              profilePicture.parentElement.insertAdjacentHTML('beforeend', adminIcon)
            }

            if (data.permissions.banned) {
              debug.log(username + ' is banned')
              const bannedIcon = `
                <span title="Banned" class="userstatusicon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8="">
                    <svg fill="currentColor" style="height: 15px; width: 15px;" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-60q142.375 0 241.188-98.812Q820-337.625 820-480q0-60.662-21-116.831Q778-653 740-699L261-220q45 39 101.493 59.5Q418.987-140 480-140ZM221-261l478-478q-46-39-102.169-60T480-820q-142.375 0-241.188 98.812Q140-622.375 140-480q0 61.013 22 117.507Q184-306 221-261Z"/></svg>
                </span>`
              profilePicture.parentElement.insertAdjacentHTML('beforeend', bannedIcon)
            }
            //   profilePictureNodes += profilePicture
          }
        }
      }
      const username = profilePicture.parentElement.href.split('/')[4]
      chrome.storage.local.get([username]).then((result) => {
        if (result[username] !== undefined && Date.now() - result[username].setAt < 500000) {
          debug.log('Got Value for user ' + username + ' is ', result)
          showStatus(result[username], username, profilePicture)
        } else {
          fetch('https://api.wasteof.money/users/' + username)
            .then(response => response.json()).then(data => {
            // console.log(data);

              showStatus(data, username, profilePicture)

              const userStatuses = {
                [username]: {
                  online: data.online,
                  beta: data.beta,
                  setAt: Date.now(),
                  verified: data.verified,
                  permissions: data.permissions
                }
              }

              chrome.storage.local.set(userStatuses).then(() => {
              // console.log("Value is set", username);
              })
            })
        }
      })
    }
  })
}

export { setUserStatuses }
