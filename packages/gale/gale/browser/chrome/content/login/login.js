/**
 * Copyright (C) by B-Star.
 *
 * Do not use, copy, modify, and distribute this software and its documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 */          

var LoginURL      = "http://192.168.1.2:7022/gateway/action/00000/000001/";
var homeURL       = "http://192.168.1.2:7022/gateway/action/00001/000001/";
const LOGINUSER     = "?user_name=";
const LOGINPASSWD   = "&password=";
const LOGINMAC      = "&mac=00000000";


const LOGINOK             = "00";
const LOGINUSERNOEXIST    = "01";
const LOGINPASSWDERROR    = "02";
const LOGINMACERROR       = "03";
const LOGINUSERPAUSED     = "04";
const LOGINUSERDEACTIVATE = "05";
const LOGINUSERNOENOUGHFEE= "06";
const LOGINUSERSTOP       = "07";
const LOGINUSERNOFEESTOP  = "08";
const LOGINUSERCANCELED   = "09";
const LOGINUSERBLACKED    = "10";

const TIPMSGUSER       = "请输入用户名";
const TIPMSGPASSWD     = "请输入密码";
const TIPMSGWAITING    = "登录中，请等待...";
const TIPMSGWELCOME    = "欢迎使用炫视通，请登录。";

const TIPMSGLOGINNETFAIL   = "登录失败，请检查网络后重新登录。";

const TIPMSGUSERNOEXIST    = "登录失败，用户名不存在。";
const TIPMSGPASSWDERROR    = "登录失败，密码不符。";
const TIPMSGMACERROR       = "登录失败，MAC绑定验证错误。";
const TIPMSGUSERPAUSED     = "登录失败，您目前的用户状态处于暂停。";
const TIPMSGUSERDEACTIVATE = "登录失败，您目前的用户状态处于待激活。";
const TIPMSGUSERNOENOUGHFEE= "登录失败，您目前的用户状态处于欠费。";
const TIPMSGUSERSTOP       = "登录失败，您目前的用户状态处于停机。";
const TIPMSGUSERNOFEESTOP  = "登录失败，您目前的用户状态处于欠费停机。";
const TIPMSGUSERCANCELED   = "登录失败，您目前的用户状态处于已销户。";
const TIPMSGUSERBLACKED    = "登录失败，您目前的用户名已进入黑名单。";
const TIPMSGUNKOWN         = "登录失败，未知的错误代码。";

const TIPMSGLOGINSERVICEFAIL  = "登录失败，请检查服务后重新登录。";
const TIPMSGLOGINSERVERBUSY   = "服务忙，请稍后登录。";
const TIPMSGGETUSERFAIL   = "获取用户名失败。";
const TIPMSGGETCONFIGFAIL = "获取门户配置信息失败。";
const TIPMSGGETMACFAIL    = "获取MAC地址失败。";
const TIPMSGSAVEGALEFAIL  = "保存用户名失败。";
const TIPMSGGETPORTALFAIL = "获取入口信息失败，请重新登录。";
const TIPMSGSETPORTALFAIL = "保存入口信息失败，请重新登录。";
const TIPMSGPORTALVERFAIL = "入口信息中版本有误。";
const TIPMSGPORTVERERROR  = "不能找到版本适合的门户。";
const TIPMSGPORTLOCATIONFAIL = "入口地址信息有误。";

var TIPMSGINFOERR        = null;

const LOGINTILE          = "炫视通用户登录";
const USERWELCOME        = "尊敬的用户：";
const USERNAME           = "用户名";
const USERPASSWD         = "密    码";
const LOGINLBL           = "登    录";
const CANCELLBL          = "取    消";

const LOGINMAXTIME       = 30*1000;//0.5m
 

var usrinf    = new UserInfo(null, null);
var portstyle = new PortalStyle(null, null);
var ajaxObj   = null;
var homepath;
var menupath;
var bAutoLogin   = false;//whether auto login
var bInitInfoOk  = false;//get initialize information ok;

var LOGINERRINFOS       =[
[LOGINUSERNOEXIST, TIPMSGUSERNOEXIST],
[LOGINPASSWDERROR, TIPMSGPASSWDERROR],
[LOGINMACERROR, TIPMSGMACERROR],
[LOGINUSERPAUSED, TIPMSGUSERPAUSED],
[LOGINUSERDEACTIVATE, TIPMSGUSERDEACTIVATE],
[LOGINUSERNOENOUGHFEE, TIPMSGUSERNOENOUGHFEE],
[LOGINUSERSTOP, TIPMSGUSERSTOP],
[LOGINUSERNOFEESTOP, TIPMSGUSERNOFEESTOP],
[LOGINUSERCANCELED, TIPMSGUSERCANCELED],
[LOGINUSERBLACKED, TIPMSGUSERBLACKED]
];

/**
 * onComplete
 * 
 * Description:
 *  ajax oncomplete callback.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param  responseText response string.
 * @param  responseXml response dom document.
 * @return 
 */
Ajax.prototype.onComplete = function(responseText, responseXml)
{
    this.logining = false;
    /**check authorization passed*/
    if (!this.logined)
    {
        this.chkLoginResult();        
    }
    /**check get portal.xml successful*/
    else if (this.logined)
    {
        ;
    }
}

/**
 * onError
 * 
 * Description:
 *  ajax onErro callback.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param  status status string.
 * @param  statusText.
 * @return 
 */
Ajax.prototype.onError = function(status, statusText)
{
    if (!this.getPorted)
    {
        if (this.logining && this.aborted)
        {
            setTipMsg(TIPMSGLOGINSERVERBUSY);
        }
        else if (this.logined)
        {
            setTipMsg(TIPMSGGETPORTALFAIL);
        }
        else
        {
            if (status == -1)
            {
                setTipMsg(TIPMSGLOGINNETFAIL);
            }
            else
            {
                setTipMsg(TIPMSGLOGINSERVICEFAIL);
            }
        }
        showLoginInfo();   
    }
    this.logining = false;
}

/**
 * onAbort
 * 
 * Description:
 *  ajax onErro callback.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param  status status string.
 * @param  statusText.
 * @return 
 */
Ajax.prototype.onAbort = function()
{
    if (!this.getPorted)
    {
        if (this.logining && this.aborted)
        {
            setTipMsg(TIPMSGLOGINSERVERBUSY);
        }
        else if (this.logined)
        {
            setTipMsg(TIPMSGGETPORTALFAIL);
        }
        else
        {
            if (status == -1)
            {
                setTipMsg(TIPMSGLOGINNETFAIL);
            }
            else
            {
                setTipMsg(TIPMSGLOGINSERVICEFAIL);
            }
        }
        showLoginInfo();   
    }
    this.logining = false;
}

/**
 * chkLoginResult
 * 
 * Description:
 *  check the response result from server after login.
 *
 * History:
 *  2007.7.10      xszhong        Creation
 * 
 * @param.
 * @return 
 */
Ajax.prototype.chkLoginResult = function()
{ 
    if (this.XmlHttp.responseText == LOGINOK)
    {
        if (!this.firstLogin)
        {
            var xmlfile = getGaleFile();
        
            /**set User longin information*/
            var flag = setUserInfo(xmlfile, usrinf); 
            if (false) //Leo 2007-11-21 to use in read on fs //(!flag)           
            {
                setTipMsg(TIPMSGSAVEGALEFAIL);
                showLoginInfo();
                return;
            }
        }
        /*save user to Browser win and onLoginOK*/   
        var win = getBrowserWindow();
        if (win)
        {
            win.strUserID  = usrinf.user;
            if (win.onLoginOK)
            {
                win.onLoginOK();
            }
        }
    }
    /**authorization don't passed, should login again*/
    else
    {
        var err = -1;

        for(var i = 0; i < LOGINERRINFOS.length; i++)
        {
            if (this.XmlHttp.responseText == LOGINERRINFOS[i][0])
            {
               err = i;
               break; 
            }
        }
        if (err != -1)
        {
            setTipMsg(LOGINERRINFOS[err][1]);
        }
        else
        {
            setTipMsg(TIPMSGUNKOWN+' '+this.XmlHttp.responseText);
        }        
        showLoginInfo();
    }
}

/**
 * KeyUp
 * 
 * Description:
 *  key up handler.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param  evnt the fired evnt.
 * @return 
 */
function KeyUp(evnt) 
{               
    var usrElement  = document.forms[0].user;
    var passElement = document.forms[0].password;
    var btnLoginElement   = document.forms[0].btnLogin;
    var btnLoginImg   = document.getElementById("btnLoginPic");

    var btnCancelElement  = document.forms[0].btncancel;
    var btnCancelImg   = document.getElementById("btnCancelPic");

    var nKey = getKey(evnt);
    switch(nKey)
    {
        case GK_ENTER: /**13 enter*/
            if (evnt.target == usrElement)
            {
                passElement.focus();
            }
            else if (evnt.target == passElement 
                || evnt.target == btnLoginElement)
            {
                btnLoginElement.focus();
                usrLogin();
            }
            else if (evnt.target == btnCancelElement)
            {
                document.forms[0].user.value = usrinf.user;
                document.forms[0].password.value = usrinf.passwd;
                btnCancelImg.style.visibility = "hidden";
                usrElement.focus();
            }
            break;
        case GK_DOWN: /**down*/
            if (evnt.target == usrElement)
            {
                passElement.focus();
            }
            else if (evnt.target == passElement)
            {
                btnLoginElement.focus();
                btnLoginImg.style.visibility = "visible";
            } 
            else if (evnt.target == btnLoginElement)
            {
                btnLoginImg.style.visibility = "hidden";
                btnCancelElement.focus();
                btnCancelImg.style.visibility = "visible";
            }
            else if (evnt.target == btnCancelElement)
            {
                btnCancelImg.style.visibility = "hidden";
                usrElement.focus();
            }
            break;
        case GK_UP: /**up*/
            if (evnt.target == passElement)
            {
                usrElement.focus();
           } 
            else if (evnt.target == btnLoginElement)
            {
                btnLoginImg.style.visibility = "hidden";
                passElement.focus();
            }
            else if (evnt.target == btnCancelElement)
            {
                btnCancelImg.style.visibility = "hidden";
                btnLoginElement.focus();
                btnLoginImg.style.visibility = "visible";
            }
            break;

        case GK_LEFT: //left 
        case GK_RIGHT: /*right*/
            if (evnt.target == btnLoginElement)
            {
                btnLoginImg.style.visibility = "hidden";
                btnCancelElement.focus();
                btnCancelImg.style.visibility = "visible";
            }
            else if (evnt.target == btnCancelElement)
            {
                btnCancelImg.style.visibility = "hidden";
                btnLoginElement.focus();
                btnLoginImg.style.visibility = "visible";
            }
            break;

        case GK_CLEAR: /*key:*/ 
            if (evnt.target == usrElement)
            {
                usrElement.value = '';
            }
            else if (evnt.target == passElement)
            {
                passElement.value = '';
            }
            break;

        default :
                ;
     }
     return;
}

/**
 * login
 * 
 * Description:
 *  go to authoriztion.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param 
 * @return 
 */
function login()
{
    if (!bInitInfoOk)
    {
        setTipMsg(TIPMSGINFOERR);
        showLoginInfo();
        return
    }
    /**go to authorization*/
    if (!ajaxObj)
    {
        ajaxObj = new Ajax();
        ajaxObj.firstLogin = true;
    }
    ajaxObj.logined    = false;
    ajaxObj.getPorted  = false;
    var url = LoginURL + LOGINUSER + usrinf.user + LOGINPASSWD 
        + usrinf.passwd + LOGINMAC + usrinf.mac;
    ajaxObj.setParam("url", url);
    var img = document.getElementById('blackPic');
    img.style.visibility = 'visible';

    img = document.getElementById('backProgressPic');
    img.style.visibility = 'visible';

    var obj = document.getElementById('progress');
    obj.style.visibility = 'visible';
    setTipMsg(TIPMSGWAITING);
    ajaxObj.logining = true;
    ajaxObj.send(); 
    checkLoginTimeOut(); 
}

/**
 * getInitInfo()
 * 
 * Description:
 *  get configure initializtion information.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param 
 * @return 
 */
function getInitInfo()
{
    var win = getBrowserWindow();
    if (win && win.bAutoLogin)
    {
        bAutoLogin = win.bAutoLogin;
    }
    var xmlfile = getGaleFile();

    /**get ajax object*/
    if (!ajaxObj)
    {
        ajaxObj = new Ajax();
        ajaxObj.firstLogin = true;
    }
    /**get User longin information*/
    var flag = getUserInfo(xmlfile, usrinf);
    if (!flag)
    {
        setTipMsg(TIPMSGGETUSERFAIL);
        TIPMSGINFOERR = TIPMSGGETUSERFAIL;    

        showLoginInfo();
        return false;
    }
    document.forms[0].user.value     = usrinf.user;
    document.forms[0].password.value = usrinf.passwd;
    
    /**get User setup style configure information*/
    flag = getPortalStyle(xmlfile, portstyle);
    if (!flag)
    {
        TIPMSGINFOERR = TIPMSGGETCONFIGFAIL;    
        setTipMsg(TIPMSGGETCONFIGFAIL);
        showLoginInfo();
        return false;
    }

    /**get mac address*/
    var macAddr = getMac();
    if (macAddr == null)
    {
        TIPMSGINFOERR = TIPMSGGETMACFAIL;    

        setTipMsg(TIPMSGGETMACFAIL);
        showLoginInfo();
        return false;
    }
    else
    {
       
        usrinf.mac = macAddr.replace(/:/g, "");
    //    usrinf.mac = "000000000001";
    }
    return true;
}

/**
 * usrLogin()
 * 
 * Description:
 *  get configure initializtion information.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param 
 * @return 
 */
function usrLogin()
{
    usrinf.user   = document.forms[0].user.value;
    usrinf.passwd = document.forms[0].password.value;
    ajaxObj.firstLogin = false;
    if (infoCheck())
    {
        document.onkeydown  = null;
        login();  
    }
}

/**
 * init()
 * 
 * Description:
 *  initialization.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param 
 * @return 
 */
function init()
{
/*
    var img = document.getElementById('basePic');
    img.style.visibility = 'visible';
    img.src = "chrome://gale/skin/icon/login/logo.jpg";
    img.style.width  = screen.width + 'px';
    img.style.height = screen.height + 'px';
*/ 
    var win = getBrowserWindow();
    if (win)
    {
        LoginURL  = win.strLoginURL;
        HomeURL   = win.strHomeURL;
    }
    var div = document.getElementById("title_div");
    div.childNodes[0].data = LOGINTILE;

    div = document.getElementById("first_div");
    div.childNodes[0].data = USERWELCOME;

    div = document.getElementById("userName");
    div.childNodes[0].data = USERNAME;

    div = document.getElementById("userPasswd");
    div.childNodes[0].data = USERPASSWD;

    div = document.getElementById("btnLoginLbl");
    div.childNodes[0].data = LOGINLBL;

    div = document.getElementById("btnCancelLbl");
    div.childNodes[0].data = CANCELLBL;

    var img = document.getElementById('btnLoginPic');
    img.src = "chrome://gale/skin/icon/login/backbtn.jpg";

    img = document.getElementById('btnCancelPic');
    img.src = "chrome://gale/skin/icon/login/backbtn.jpg";
    
    setLoginInfo();
    setProgressTipInfo();
    bInitInfoOk = getInitInfo();
    
    if (bAutoLogin)
    {
        login();
    }
    else
    {
        if (bInitInfoOk)
        {
            setTipMsg(TIPMSGWELCOME);
            showLoginInfo();
        }
        window.setTimeout(
            function(){
                document.forms[0].user.focus();
            }
        , 200);
    }
}

/**
 * infoCheck()
 * 
 * Description:
 *  check user input information.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param 
 * @return boolean 
 */
function infoCheck()
{
	var fm = document.forms[0];
	s = fm.style.value;
	
	fm.user.value     = strTrim(fm.user.value);
    fm.password.value = strTrim(fm.password.value);

	if( fm.user.value == "") 
    {
		setTipMsg(TIPMSGUSER);
        document.getElementById("btnLoginPic").style
            .visibility = "hidden";
        document.getElementById("btnCancelPic").style
            .visibility = "hidden";
		fm.user.focus();
		return false;
	}	

	if(fm.password.value.length == "") 
    {
		setTipMsg(TIPMSGPASSWD);
        document.getElementById("btnLoginPic").style
            .visibility = "hidden";
        document.getElementById("btnCancelPic").style
            .visibility = "hidden";
		fm.password.focus();
		return false;
	}
	return true;
}

/**
 * setTipMsg()
 * 
 * Description:
 *  set tip message.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param str sting
 * @return string
 */
function setTipMsg(str)
{
    document.getElementById("second_div").childNodes[0].data = str;
}

/**
 * showLoginInfo()
 * 
 * Description:
 *  show the login status.
 *
 * History:
 *  2007.5.31      xszhong        Creation
 * 
 * @param 
 * @return 
 */ 
function showLoginInfo()
{
    ajaxObj.logined    = false;
    ajaxObj.getPorted  = false;

    var img = document.getElementById('blackPic');
    img.style.visibility = 'hidden';

    img = document.getElementById('backProgressPic');
    img.style.visibility = 'hidden';

    var obj = document.getElementById('progress');
    obj.style.visibility = 'hidden';

    document.onkeydown = KeyUp;
    document.getElementById("btnLoginPic").style.visibility = "hidden";
    document.getElementById("btnCancelPic").style.visibility = "hidden";
    document.forms[0].user.focus();
}

/**
 * setLoginInfo()
 * 
 * Description:
 *  set and show the login picture and information.
 *
 * History:
 *  2007.6.6      xszhong        Creation
 * 
 * @param 
 * @return 
 */ 
function setLoginInfo()
{
//    var img = document.getElementById('basePic');
//    img.style.visibility = 'hidden';

    var img = document.getElementById('backgroundPic');
    img.src = "chrome://gale/skin/icon/login/background_login.jpg";
    img.style.visibility = 'visible';

    var obj = document.getElementById('logininfo');
    obj.style.visibility = 'visible';
}

/**
 * setProgressTipInfo()
 * 
 * Description:
 *  set and show the logining picture and information.
 *
 * History:
 *  2007.6.6      xszhong        Creation
 * 
 * @param 
 * @return 
 */ 
function setProgressTipInfo()
{

    var img = document.getElementById('blackPic');
    img.src = "chrome://gale/skin/icon/login/black.png";
    img.style.visibility = 'hidden';

    img = document.getElementById('backProgressPic');
    img.src = "chrome://gale/skin/icon/login/backprogress.jpg";
    img.style.visibility = 'hidden';

}

/**
 * checkLoginTimeOut()
 * 
 * Description:
 *  check the use time of login.
 *
 * History:
 *  2007.6.13      xszhong        Creation
 * 
 * @param 
 * @return 
 */ 
function checkLoginTimeOut()
{
    if (ajaxObj.aborted)
    {
        ajaxObj.aborted = false;
    }
    if (window.doCheckLoginTimeOut)
    {
        window.clearTimeout(window.doCheckLoginTimeOut);
    }
    window.doCheckLoginTimeout = window.setTimeout(
        function ()
        {
            if (ajaxObj && ajaxObj.logining)
            {
                ajaxObj.aborted = true;
                ajaxObj.abort();                
            }
            window.clearTimeout(window.doCheckLoginTimeOut);
        }, LOGINMAXTIME);
}
