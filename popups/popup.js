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

function setOptionValue (option, value, addon, optionsJSON, optionsParentElement) {
  chrome.storage.local.get([addon + 'Options'], function (result) {
    if (result[addon + 'Options'] !== undefined) {
      console.log('optioin setting is already set')
      const newValues = result[addon + 'Options']
      newValues[option] = value
      chrome.storage.local.set({ [addon + 'Options']: newValues })
    } else {
      console.log('optioin setting is not already set')
      const newValues = {}
      newValues[option] = value
      chrome.storage.local.set({ [addon + 'Options']: newValues })
    }
    updateOptionDependencies(option, optionsJSON, addon, optionsParentElement, true)
  })
}

function compare (a, b) {
  if (a.order < b.order) {
    return -1
  }
  if (a.order > b.order) {
    return 1
  }
  return 0
}

// updateOptionDependencies(loopOption.id, addonData.options, addon, card.querySelector('.addonOptions'))
function updateOptionDependencies (option, optionsJSON, addon, optionsParentElement, originalShowing) {
  console.log('evaluating dependencies')
  chrome.storage.local.get([addon + 'Options'], function (result) {
    if (result[addon + 'Options'] === undefined) {
      console.log('optioin setting is not already set')
    } else {
    // const gotOptions = result[addon + 'Options']
    // const gotOptionsArray = Object.keys(gotOptions).map((key) => ({ id: key, value: gotOptions[key] }))

      const sortedOptionsArray = optionsJSON.sort(compare)
      console.log('sortedOptionsArray', sortedOptionsArray)

      for (const otherOption of sortedOptionsArray) {
        if (otherOption.dynamicVisibility !== undefined) {
          console.log('option has dynamic visibility', otherOption.id)
          if (otherOption.dynamicVisibility.find(rule => rule.id === option)) {
            console.log('option with dynamic vsiibility', otherOption, 'has a rule for option', option)
            console.log('Value currently is ' + result[addon + 'Options'][option])
            const indexOfOtherOption = optionsJSON.indexOf(otherOption)

            console.log('value for option', option, 'is ', result[addon + 'Options'][option])

            if (otherOption.dynamicVisibility.find(rule => rule.id === option).values.includes(result[addon + 'Options'][option])) {
              console.log('showing an option, ', otherOption.id, 'but the original dependency option', option, 'is', originalShowing)
              if (originalShowing) {
                optionsParentElement.children[indexOfOtherOption].style.display = 'flex'
                console.log('evaluating dependencies recursively for option', otherOption.id, 'because it is showing!!!')
                updateOptionDependencies(otherOption.id, optionsJSON, addon, optionsParentElement, true)
              } else {
                optionsParentElement.children[indexOfOtherOption].style.display = 'none'
                console.log('evaluating dependencies recursively for option', otherOption.id, 'because it is hidden')
                updateOptionDependencies(otherOption.id, optionsJSON, addon, optionsParentElement, false)
              }
            } else {
              optionsParentElement.children[indexOfOtherOption].style.display = 'none'
              console.log('evaluating dependencies recursively for option', otherOption.id, 'because it is hidden')
              updateOptionDependencies(otherOption.id, optionsJSON, addon, optionsParentElement, false)
            }
          } else {
            console.log('option with dynamic vsiibility', otherOption.dynamicVisibility, 'does not hava a rule for option', option)
          }
        } else {
          console.log('object does not have dynamic visibility', otherOption, otherOption.id)
        }
      }
    }
  })
}

function getOptionValue (option, addon) {
  return new Promise((resolve, reject) => {
    console.log('getting storage value for option', option, 'for addon', addon, addon + 'Options')
    chrome.storage.local.get([addon + 'Options'], function (result) {
      if (result[addon + 'Options'] === undefined) {
        console.log('option setting that the get function requested is not already set')
        reject(new Error('option setting that the get function requested is not already set'))
      } else {
        console.log('the raw result from get function for option', option, ' is ', result[addon + 'Options'])
        console.log('Value currently is ' + result[addon + 'Options'][option])
        resolve(result[addon + 'Options'][option])
      }
    })
  })
}

document.getElementsByClassName('openInNew')[0].addEventListener('click', () => {
  chrome.tabs.create({ url: 'popup.html' })
  window.close()
})

const views = chrome.extension.getViews({ type: 'popup' })
console.log('the views are', views)
if (views === []) {
  document.body.style.removeProperty('max-width')
  document.getElementsByClassName('blankSpaceDiv')[0].style.display = 'none'
  document.getElementsByClassName('header')[0].style.justifyContent = 'center'
  document.getElementsByClassName('openInNew')[0].style.display = 'none'
} else {
  // wait 2 seconds
  setTimeout(() => {
    const views = chrome.extension.getViews({ type: 'popup' })
    if (views.length === 0) {
      document.getElementsByClassName('openInNew')[0].style.display = 'none'
      document.getElementsByClassName('blankSpaceDiv')[0].style.display = 'none'
      document.getElementsByClassName('header')[0].style.justifyContent = 'center'

      document.body.style.removeProperty('max-width')
    }
  }, 200)
}
if (navigator.userAgent.includes('Mozilla')) {
  if (views.length > 0) {
    document.body.style.maxWidth = '365px'
  }
  chrome.permissions.contains({ origins: ['*://*.wasteof.money/*'] },
    function (result) {
      if (result) {
        console.log('The extension has the permissions')
        document.getElementsByClassName('permissionCard')[0].style.display = 'none'
      } else {
        console.log('The extension does not have the permissions')
        document.getElementById('start').addEventListener('click', () => {
          browser.permissions.request({ origins: ['*://*.wasteof.money/*'] })
            .then((result) => {
              if (result) {
                console.log('Permission granted')
                window.location.reload()
              } else {
                console.log('Permission denied')
              }
            })
          console.log('browser is', navigator.userAgent)
          console.log('the views are', views)
          if (views.length > 0) {
            window.close()
          }
        })
      }
    })
} else {
  document.getElementsByClassName('permissionCard')[0].style.display = 'none'
  console.log('browser is', navigator.userAgent)
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

        function addonSorter (a, b) {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        }

        for (const addon of data.sort(addonSorter)) {
          fetch('../addons/' + addon + '/addon.json').then(response => response.json()).then(async (addonData) => {
            addonList.insertAdjacentHTML('beforeend', cardText)
            setIconTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
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

            // card.querySelector('#requestpermission').addEventListener('click', () => {
            //   chrome.permissions.request({
            //     permissions: ['notifications']
            //   })
            // })
            card.querySelector('input').addEventListener('click', (event) => {
              console.log('toggled!!!', enabledAddonsList, enabledAddonsList.length)
              if (enabledAddonsList.includes(addon)) {
                if (enabledAddonsList.length < 2) {
                  enabledAddonsList = []
                  chrome.storage.local.set({ enabledAddons: [] })
                  console.log('removed all addons!!!', enabledAddonsList.length)
                } else {
                  const index = enabledAddonsList.indexOf(addon)

                  enabledAddonsList.splice(index, 1)
                  console.log('removed addon', addon, enabledAddonsList)

                  chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                }
                chrome.runtime.sendMessage({
                  type: 'remove_script'
                }, function (response) {
                  console.log('response from bg', response)
                })
                expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
              } else {
                if (addonData.permissions) {
                  console.log('addon has permissions', addonData.permissions)
                  chrome.permissions.request({
                    permissions: ['notifications']
                  }, (granted) => {
                    if (granted) {
                      console.log('granted')
                      if (granted) {
                        console.log('granted')
                        enabledAddonsList.push(addon)
                        console.log('add item to enabled addons list', enabledAddonsList)
                        chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                        expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
                      } else {
                        console.log('not granted')
                      }
                    } else {
                      console.log('not granted')
                    }
                  })
                  if (views.length > 0) {
                    window.close()
                  }

                  // browser.permissions.contains({
                  //   permissions: addonData.permissions
                  // }, (resultPerm) => {
                  //   if (!resultPerm) {
                  //     chrome.permissions.request({
                  //       permissions: ['notifications']
                  //     })
                  //     chrome.permissions.request({
                  //       permissions: addonData.permissions
                  //     }, (granted) => {
                  //       if (granted) {
                  //         console.log('granted')
                  //         enabledAddonsList.push(addon)
                  //         console.log('add item to enabled addons list', enabledAddonsList)
                  //         chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                  //         expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
                  //       } else {
                  //         console.log('not granted')
                  //       }
                  //     })
                  //   } else {
                  //     console.log('permission already granted')
                  //     enabledAddonsList.push(addon)
                  //     chrome.storage.local.set({ enabledAddons: enabledAddonsList })
                  //     console.log('should options show', enabledAddonsList.includes(addon))
                  //     expandReversed = updateOptions(card, enabledAddonsList.includes(addon))
                  //   }
                  // })
                } else {
                  enabledAddonsList.push(addon)
                  // sned message to background script to enable addon
                  console.log('add item to enabled addons list', enabledAddonsList)
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
              setIconTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
            }
            console.log(addonData.options, addonData.options.length)
            if (!(addonData.options.length > 0)) {
              card.querySelector('.addonOptions').style.display = 'none'
              card.querySelector('.optionsHeader').style.display = 'none'
            }
            const sortedOptions = addonData.options.sort(compare)
            for (const option of sortedOptions) {
              const booleanOptionText = `
              <div class="flex items-center mt-3">
                <input checked id="checked-checkbox" type="checkbox" value="" class="optionBoolean w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" style="margin-right: 5px">
              <label for="checked-checkbox" class="optionName ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">Checked state</label>
              </div>`
              const selectOptionText = `
              <div class="addonOption inline-flex" role="group">
                <p class="dark:text-white optionName"></p>
                <div class="optionSelect">
                <button type="button" class="firstOption px-1.5 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                  None
                </button>
                <button type="button" class="lastOption px-1.5 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                  Discord
                </button>
                </div>
              </div>`
              const selectMiddleOptionText = `
              <button type="button" class="px-1.5 py-2 text-xs font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                  Cha-Ching
                </button>`
              const fileOptionText = `
              <div class="addonOption">
              <label class="optionName block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
              <div class="optionFile">
              <input accept=".ogg,.wav,.mp3" class="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file">
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">MP3, WAV, or OGG (max. 30 secs).</p>
              </div>
              </div>`
              const sliderOptionText = `
              <div class="addonOption">
              <label class="optionName block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
              <div class="optionSlider">
              <input id="minmax-range" type="range" min="0" max="10" value="5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
              </div>
              </div>`
              const textOptionText = `
              <div class="addonOption">
              <label class="optionName block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
              <div class="optionText">
              <input type="text" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
              </div>`
              console.log(option.type)
              if (option.type === 'boolean') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', booleanOptionText)
                card.querySelector('.addonOptions').lastElementChild.querySelector('.optionName').innerText = option.name
                console.log('boolean option', option, ' has a value of ', await getOptionValue(option.id, addon))
                card.querySelector('.addonOptions').lastElementChild.querySelector('.optionBoolean').checked = await getOptionValue(option.id, addon)
                card.querySelector('.addonOptions').lastElementChild.querySelector('.optionBoolean').addEventListener('change', (event) => {
                  console.log('changed boolean for addon', addon)
                  setOptionValue(option.id, event.target.checked, addon, addonData.options, card.querySelector('.addonOptions'))
                })
              } else if (option.type === 'select') {
                function resetSelectOptionStyles (parentElement, ignore) {
                  console.log('the select element/parent is', parentElement.children)
                  for (const selectOption of parentElement.children) {
                    if (selectOption.classList.contains('bg-blue-700')) {
                      if (ignore !== selectOption) {
                        selectOption.classList.remove('bg-blue-700', 'dark:hover:bg-blue-600', 'hover:bg-blue-600', 'dark:bg-blue-700', 'text-white')
                        selectOption.classList.add('focus:text-blue-700', 'hover:text-blue-700', 'bg-white', 'dark:bg-gray-700')
                        // selectOption.classList.remove('bg-gray-100', 'text-blue-700', 'dark:text-blue-500')
                      }
                    }
                  }
                }
                function addSelectOption (element, value, setValue) {
                  element.innerText = value
                  console.log('adding sleect option with value', value, 'and setValue ', setValue)
                  if (setValue === value) {
                    element.classList.remove('focus:text-blue-700', 'hover:text-blue-700', 'bg-white', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'dark:bg-gray-700')
                    element.classList.add('bg-blue-700', 'dark:hover:bg-blue-600', 'hover:bg-blue-600', 'dark:bg-blue-700', 'text-white')
                  }
                  element.addEventListener('click', (event) => {
                    console.log('changed select for addon', addon)
                    event.target.classList.remove('focus:text-blue-700', 'hover:text-blue-700', 'bg-white', 'dark:hover:bg-gray-600', 'hover:bg-gray-100', 'dark:bg-gray-700')
                    event.target.classList.add('bg-blue-700', 'dark:hover:bg-blue-600', 'hover:bg-blue-600', 'dark:bg-blue-700', 'text-white')
                    resetSelectOptionStyles(event.target.parentElement, event.target)
                    // px-3 py-2 ext-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white
                    // convert to dark mode
                    setOptionValue(option.id, value, addon, addonData.options, card.querySelector('.addonOptions'))
                  })
                }
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', selectOptionText)
                const addedElement = card.querySelector('.addonOptions').lastElementChild
                addedElement.querySelector('.optionName').innerText = option.name

                console.log('the value of the select element is ', await getOptionValue(option.id, addon))
                addSelectOption(addedElement.querySelector('.firstOption'), option.options[0], await getOptionValue(option.id, addon))
                addSelectOption(addedElement.querySelector('.lastOption'), option.options[option.options.length - 1], await getOptionValue(option.id, addon))
                for (let i = 1; i < option.options.length - 1; i++) {
                  console.log('inserting middle option!')
                  addedElement.querySelector('.lastOption').insertAdjacentHTML('beforeBegin', selectMiddleOptionText)
                  // addedElement.querySelector('.lastOption').previousElementSibling.innerText = option.options[i]
                  addSelectOption(addedElement.querySelector('.lastOption').previousElementSibling, option.options[i], await getOptionValue(option.id, addon))
                }

                // addedElement.querySelector('.firstOption').innerText = option.options[0]
                // addedElement.querySelector('.lastOption').innerText = option.options[option.options.length - 1]
              } else if (option.type === 'file') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', fileOptionText)
                const fileSelector = card.querySelector('.addonOptions').lastElementChild.querySelector('.optionFile > input')
                function dataURLtoFile (dataurl, filename) {
                  const arr = dataurl.split(',')
                  const mime = arr[0].match(/:(.*?);/)[1]
                  const bstr = atob(arr[arr.length - 1])
                  let n = bstr.length
                  const u8arr = new Uint8Array(n)
                  while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                  }
                  return new File([u8arr], filename, { type: mime })
                }

                chrome.storage.local.get(['notificationsSound'], function (resultFile) {
                  if (resultFile.notificationsSound !== undefined) {
                    const myFile = dataURLtoFile(resultFile.notificationsSound.file, resultFile.notificationsSound.name)
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(myFile)
                    fileSelector.files = dataTransfer.files
                  } else {
                    console.log('no file found')
                  }
                })
                fileSelector.addEventListener('change', async function () {
                  const file = fileSelector.files[0]
                  file.end = file.size
                  console.log(file)
                  const reader = new FileReader()
                  reader.onload = function (e) {
                    console.log('the file\'s url is ')

                    // console.log(e.target.result)
                    chrome.storage.local.set({ notificationsSound: { file: e.target.result, name: file.name } })
                  }
                  reader.readAsDataURL(file)
                  // reader.readAsText(file)

                  // chrome.storage.local.set({ notificationsSound: { file: reader.readAsDataURL(file) } })
                  // console.log('data url', await reader.readAsDataURL(fileSelector.files[0]))

                  // const urlObj = URL.createObjectURL(fileSelector.files[0])

                  // console.log('url object ', urlObj)
                })
              } else if (option.type === 'slider') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', sliderOptionText)
                const addedElement = card.querySelector('.addonOptions').lastElementChild
                addedElement.querySelector('.optionName').innerText = option.name
                addedElement.querySelector('input').min = option.settings.min
                addedElement.querySelector('input').max = option.settings.max
                addedElement.querySelector('input').step = option.settings.step
                addedElement.querySelector('input').value = await getOptionValue(option.id, addon)
                addedElement.querySelector('input').addEventListener('change', async function (event) {
                  setOptionValue(option.id, event.target.value, addon, addonData.options, card.querySelector('.addonOptions'))
                  console.log('slider changed!!!')
                })
              } else if (option.type === 'text') {
                card.querySelector('.addonOptions').insertAdjacentHTML('beforeend', textOptionText)
                const addedElement = card.querySelector('.addonOptions').lastElementChild
                addedElement.querySelector('.optionName').innerText = option.name
                addedElement.querySelector('input').value = await getOptionValue(option.id, addon)
                addedElement.querySelector('input').placeholder = option.placeholder

                addedElement.querySelector('input').addEventListener('change', async function (event) {
                  setOptionValue(option.id, event.target.value, addon, addonData.options, card.querySelector('.addonOptions'))
                  console.log('text changed!!!')
                })
              }
              setIconTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
              if (sortedOptions.indexOf(option) === sortedOptions.length - 1) {
                console.log('last option', option, 'so we\'re updating dependencies')
                for (const loopOption of sortedOptions) {
                  console.log('update dependencies for option', loopOption, 'in addon', addon)
                  // updateOptionDependencies(loopOption.id, addon, addonData.options, card.querySelector('.addonOptions'))
                  console.log('about to update dependencies for option', loopOption.id, 'in addon', addon)
                  console.log('this option\'s element is ', card.querySelector('.addonOptions').children[sortedOptions.indexOf(loopOption)])
                  console.log('its display is ', window.getComputedStyle(card.querySelector('.addonOptions').children[sortedOptions.indexOf(loopOption)]).display)
                  updateOptionDependencies(loopOption.id, addonData.options, addon, card.querySelector('.addonOptions'), window.getComputedStyle(card.querySelector('.addonOptions').children[sortedOptions.indexOf(loopOption)]).display === 'flex')
                }
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

function setIconTheme (theme) {
  console.log('all icons on page', document.querySelectorAll('.icon'))
  for (const icon of document.querySelectorAll('.icon')) {
    console.log('icon', icon)
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
    console.log('setting dark mode based on chrome local storage')
    document.documentElement.classList.add('dark')
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
