let hovering = false;
let hoveringArea = false;

function greyOutFollowButton(button) {
    // remove classes: text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-primary-500
    // text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-gray-500
    button.classList.remove("bg-primary-500")
    button.classList.add("bg-gray-500")
    button.querySelector("span.hidden").innerText = "Unfollow";
    button.style.width = "110px"
    button.style.left = "225px"
}

function unGreyOutFollowButton(button) {
    // remove classes: text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-primary-500
    // text-white text-center font-bold p-2 h-10 rounded-lg cursor-pointer bg-gray-500
    button.classList.add("bg-primary-500")
    button.classList.remove("bg-gray-500")
    followButton.querySelector("span.hidden").innerText = "Follow";
    followButton.style.width = "105px"
    followButton.style.left = "230px"
}

async function fillInHoverCardTemplate(hovercard, postHeader, utils) {
    const username = postHeader.querySelector("span.ml-1.inline-block").innerText
    const apiUrl = "https://api.wasteof.money/users/" + username.slice(1, username.length - 1);
    const userUrl = "https://wasteof.money/users/" + username.slice(1, username.length - 1);
    const user = await fetch(apiUrl).then(response => response.json());
    // https://api.wasteof.money/users/jeffalo/followers/radi8
    const actualUserUsername = document.querySelector("span.flex > li > a.inline-block.font-semibold > span").innerText;
    console.log("the currently logged in user is ", actualUserUsername)
    console.log("the url of me is ", "https://wasteof.money/users/" + actualUserUsername + "/followers/" + username.slice(1, username.length - 1))
    const followingMe = await fetch("https://api.wasteof.money/users/" + actualUserUsername + "/followers/" + username.slice(1, username.length - 1)).then(response => response.json());
    const meFollowing = await fetch(apiUrl + "/followers/" + actualUserUsername).then(response => response.json());

    console.log("following me", followingMe)

    hovercard.querySelector(".userUsername").innerText = username;
    console.log("username", username)

    const profilePicture = postHeader.querySelector("img.border-2").src;
    hovercard.querySelector(".userPfp").src = profilePicture;
    hovercard.querySelector(".userPfp").alt = username.slice(1, username.length - 1) + "'s Profile Picture";

    const banner = apiUrl + "/banner";
    hovercard.querySelector(".userBanner").src = banner;

    const bio = user.bio
    const stats = user.stats;
    hovercard.querySelector(".userBio").innerText = bio;
    hovercard.querySelector(".userFollowers").innerText = stats.followers + " Followers";
    hovercard.querySelector(".userFollowing").innerText = stats.following + " Following";
    console.log("user joined", user)
    if (user.history != null) {
        const joined = utils.timeDifference(new Date(), user.history.joined)
        hovercard.querySelector(".userJoined").innerText = "Joined " + joined;
    } else {
        hovercard.querySelector(".userJoined").innerText = "Joined Unknown";
    }

    const wallUrl = userUrl + "/wall";
    hovercard.querySelector(".userWallUrl").href = wallUrl;

    for (const userUrlElem of hovercard.querySelectorAll(".userUrl")) {
        userUrlElem.href = userUrl;
    }
    const verified = user.verified;
    const admin = user.permissions.admin;
    const beta = user.beta;
    if (verified) {
        hovercard.querySelector(".userVerified").style.display = "block";
    } else {
        hovercard.querySelector(".userVerified").style.display = "none";
    }
    if (admin) {
        hovercard.querySelector(".userAdmin").style.display = "block";
    } else {
        hovercard.querySelector(".userAdmin").style.display = "none";
    }
    if (beta) {
        hovercard.querySelector(".userBeta").style.display = "block";
    } else {
        hovercard.querySelector(".userBeta").style.display = "none";
    }

    if (verified && !admin) {
        hovercard.querySelector(".userVerified").style.left = "0px";
    }
    if (beta && ((!admin || !verified) && !(!admin && !verified))) {
        hovercard.querySelector(".userBeta").style.left = "25px";
    } else if (!admin && !verified) {
        hovercard.querySelector(".userBeta").style.left = "0px";
    }
    const followButton = hovercard.querySelector(".followButton");

    if (followingMe) {
        hovercard.querySelector(".userFollowingMe").style.display = "block";
    }
    if (meFollowing) {

        greyOutFollowButton(followButton);
    }

    followButton.addEventListener("click", async () => {
        fetch("https://api.wasteof.money/users/" + username.slice(1, username.length - 1) + "/followers", {
            method: "POST",
            headers: {
                "Authorization": document.querySelector("body").dataset.token
            }
        }).then(response => response.json()).then(data => {
            console.log("finished following/unfollowing", data);
            if (data.error) {
                alert(data.error);
                return;
            }
            if (data.ok == "followed") {
                unGreyOutFollowButton(followButton);
            } else if (data.ok == "unfollowed") {
                greyOutFollowButton(followButton);
            }
            stats.followers = data.new.followers;
            stats.following = data.new.following;
            meFollowing = data.new.isFollowing;
        });
    });

    const online = user.online;
    if (online) {
        hovercard.querySelector(".userOnlineDot").style.display = "block";
    } else {
        hovercard.querySelector(".userOnlineDot").style.display = "none";
    }



}

async function addon() {
    console.log("executing addon , profileHoverCards");
    const htmlFileContent = await fetch(chrome.runtime.getURL("./addons/profileHoverCards/templates/hovercard4.html")).then(response => response.text());
    // console.log("htmlFileContent", htmlFileContent)
    const utilsUrl = chrome.runtime.getURL("../utils.js");
    const utils = await import(utilsUrl);
    if (document.querySelector('main > div.max-w-2xl.mx-auto > div.border-2') == null) {
        utils.waitForElm('div.ml-6 > div.rounded-xl')
    }

    console.log("navigation bar is ")
    document.querySelector("nav").style.zIndex = "10000";

    console.log("all posts list", document.querySelectorAll('main > div.max-w-2xl.mx-auto > div.border-2').length)
    for (const post of document.querySelectorAll('div.border-2.rounded-xl')) {
        const postHeader = post.querySelector("a.w-full");
        if (!postHeader.parentElement.classList.contains("truncate")) {
            postHeader.parentElement.style.position = "relative";
            console.log("post1", postHeader);
            if (!postHeader.querySelector("div.hoverCard")) {
                postHeader.parentElement.insertAdjacentHTML("beforeend", await htmlFileContent);
                const hovercard = postHeader.parentElement.querySelector("div.hoverCard");
                hovercard.style.display = "none";
                const hoverArea = document.createElement("div");
                hoverArea.classList.add("hoverArea");
                postHeader.appendChild(hoverArea);

                fillInHoverCardTemplate(hovercard, postHeader.parentElement, utils);
                hovercard.onmouseover = function () {
                    hovering = true;
                    hovercard.style.display = "block";
                }
                hovercard.onmouseout = function () {
                    hovering = false;
                    if (!hoveringArea) {
                        hovercard.style.display = "none";
                    }
                }
                hoverArea.onmouseover = function () {
                    hoveringArea = true;
                    hovercard.style.display = "block";
                }
                hoverArea.onmouseout = function () {
                    hoveringArea = false;
                    console.log("hoverArea.onmouseout", hovering)
                    if (!hovering) {
                        hovercard.style.display = "none";
                    }
                }

            }
        }
    }

    // await utils.waitForElm("#comments > div.my-2 > div > div.border-2")
    // console.log("comment posts finished loading", document.querySelectorAll('#comments > div.my-2 > div > div.border-2').length)

    // for (const post of document.querySelectorAll('#comments > div.my-2 > div > div.border-2')) {
    //     checkOnePost(post, "comment")
    //     // const read = await checkPostRead(post, "comment");
    // }

    // if (document.querySelectorAll('div.ml-6 > div.rounded-xl') != null) {
    //     checkPostReplies()
    // }

}

const getTokenScript = document.createElement("script");
getTokenScript.id = "getTokenScript";
getTokenScript.src = chrome.runtime.getURL("./addons/profileHoverCards/lib/getToken.js");

document.body.appendChild(getTokenScript);

addon()
