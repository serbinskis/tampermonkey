// ==UserScript==
// @name         CSDD Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect and compare answers
// @author       Serbinskis
// @match        https://csnt2.csdd.lv/*
// @require      http://pajhome.org.uk/crypt/md5/2.2/md5-min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdd.lv
// @grant        GM_xmlhttpRequest
// @grant        none
// @require      https://www.example.com/some/js/GM_fetch.js
// ==/UserScript==

async function loadCategory(cat, url) {
    var category = JSON.parse((await (await fetch(url)).text()).replaceAll("\\\\", "\\"));
    sessionStorage.setItem(`category_${cat}`, JSON.stringify(category));
    for (const [key, value] of Object.entries(category)) { localStorage.setItem(key, value); }
}

async function loadCategories() {
    await loadCategory("b", "https://raw.githubusercontent.com/serbinskis/tampermonkey/refs/heads/master/CSDD/categories/b_category.json");
}

function addButton(text, id, callback) {
    var input = document.createElement("input");
    input.className = "button csdd_test";
    input.type = "button";
    input.id = id;
    input.value = text;
    input.addEventListener("click", callback);
    $("fieldset")[0].appendChild(input);
}

function loadQuestion(question) {
    var answers = question.answers.map(e => e.answer).toString();
    var key = hex_md5(question.media + question.question + answers);
    var item = localStorage.getItem(key);
    if (item) { console.log(JSON.parse(item)); }
    return item ? JSON.parse(item) : null;
}

function saveQuestion(question) {
    var answers = question.answers.map(e => e.answer).toString();
    var key = hex_md5(question.media + question.question + answers);
    localStorage.setItem(key, JSON.stringify(question));
    console.log("Saved question.");
    console.log(question);
    console.log(localStorage.length);
}

function prepareQuestion(question) {
    $('video').remove();
    $('.block-label input').attr('checked', null);
    $('.block-label').css('border-color', '');

    if (question.media.includes('.mp4')) {
        var video = document.createElement("video");
        video.src = question.media;
        video.controls = true;
        $('.content-container')[0].prepend(video);
    } else {
        var image = `background-image:url('${question.media}'); background-size: contain; background-repeat: no-repeat; background-color: #f2f2f2; background-position: top;`;
        $('.content-container')[0].setAttribute('style', image);
        $('.content-container')[0].href = question.media;
    }

    $(".text")[0].textContent = question.question;
    var dummy = $('.block-label').clone()[0];
    $('.block-label').remove();

    for (const answer of question.answers.sort(() => 0.5 - Math.random())) {
        var answer_el = $(dummy).clone()[0];
        answer_el.setAttribute('for', answer.answer);
        answer_el.childNodes[1].id = answer.answer;
        answer_el.childNodes[1].setAttribute('value', answer.answer.split('-').pop());
        answer_el.childNodes[2].textContent = answer.text;
        $('#atb > fieldset')[0].prepend(answer_el);
    }
}

async function startCategoryTest(cat, imagesFirst, bContinue) {
    if (!sessionStorage[`category_${cat}`]) { return alert('Failed to load data from session storage.'); }
    window.addTime = () => {};
    window.secondsTimeSpanToHMS = () => window.secondsTimeSpanToHMS_new(0);

    window.secondsTimeSpanToHMS_new = (s) => {
        var h = Math.floor(s / 3600);
        var m = Math.floor((s % 3600) /60);
        s = s % 60;

        return (h < 10 ? '0' + h : h) + ":" +
            (m < 10 ? '0' + m : m) + ":" +
            (s < 10 ? '0' + s : s);
    }

    $('#header div.csn-time span').html(window.secondsTimeSpanToHMS_new(0));
    $('#header div.csn-time').attr('val', bContinue ? localStorage[`time_${cat}`] : 2);
    //$('#header div.csn-time span').html('∞');

    var timer = setInterval(() => {
		var ttm = parseInt($('#header div.csn-time').attr('val'));
		$('#header div.csn-time span').html(window.secondsTimeSpanToHMS_new(ttm));
		$('#header div.csn-time').attr('val', ttm+1);
        localStorage[`time_${cat}`] = ttm+1;
    }, 1000);

    var category = JSON.parse(sessionStorage.getItem(`category_${cat}`));
    var questions = Object.entries(category).sort(() => 0.5 - Math.random());

    if (bContinue) { questions = JSON.parse(localStorage[`questions_${cat}`]); }
    if (!bContinue) { localStorage[`questions_${cat}`] = JSON.stringify(questions); }

    var index = bContinue ? parseInt(localStorage[`index_${cat}`])-2 : -1;
    var cur_question = null;

    $(".csdd_test").remove();
    $('.controls-group').remove();

    addButton("Pārbaudīt", "parbaudit", () => {
        console.log(cur_question);
        var answer = cur_question.answers.filter(e => e.correct)[0]?.answer;
        console.log(answer);
        $(`.block-label[for='${answer}']`)[0].click();
        $(`.block-label[for='${answer}']`).css('border-color', 'green');
        $(`.block-label[for!='${answer}']`).css('border-color', 'red');
    });

    addButton("Izlaist", "izlaist", () => {
        if (index+1 >= questions.length) { return clearInterval(timer); }
        cur_question = JSON.parse(questions[index+++1][1]);
        localStorage.setItem(`index_${cat}`, index+1);
        document.querySelector('.csn-question').childNodes[1].textContent = ` ${index+1}/${questions.length}`;
        prepareQuestion(cur_question);
    });

    addButton("Atpakaļ", "atpakal", () => {
        if (index-1 < 0) { return; }
        cur_question = JSON.parse(questions[index---1][1]);
        localStorage.setItem(`index_${cat}`, index+1);
        document.querySelector('.csn-question').childNodes[1].textContent = ` ${index+1}/${questions.length}`;
        prepareQuestion(cur_question);
    });

    $(`#izlaist`).click();
}

(async function() {
    if ($(".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close")[0]) {
        $(".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close")[0].click();
    }

    if ($("#52")[0]) { return await loadCategories(); }
    if (!$(".text")[0]) { return; }

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
        var isFirst = $(".csn-question")[0].textContent.includes("1/");
        var isTest = $(".csn-time")[0]?.getAttribute("val") ? true : false;

        if (isStart && !isTest) {
            $(".block-label[for='atbilde-2264']")[0]?.click();
            $(".block-label[for='atbilde-2272']")[0]?.click();
            $(".block-label[for='atbilde-51986']")[0]?.click();
            $(".button[type='submit']")[0].click();
        }

        if (isFirst && isTest) {
            addButton("SĀKT MEGA TESTU", "category-test", () => startCategoryTest('b', true, false));
            if (localStorage.index_b) { addButton("TURPINĀT MEGA TESTU", "category-test", () => startCategoryTest('b', true, true)); }
        }

        question = loadQuestion(question);
        if (!question) { return; }

        var answer = question.answers.filter(e => e.correct)[0]?.answer;
        if (!answer) { return; }

        if (isTest) {
            addButton("Pārbaudīt", "parbaudit", () => {
                $(`.block-label[for='${answer}']`)[0].click();
            });

            addButton("Izlaist", "izlaist", () => {
                $(`.block-label[for='${answer}']`)[0]?.click();
                $(".button[type='submit']")[0].click();
            });
        }
    }
})();
