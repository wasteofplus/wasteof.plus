function addon() {
    const codesUrl = chrome.runtime.getURL('./codes.js')
    const bigBoy = await import(codesUrl)
    // steal a bit from polls/addon.js
    document.querySelectorAll('.prose > pre').forEach(async (element) => {
        const rawContent = element.textContent
        // finish later
    })
}