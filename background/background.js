async function doesContentScriptExist(tabId, contentScript) {
    console.log("does content script exist", tabId)
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.sendMessage(tabId, { greeting: contentScript }, function (response) {
                if (response) {
                    console.log("Already there");
                    resolve(true);
                } else {
                    console.log("Not there, inject contentscript");
                    resolve(false);
                }
            });
        } catch {
            console.log("returning false1")
            resolve(false);
        }
    });
}

function runAddon(tabId, contentScript) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["addons/" + contentScript + "/addon.js"],
    });
    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["addons/" + contentScript + "/addon.css"],
    });
}

const enabledAddons = [
    "addUserStatuses",
    "showSeenPosts"
];

// Cooldown variables
let lastTabId = 0;
let lastAddedAddons = null;

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    // Implement cooldown
    if (lastTabId != details.tabId || lastAddedAddons == null || Date.now() - lastAddedAddons > 2000) {
        lastAddedAddons = Date.now();
        lastTabId = details.tabId;
        for (let addon of enabledAddons) {
            console.log("enabling addon", addon)
            console.log(chrome.runtime.getURL("addons/" + addon + "/addon.json"))
            const addonSettings = fetch(chrome.runtime.getURL("addons/" + addon + "/addon.json"));
            addonSettings.then(response => response.json()).then(async (data) => {
                console.log("addon settings", data.urls);
                let dynamicEnableStatus = false;
                for (let url of data.urls) {
                    console.log(details.url, " ", url, details.url == url)
                    if (details.url == url) {
                        dynamicEnableStatus = true;
                    }
                }
                for (let url of data.urlcontains) {
                    if (details.url.includes(url)) {
                        dynamicEnableStatus = true;
                    }
                }
                console.log("does current url", details.url, " match addon url?", dynamicEnableStatus)
                if (dynamicEnableStatus) {
                    // wait 1 second
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec
                    // console.log("exists?", doesContentScriptExist(details.tabId, "feed"))
                    const scriptExists = await doesContentScriptExist(details.tabId, addon);
                    console.log(scriptExists)
                    if (!scriptExists) {
                        console.log("adding addon", addon)
                        runAddon(details.tabId, addon)
                    } else {
                        console.log("script already exists. reloading tab")
                        chrome.tabs.reload(details.tabId)
                    }
                }
            });
        }

    }
});

// function handleMessage(request, sender, sendResponse) {
//     console.log(`A content script sent a message:`);
//     console.log("background script received reload instruction!")

//     chrome.tabs.sendMessage(request.tabId, {
//         greeting: "reload",
//         addon: request.addon
//     }, function (response) {
//         console.log("finished sending message")
//     });
//     sendResponse({ response: "Response from background script" });
// }

// chrome.runtime.onMessage.addListener(handleMessage);
