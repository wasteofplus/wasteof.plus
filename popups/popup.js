function updateOptions (card, showing) {
  if (showing) {
    card.querySelector('.addonOptions').style.display = 'block'
    card.querySelector('.optionsExpand').src = '../../assets/icons/material-icons/expand_less.svg'
  } else {
    card.querySelector('.addonOptions').style.display = 'none'
    card.querySelector('.optionsExpand').src = '../../assets/icons/material-icons/expand_more.svg'
  }
  return !showing
}

fetch('templates/extensionCard.html').then(response => response.text()).then(async (cardText) => {
  console.log('cardhtml', cardText)

  chrome.storage.local.get(['enabledAddons']).then((result) => {
    console.log('Value currently is ' + result.enabledAddons)

    if (result.enabledAddons === undefined) {
      chrome.storage.local.set({ enabledAddons: [] })
    } else {
      let enabledAddonsList = result.enabledAddons
      //   fetch('./templates/popupNavbar.html').then(response => response.text()).then(async (navbarText) => {
      //     document.querySelector('.header').insertAdjacentHTML('beforebegin', navbarText)
      //   })
      fetch('../addons/addons.json').then(response => response.json()).then(async (data) => {
        console.log('addons.json', data)
        const addonList = document.querySelector('.addons')

        for (const addon of data.sort()) {
          fetch('../addons/' + addon + '/addon.json').then(response => response.json()).then(async (addonData) => {
            addonList.insertAdjacentHTML('beforeend', cardText)
            const card = addonList.lastElementChild
            card.querySelector('.addonName').innerText = addonData.name
            card.querySelector('.addonDescription').innerText = addonData.description
            let expandReversed = enabledAddonsList.includes(addon)
            updateOptions(card, enabledAddonsList.includes(addon))
            card.querySelector('.optionsExpand').addEventListener('click', (event) => {
              expandReversed = !expandReversed
              updateOptions(card, expandReversed)
            })
            if (enabledAddonsList.includes(addon)) {
              card.querySelector('input').checked = true
            } else {
              card.querySelector('input').checked = false
            }
            card.querySelector('input').addEventListener('change', (event) => {
              console.log('toggled!!!')
              if (enabledAddonsList.includes(addon)) {
                if (enabledAddonsList.length < 2) {
                  enabledAddonsList = []
                  chrome.storage.local.set({ enabledAddons: [] })
                } else {
                  const index = enabledAddonsList.indexOf(addon)

                  enabledAddonsList = enabledAddonsList.splice(index, 1)
                  console.log('removed addon', addon, enabledAddonsList)

                  chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                }
                expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
              } else {
                if (addonData.permissions) {
                  console.log('addon has permissions')
                  chrome.permissions.contains({
                    permissions: addonData.permissions
                  }, (resultPerm) => {
                    if (!resultPerm) {
                      chrome.permissions.request({
                        permissions: addonData.permissions
                      }, (granted) => {
                        if (granted) {
                          console.log('granted')
                          enabledAddonsList.push(addon)
                          chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                          expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
                        } else {
                          console.log('not granted')
                        }
                      })
                    } else {
                      console.log('permission already granted')
                      enabledAddonsList.push(addon)
                      chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                      console.log('should options show', enabledAddonsList.includes(addon))
                      expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
                    }
                  })
                } else {
                  enabledAddonsList.push(addon)
                  chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                  expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
                }
              }
            })
            for (const developer of addonData.developers) {
              card.querySelector('.addonDevelopers').insertAdjacentHTML('beforeend', '<a class="developer-link" href="' + developer.link + '"><img class="inline developer-logo" src="' + developer.link + '.png?size=48"></img><p class="inline">' + developer.name + '</p></a>')
              card.querySelector('.addonDevelopers').lastElementChild.addEventListener('click', (event) => {
                chrome.tabs.create({ active: true, url: developer.link })
              })
            }
            console.log(addonData.options, addonData.options.length)
            if (!(addonData.options.length > 0)) {
              card.querySelector('.addonOptions').style.display = 'none'
              card.querySelector('.optionsHeader').style.display = 'none'
            }
            for (const option of addonData.options) {
              const booleanOptionText = `
              <div class="flex items-center mt-3">
                <input checked id="checked-checkbox optionBoolean" type="checkbox" value="" class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" style="margin-right: 5px">
              <label for="checked-checkbox" class="optionName ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">Checked state</label>
              </div>`
              const selectOptionText = `
              <div class="addonOption inline-flex" role="group">
                <p class="dark:text-white optionName"></p>
                <div class="optionSelect">
                <button type="button" class="px-3 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-700 focus:text-indigo-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-indigo-500 dark:focus:text-white">
                  None
                </button>
                <button type="button" class="px-3 py-2 text-xxs font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-700 focus:text-indigo-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-indigo-500 dark:focus:text-white">
                  Cha-Ching
                </button>
                <button type="button" class="px-3 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-700 focus:text-indigo-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-indigo-500 dark:focus:text-white">
                  Discord
                </button>
                </div>
              </div>`
              const fileOptionText = `
              <div class="addonOption">
              <label class="optionName block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
              <div class="optionFile">
              <input accept=".ogg,.wav,.mp3" class="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file">
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">MP3, WAV, or OGG (max. 30 secs).</p>
              </div>
              </div>`
              console.log(option.type)
              if (option.type === 'boolean') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', booleanOptionText)
                card.querySelector('.addonOptions').lastElementChild.querySelector('.optionName').innerText = option.name
              } else if (option.type === 'select') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', selectOptionText)
                card.querySelector('.addonOptions').lastElementChild.querySelector('.optionName').innerText = option.name
              } else if (option.type === 'file') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', fileOptionText)
                const fileSelector = card.querySelector('.addonOptions').lastElementChild.querySelector('.optionFile > input')
                fileSelector.addEventListener('click', async function () {
                  chrome.permissions.contains({
                    permissions: ['unlimitedStorage']
                  }, (result) => {
                    if (!result) {
                      chrome.permissions.request({
                        permissions: ['unlimitedStorage']
                      }, (granted) => {
                        if (granted) {
                          console.log('granted')
                        } else {
                          console.log('not granted')
                        }
                      })
                    } else {
                      console.log('permission already granted')
                    }
                  })
                })

                fileSelector.addEventListener('change', async function () {
                  const file = fileSelector.files[0]
                  console.log(file)
                  const reader = new FileReader()
                  // reader.onload = function (e) {
                  //   console.log(e.target.result)
                  // }
                  // reader.readAsText(file)
                  console.log('data url', await reader.readAsDataURL(fileSelector.files[0]))

                  // const urlObj = URL.createObjectURL(fileSelector.files[0])

                  // console.log('url object ', urlObj)
                })
              }
            }
          })
        }
      })
    }
  })
})

const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon')
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon')

function setIconTheme(theme) {
  for (const icon of document.querySelectorAll('.icon')) {
    if (theme === 'dark') {
      // -webkit-filter: invert(100%); /* Safari/Chrome */
      // filter: invert(100%);
      icon.style.filter = 'invert(100%)'
      icon.style.webkitFilter = 'invert(100%)'
    } else {
      icon.style.filter = 'invert(0%)'
      icon.style.webkitFilter = 'invert(0%)'
    }
  }
}

// Change the icons inside the button based on previous settings
chrome.storage.local.get(['popupTheme']).then((result) => {
  console.log('got popup theme on start', result)
  if (result.popupTheme === 'dark' || (result.popupTheme === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    setIconTheme('dark')
    themeToggleLightIcon.classList.remove('hidden')
  } else {
    themeToggleDarkIcon.classList.remove('hidden')
    setIconTheme('light')
  }
})

const themeToggleBtn = document.getElementById('theme-toggle')

themeToggleBtn.addEventListener('click', function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle('hidden')
  themeToggleLightIcon.classList.toggle('hidden')

  // if set via local storage previously
  chrome.storage.local.get(['popupTheme']).then((result) => {
    console.log('got popup theme', result)
    if (result.popupTheme !== undefined) {
      if (result.popupTheme === 'light') {
        document.documentElement.classList.add('dark')
        chrome.storage.local.set({ popupTheme: 'dark' })
        setIconTheme('dark')
      } else {
        document.documentElement.classList.remove('dark')
        chrome.storage.local.set({ popupTheme: 'light' })
        setIconTheme('light')
      }

    // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
        chrome.storage.local.set({ popupTheme: 'light' })
        setIconTheme('light')
      } else {
        document.documentElement.classList.add('dark')
        chrome.storage.local.set({ popupTheme: 'dark' })
        setIconTheme('dark')
      }
    }
  })
})
