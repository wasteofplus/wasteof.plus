var isWasteof3 = /beta/.test(new URL(document.URL).host);
var userName = document.querySelector(isWasteof3 ? "a.mx-2 > span:nth-child(2)" : "span.hidden:nth-child(2)").innerText;
var unloaded = true;
var _unloaded = unloaded;
var socket;

function sendMessage(message) {
    // ok I found it
    console.log(socket);
    socket.emit("message", message);
}

function onUnload() {
    console.log("unloaded!");
    unloaded = true;
    sendMessage(`<i>${userName} leaves the chat.</i>`);
}

function onLoad() {
    console.log("loaded!");
    unloaded = false;
    sendMessage(`<i>${userName} enters the chat.</i>`);
}

function checkLocation() {
    unloaded = !(window.location.pathname == "/chat");
    if (_unloaded != unloaded) {
        [onLoad, onUnload][+unloaded](); // a cursed if block
        _unloaded = unloaded;
    }
}

function addon() {
    window.onbeforeunload = onUnload;
    console.log("made it here :)");
    // set socket
    console.log(window);
    // FIXME: Seems like the `window` here doesn't have either `socket` or `$nuxt`...
    socket = isWasteof3 ? window.socket : window.$nuxt.$socket;
    if (socket === undefined) throw Error("socket is undefined");
    setInterval(checkLocation, 1000)
}

addon();

