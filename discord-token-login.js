// ==UserScript==
// @name         Discord Token Login
// @version      1.0
// @description  Discord Token Login
// @author       CoSeR & Wonfy & WobbyChip
// @match        *://discord.com/
// @include      *://discord.com/*
// ==/UserScript==

const accounts = {
    "TOEKN": "USERNAME",
};

const discordClassName = "authBoxExpanded-AN2aH1 authBox-1HR6Ha theme-dark";
const discordSettingsClassName = "flex-2S1XBF flex-3BkGQD horizontal-112GEH horizontal-1Piu5- flex-3BkGQD directionRow-2Iu2A9 justifyStart-2Mwniq alignStretch-Uwowzr noWrap-hBpHBz";
const discordLeaveSvg = "M18 2H7C5.897 2 5 2.898 5 4V11H12.59L10.293 8.708L11.706 7.292L16.414 11.991L11.708 16.706L10.292 15.294L12.582 13H5V20C5 21.103 5.897 22 7 22H18C19.103 22 20 21.103 20 20V4C20 2.898 19.103 2 18 2Z";

var interval1 = setInterval(() => {
    if (window.location.href.indexOf("https://discord.com/login") < 0) { return; }
    if (!document.getElementsByClassName(discordClassName)[0]) { return; }

    loadAccounts();
    clearInterval(interval1);
}, 100);

var interval2 = setInterval(() => {
    if (!document.getElementsByClassName(discordSettingsClassName)[0]) { return; }

    loadLogout();
    clearInterval(interval2);
}, 100);


function logout() {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = "";
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.tokens = "";
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.MultiAccountStore = "";
    }, 50);

    setTimeout(() => {
        location = "https://discord.com/login";
    }, 500);
}


function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
    }, 50);

    setTimeout(() => {
        location.reload();
    }, 500);
}


function loadAccounts() {
    if (document.getElementsByClassName("showButton")[0] !== undefined) {
        return;
    }

    var hidden = false;
    var style = document.createElement("style");
    var css = new String();

    css += ".showButton {";
    css += "    background-color: var(--brand-experiment);";
    css += "    width:32px;";
    css += "    border: none;";
    css += "    color: #FFF;";
    css += "    text-align: center;";
    css += "    display: inline-block;";
    css += "    font-size: 16px;";
    css += "    line-height: 24px;";
    css += "    margin-bottom: 0px;";
    css += "    margin-top: 10px;";
    css += "    border-radius: 100px;";
    css += "    transition: background-color .17s ease,color .17s ease;";
    css += "}";

    css += ".showButton:hover {";
    css += "    background-color: #677bc4;";
    css += "}";

    css += ".showButton:active {";
    css += "    background-color: #5b6eae;";
    css += "}";

    css += ".accounts {"
    css += "    background-color: var(--brand-experiment);";
    css += "    height: 44px; width: auto;";
    css += "    border: none; color: #FFF;";
    css += "    padding: 0px; text-align: center;";
    css += "    display: inline-block;";
    css += "    font-size: 16px;";
    css += "    line-height: 24px;";
    css += "    margin-top: 20px;";
    css += "    padding-left: 10px;";
    css += "    padding-right: 10px;";
    css += "    border-radius: 5px;";
    css += "    margin-right: 20px;";
    css += "    transition: background-color .17s ease, color .17s ease;";
    css += "}";

    css += ".accounts:hover {";
    css += "    background-color: #677bc4;";
    css += "}";

    css += ".accounts:active {";
    css += "    background-color: #5b6eae;";
    css += "}";

    css += ".tokenInput {";
    css += "    margin-top: 20px;";
    css += "    margin-right: 15px;";
    css += "    padding: 10px;";
    css += "    font-size: 16px;";
    css += "    width: 54%;";
    css += "    border-radius: 3px;";
    css += "    color: var(--text-normal);";
    css += "    background-color: var(--deprecated-text-input-bg);";
    css += "    border: 1px solid var(--deprecated-text-input-border);";
    css += "}";

    css += ".login {"
    css += "    background-color: var(--brand-experiment);";
    css += "    height: 43px; width: 112px;";
    css += "    border: none; color: #FFF;";
    css += "    text-align: center;";
    css += "    display: inline-block;";
    css += "    font-size: 16px;";
    css += "    line-height: 24px;";
    css += "    margin-top: 20px;";
    css += "    border-radius: 5px;";
    css += "    margin-right: 20px;";
    css += "    transition: background-color .17s ease, color .17s ease;";
    css += "}";

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].append(style);
    const form = document.getElementsByClassName(discordClassName)[0];

    const showButton = document.createElement("button");
    showButton.innerText = "...";
    showButton.className = "showButton";
    form.append(showButton);

    showButton.addEventListener("click", () => {
        container.style = hidden ? "display: none" : "display: block";
        hidden = !hidden;
    });

    var container = document.createElement("div");
    container.style = "display: none";

    for (const [token, name] of Object.entries(accounts)) {
        var button = document.createElement("button");
        button.className = "accounts";
        button.innerText = name;
        button.addEventListener("mouseup", (event) => {
            if (event.button == 0) { login(token); }
            if (event.button == 2) {
                const copy = document.createElement("textArea");
                copy.value = token;
                document.body.appendChild(copy);
                copy.select();
                document.execCommand("copy");
                document.body.removeChild(copy);
            }
        });
        container.append(button);
    }

    var br = document.createElement("br");
    container.append(br);

    var input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Enter token";
    input.className = "tokenInput";
    container.append(input);

    var loginButton = document.createElement("button");
    loginButton.className = "login";
    loginButton.innerText = "Login";
    loginButton.addEventListener("click", () => {
        var token = document.getElementsByClassName("tokenInput")[0].value;
        if (token != "") { login(token); }
    });

    container.append(loginButton);
    form.append(container);
}

function loadLogout() {
    var clone = document.getElementsByClassName(discordSettingsClassName)[0].lastChild.cloneNode(true);
    clone.style = "left: -100%;"
    clone.onclick = logout;
    clone.children[0].children[0].children[0].setAttribute("d", discordLeaveSvg);
    document.getElementsByClassName(discordSettingsClassName)[0].appendChild(clone);
}

window.onpopstate = (event) => { loadAccounts(); }
