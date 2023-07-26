// generate hashtag links from elements containing # symbols
function hashtag (text) {
  const domtostr = text.innerText
  const tag = domtostr.replace(
    /#(\w+)/g,
    '<a href="https://wasteof.money/search?q=$1">#$1</a>'
  )
  return tag
}
// add hashtags to html (make them clickable)
async function addhashtags () {
  const utilsUrl = chrome.runtime.getURL('../utils.js')
  const utils = await import(utilsUrl)
  await utils.waitForElm('img.border-2')

  await new Promise(resolve => setTimeout(resolve, 600)) // 3 sec
  console.log('executing hastags script!')

  const postcollection = document.getElementsByClassName('break-words')
  let i = 0

  console.log('postcollection', postcollection)

  // go through all posts
  while (i < postcollection.length) {
    let v = 0

    // go through all lines in each post to find lines containing # symbols
    const postlines = postcollection[i].childNodes
    console.log('postlines', postlines)
    while (v < postlines.length) {
      // make new element with hashtag link code
      const newP = document.createElement('p')

      console.log('postlines[v]', postlines[v])
      const strtodom = hashtag(postlines[v])

      console.log('strtodom', strtodom)

      newP.innerHTML = strtodom

      // replace current hashtag with hashtag with link
      postlines[v].replaceWith(newP)
      v++
    }

    i++
  }
}

addhashtags()
