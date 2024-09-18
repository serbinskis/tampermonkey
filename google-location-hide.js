// ==UserScript==
// @name         Google Location Hide
// @namespace    WobbyChip
// @version      0.1
// @description  Hide location when searching in google chrome
// @author       Serbinskis
// @include      http*://*google.*/search*
// @grant        none
// ==/UserScript==

try {
    document.getElementsByClassName("fbar b2hzT")[0].hidden = true;
} catch (e){};
