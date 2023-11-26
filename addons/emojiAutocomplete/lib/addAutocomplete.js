const data = JSON.parse(document.body.dataset.emojiData)
// eslint-disable-next-line no-undef
EmojiMart.init({ data })
console.log('init')

async function search (value) {
  // eslint-disable-next-line no-undef
  const emojis = await EmojiMart.SearchIndex.search(value)
  if (!emojis || emojis.length === 0) {
    return []
  }
  const results = emojis.map((emoji) => {
    return emoji.skins[0].shortcodes
  })

  console.log(results)
  return results
}

const contenteditableDivs = document.querySelectorAll('div.prose > div')

const pickerContainer = document.createElement('div')
contenteditableDivs.forEach((contenteditableDiv) => {
  const prose = contenteditableDiv.parentElement
  prose.style.position = 'relative'
  contenteditableDiv.addEventListener('input', async (event) => {
    console.log('input')
    const text = event.target.innerText
    const lastColonIndex = text.lastIndexOf(':')
    const lastSpaceIndex = text.slice(lastColonIndex + 1).indexOf(' ')
    const selection = window.getSelection()
    const anchornode = selection.anchorNode
    const range = selection.getRangeAt(0)
    const rect = range.getClientRects()[0]
    const boxRect = prose.getBoundingClientRect()
    const ptest = document.createElement('p')

    console.log(selection.anchorOffset, lastSpaceIndex)
    if (lastColonIndex !== -1 && lastColonIndex !== text.length - 1 && (selection.anchorOffset <= lastSpaceIndex + 1 || lastSpaceIndex === -1) && text.charAt(lastColonIndex + 1) !== ' ') {
      document.querySelectorAll('.placehold').forEach((element) => {
        element.remove()
      })

      if (pickerContainer) {
        pickerContainer.remove()
        while (pickerContainer.lastElementChild) {
          pickerContainer.removeChild(pickerContainer.lastElementChild)
        }
      }
      pickerContainer.style.top = `${(rect.top - boxRect.top) + 32}px`

      pickerContainer.classList.add('emoji-picker-container')
      pickerContainer.classList.add(...('bg-gray-100 dark:bg-gray-800 px-2 mb-4 py-2 border-2 dark:border-gray-700 rounded-xl'.split(' ')))
      contenteditableDiv.parentElement.appendChild(pickerContainer)
      // eslint-disable-next-line no-undef

      console.log(text.slice(lastColonIndex + 1, lastSpaceIndex !== -1 ? lastSpaceIndex + 1 : text.length))
      if (await search(text.slice(lastColonIndex + 1, lastSpaceIndex !== -1 ? lastSpaceIndex + 1 : text.length)).length === 0) {
        pickerContainer.remove()
        while (pickerContainer.lastElementChild) {
          pickerContainer.removeChild(pickerContainer.lastElementChild)
        }
      } else {
        (await search(text.slice(lastColonIndex + 1, lastSpaceIndex !== -1 ? lastSpaceIndex + 1 : text.length))).forEach((emoji) => {
          const emojiButton = document.createElement('em-emoji')
          // <em-emoji id="+1" size="2em"></em-emoji>
          emojiButton.set = 'twitter'
          emojiButton.insertAdjacentHTML('beforeend', '<p class="emojilabel font-semibold ml-4">' + emoji + '</p>')
          emojiButton.setAttribute('set', 'twitter')

          emojiButton.classList.add('emoji-button', ...('dark:hover:bg-gray-700 hover:bg-gray-900 px-2 rounded-md'.split(' ')))
          emojiButton.id = emoji.slice(1, -1)

          pickerContainer.appendChild(emojiButton)
          emojiButton.addEventListener('click', (event) => {
            pickerContainer.remove()
            const newText = text.slice(0, lastColonIndex) + emojiButton.querySelector('span > img').alt + (lastSpaceIndex !== -1 ? text.slice(lastSpaceIndex + 1) : '')
            anchornode.data = newText
          })
        })
      }
    } else if (pickerContainer) {
      pickerContainer.remove()
      while (pickerContainer.lastElementChild) {
        pickerContainer.removeChild(pickerContainer.lastElementChild)
      }
      document.querySelectorAll('.placehold').forEach((element) => {
        element.remove()
      })
      if (lastColonIndex !== -1 && selection.anchorOffset === lastColonIndex + 1 && lastSpaceIndex === -1) {
        ptest.innerText = 'Search Emoji...'
        ptest.classList.add('placehold')
        ptest.style.top = `${(rect.top - boxRect.top - 14)}px`
        ptest.style.left = `${(rect.left - boxRect.left + 2)}px`

        contenteditableDiv.parentElement.appendChild(ptest)
      }
    }
  })
})
// contenteditableDiv.addEventListener('input', (event) => {
//   const text = event.target.innerText
//   const lastColonIndex = text.lastIndexOf(':')

//   if (lastColonIndex !== -1 && text.charAt(lastColonIndex - 1) !== ' ') {
//     const pickerContainer = document.createElement('div')
//     pickerContainer.classList.add('emoji-picker-container')
//     contenteditableDiv.parentElement.appendChild(pickerContainer)

//     // eslint-disable-next-line no-undef
//     const picker = new EmojiMart.Picker({
//       data: async () => {
//         const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
//         return response.json()
//       },
//       onSelect: (emoji) => {
//         pickerContainer.remove()
//         const newText = text.slice(0, lastColonIndex) + emoji.native + text.slice(event.target.selectionEnd)
//         event.target.innerText = newText
//       },
//       onClickOutside: () => {
//         pickerContainer.remove()
//       }
//     })

//     pickerContainer.appendChild(picker)

//     console.log(picker, picker.shadowRoot, picker.shadowRoot.querySelector('input'))
//     const observer = new MutationObserver(mutations => {
//       mutations.forEach(function (mutation) {
//         // check for changes to the child list

//         // check if anything was removed and if the specific element we were looking for was removed
//         console.log(mutation.addedNodes.length, mutation)
//         if (mutation.addedNodes.length > 0) {
//           if ([...mutation.addedNodes].filter(node => node.nodeName === 'INPUT').length > 0) {
//             console.log('mutation', mutations.addedNodes)
//             console.log('callback that runs when observer is triggered')
//             //   picker.shadowRoot.querySelector('input').style.display = 'none'
//             picker.shadowRoot.querySelector('input').value = 'sm'
//           }
//         }
//       })
//     })

//     // call `observe()` on that MutationObserver instance,
//     // passing it the element to observe, and the options object
//     observer.observe(picker.shadowRoot, { subtree: true, childList: true })
//   }
// })
// var selection = window.getSelection(),
//     range = selection.getRangeAt(0),
//     rect = range.getClientRects()[0];
