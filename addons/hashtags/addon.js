// generate hashtag links from elements containing # symbols
// change code to make it open a popup later
function hashtag (text) {
  const tag = text.replace(
    /#(\w+)/g,
    '<a href="https://wasteof.money/search?q=$1">#$1</a>'
  )
  return tag
}

// add hashtags to html (make them clickable)
function addhashtags () {
  console.log('executing hashtags script!')

  // get all the posts containing the class prose dark:prose-light max-w-none break-words
  const postcollection = document.querySelectorAll('.prose.dark\\:prose-light.max-w-none.break-words')

  // go through all posts (boring)
  postcollection.forEach(post => {
    // find all the text paragraph elements within the post
    const paragraphs = post.querySelectorAll('p')

    // go through all paragraph elements to find and update hashtags
    paragraphs.forEach(p => {
      const updatedContent = hashtag(p.innerHTML)
      p.innerHTML = updatedContent
    })
  })
}

// execute the function when the page and posts are loaded
if (document.readyState === 'complete') {
  addhashtags()
} else {
  document.addEventListener('DOMContentLoaded', addhashtags)
}
