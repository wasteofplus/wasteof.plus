console.log('autolovePosts loaded')

const oldHref = window.location.href
document.querySelector('.vfm__container').querySelector('button.bg-primary-500').addEventListener('click', () => {
  setTimeout(function () {
    console.log(window.location.href)
    if (window.location.href !== oldHref) {
      if (window.location.href.split('/')[4]) {
        console.log(window.location.href.split('/')[4])
        const postID = window.location.href.split('/')[4]
        fetch('https://api.wasteof.money/posts/' + postID + '/loves/' + document.querySelector('body').dataset.username, {
          headers: {
            Authorization: document.querySelector('body').dataset.token
          }
        }).then((response) => response.json()).then((didILike) => {
          console.log(didILike)
          if (!didILike) {
            fetch(
              'https://api.wasteof.money/posts/' + postID + '/loves',
              {
                method: 'POST',
                headers: {
                  Authorization: document.querySelector('body').dataset.token
                }
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log('finished liking/unliking', data)
                window.location.reload()
                if (data.error) {
                  alert(data.error)
                }
              })
          }
        })
      }
    } else {
      console.log('post didn\'t post')
    }
  }, 1500)
})
