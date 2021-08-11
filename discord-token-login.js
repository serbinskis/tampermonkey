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

const DiscordFormClassName = "authBoxExpanded-2jqaBe authBox-hW6HRx theme-dark"


function CheckURL(timeout) {
    if (window.location.href.indexOf("https://discord.com/login") > -1) {
        if (document.getElementsByClassName(DiscordFormClassName)[0] !== undefined) {
            LoadAccounts();
            return;
        }
    }

    setTimeout(CheckURL, timeout, timeout);
}


function Login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
    }, 50);

    setTimeout(() => {
        location.reload();
    }, 500);
}


function LoadAccounts() {
    if (document.getElementsByClassName("showButton")[0] !== undefined) {
        return;
    }

    var hidden = false;
    var style = document.createElement("style");
    var css = new String();

    css += ".showButton {";
    css += "    background-color: #7289DA;";
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
    css += "    background-color: #7289DA;";
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
    css += "    background-color: #7289DA;";
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
    const form = document.getElementsByClassName(DiscordFormClassName)[0];

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

    for(const [token, name] of Object.entries(accounts)) {
        var button = document.createElement("button");
        button.className = "accounts";
        button.innerText = name;
        button.addEventListener("mouseup", (event) => {
            if (event.button == 0) {Login(token);}
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
        var token = document.getElementsByClassName("tokenInput")[0].value
        if (token != "") { Login(token) }
    });
    container.append(loginButton);

    form.append(container);
}

window.onpopstate = function(event) {
    LoadAccounts();
};

CheckURL(100);