// ==UserScript==
// @name            iWin
// @namespace       iWin
// @description     修正官方網站不想解決的問題
// @include         http://www.i-win.com.tw/*
// @version         0.1
// ==/UserScript==

var middlearea = document.getElementById("middlearea"); 
window.onload = function(){
        middlearea.style.height = middlearea.contentDocument.documentElement.scrollHeight + 20 + "px";
}
