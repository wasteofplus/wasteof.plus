let isWasteof3 = /beta/.test(new URL(document.URL).host);
let userName = document.querySelector(isWasteof3 ? "a.mx-2 > span:nth-child(2)" : "span.hidden:nth-child(2)").innerText;
let unloaded = true;
let _unloaded = unloaded;
let socket;

function sendMessage(message) {
    // ok I found it
    console.log(socket);
    socket.emit("message", message);
}

function onUnload() {
    unloaded = true;
    sendMessage(`<i>${userName} leaves the chat.</i>`);
    console.log("unloaded!");
}

function onLoad() {
    unloaded = false;
    sendMessage(`<i>${userName} enters the chat.</i>`);
    console.log("loaded!");
}

function checkLocation() {
    unloaded = !(window.location.pathname == "/chat");
    if (_unloaded != unloaded) {
        [onLoad, onUnload][+unloaded](); // a cursed if block
        _unloaded = unloaded;
    }
}

function init() {
    window.addEventListener("beforeunload", function (event) {
        // FIXME: sometimes this doesn't emit properly
        if (window.location.pathname == "/chat") onUnload();
    });
    // set socket
    socket = isWasteof3 ? window.socket : $nuxt.$socket;
    // add @ to wasteof2 users
    if (!isWasteof3) userName = "@" + userName;
    if (socket === undefined) throw Error("socket is undefined");
    console.log("notify script injected successfully");
    setInterval(checkLocation, 1000)
}

init();

