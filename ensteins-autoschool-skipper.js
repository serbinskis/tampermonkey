// ==UserScript==
// @name         Ensteins Autoschool Skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip online lessons in Ensteins autoschool
// @author       Serbinskis
// @match        https://student.einsteins.lv/e-learning/1/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=einsteins.lv
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        none
// @require      https://www.example.com/some/js/GM_fetch.js
// ==/UserScript==

async function waitElement(cb) {
    while (!cb()) { await new Promise(resolve => setTimeout(resolve, 10)); }
    return cb();
}

async function skip() {
    var code = location.href.split('/').pop();
    var duration = document.querySelector('.lesson-player video').duration;

    var system = "Unknown";
    if (window.navigator.userAgent.includes("Windows NT")) { system = "Windows"; }
    if (window.navigator.userAgent.includes("Mac")) { system = "Mac"; }
    if (window.navigator.userAgent.includes("X11")) { system = "UNIX"; }
    if (window.navigator.userAgent.includes("Linux")) { system = "Linux"; }

    console.log(await fetch("https://einsteins2.webplace.lv/student-api/set-chapter-progress", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,lv-LV;q=0.8,lv;q=0.7,en-GB;q=0.6",
            "authorization": `Bearer ${window.sessionStorage.bearer_token}`,
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `\"${system}\"`,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "https://student.einsteins.lv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"chapter\":\"${code}\",\"second\":${duration}}`,
        "method": "POST",
    }));

    console.log(await fetch("https://einsteins2.webplace.lv/student-api/set-passed-chapter", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,lv-LV;q=0.8,lv;q=0.7,en-GB;q=0.6",
            "authorization": `Bearer ${window.sessionStorage.bearer_token}`,
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `\"${system}\"`,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "https://student.einsteins.lv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"chapter\":\"${code}\"}`,
        "method": "POST",
    }));

    location.reload();
}

(async () => {
    window.skip_lesson = skip;
    var next_button = await waitElement(() => document.querySelector(".chapter-navigation.disabled.right"));
    var video_player = await waitElement(() => document.querySelector(".lesson-player video"));

    next_button.classList.remove("disabled");
    next_button.querySelector("b").innerText = "Marķēt kā noskatītu";
    next_button.onclick = skip;
})();
