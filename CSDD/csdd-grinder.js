// ==UserScript==
// @name         CSDD Grinder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Loop over questions and let the csdd test remember them
// @author       Serbinskis
// @match        https://csnt2.csdd.lv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdd.lv
// @grant        none
// ==/UserScript==

(async function() {
    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    var segment = location.href.split("/").pop();
    if (segment == "parskats") {
        await new Promise(resolve => setTimeout(resolve, 10));
        var isNext = $(".next")[0];
        if (isNext) { $(".next a")[0].click(); }
        if (!isNext) { $("a[href$='new/']")[0].click(); }
    } else {
        await new Promise(resolve => setTimeout(resolve, 10));
        $("#52")[0]?.click();
        $("a[href$='parskats']")[0]?.click();

        var isEnd = $("#infodiv")[0] ? true : false;
        var isAllCorrect = $("a[href$='parskats']")[0] ? false : true;

        if (isEnd && !isAllCorrect) {
            $("a[href$='parskats']")[0].click();
        } else if (isEnd && isAllCorrect) {
            $("a[href$='new/']")[0].click();
        }

        var isTest = $(".csn-time")[0]?.getAttribute("val") ? true : false;
        if (!isTest) { return; }

        var selected = randomInt($(".block-label").length);
        $(".block-label")[selected].click();
        $("#izlaist")[0] ? $("#izlaist")[0].click() : $(".button[type='submit']")[0].click();
    }
})();
