// ==UserScript==
// @name            iWin
// @namespace       iWin
// @description     修正官方網站不想解決的問題
// @include         http://www.i-win.com.tw/*
// @version         0.1
// ==/UserScript==

var middlearea = document.getElementById("middlearea");
var height = middlearea.contentDocument.documentElement.scrollHeight;
window.onload = function(){
    middlearea.style.height = height > 480 ? height + 20 + "px" : 480;
}
