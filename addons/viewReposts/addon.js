async function addon() {
  const repostsSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" class="view-reposts-icon"><path d="M11.6 3.4l-.8-.8c-.5-.6-.4-1.5.3-1.8.4-.3 1-.2 1.4.2a509.8 509.8 0 012.7 2.7c.5.4.5 1.2.1 1.6l-2.8 2.9c-.5.5-1.3.5-1.8-.1-.3-.5-.2-1 .2-1.5l.8-1H7a4.3 4.3 0 00-4.1 4.7 2036.2 2036.2 0 01.2 8h2.4c.5 0 .8.2 1 .6.2.4.2.9 0 1.2-.2.4-.6.6-1 .6H1.8c-.7 0-1.2-.5-1.2-1.1v-.2V10c0-1.3.3-2.5 1-3.6 1.3-2 3.2-3 5.6-3h4.4zM12.3 18.3h4.6c2.3 0 4.2-2 4.2-4.3V5.9c0-.2 0-.2-.2-.2h-2.3c-.6 0-1-.3-1.2-.8a1.2 1.2 0 011.1-1.6h3.6c.8 0 1.3.5 1.3 1.3v9c0 1.1-.1 2.2-.6 3.2a6.4 6.4 0 01-5.6 3.7l-4.6.1h-.2l.7.8c.4.4.5.9.3 1.3-.3.8-1.3 1-1.9.4L9 20.6l-.4-.5c-.3-.4-.3-1 0-1.4l2.9-3c.6-.6 1.7-.3 2 .6 0 .4 0 .7-.3 1l-.9 1z" fill="currentColor"></path></svg>';
  const dateFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    dateStyle: "long",
  });
  const parser = new DOMParser();
  const pageTemplate = await fetch(
    chrome.runtime.getURL("addons/viewReposts/templates/pageTemplate.html")
  ).then((response) => response.text());
  const postTemplate = await fetch(
    chrome.runtime.getURL("addons/viewReposts/templates/postTemplate.html")
  ).then((response) => response.text());

  const createPost = async (postId) => {
    const apiResponse = await fetch(
      `https://api.wasteof.money/posts/${postId}`
    ).then((response) => response.json());
    const post = parser
      .parseFromString(postTemplate, "text/html")
      .body.querySelector("*");
    post.querySelector(
      "[data-reposts-main-link]"
    ).href = `/posts/${apiResponse._id}`;
    post.querySelector(
      "[data-reposts-user-link]"
    ).href = `/users/${apiResponse.poster.name}`;
    post.querySelector(
      "[data-reposts-profile-picture]"
    ).src = `https://api.wasteof.money/users/${apiResponse.poster.name}/picture`;
    post
      .querySelector("[data-reposts-username-section]")
      .classList.add(`theme-${apiResponse.poster.color}`);
    post.querySelector("[data-reposts-username]").textContent =
      apiResponse.poster.name;
    post.querySelector("[data-reposts-content]").innerHTML =
      apiResponse.content;
    post.querySelector("[data-reposts-creation-time]").textContent =
      dateFormatter.format(new Date(+apiResponse.time)).replace(" at", ",");
    console.log(apiResponse.revisions.length);
    if (apiResponse.revisions.length === 1) {
      post.querySelector("[data-reposts-edited]").classList.add("hidden");
    }
    post.querySelector("[data-reposts-love-counter]").textContent =
      apiResponse.loves;
    post.querySelector("[data-reposts-repost-counter]").textContent =
      apiResponse.reposts;
    post.querySelector("[data-reposts-comment-counter]").textContent =
      apiResponse.comments;
    return post;
  };

  document
    .querySelectorAll(".float-right.relative.inline-block.z-20 svg")
    .forEach((el) => {
      el.addEventListener("click", () => {
        const menu = el.parentElement.querySelector("div");
        const viewReposts = document.createElement("span");
        viewReposts.classList.add(
          "flex",
          "px-4",
          "py-2",
          "text-sm",
          "text-gray-700",
          "dark:text-gray-300",
          "hover:bg-primary-50",
          "dark:hover:bg-gray-800",
          "active:bg-primary-100",
          "dark:active:bg-gray-700",
          "transition-colors",
          "cursor-pointer"
        );
        const repostsIcon = document.createElement("span");
        repostsIcon.classList.add("mr-1");
        repostsIcon.innerHTML = repostsSvg;
        viewReposts.appendChild(repostsIcon);
        const repostsText = document.createTextNode("View reposts");
        viewReposts.appendChild(repostsText);
        viewReposts.addEventListener("click", () => {
          const wrapperLink =
            el.parentElement.parentElement.parentElement.parentElement;
          location.href =
            (wrapperLink.getAttribute("to") ||
              wrapperLink.getAttribute("href")) + "/reposts";
        });
        menu.appendChild(viewReposts);
      });
    });

  const postId = location.pathname.match(/^\/posts\/([0-9a-f]+)\/reposts/)[1];
  if (!postId) {
    return;
  }
  const page = parser
    .parseFromString(pageTemplate, "text/html")
    .body.querySelector("*");
  page
    .querySelector("[data-reposts-original-post]")
    .appendChild(await createPost(postId));
  document.querySelector("main").replaceChildren(page);
  const reposts = (
    await fetch(
      `https://corsproxy.io?https://beta.wasteof.money/posts/${postId}/reposts/__data.json`
    ).then((response) => response.json())
  ).reposts.map((repost) => repost.id);
  const posts = page.querySelector("[data-reposts-posts]");
  for (const repost of reposts) {
    posts.appendChild(await createPost(repost));
  }
}

addon();
