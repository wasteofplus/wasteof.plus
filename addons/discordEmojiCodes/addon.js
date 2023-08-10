async function addon() {
    const codesUrl = chrome.runtime.getURL('addons/discordEmojiCodes/lib/codes.js')
    const bigBoy = await import(codesUrl)
    // steal a bit from polls/addon.js
    document.querySelectorAll('.prose > p').forEach(async (element) => {
        console.log('emoji scanning', element)
        let rawContent = element.textContent
        var afterConvert = rawContent
        console.log('search emojis', rawContent.matchAll(/\:[A-Za-z0-9\+\-]+\:/g))

        // search for potential emojis and replace them with counterparts
        for (const emoji of rawContent.matchAll(/\:[A-Za-z0-9\+\-]+\:/g)) {
            console.log('emoji', emoji, emoji[0], emoji[0].substring(1,emoji[0].length-1))
            console.log('full bigboy', bigBoy.codes)
            console.log('value from bigboy', bigBoy.codes[emoji[0].substring(1,emoji[0].length-1)])

            console.log('bigboy', Object.values(bigBoy.codes).filter((emojicode) => bigBoy.codes[emojicode]==emoji[0].substring(1,-1)))
            if (bigBoy.codes[emoji[0].substring(1,emoji[0].length-1)]) {
               afterConvert = afterConvert.replaceAll(emoji[0], bigBoy.codes[emoji[0].substring(1,emoji[0].length-1)])
            } else return
        }
        element.textContent = afterConvert // does this work???
    })
}
console.log('discord emoji codes addon executing')
addon()
