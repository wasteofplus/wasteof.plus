const openDropdowns = {};

const replyCounts = {};

function markPostRead(post) {
    post.classList.remove("bg-gray-100")
    post.classList.remove("dark:bg-gray-800")
    post.classList.add("bg-gray-200")
    post.classList.add("dark:bg-gray-700")
}

let unreadComments = [];

const readMessage = document.createElement("p");
readMessage.style.position = "absolute";
readMessage.style.fontSize = "15px";
readMessage.style.fontWeight = "400";
readMessage.style.textDecoration = "underline";
readMessage.style.right = "0";
readMessage.style.top = "4px";
readMessage.classList.add("readIndicator");

function initCommentActionDropdown() {

    const commentActionDropdown = document.createElement("div");
    commentActionDropdown.classList.add("commentActionDropdown");
    // px-8 mb-4 border-2 dark:border-gray-600 rounded-xl bg-gray-300 dark:bg-gray-800
    commentActionDropdown.classList.add("px-8");
    commentActionDropdown.classList.add("mb-4");
    commentActionDropdown.classList.add("border-2");
    commentActionDropdown.classList.add("dark:border-gray-600");
    commentActionDropdown.classList.add("rounded-xl");
    commentActionDropdown.classList.add("bg-gray-300");
    commentActionDropdown.classList.add("dark:bg-gray-800");
    commentActionDropdown.style.position = "absolute";
    commentActionDropdown.style.right = "-14px";
    commentActionDropdown.style.fontSize = "14px"
    commentActionDropdown.style.fontWeight = "500"
    commentActionDropdown.style.maxWidth = "220px"
    commentActionDropdown.style.padding = "8px 16px"

    return commentActionDropdown;
}

const actionDropdownItem = document.createElement("p");
actionDropdownItem.classList.add("actionDropdownItem");
actionDropdownItem.style.margin = "4px 0px";

const dropdownSvg = `
<div class="dropdownIcon">
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
</div>
`

const replyIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" style="display: inline;" class="replyIcon h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
</svg>
`;



const full_reply_json = {}


function addReplyCount(post, post_id) {
    const commentFooter = post.querySelector("div > div.flex > span.relative");
    if (commentFooter.querySelector("replyIcon")) {
        return;
    }
    
    if (commentFooter.querySelector("replyCount")) {
        return;
        // commentFooter.querySelector("replyCount").remove();
    }

    commentFooter.querySelector("svg").style.display = "inline"
    commentFooter.insertAdjacentHTML("beforeend", replyIconSvg)
    console.log("reply", post_id, "has number of replies")
    console.log("adding reply count", post.querySelector("div > div.flex > span.relative"))

    const replyCount = document.createElement("span")
    replyCount.classList.add("replyCount")
    if (full_reply_json[post_id]) {
        if (full_reply_json[post_id].length > 0) {
        replyCount.innerHTML = full_reply_json[post_id].length.toString();
        } else {
            replyCount.innerHTML = "0"
        }
    } else {
        replyCount.innerHTML = "0"
    }
    commentFooter.appendChild(replyCount)
    replyCounts[post_id] = replyCount;
}

function addDot(post, post_id) {

    // const post_id = window.location.href.split("/")[4];


    const dotSvg = `
    <circle cx="16.5" cy="3.5" r="3.5" stroke="black" stroke-width="0" fill="red"></circle>
    `
    console.log("red dot space", post, post.querySelector("span > div.mt-3 > div.select-none > svg:nth-child(2)"), post.querySelector("span > div.mt-3 > div.select-none"))
    console.log("red dot svg", post.querySelectorAll("span > div.mt-3 > div.select-none > svg")[2])
    unreadComments = []
    fetch('https://api.wasteof.money/posts/' + post_id + '/comments')
        .then(response => response.json()).then((data) => {
            console.log("got comments for post ", post_id, data)
            if (data.error) {
                console.log("error getting comments", data.error, post_id)
            } else {
                if (data.comments.length != 0) {
                    full_reply_json[post_id] = [
                    ];
                    function loop_comments(comments, reply_json, id, aboveIcon) {
                        console.log("the above icon is", aboveIcon)
                        if (replyCounts[id]) {
                            replyCounts[id].innerHTML = comments.length.toString();
                        }
                        const unreadReplies = [];
                        for (const comment of comments) {
                            reply_json.push(comment._id)
                            full_reply_json[comment._id] = []

                            chrome.storage.local.get([comment._id]).then((result) => {
                                console.log("got result for comment3", result, !result[comment._id])
                                if ((!result[comment._id]) || (!result[comment._id].seen)) {
                                    console.log("comment found is unread", aboveIcon)
                                    if (unreadReplies.length == 0) {
                                        if (aboveIcon) {
                                            aboveIcon.insertAdjacentHTML("beforeend", dotSvg)
                                            }
                                    }
                                    if (unreadComments.length == 0) {
                                        post.querySelectorAll("span > div.mt-3 > div.select-none > svg")[2].insertAdjacentHTML("beforeend", dotSvg)
                                        console.log("should add red dot to parent comment", aboveIcon)


                                        console.log("add unread comment");
                                    }
                                    unreadComments.push(comment._id)
                                    unreadReplies.push(comment._id)

                                }
                                if (comment.hasReplies) {
                                    fetch('https://api.wasteof.money/comments/' + comment._id + '/replies')
                                        .then(response => response.json()).then((data) => {
                                            console.log("got replies for comment ", comment._id, data)
                                            
                                            let aboveIconSet = null;
                                            if (replyCounts[comment._id]) {
                                                console.log("setting above icon", replyCounts[comment._id].parentElement.querySelector(".replyIcon"))

                                                aboveIconSet = replyCounts[comment._id].parentElement.querySelector(".replyIcon")
                                            }
                                            loop_comments(data.comments, full_reply_json[comment._id], comment._id, aboveIconSet)

                                        });

                                }
                            });

                        }
                    }
                    loop_comments(data.comments, full_reply_json[post_id], post_id, null)
                }
            }
        });

        console.log("full reply json", full_reply_json)

    // const postHeader = post.querySelector("span > div.w-full")
    // postHeader.style.position = "relative";

    console.log("the post id is ", post_id)
}

function addDropdownIcon(postHeader, type, post_id) {
    if (postHeader.querySelector(".dropdownIcon")) {
        postHeader.querySelector(".dropdownIcon").remove();
    }
    postHeader.insertAdjacentHTML("beforeend", dropdownSvg);
    const dropdownIcon = postHeader.querySelector(".dropdownIcon");
    dropdownIcon.style.position = "absolute";
    dropdownIcon.style.right = "-20px";
    dropdownIcon.style.top = "4px";
    dropdownIcon.style.transform = "rotate(90deg)";
    dropdownIcon.dataset.postId = post_id;
    if (postHeader.querySelector(".commentActionDropdown")) {
        postHeader.querySelector(".commentActionDropdown").remove()
    }

    const commentActionDropdown = initCommentActionDropdown();

    console.log("actionDropdown", commentActionDropdown)
    postHeader.appendChild(commentActionDropdown.cloneNode(true));
    const commentActionDropdownElement = postHeader.querySelector(".commentActionDropdown");
    commentActionDropdownElement.dataset.postId = post_id;
    commentActionDropdownElement.style.display = "none";
    actionDropdownItem.innerHTML = "Mark All Replies as Read";
    commentActionDropdownElement.appendChild(actionDropdownItem.cloneNode(true));
    actionDropdownItem.innerHTML = "Mark All Replies as Unread";
    commentActionDropdownElement.appendChild(actionDropdownItem.cloneNode(true));
    actionDropdownItem.innerHTML = "Hide Read Replies";
    commentActionDropdownElement.appendChild(actionDropdownItem.cloneNode(true));
    if (type == "post") {
        actionDropdownItem.innerHTML = "Manage Comments";
        commentActionDropdownElement.appendChild(actionDropdownItem.cloneNode(true));
    }

    dropdownIcon.addEventListener('click', function (event) {
        console.log("dropdown clicked",)
        if (dropdownIcon.parentElement.querySelector(".commentActionDropdown").style.display == "none") {
            dropdownIcon.parentElement.querySelector(".commentActionDropdown").style.display = "block";
            function handleWindowClick(e) {
                if (dropdownIcon.parentElement.querySelector(".commentActionDropdown").contains(e.target) || dropdownIcon.contains(e.target)) {
                    // Clicked in box
                } else {
                    dropdownIcon.parentElement.querySelector(".commentActionDropdown").style.display = "none";
                    window.removeEventListener('click', handleWindowClick);

                    // Clicked outside the box
                }
            }
            window.addEventListener('click', handleWindowClick)
        } else {
            dropdownIcon.parentElement.querySelector(".commentActionDropdown").style.display = "none";
        }
        // do something
    });
}

function checkPostRead(post, type) {
    return new Promise(resolve => {

        const config = {
            root: null,
            threshold: 0.65 // This was the element being 50% in view (my requirements)
        };
        let post_id = post.querySelector("a").href.split("/")[4];
        console.log("post type", type)
        // const post_id = "";
        if (type == "comment") {
            console.log("old id was", post_id)
            console.log("id should be", post.id.split("-")[1])
            post_id = post.id.split("-")[1];
        } else if (window.location.href.includes("posts")) {
            console.log("old id 2 was", post_id)

            console.log("id should be", window.location.href.split("/")[4])
            console.log("id2")
            post_id = window.location.href.split("/")[4];
        } else {
            console.log("old id was", post_id)

            console.log("id should be", post.querySelector("a").href.split("/")[4])

            post_id = post.querySelector("a").href.split("/")[4];
        }

        chrome.storage.local.get([post_id]).then((result) => {
            console.log("got result for post ", type, result)
            if (type != "comment") {
                console.log("adding dot7", post_id)
                addDot(post, post_id)
            }

            if (result[post_id] != null && result[post_id].seen) {
                console.log("post already seen", post_id)
                markPostRead(post);
                if (type == "comment") {
                    console.log("comment post", window.location.href.split("/")[4])
                    // postStatus[post_id].parent = window.location.href.split("/")[4];
                } else {
                    readMessage.innerText = "Mark as Unread";
                    post.querySelector("span > div.w-full").appendChild(readMessage.cloneNode(true));
                    post.querySelector("span > div.w-full").style.position = "relative";
                    addDropdownIcon(post.querySelector("span > div.w-full"), type, post_id)

                }

                resolve(true);


                // post.style.backgroundColor = "#80899c";

            } else {
                let timer;

                console.log("observing posty")

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {
                            console.log("post began in view")
                            timer = setTimeout(() => {
                                console.log("user read post!", entry);

                                const postStatus = {
                                    [post_id]: {
                                        seen: true,
                                        setAt: Date.now(),
                                        type: type,
                                        reply_count: post.querySelector("span > div.mt-3 > div.select-none")
                                    }
                                }

                                if (type == "comment") {
                                    console.log("comment post", window.location.href.split("/")[4])
                                    postStatus[post_id].parent = window.location.href.split("/")[4];
                                } else {
                                    console.log("not a comment, should add dot")
                                }

                                if (type == "comment") {
                                    unreadComments.splice(0, 1)
                                    if (unreadComments.length == 1) {
                                        document.querySelector("main > div > div.border-2").querySelectorAll("span > div.mt-3 > div.select-none > svg")[2].querySelector("circle").remove()
                                    }
                                    readMessage.innerText = "Mark as Unread";
                                    console.log("appending read message".post)
                                    const postHeader = post.querySelector("div > div.w-full")
                                    postHeader.style.position = "relative";
                                    if (postHeader.querySelector(".readIndicator")) {
                                        postHeader.querySelector(".readIndicator").remove()
                                    }
                                    postHeader.appendChild(readMessage.cloneNode(true));
                                    addDropdownIcon(postHeader, type, post_id)

                                    console.log("not marking post as read because it is a comment")
                                } else {

                                }

                                markPostRead(post);
                                chrome.storage.local.set(postStatus).then(() => {
                                    console.log("Value is set for post", post_id);
                                });
                                //... push to data layer
                            }, 3500);
                        } else {
                            clearTimeout(timer);
                        }
                    });
                }, config);

                if (type == "post") {

                    console.log("marking an actual post as read", post.querySelector("span > div.w-full"))
                    post.querySelector("span > div.w-full").style.position = "relative";
                    readMessage.innerText = "Mark as Read";

                    post.querySelector("span > div.w-full").appendChild(readMessage.cloneNode(true));
                    addDropdownIcon(post.querySelector("span > div.w-full"), type, post_id)

                }

                observer.observe(post);
                resolve(false);
            }
        });
    });
}

async function checkOnePost(post, type) {
    const post_id = post.id.split("-")[1];

    const read = await checkPostRead(post, "comment")
    console.log("we can see that comment", post, "was read?", read)
    const postHeader = post.querySelector("div > div.w-full")
    postHeader.style.position = "relative";
    if (read) {
        readMessage.innerText = "Mark as Unread";
    } else {
        readMessage.innerText = "Mark as Read";
    }

    console.log("we saw that,", post.querySelector("div > div.w-full"))

    if (postHeader.querySelector(".readIndicator")) {
        postHeader.querySelector(".readIndicator").remove()
    }


    postHeader.appendChild(readMessage.cloneNode(true));
    addDropdownIcon(postHeader, type, post_id)

    addReplyCount(post, post_id)

}

async function checkPostReplies() {
    console.log("comment replies finished loading", document.querySelectorAll('div.ml-6 > div.rounded-xl'))

    for (const post of document.querySelectorAll('div.ml-6 > div.rounded-xl')) {
        checkOnePost(post, "comment")
    }
}



async function addon() {
    console.log("executing addon , showSeenPosts")
    const utilsUrl = chrome.runtime.getURL("../utils.js");
    const utils = await import(utilsUrl);
    utils.waitForElm('div.ml-6 > div.rounded-xl', checkPostReplies)

    await utils.waitForElm("main > div.max-w-2xl.mx-auto > div")
    console.log("posts finished loading", document.querySelectorAll('main > div.max-w-2xl.mx-auto > div.border-2').length)


    for (const post of document.querySelectorAll('main > div.max-w-2xl.mx-auto > div.border-2')) {
        checkPostRead(post, "post")
    }

    await utils.waitForElm("#comments > div.my-2 > div > div.border-2")
    console.log("comment posts finished loading", document.querySelectorAll('#comments > div.my-2 > div > div.border-2').length)

    for (const post of document.querySelectorAll('#comments > div.my-2 > div > div.border-2')) {
        checkOnePost(post, "comment")
        // const read = await checkPostRead(post, "comment");
    }

    if (document.querySelectorAll('div.ml-6 > div.rounded-xl') != null) {
        checkPostReplies()
    }

}

addon()
