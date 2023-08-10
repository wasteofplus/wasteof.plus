// add picmo script from CDN

// <script src="https://unpkg.com/@picmo/popup-picker@latest/dist/umd/index.js"></script>
const emojiPopupScript = document.createElement('script')
emojiPopupScript.id = 'emojiPopupScript'
emojiPopupScript.src = chrome.runtime.getUrl('node_modules/@picmo/popup-picker/dist/umd/index.js')

console.log('create picker', createPopup)
const trigger = document.querySelector('.emoji-button');

const picker = createPopup({
  // picker options go here
}, {
  referenceElement: trigger,
  triggerElement: trigger
});
