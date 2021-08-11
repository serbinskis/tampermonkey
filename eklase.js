// ==UserScript==
// @name         e-klase.lv
// @namespace    WobbyChip
// @version      0.1
// @description  Autologin in e-klase.lv
// @author       WobbyChip
// @include      https://*e-klase.lv/*
// @grant        none
// ==/UserScript==

var inputs = document.getElementsByTagName("input");

for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].name == "UserName") inputs[i].value = "";
    if (inputs[i].name == "Password") inputs[i].value = "";
};

try {
    document.getElementsByClassName("btn btn-default")[0].click();
} catch (e){};

try {
    document.getElementsByClassName("ButtonDefault")[0].click();
} catch (e){};

try {
    document.getElementsByClassName("widget-notification reset-news-notifications #comercial")[0].click();
} catch (e){};

try {
    document.getElementsByClassName("home-diary-link")[0].click();
} catch (e){};

try {
    document.getElementsByClassName("UserProfileSelector_SelectMarker")[0].click();
} catch (e){};

try {
    document.getElementsByClassName("modal-options-button btn-switch-student")[0].click();
} catch (e){};