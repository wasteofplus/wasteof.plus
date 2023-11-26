const emojiPickerScript = document.createElement('script')
emojiPickerScript.id = 'emojiPickerScript'
emojiPickerScript.src = chrome.runtime.getURL('../../node_modules/emoji-mart/dist/browser.js')
document.head.appendChild(emojiPickerScript)

// fetch(chrome.runtime.getURL('../../node_modules/@emoji-mart/data/sets/14/native.json')).then((response) => {
//   return response.json()
// }).then((data) => {
//   console.log(data)
//   window.emojiData = data
//   document.body.dataset.emojiData = JSON.stringify(data)
//   const addPickerScript = document.createElement('script')
//   addPickerScript.src = chrome.runtime.getURL('addons/emojiPicker/lib/addAutocomplete.js')
//   document.head.appendChild(addPickerScript)
// })
// const modalHeader1 = [...document.querySelectorAll('#modal-header')]
//   .find((el) => el.textContent === 'Create post')
//   .parentElement.querySelector('#modal-header ~ div > div > div > div')
// const insertPollsButton = document.createElement('button')
// insertPollsButton.classList.add(
//   'emojiActionButton',
//   'text-white',
//   'p-1',
//   'rounded',
//   'bg-gray-500'
// )
// const insertPollsButtonSpan = document.createElement('span')
// insertPollsButtonSpan.innerHTML = `
//   <svg class="emojiAddButton text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"/>
//   </svg>`
// insertPollsButton.appendChild(insertPollsButtonSpan)
// insertPollsButton.addEventListener('click', () => {
// })
// modalHeader1.insertBefore(insertPollsButton, modalHeader1.lastChild)
const addPickerScript = document.createElement('script')
addPickerScript.src = chrome.runtime.getURL('addons/emojiPicker/lib/addPicker.js')
document.head.appendChild(addPickerScript)
// // add picmo script from CDN

// // <script src="https://unpkg.com/@picmo/popup-picker@latest/dist/umd/index.js"></script>
// const emojiPopupScript = document.createElement('script')
// emojiPopupScript.id = 'emojiPopupScript'
// emojiPopupScript.src = chrome.runtime.getUrl('node_modules/@picmo/popup-picker/dist/umd/index.js')

// console.log('emoji script src ', chrome.runtime.getUrl('node_modules/@picmo/popup-picker/dist/umd/index.js'))
// console.log('emoji create picker', createPopup)
// const trigger = document.querySelector('.emoji-button')

// const picker = createPopup({
//   // picker options go here
// }, {
//   referenceElement: trigger,
//   triggerElement: trigger
// });

// const elementToObserve = document.querySelector('div.prose > div')
// const observer = new MutationObserver(mutations => {
//   console.log('mutation', mutations.addedNodes)
//   console.log('callback that runs when observer is triggered')
// })

// // call `observe()` on that MutationObserver instance,
// // passing it the element to observe, and the options object
// observer.observe(elementToObserve, { subtree: true, childList: true })

// console.log('twemoji script loaded')
