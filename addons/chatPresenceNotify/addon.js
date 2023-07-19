console.log("made it here :)");
const isWasteof3 = /beta/.test(new URL(document.URL).host);
let userName = document.querySelector(isWasteof3 ? "a.mx-2 > span:nth-child(2)" : "span.hidden:nth-child(2)").innerText;
let unloaded = true;
let _unloaded = unloaded;
let socket;

function sendMessage(message) {
    // ok I found it
    socket.emit("message", message);
}

function onUnload() {
    console.log("unloaded!");
    if (unloaded) return; // already outside /chat
    unloaded = true;
    sendMessage(`<i>${userName} leaves the chat.</i>`);
}

function onLoad() {
    console.log("loaded!");
    if (!unloaded) return; // already inside /chat
    unloaded = false;
    sendMessage(`<i>${userName} enters the chat.</i>`);
}

function checkLocation() {
    unloaded = !(window.location.pathname == "/chat");
    if (_unloaded != unloaded) {
        _unloaded = unloaded;
        [onLoad, onUnload][+unloaded](); // a cursed if block
    }
}

function addon() {
    // set socket
    socket = isWasteof3 ? window.socket : window.$nuxt.$socket;
    setInterval(checkLocation, 1000)
}

document.addEventListener("beforeunload", onUnload);
document.addEventListener("load", addon); // imagine addon() is here
