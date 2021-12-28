// ==UserScript==
// @name         YouTube - Remove watched video
// @namespace    WobbyChip
// @version      0.1
// @description  Remove watched video
// @author       WobbyChip
// @include      https://www.youtube.com/
// @grant        none
// ==/UserScript==

function isElementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
    );
}

setInterval(async function () {
    var progress = document.querySelectorAll("#progress");

    for (var i = 0; i < progress.length; i++) {
        if (isElementInViewport(progress[i]) && (progress[i].style.cssText == "width: 100%;")) {
            progress[i].parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("button#button").click();
            await new Promise(resolve => setTimeout(resolve, 100));
            document.querySelector("tp-yt-paper-listbox").children[3].click();
        }
    }
}, 500);
