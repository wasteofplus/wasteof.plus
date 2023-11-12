console.log('websitethemecolors')
chrome.runtime.sendMessage({ type: 'getOptions', addon: 'websiteThemeColors' }, function (response) {
    console.log(response)
    if (response.surpriseColor) {
        document.body.classList.add('theme-' + response.customColor)
    } else {
        document.body.classList.add('theme-' + response.customColor)
    }
})