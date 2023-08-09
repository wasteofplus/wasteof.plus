function addon() {
    const codesUrl = chrome.runtime.getURL('./codes.js')
    const bigBoy = await import(codesUrl)
    // steal a bit from polls/addon.js
    document.querySelectorAll('.prose > pre').forEach(async (element) => {
        let rawContent = element.textContent
        var afterConvert = rawContent
        // search for potential emojis and replace them with counterparts
        rawContent.matchAll(/\:[A-Za-z0-9\+\-]+\:/g).forEach( (emoji) => {
            if (bigBoy.codes[emoji.substring(1,-1)]) {
               afterConvert = afterConvert.replaceAll(emoji, bigBoy.codes[emoji.substring(1,-1)])
            } else return
        })
        element.textContent = afterConvert // does this work???
    })
}