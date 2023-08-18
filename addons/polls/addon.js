function testrunaddon () {
  const cookieMatch = document.cookie.match(/token=([^;]+)/)
  const token = cookieMatch ? cookieMatch[1] : null

  const getPostCommentsByPoster = async (post, allowedOptions) => {
    let page = 1
    const mappedComments = new Map()
    const paragraphs = allowedOptions.map((option) => `<p>${option}</p>`)
    const votedAuthors = []
    while (true) {
      const response = await fetch(
        `https://api.wasteof.money/posts/${post}/comments?page=${page}`
      ).then((response) => response.json())
      response.comments.forEach((comment) => {
        if (!paragraphs.includes(comment.content)) {
          return
        }
        if (votedAuthors.includes(comment.poster.id)) {
          return
        }
        const values = mappedComments.get(comment.content)
        mappedComments.set(comment.content, [
          ...(values ?? []),
          comment.poster
        ])
        votedAuthors.push(comment.poster.id)
      })
      if (response.last) {
        break
      }
      page++
    }
    return mappedComments
  }

  const pollSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chart-pie" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8"></path><path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5"></path></svg>' // This is the chart-pie icon from https://tabler-icons.io

  const modalHeader = [...document.querySelectorAll('#modal-header')]
    .find((el) => el.textContent === 'Create post')
    .parentElement.querySelector('#modal-header ~ div > div > div > div')
  const insertPollsButton = document.createElement('button')
  insertPollsButton.classList.add(
    'text-white',
    'p-1',
    'rounded',
    'bg-gray-500'
  )
  const insertPollsButtonSpan = document.createElement('span')
  insertPollsButtonSpan.innerHTML = pollSvg
  insertPollsButton.appendChild(insertPollsButtonSpan)
  insertPollsButton.addEventListener('click', () => {
    if (
      [...document.querySelectorAll('nav + div .ProseMirror pre code')].some(
        (el) => el.textContent.startsWith('poll: ')
      )
    ) {
      alert('Only one poll per post is supported.')
      return
    }
    const options = []
    while (true) {
      const option = prompt(
        `Current options: ${options.join(
          ', '
        )}\nPut in another option, or press Cancel to stop.`
      )
      if (option === null) {
        break
      }
      options.push(option)
    }
    if (options.length === 0) {
      return
    }
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.textContent = `poll: ${JSON.stringify(options)}`
    pre.appendChild(code)
    document.querySelector('.ProseMirror').appendChild(pre)
  })
  modalHeader.insertBefore(insertPollsButton, modalHeader.lastChild)

  document.querySelectorAll('.prose > pre').forEach(async (element) => {
    const debug = await import(chrome.runtime.getURL('../debug.js'))

    const rawContent = element.textContent
    const postId = (
      element.parentElement.parentElement.getAttribute('to') ||
      element.parentElement.parentElement.getAttribute('href')
    ).replace(/^\/posts\//, '')
    if (!rawContent.startsWith('poll: ')) {
      return
    }
    const content = rawContent.replace(/^poll: /, '')
    const options = JSON.parse(content)
    if (
      !(options instanceof Array) ||
      options.some((option) => typeof option !== 'string')
    ) {
      debug.log(`Expected options to be an array of strings, got ${content}`)
    }
    const comments = await getPostCommentsByPoster(postId, options)
    const voteAmounts = [...comments.values()]
      .map((value) => value.length)
      .reduce((a, b) => a + b, 0)
    const poll = document.createElement('form')
    poll.classList.add(
      'bg-gray-100',
      'dark:bg-gray-800',
      'px-8',
      'mb-4',
      'border-2',
      'dark:border-gray-700',
      'rounded-xl',
      'poll'
    )
    poll.addEventListener('submit', async (e) => {
      const checked = poll.querySelector(`[name='poll-${postId}']:checked`)
      if (!checked) {
        alert('Please select something.')
        return
      }
      const response = await fetch(
        `https://api.wasteof.money/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify({
            content: `<p>${checked.value}</p>`,
            parent: null
          })
        }
      )
      if (response.status === 200) {
        alert('Successfully voted.')
      } else {
        alert(`Something went wrong, error code: ${response.status}`)
      }
    })
    options.forEach((option) => {
      const votes = comments.get(`<p>${option}</p>`) ?? []
      const inputWrapper = document.createElement('label')
      inputWrapper.classList.add('poll-input')
      const leftInput = document.createElement('div')
      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = `poll-${postId}`
      radio.value = option
      radio.classList.add('poll-radio')
      leftInput.appendChild(radio)
      const text = document.createTextNode(option)
      leftInput.appendChild(text)
      inputWrapper.appendChild(leftInput)
      const rightInput = document.createElement('div')
      const profilePictures = document.createElement('span')
      profilePictures.classList.add('poll-pfps')
      profilePictures.title = votes.map((vote) => vote.name).join(', ')
      votes.forEach((vote, i) => {
        if (i >= 10) {
          return
        }
        const profilePicture = document.createElement('img')
        profilePicture.src = `https://api.wasteof.money/users/${vote.name}/picture`
        profilePicture.alt = vote.name
        profilePictures.appendChild(profilePicture)
      })
      rightInput.appendChild(profilePictures)
      const count = document.createElement('span')
      count.classList.add('poll-count')
      count.textContent = `${votes.length}/${voteAmounts}` // TODO change this later
      rightInput.appendChild(count)
      inputWrapper.appendChild(rightInput)
      poll.appendChild(inputWrapper)
      const meter = document.createElement('meter')
      meter.max = voteAmounts
      meter.value = votes.length
      meter.classList.add('poll-meter')
      poll.appendChild(meter)
    })
    if (token) {
      const submitButton = document.createElement('button')
      submitButton.classList.add('button-primary', 'poll-submit')
      submitButton.type = 'submit'
      submitButton.textContent = 'Vote'
      poll.appendChild(submitButton)
    }
    element.replaceWith(poll)
  })
}

function addon () {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('executing addon, polls')
  })
  testrunaddon()
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  import(chrome.runtime.getURL('../debug.js')).then((debug) => {
    debug.log('message polls', message)
    sendResponse({ message: 'hello' })
    if (message.action === 'reload') {
      debug.log('RELOADING!!! user statuses')
      // wait 3 seconds
      setTimeout(() => {
        debug.log('it\'s been 3 seconds, reloading addon polls')
        debug.log('going to execute polls')
        testrunaddon()

      // addon()
      }, 3000)
      // addon()
      debug.log('finsihed reloading addon user statises')
    }
  })
})

addon()
