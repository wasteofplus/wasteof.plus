const modalHeader1 = [...document.querySelectorAll('#modal-header')]
  .find((el) => el.textContent === 'Create post')
  .parentElement.querySelector('#modal-header ~ div > div > div > div')
const allModalHeaders = [modalHeader1, ...[...document.querySelector('div.container > main > .max-w-2xl').querySelectorAll('div[contenteditable="true"]')].map((el) => el.parentElement.parentElement.firstChild)]
console.log('modals', modalHeader1, allModalHeaders)

allModalHeaders.forEach((modalHeader) => {
  const insertPollsButton = document.createElement('button')
  const prose = modalHeader.parentElement.querySelector('div.prose')
  insertPollsButton.classList.add(
    'emojiActionButton',
    'text-white',
    'p-1',
    'rounded',
    'bg-gray-500'
  )
  const insertPollsButtonSpan = document.createElement('span')
  insertPollsButtonSpan.innerHTML = `
  <svg class="emojiAddButton text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"/>
  </svg>`
  insertPollsButton.appendChild(insertPollsButtonSpan)
  insertPollsButton.addEventListener('click', (event) => {
    console.log(event.target)
    if (event.target.classList.contains('emojiActionButton') || event.target.classList.contains('emojiAddButton')) {
      picker.style.display = picker.style.display === 'none' ? 'flex' : 'none'
    }
  })
  modalHeader.insertBefore(insertPollsButton, modalHeader.lastChild)

  const pickerOptions = {
    set: 'twitter',
    theme: document.documentElement.className === 'dark' ? 'dark' : 'light',
    onEmojiSelect: (emoji) => {
      console.log('select')
      const selection = window.getSelection()
      console.log(selection.anchorNode)
      // if (prose.querySelector('div').contains(selection.anchorNode)) {
      console.log('contains', selection.anchorNode)
      if ((document.querySelector('#__layout > div > div').contains(selection.anchorNode) && document.querySelector('#__layout > div > div').contains(modalHeader)) || (modalHeader.parentElement.contains(selection.anchorNode))) {
        if (selection.anchorNode.classList && selection.anchorNode.classList.contains('is-empty')) {
          const p = document.createElement('p')
          p.innerText = emoji.native
          selection.anchorNode.parentElement.appendChild(p)
          selection.anchorNode.remove('is-empty')
        } else if (selection.anchorNode.classList && selection.anchorNode.classList.contains('ProseMirror')) {
          console.log('prosemirror', selection.anchorNode.querySelectorAll('p')[selection.anchorNode.querySelectorAll('p').length - 1])
          // const p = document.createElement('p')
          // p.innerText = emoji.native
          if (selection.anchorNode.querySelectorAll('p').length > 0) {
            selection.anchorNode.querySelectorAll('p')[selection.anchorNode.querySelectorAll('p').length - 1].innerText = selection.anchorNode.querySelectorAll('p')[selection.anchorNode.querySelectorAll('p').length - 1].innerText + emoji.native
          }
          // selection.anchorNode.remove('is-empty')
        } else {
          selection.anchorNode.data = selection.anchorNode.data + emoji.native
        }
      } else {
        prose.querySelector('div').querySelectorAll('p')[selection.anchorNode.querySelectorAll('p').length - 1].innerText = selection.anchorNode.querySelectorAll('p')[selection.anchorNode.querySelectorAll('p').length - 1].innerText + emoji.native
      }
      // } else {
      //   console.log('does not contain')
      // }
    }
  }

  // eslint-disable-next-line no-undef
  const picker = new EmojiMart.Picker(pickerOptions)
  picker.addEventListener('click', () => {
    console.log('click')
  })
  picker.classList.add('actual-picker')
  insertPollsButton.appendChild(picker)
  document.querySelector('div > div > div > div > div > div.vfm__content.relative.flex.flex-col.max-h-full.mx-4.rounded > div').style.overflowY = 'visible'

  setTimeout(() => {
    picker.style.display = 'none'
  }, 1000)
})
