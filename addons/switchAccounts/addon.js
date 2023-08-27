function addon () {
  if (!document.getElementById('accountSwitcher')) {
    if (document.querySelector('body').dataset.loggedIn !== 'null') {
      const topUsername = document.querySelector('nav > div > div > ul > span > li > a > span')
      document.querySelector('nav > div > div > ul > span > li > a').classList.remove('inline-block')
      document.querySelector('nav > div > div > ul > span > li > a').classList.add('flex')

      topUsername.insertAdjacentHTML('afterEnd', `
<a href="#"><svg id="accountSwitcher" class="rounded-lg hover:bg-primary-700 dark:hover:bg-gray-800" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white"><path d="M480-360 280-559h400L480-360Z"/></svg></a>
`)

      topUsername.insertAdjacentHTML('afterEnd', `
      <a href="#" id="accountListLink" class="absolute">
<div id="accountsList" class="hidden bg-gray-100 dark:bg-gray-700 px-2 py-2 my-8 border-4 dark:border-gray-600 rounded-xl">
<svg class="mb-2 inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M627-210q17-33 26-69.5t9-75.5q0-80-35-146.5T532-612l-92 92v-320h320l-92 92q52 47 83 112t31 141q0 91-42.5 165T627-210Zm-427 90 92-92q-53-47-83.5-112T178-465q0-91 42.5-165T334-750q-17 33-26.5 69.5T298-605q0 80 35.5 146.5T428-348l92-92v320H200Z"/></svg>
<p id="switchLabel" class="inline-block">Switch account</p>
<button id="addAccountToSwitcher" class="dark:bg-gray-800 mt-1 pl-2 px-4 dark:hover:bg-gray-7
    00 px-4 py-2 rounded-lg block">
    <svg class="inline-block mr-1" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" fill="#ffffff" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
    <p class="inline-block">Add new account</p>
    </button>
</div>
</a>
`)

      function addCurrentAccountToSwitcher (username, accounts, userId, token, add) {
        chrome.storage.local.get(['accountSwitcher'], (result) => {
        // if (result.accountSwitcher === undefined) {
        // } else {}
        // console.error(result.accountSwitcher.filter((account) => account.username === username))
          document.getElementById('addAccountToSwitcher').insertAdjacentHTML('beforebegin', `
    <a href="#" class="block w-full mt-2 truncate relative z-10"><div class="inline-block"><img src="https://api.wasteof.money/users/${username}/picture" alt="${username}'s profile picture" class="inline h-8 bg-white dark:border-gray-700 rounded-full "> <span data-v-70f0e806="" class="ml-1">${username}</span></div>
    <svg xmlns="http://www.w3.org/2000/svg" class="deleteAcocuntSwitch inline-block" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>
    </a>
    `)

          if (add) {
            let accountList = null
            if (result.accountSwitcher === undefined) {
              accountList = []
              accountList.push({ username, userId, token })
            } else {
              accountList = result.accountSwitcher
              if (accountList.filter((account) => account.username === username).length === 0) {
                accountList.push({ username, userId, token })
              }
            }
            chrome.storage.local.set({ accountSwitcher: accountList })
          }

          const profilePicture = accounts.children[accounts.children.length - 2].querySelector('img')
          const element = accounts.children[accounts.children.length - 2]
          accounts.children[accounts.children.length - 2].querySelector('.deleteAcocuntSwitch').addEventListener('click', () => {
            event.stopPropagation()
            let confirmed = null
            if (document.querySelector('body').dataset.username !== username) {
              confirmed = confirm('Are you sure you want to sign out of the account "' + username + '"? This will discard the stored login token.')
            } else {
              confirmed = confirm('Are you sure you want to sign out of the active account: ' + username + '? This will discard the stored login token and redirect you to the sign-in page.')
              document.cookie = 'token=null'
            }
            if (confirmed) {
              chrome.storage.local.get(['accountSwitcher'], (result) => {
                const accountList = result.accountSwitcher
                const index = accountList.findIndex((account) => account.username === username)
                accountList.splice(index, 1)
                chrome.storage.local.set({ accountSwitcher: accountList })
                element.remove()
              })
            }
          })

          accounts.children[accounts.children.length - 2].addEventListener('click', () => {
            event.stopPropagation()

            fetch('https://api.wasteof.money/session', {
              headers: {
                Authorization: token
              }
            }).then((response) => response.json()).then((res) => {
              console.error('res from session', token, res === {}, Object.keys(res).length === 0, JSON.stringify(res))
              if (res.error || res === {} || Object.keys(res).length === 0) {
                alert('the token for this account is invalid/expired')
              } else {
                if (document.querySelector('body').dataset.username === username) {
                  alert('you are already signed into this account')
                } else {
                  const confirmed = confirm('Are you sure you want to switch to the account ' + username + '?')
                  if (confirmed) {
                    //   document.cookie = 'token=' + token
                    const tempExp = 'Wed, 31 Oct 2023 08:50:17 GMT'
                    document.cookie = 'token=' + token + ';path=/; expires=' + tempExp
                    window.location.reload()
                  }
                }
              }
            })
          })
          const data = JSON.parse(document.querySelector('body').dataset.permissions)
          //   console.error(accounts.children[accounts.children.length - 2])

          if (data.beta) {
            const betaIcon = `
        <span title="Beta tester" class="switcherStatusIcon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clip-rule="evenodd"></path>
        </svg></span>`
            profilePicture.parentElement.parentElement.children[profilePicture.parentElement.children.length - 1].insertAdjacentHTML('beforebegin', betaIcon)
          }
          if (data.verified) {
            const verifiedIcon = `
        <span title="Verified" class="switcherStatusIcon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg></span>`
            profilePicture.parentElement.parentElement.children[profilePicture.parentElement.children.length - 1].insertAdjacentHTML('beforebegin', verifiedIcon)
          }
          if (data.permissions.admin) {
            const adminIcon = `
        <span title="Admin" class="switcherStatusIcon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8=""><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg></span>`
            profilePicture.parentElement.parentElement.children[profilePicture.parentElement.children.length - 1].insertAdjacentHTML('beforebegin', adminIcon)
          }

          if (data.permissions.banned) {
            const bannedIcon = `
        <span title="Banned" class="switcherStatusIcon inline-block text-primary-500 dark:text-primary-300" data-v-6242d9e8="">
            <svg fill="currentColor" style="height: 15px; width: 15px;" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-60q142.375 0 241.188-98.812Q820-337.625 820-480q0-60.662-21-116.831Q778-653 740-699L261-220q45 39 101.493 59.5Q418.987-140 480-140ZM221-261l478-478q-46-39-102.169-60T480-820q-142.375 0-241.188 98.812Q140-622.375 140-480q0 61.013 22 117.507Q184-306 221-261Z"/></svg>
        </span>`
            profilePicture.parentElement.parentElement.children[profilePicture.parentElement.children.length - 1].insertAdjacentHTML('beforebegin', bannedIcon)
          }
        })
      }

      const addAccountToSwitcher = document.getElementById('addAccountToSwitcher')

      addAccountToSwitcher.addEventListener('click', () => {
        event.stopPropagation()

        //   alert('hello!')
        const oldusername = document.querySelector('body').dataset.username
        const olduserId = document.querySelector('body').dataset.userId
        const oldtoken = document.querySelector('body').dataset.token

        //   const accounts = document.querySelector('#accountsList')
        chrome.storage.local.get(['accountSwitcher'], (result) => {
          if (result.accountSwitcher === undefined || result.accountSwitcher.filter((account) => account.username === oldusername).length === 0) {
            const saveAccount = confirm('would you like to save the currently-logged-in token so it is available to switch to?')
            console.error(saveAccount)
            if (saveAccount) {
              addCurrentAccountToSwitcher(oldusername, document.getElementById('accountsList'), olduserId, oldtoken, true)
              //   if (accountList.filter((account) => account.username === username).length === 0) {
              //     accountList.push({ username, userId, token })
              //     chrome.storage.local.set({ accountSwitcher: accountList })
              //   }
            }
          }
        })

        const username = prompt('Enter a username of an account you would like to switch to:')
        if (!(username === null || document.querySelector('body').dataset.username === username)) {
          fetch('https://api.wasteof.money/username-available?username=' + username).then((response) => response.json()).then((response) => {
            if (!response.available) {
              const password = prompt('Enter the password for the account "' + username + '":')
              if (password !== null) {
                fetch('https://api.wasteof.money/session',
                  {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                      username,
                      password
                    })
                  }).then((response) => response.json()).then((res) => {
                  if (res.error || res === {} || Object.keys(res).length === 0) {
                    alert('the token for this account is invalid/expired')
                  } else {
                    document.cookie = 'token=' + res.token
                    addCurrentAccountToSwitcher(username, document.getElementById('accountsList'), '', res.token, true)
                    // location.reload()
                    console.log('return', res)
                  }
                })
              }
            }
          })
        }

        //   addCurrentAccountToSwitcher(username, accounts, userId, token, true)
      })

      const switcher = document.getElementById('accountSwitcher')
      switcher.addEventListener('click', () => {
        const accounts = document.querySelector('#accountsList')
        event.stopPropagation()
        accounts.classList.toggle('hidden')
      })

      //   const myusername = document.querySelector('body').dataset.username
      //   const myuserId = document.querySelector('body').dataset.userId
      //   const mytoken = document.querySelector('body').dataset.token
      // addCurrentAccountToSwitcher(myusername, document.querySelector('#accountsList'), myuserId, mytoken, false)

      chrome.storage.local.get(['accountSwitcher'], (result) => {
        if (result.accountSwitcher !== undefined) {
          console.error(result.accountSwitcher)
          for (const account of result.accountSwitcher) {
            fetch('https://api.wasteof.money/session', {
              headers: {
                Authorization: account.token
              }
            }).then((response) => response.json()).then((res) => {
              if (res.error || res === {} || Object.keys(res).length === 0) {
                if (document.querySelector('body').dataset.username === account.username && document.querySelector('body').dataset.token !== account.token) {
                  const changedResult = result.accountSwitcher
                  const indexInList = changedResult.indexOf(account)
                  changedResult[indexInList].token = document.querySelector('body').dataset.token
                  chrome.storage.local.set({ accountSwitcher: changedResult })
                  addCurrentAccountToSwitcher(account.username, document.querySelector('#accountsList'), account.userId, document.querySelector('body').dataset.token, false)
                } else {
                  addCurrentAccountToSwitcher(account.username, document.querySelector('#accountsList'), account.userId, account.token, false)
                }
              } else {
                if (document.querySelector('body').dataset.username === account.username && document.querySelector('body').dataset.token !== account.token) {
                  const changedResult = result.accountSwitcher
                  const indexInList = changedResult.indexOf(account)
                  changedResult[indexInList].token = document.querySelector('body').dataset.token
                  chrome.storage.local.set({ accountSwitcher: changedResult })
                  addCurrentAccountToSwitcher(account.username, document.querySelector('#accountsList'), account.userId, document.querySelector('body').dataset.token, false)
                } else {
                  addCurrentAccountToSwitcher(account.username, document.querySelector('#accountsList'), account.userId, account.token, false)
                }
              }
            })
          }
        }
      })
    }
  }
}

addon()
