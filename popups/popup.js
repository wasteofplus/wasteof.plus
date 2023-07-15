fetch("templates/extensionCard.html").then(response => response.text()).then(async (cardText) => {
    console.log("cardhtml", cardText);

    chrome.storage.local.get(["enabledAddons"]).then((result) => {
        console.log("Value currently is " + result.enabledAddons);

        if (result.enabledAddons == undefined) {
            chrome.storage.local.set({ enabledAddons: [] })
        } else {
            fetch("../addons/addons.json").then(response => response.json()).then(async (data) => {
                console.log("addons.json", data);
                const addonList = document.querySelector(".addons")

                for (let addon of data.sort()) {
                    fetch("../addons/" + addon + "/addon.json").then(response => response.json()).then(async (addonData) => {

                        addonList.insertAdjacentHTML("beforeend", cardText);
                        const card = addonList.lastElementChild;
                        card.querySelector(".addonName").innerText = addonData.name;
                        card.querySelector(".addonDescription").innerText = addonData.description;
                        if (result.enabledAddons.includes(addon)) {
                            card.querySelector("input").checked = true;

                        }
                        card.querySelector("input").addEventListener('change', (event) => {
                            if (result.enabledAddons.includes(addon)) {

                                if (result.enabledAddons.length < 2) {
                                    chrome.storage.local.set({ enabledAddons: [] })
                                } else {
                                    const index = result.enabledAddons.indexOf(addon);

                                    const x = result.enabledAddons.splice(index, 1);
                                    console.log("removed addon", addon, x)

                                    chrome.storage.local.set({ enabledAddons: x })
                                }
                                
                            } else {
                                result.enabledAddons.push(addon)
                                chrome.storage.local.set({ enabledAddons: result.enabledAddons })
                            }
                        })
                    });
                }
            });
        }
    });
});
