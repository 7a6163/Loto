// ==UserScript==
// @name            iWin
// @namespace       iWin
// @description     修正官方網站不想解決的問題
// @include         https://bet.i-win.com.tw/SBP2Web/*
// @include         http://www.i-win.com.tw/*
// @auther          Zac
// @version         0.9.8
// ==/UserScript==

function main() {
    //複寫原有的顯示賠率方法
    window.oddsChangeDisplay = function (gameType, matchID) {
    	'use strict';
        var trObj = document.getElementById("odds_display_" + gameType + "_" + matchID),
			middle = parent.document.getElementById('middlearea'),
			docElement = document.documentElement;
        if (trObj.style.display === "none") {
            setOddsOpen(gameType, matchID);
            middle.style.height = docElement.scrollHeight + 80 + "px";
        } else {
            setOddsClose(gameType, matchID);
            if (docElement.scrollHeight < 440) {
                middle.style.height = "460px";
            } else {
               middle.style.height = docElement.scrollHeight + 20 + "px";
            }
        }
    };
    
    //複寫原有的顯示全部賠率
    window.oddsChangeAll = function () {
        'use strict';
        var allImgObj = document.getElementById('btn_displayodds'),
			openCheck_cnfArray = document.getElementsByName('openCheck_cnf'), 
			openCheck_uncnfArray = document.getElementsByName('openCheck_uncnf'), 
			matchID, 
			i = 0,
			max,
			docElement = document.documentElement,
			middle = parent.document.getElementById('middlearea');

        //全部展開
        if (allImgObj.src.indexOf("img/display_allodds.gif") > -1) {
            for (i = 0, max = openCheck_cnfArray.length; i < max; i += 1) {
                matchID = openCheck_cnfArray[i].value;
                setOddsOpen('cnf', matchID);
            }
            for (i = 0, max = openCheck_uncnfArray.length; i < max; i += 1) {
                matchID = openCheck_uncnfArray[i].value;
                setOddsOpen('uncnf', matchID);
            }
            middle.style.height = docElement.scrollHeight + 20 + "px";
            allImgObj.src = "img/close_allodds.gif";
        } else {
            //全部關閉
            for (i = 0, max = openCheck_cnfArray.length; i < max; i += 1) {
                matchID = openCheck_cnfArray[i].value;
                setOddsClose('cnf', matchID);
            }
            for (i = 0, max = openCheck_uncnfArray.length; i < max; i += 1) {
                matchID = openCheck_uncnfArray[i].value;
                setOddsClose('uncnf', matchID);
            }
            if (docElement.scrollHeight < 440) {
                middle.style.height = "460px";
            } else {
                middle.style.height = docElement.scrollHeight + 20 + "px";
            }
            allImgObj.src = "img/display_allodds.gif";
        }
    };
    
    //以下是計算機修正
    window.showAllUpCalcDlg = function (matchNum,matchPoolID,combination,poolCode) {
	    if (poolCode === '') {
			poolCode = document.getElementById("poolCode").value; //ALL
		}
		
		var sportsCode = document.getElementById("sportCode").value; //FB
		var dlgUrl = "calculate.do?method=allupList&sportsCode=" + sportsCode + "&poolCode=" + poolCode + "&matchNum="
		+ matchNum + "&matchPoolID=" + matchPoolID + "&combination=" + combination;
		// if ( betDescribe ){
		// dlgUrl +="&betDescribe="+$('betDescribe_'+arguments[4]).innerHTML;
		// }
		var pos = "height=390,width=780,left=" + (screen.AvailWidth - 780) / 2 + ",top=" + (screen.AvailHeight - 390) / 2;
		var dlg = window.open(dlgUrl, "newtab", pos + ",status=yes,toolbar=no,menubar=no,location=no,resizable=no");
		//window.location = dlgUrl,null,pos + ",status=yes,toolbar=no,menubar=no,location=no,resizable=no";
		dlg.focus(); 
    };

    window.initFormulas = function () {
		var ajaxObj = {
			url:'calculate.do?method=ajaxFormulaList',
			method:'post',
			success:function(result,request){
				var formulas= Ext.util.JSON.decode(result.responseText);
				var selObj = document.getElementById("formula");
				selObj.options.length = 0;//清空数据
				for (var i = 0; i < formulas.length; i++) {
					var text = formulas[i]["formulaName"];
					var value = formulas[i]["formulaName"];
					var option = new Option(text, value);
					//alert(option.text);
					selObj.add(option, -1);
				}
			},
			failure:function(result,request){
				alert("ERROR:" + result.responseText);
			}
		}
		Ext.Ajax.request(ajaxObj);
	};

	window.calcOk = function() {
	 	  var formula = document.getElementById("formula").value;
	 	  var singleMoney = document.getElementById("singleMoney").value;
	 	  
	 	  if (document.getElementById("betNumber").value === "") {
				document.getElementById("betNumber").value 
					= document.getElementById("formula").value.substring(document.getElementById("formula").value.indexOf("x") + 1);
			}
	 	  var betNumber = document.getElementById("betNumber").value;
	 	  if(formula === ""){
	 	  	alert("必須選擇過關模式!");
	 	  	return;
	 	  }
	 	  if(singleMoney === "" || parseInt(singleMoney) === 0){
	 	  	alert("必須輸入每組合金額,並且必須大於0!");
	 	  	return;
	 	  }
	 	  //alert(singleMoney + " -- " +parseInt(singleMoney)%10);
	 	  //if(parseInt(singleMoney)<100 || (parseInt(singleMoney)%10)!= 0 || parseInt(singleMoney)>100000){
	 	  //if((parseInt(singleMoney)%10)!= 0){
	 	  
	 	  if((parseInt(singleMoney) % 10) != 0
	 	  		|| (formula.substring(formula.indexOf("x") + 1) * singleMoney < 100)
	 	  		|| (formula.substring(formula.indexOf("x") + 1) * singleMoney > 100000)){
	 	    alert("每組合金額需為10的倍數，且總投注金額必須大於100，小於10萬");
	 	  	tenInteger(document.getElementById("singleMoney"));
	 	    return;
	 	  }
	 	  var ajaxObj = {
	 	   	   url:'calculate.do?method=ajaxAllUpCalc',
	 	   	   params:{formula:formula,singleMoney:singleMoney,betNumber:betNumber},
	 	   	   method:'post',
	 	   	   success:function(result,request){
	 	   	   	  var calcRes= Ext.util.JSON.decode(result.responseText);
	 	   	   	  if (typeof(calcRes)=="string"&&calcRes.indexOf("error:")!=-1){
	 	   	   	  	alert("ERROR:"+calcRes.substring(calcRes.indexOf(":")+1));
	 	   	   	  	return;
	 	   	   	  }
	 	   	   	  setCalcResValue(calcRes.totalBetNumber,calcRes.singleBetMoney,calcRes.totalBetMoney,
	 	   	   	                  calcRes.winBetNumber,calcRes.winBetMoney,calcRes.payoffMoney);
	 	   	   },
	 	   	   failure:function(result,request){
	 	   	   	alert("ERROR:" + result.responseText);
	 	   	  }
	 	  };
	 	  Ext.Ajax.request(ajaxObj);
	 };
	 
	window.setCalcResValue = function (totalBetNumber,singleBetMoney,totalBetMoney,winBetNumber,winBetMoney,payoffMoney) {
		document.getElementById("td_totalBetNumber").innerHTML=totalBetNumber;
		document.getElementById("td_singleBetMoney").innerHTML='NT$' + convert1000(singleBetMoney);
		document.getElementById("td_totalBetMoney").innerHTML='NT$' + convert1000(totalBetMoney);
		document.getElementById("td_winBetNumber").innerHTML= winBetNumber;
		document.getElementById("td_winBetMoney").innerHTML='NT$' + convert1000(winBetMoney);
		document.getElementById("td_payoffMoney").innerHTML='NT$' + convert1000(payoffMoney);
	};
	 
	window.convert1000 = function (inValue) {
		var value = "" + inValue;
		if(value.length <= 3){
			return value;
		}
		var len = value.length
		var valueArr = [];
		var result = "";
		for(var i=1; len-(3 * i) > 0; i++){
	  		valueArr[i-1] = value.substring(value.length - 3);
	  		value = value.substring(0, value.length - 3);
	  		if(value.length <= 3) {
				valueArr[i] = value;
				break;
			}
		}
		for(var i = valueArr.length - 1; i >= 0; i--){
			result += valueArr[i];
			if(i != 0) {
		      	result += ",";
			}
		}
		return result;
	};

	window.successChecked = function (itemid,checked) {
		var ajaxObj = {
	 	   	   url:'calculate.do?method=ajaxAllUpSuccessChanged',
	 	   	   params:{itemid:itemid,checked:checked},
	 	   	   method:'post',
	 	   	   success:function(result,request){
	 	   	   	  var success= Ext.util.JSON.decode(result.responseText);
	 	   	   },
	 	   	   failure:function(result,request){
	 	   	   	  alert("ERROR:" + result.responseText);
	 	   	  }
	 	  };
	 	  Ext.Ajax.request(ajaxObj);
	};
	
	window.changeBetNumber = function (formula) {
	 	document.getElementById("betNumber").value = formula.substring(formula.indexOf("x") + 1);
	 	//var matchBet = formula.substring(formula.indexOf("x")+1);
	 	//document.getElementById("singleMoeny").value = formatMoney(100);
	 	var singleMoney = document.getElementById("singleMoney").value;
	 	var betNumber = document.getElementById("betNumber").value;
	 	if(singleMoney === "" ) {
	 	  	alert("必須輸入每組合金額,並且必須大於0!");
	 	  	return;
	 	  }
	 	  //alert(singleMoney + " -- " +parseInt(singleMoney)%10);
	 	  if((parseInt(singleMoney) % 10) !== 0
	 	  		|| (formula.substring(formula.indexOf("x")+1) * singleMoney < 100)
	 	  		|| (formula.substring(formula.indexOf("x")+1) * singleMoney > 100000)){
	 	    alert("每組合金額需為10的倍數，且總投注金額必須大於100，小於10萬");
	 	  	tenInteger(document.getElementById("singleMoney"));
	 	    return;
	 	  }
	 	var ajaxObj = {
	 	   	   url:'calculate.do?method=ajaxAllUpCalc',
	 	   	   params:{formula:formula,singleMoney:singleMoney,betNumber:betNumber},
	 	   	   method:'post',
	 	   	   success:function(result,request){
	 	   	   	  var calcRes= Ext.util.JSON.decode(result.responseText);
	 	   	   	  if (typeof(calcRes) === "string" &&calcRes.indexOf("error:") !== -1){
	 	   	   	  	alert("ERROR:" + calcRes.substring(calcRes.indexOf(":") + 1));
	 	   	   	  	return;
	 	   	   	  }
	 	   	   	  setCalcResValue(calcRes.totalBetNumber,calcRes.singleBetMoney,calcRes.totalBetMoney,
	 	   	   	                  calcRes.winBetNumber,calcRes.winBetMoney,calcRes.payoffMoney);
	 	   	   },
	 	   	   failure:function(result,request){
	 	   	   	alert("ERROR:" + result.responseText);
	 	   	  }
	 	  };
	 	  Ext.Ajax.request(ajaxObj);
	 };
	 
	window.deleteItem = function (rowObj, itemid) {
		console.log(rowObj);
		var ajaxObj = {
				url:'calculate.do?method=ajaxDeleteItem',
				params:{itemid:itemid},
				method:'post',
	 	   	   success:function(result,request){
	 	   	   	  var success = Ext.util.JSON.decode(result.responseText);
	 	   	   	  if(success) {
	 	   	   	     var table = document.getElementById("betingTable");
	 	   	   	     table.children[0].removeChild(rowObj);
	 	   	   	     initFormulas();
	 	   	   	  }
	 	   	   },
	 	   	   failure:function(result,request){
	 	   	   	  alert("ERROR:" + result.responseText);
	 	   	  }
	 	  };
	 	  if(window.confirm("您確認要刪除此投注項嗎?")) {
	 	     Ext.Ajax.request(ajaxObj);
	 	  }
	 };
	
	//以下是賽事結果修正
	window.bodyLoad = function () {
		var parameter = location.search,
			patten = /sportsId=\d{1}/gi,
			regexSport = patten.exec(parameter)[0],
			sportId;
			
		patten = /\d{1}/;
		sportId = patten.exec(regexSport)[0];
    	
    	document.getElementById("middlearea").src = "/SBP2Web/matchquery.do?method=matchResult&sportsId=" + sportId;
    	window.focus();
	};

	window.changeMiddlePage = function (url, title1, title2) {
		if(url !== "") {
			window.location = url;
		} else {
			document.getElementById("middlearea").src = "";
		}
	};

	window.changeSportsPage = function(sportsId, url, title1, title2) { 
		if(sportsId === 3){
			window.location = "http://sd.i-win.com.tw/";
		} else {
			if(url !== ""){
				window.location = url;
			} else {
				document.getElementById("middlearea").src = "";
			}
		}
	};

	window.changeLink = function (menu) {
		var bsLink = document.getElementById("bsLink");
		var bkLink = document.getElementById("bkLink");
		var fbLink = document.getElementById("fbLink");
		
		if(bsLink !== null) {
		var idxbs = bsLink.href.indexOf("menu=");
		//alert(bsLink.href);
			bsLink.href = bsLink.href.substring(0,idxbs+5)+menu;
		//alert(bsLink.href);
		}
		if(bkLink !== null) {
		var idxbk = bkLink.href.indexOf("menu=");
		//alert(bkLink.href);
		bkLink.href = bkLink.href.substring(0,idxbk+5)+menu;
		//alert(bkLink.href);
		}
		if(fbLink !== null) {
		var idxfb = fbLink.href.indexOf("menu=");
		//alert(fbLink.href);
		fbLink.href = fbLink.href.substring(0,idxfb+5)+menu;
		//alert(fbLink.href);
		}
	};
 }

(function() {
	//解決Chrome 不支援 unsafewindow
	var script = document.createElement('script');
	script.appendChild(document.createTextNode('(' + main + ')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
	
	//增加Firefox 支援 正確比分
	var middlearea = document.getElementById("middlearea");
	middlearea.onload = function () {
	    'use strict';
	    var iframeHeight,
			imgCheck,
			i = 0,
			strCheck,
			pattermCheck,
			regexped, 
			replaced;
			
	    //修正高度
	    iframeHeight = middlearea.contentDocument.documentElement.scrollHeight;
	    middlearea.style.height = iframeHeight > 480 ? iframeHeight + 100 + "px" : "480px";
	
	    imgCheck = middlearea.contentDocument.getElementsByName("betCheck_CRS_img");
	    for (i = 0; i < imgCheck.length; i += 1) {
	        strCheck = imgCheck[i].getAttribute("onclick");
	        pattermCheck = /betCheck_CRS_\d+/;
	        regexped = '"' + strCheck.match(pattermCheck)[0] + '"';
	        replaced = strCheck.replace(pattermCheck, regexped);
	        imgCheck[i].setAttribute("onclick", replaced);
	    }
	};
	
	//修正熱門賽事的顯示
	var hotmatchid = document.getElementById("hotmatchid");
	hotmatchid.onload = function () {
	    'use strict';
	    var hotHeight =  hotmatchid.contentDocument.documentElement.scrollHeight;
	    hotmatchid.style.height = hotHeight > 365 ? hotHeight + 50 + "px" : "365px";
	};
})();

function setOddsOpen(gameType, matchID) {
    'use strict';
    var imgObj = document.getElementById("oddsBtn_" + gameType + "_" + matchID),
	    trObj = document.getElementById("odds_display_" + gameType + "_" + matchID),
	    openCheck = document.getElementById("openCheck_" + gameType + "_" + matchID);
    if (imgObj !== null && trObj !== null) {
        trObj.style.display = "";
        imgObj.src = "img/icon_hide.gif";
        imgObj.alt = "點此收起";
        openCheck.checked = true;
    }
}

function setOddsClose(gameType, matchID) {
    'use strict';
    var imgObj = document.getElementById("oddsBtn_" + gameType + "_" + matchID),
	    trObj = document.getElementById("odds_display_" + gameType + "_" + matchID),
	    openCheck = document.getElementById("openCheck_" + gameType + "_" + matchID);
    if (imgObj !== null && trObj !== null) {
        trObj.style.display = "none";
        imgObj.src = "img/icon_display.gif";
        imgObj.alt = "詳細賠率";
        openCheck.checked = false;
    }
}
