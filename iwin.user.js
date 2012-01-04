// ==UserScript==
// @name            iWin
// @namespace       iWin
// @description     修正官方網站不想解決的問題
// @include         https://bet.i-win.com.tw/SBP2Web/*
// @auther          Zac
// @version         0.4
// ==/UserScript==

function main() {
    window.oddsChangeDisplay = function(gameType ,matchID) {
        var trObj=document.getElementById("odds_display_"+gameType+"_"+matchID);
        if (trObj.style.display == "none"){
            setOddsOpen(gameType ,matchID);
            parent.document.getElementById('middlearea').style.height = document.documentElement.scrollHeight + 80 + "px";
        } else {
            setOddsClose(gameType ,matchID);
            if (document.body.scrollHeight < 440){
                parent.document.getElementById('middlearea').style.height = "460px";
            } else {
                parent.document.getElementById('middlearea').style.height =document.documentElement.scrollHeight + 20 + "px";
            }
        }
    }

    window.oddsChangeAll = function() {
        var allImgObj = document.getElementById('btn_displayodds');
        var openCheck_cnfArray = document.getElementsByName('openCheck_cnf');
        var openCheck_uncnfArray = document.getElementsByName('openCheck_uncnf');
        //全部展開
        if ( allImgObj.src.indexOf("img/display_allodds.gif")>-1 ){
            for (i=0;i<openCheck_cnfArray.length;i++){
                matchID = openCheck_cnfArray[i].value;
                setOddsOpen('cnf' ,matchID);
            }
            for (i=0;i<openCheck_uncnfArray.length;i++){
                matchID = openCheck_uncnfArray[i].value;
                setOddsOpen('uncnf' ,matchID);
            }
            parent.document.getElementById('middlearea').style.height = document.documentElement.scrollHeight + 20 + "px";
            allImgObj.src = "img/close_allodds.gif";
        }else {
            //全部關閉
            for (i=0;i<openCheck_cnfArray.length;i++){
                matchID = openCheck_cnfArray[i].value;
                setOddsClose('cnf' ,matchID);
            }
            for (i=0;i<openCheck_uncnfArray.length;i++){
                matchID = openCheck_uncnfArray[i].value;
                setOddsClose('uncnf' ,matchID);
            }
            if (document.body.scrollHeight < 440){
                parent.document.getElementById('middlearea').style.height = "460px";
            }else {
                parent.document.getElementById('middlearea').style.height = document.documentElement.scrollHeight + 20 + "px";
            }
            allImgObj.src = "img/display_allodds.gif";
        } 
    }
}
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

var middlearea = document.getElementById("middlearea");
middlearea.onload = function(){
    var imgCheck = middlearea.contentDocument.getElementsByName("betCheck_CRS_img");
    //console.log(imgCheck.length);
    for (var i=0; i<imgCheck.length; i++) {
        var strCheck = imgCheck[i].getAttribute("onclick");
        //console.log(strCheck);
        var pattermCheck = /betCheck_CRS_\d+/;
        var regexped = '"'+ strCheck.match(pattermCheck)[0]+'"';
        //console.log('"'+ strCheck.match(regepCheck)[0]+'"');
        var replaced = strCheck.replace(pattermCheck,regexped);
        //console.log(imgCheck[i].getAttribute.replace(/betCheck_CRS_\d+/,\"+ regepCheck +\"));
        //console.log(replaced);
        //imgCheck[i].removeAttribute("onclick");
        imgCheck[i].setAttribute("onclick",replaced);
    }
}


window.onload = function(){
    var iframeHeight = middlearea.contentDocument.documentElement.scrollHeight;
    middlearea.style.height = iframeHeight > 480 ? iframeHeight + 100 + "px" : "480px";
    var imgCheck = middlearea.contentDocument.getElementsByName("betCheck_CRS_img");
    for (var i=0; i<imgCheck.length; i++) {
        imgCheck[i].onclick = alert('XD');
    }
}

function setOddsOpen(gameType ,matchID){
    var imgObj = document.getElementById("oddsBtn_"+gameType+"_"+matchID);
    var trObj=document.getElementById("odds_display_"+gameType+"_"+matchID);
    var openCheck = document.getElementById("openCheck_"+gameType+"_"+matchID);
    if (imgObj != null && trObj != null ){
        trObj.style.display = "";
        imgObj.src = "img/icon_hide.gif";
        imgObj.alt = "點此收起";
        openCheck.checked=true;
    }
}

function setOddsClose(gameType ,matchID){
    var imgObj = document.getElementById("oddsBtn_"+gameType+"_"+matchID);
    var trObj=document.getElementById("odds_display_"+gameType+"_"+matchID);
    var openCheck = document.getElementById("openCheck_"+gameType+"_"+matchID);
    if (imgObj != null && trObj != null ){
        trObj.style.display = "none";
        imgObj.src = "img/icon_display.gif";
        imgObj.alt = "詳細賠率";
        openCheck.checked=false;
    }
} 

