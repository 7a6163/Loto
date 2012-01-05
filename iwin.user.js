// ==UserScript==
// @name            iWin
// @namespace       iWin
// @description     修正官方網站不想解決的問題
// @include         https://bet.i-win.com.tw/SBP2Web/*
// @include         http://www.i-win.com.tw/*
// @auther          Zac
// @version         0.6.1
// ==/UserScript==

function main() {
    //複寫原有的顯示賠率方法
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
    //複寫原有的顯示全部賠率
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

    //預計要修正賽事結果
    window.bodyLoad(){
        document.getElementById("middlearea").location.href = "/SBP2Web/matchquery.do?method=matchResult&sportsId=1";
    }
}

//解決Chrome 不支援 unsafewindow
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

//增加Firefox 支援 正確比分
var middlearea = document.getElementById("middlearea");
middlearea.onload = function(){
    //高度修正
    var iframeHeight = middlearea.contentDocument.documentElement.scrollHeight;
    middlearea.style.height = iframeHeight > 480 ? iframeHeight + 100 + "px" : "480px";

    var imgCheck = middlearea.contentDocument.getElementsByName("betCheck_CRS_img");
    for (var i=0; i<imgCheck.length; i++) {
        var strCheck = imgCheck[i].getAttribute("onclick");
        var pattermCheck = /betCheck_CRS_\d+/;
        var regexped = '"'+ strCheck.match(pattermCheck)[0]+'"';
        var replaced = strCheck.replace(pattermCheck,regexped);
        imgCheck[i].setAttribute("onclick",replaced);
    }
}


//修正熱門賽事的顯示
var hotmatchid = document.getElementById("hotmatchid");
hotmatchid.onload = function() {
    var hotHeight =  hotmatchid.contentDocument.documentElement.scrollHeight;
    hotmatchid.style.height = hotHeight > 365 ? hotHeight + 50 + "px" : "365px";
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

