// ==UserScript==
// @name         Salidzini Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove items that are not available
// @author       Serbinskis
// @match        https://www.salidzini.lv/cena?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salidzini.lv
// @grant        none
// ==/UserScript==

(function() {
    var exclude = ["maxtrade.lv", "iizii.eu", "aircomnet.lv", "digibox.lv", "maxtrade.lv", "2clix.eu", "legit.lv", "clix.lv", "1clix.eu", "dfi.lv"];
    document.querySelectorAll(".item_stock span").forEach(e => e.parentNode.parentNode.parentNode.parentNode.remove());
    Array.from(document.querySelectorAll(".item_shop_name")).filter(e => exclude.includes(e.innerText)).forEach(e => e.parentElement.parentElement.parentElement.parentElement.parentElement.remove());
})();
