// ==UserScript==
// @name            iWin
// @namespace       iWin
// @description     修正官方網站不想解決的問題
// @include         https://bet.i-win.com.tw/SBP2Web/*
// @version         0.1
// ==/UserScript==

var middlearea = document.getElementById("middlearea");
window.onload = function(){
    var height = middlearea.contentDocument.documentElement.scrollHeight;
    middlearea.style.height = height > 480 ? height + 20 + "px" : 480;
}
