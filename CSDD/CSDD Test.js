// ==UserScript==
// @name         CSDD Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect and compare answers
// @author       WobbyChip
// @match        https://csnt2.csdd.lv/*
// @require      http://pajhome.org.uk/crypt/md5/2.2/md5-min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdd.lv
// @grant        GM_xmlhttpRequest
// ==/UserScript==

async function get(url) {
    return await new Promise(resolve => {
        GM_xmlhttpRequest ({ method: "GET", url: url, onload: resolve });
    });
}

(async function() {
    if ($(".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close")[0]) {
        $(".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close")[0].click();
    }

    if ($("#52")[0]) {
        var url = "https://raw.githubusercontent.com/WobbyChip/Tampermonkey/master/CSDD/B%20Category.txt";
        var category = JSON.parse((await get(url)).responseText.replaceAll("\\\\", "\\"));

        for (const [key, value] of Object.entries(category)) {
            localStorage.setItem(key, value);
        }

        return;
    }

    if (!$(".text")[0]) { return; }

    function addButton(text, id, callback) {
        var input = document.createElement("input");
        input.className = "button";
        input.id = id;
        input.value = text;
        input.addEventListener("click", callback);
        $("fieldset")[0].appendChild(input);
    }

    function loadQuestion(question) {
       var answers = question.answers.map(a => a.answer).toString();
       var key = hex_md5(question.media + question.question + answers);
       var item = localStorage.getItem(key);
       if (item) { console.log(JSON.parse(item)); }
       return item ? JSON.parse(item) : null;
    }

    function saveQuestion(question) {
       var answers = question.answers.map(a => a.answer).toString();
       var key = hex_md5(question.media + question.question + answers);
       localStorage.setItem(key, JSON.stringify(question));
       console.log("Saved question.");
       console.log(question);
       console.log(localStorage.length);
    }

    var question = {
        media: $(".content-container a")[0]?.href || $(".content-container source")[0]?.src,
        question: $(".text")[0].textContent.replace($(".text div")[0]?.textContent, "").trim(),
        answers: Array.from($(".block-label")).reduce((a, e) => ([...a, {
            answer: e.htmlFor,
            correct: e.classList.contains("pareizi"),
            text: e.innerText.trim(),
        }]), []),
    }

    question.answers = question.answers.sort((a, b) => ('' + a.answer).localeCompare(b.answer));
    var segment = location.href.split("/").pop();

    if (segment == "parskats") {
        saveQuestion(question);
    } else {
        var isStart = $(".csn-question")[0].textContent.includes("/3");
        var isTest = $(".csn-time")[0].getAttribute("val") ? true : false;

        if (isStart && !isTest) {
            $(".block-label[for='atbilde-2264']")[0]?.click();
            $(".block-label[for='atbilde-2272']")[0]?.click();
            $(".block-label[for='atbilde-37322']")[0]?.click();
            $(".button[type='submit']")[0].click();
        }

        question = loadQuestion(question);
        if (!question) { return; }

        var answer = question.answers.filter(e => e.correct)[0]?.answer;
        if (!answer) { return; }

        if (isTest) { addButton("Pārbaudīt", "parbaudit", () => {
            $(`.block-label[for='${answer}']`)[0].click();
        }); }

        if (isTest) { addButton("Izlaist", "izlaist", () => {
            $(`.block-label[for='${answer}']`)[0]?.click();
            $(".button[type='submit']")[0].click();
        }); }
    }
})();
