// ==UserScript==
// @name         CSDD Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect and compare answers
// @author       WobbyChip
// @match        https://csnt2.csdd.lv/*
// @require      http://pajhome.org.uk/crypt/md5/2.2/md5-min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdd.lv
// @grant        none
// ==/UserScript==

(async function() {
    if ($("#52")[0]) { return; }
    if (!$(".text")[0]) { return; }

    var url = "https://api.github.com/repos/WobbyChip/Tampermonkey/git/blobs/48ca91b77d0752f40a12468b469c71e9efbbe494";
    var content = b64DecodeUnicode(JSON.parse((await LoadGithub(url))).content);
    var category = JSON.parse(content.trim().replaceAll("\\\\", "\\"));

    for (const [key, value] of Object.entries(category)) {
        localStorage.setItem(key, value);
    }

    function b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }

    async function LoadGithub(url) {
        return await new Promise(resolve => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.send();
        });
    }

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
