/**
 * Copyright (C) by B-Star.
 *
 * Do not use, copy, modify, and distribute this software and its 
 * documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 * File:  
 *    galeBrowser.js
 * Description:
 *    this file defines the behavior of the main bowrser of the gale stb.
 */
const DEFAULT_CSIGN     = '00000-000000-00000';
const PRECSIGN_LIVE     = '00001-000201';
const PRECSIGN_VOD      = '00001-000202';
const NINTERVALGETMSG   = 3000;
const NINTERVALLOOPCHG  = 25000;
const NINTERVALCHGSIGN  = 1500;
const NINTCHGVOLCLOSE   = 3500;
const NINTERVALCHGVOL   = 300;
const NSTEPCHGVOL       = 5;
const CHGVOL_UP         = '+';
const CHGVOL_DOWN       = '-';

var winPhoneWidth         = 200;
var winPhoneHeight        = 190;
var winPhoneLeft          = screen.width  - winPhoneWidth;
var winPhoneTop           = screen.height - winPhoneHeight - 2;

var   chgVolInnerHTML   = "<stack><image id='volBgPic' width='800' height='48'"
    + " src='chrome://gale/skin/bg.jpg'/><html:div style='left:80px;top:13px;"
    + " width:637px;height:24px;border:0px;'><image id='volProgressPic' src=''"   
    + " style='list-style-image:url('chrome://gale/skin/bg_s.jpg');"
    + " -moz-image-region:(0px 10px 24px 0px);'/></html:div></stack>";

var   divDefInnerHTML   = "<stack><image id='volBgPic' width='800' height='48'"
    + " src='chrome://gale/skin/msgbg.jpg'/></stack>";

var volMutePicWidth   = '80';
var volMutePicHeight  = '48';

var strGetMsgURL      = '';

// the timer obj for the get message from service.
var tmStartGetMsg     = null;

// an global obj that maintain the status box message(add/del/show).
var gStatusManager    = null;


var gRequest          = null;// XmlHttpRequest Obj for getting message

var bStartMessage     = false;// flag for stopping message system

/* message xml format from server
<?xml version='1.0' encoding='UTF-8'?>
<messages>
    <start_time>2007-04-12 14:55</start_time>
    <duration>30</duration>
    <number>5</number>
    <message>
        <id>msg1</id>
        <start_time>2007-04-12 14:56</start_time>
        <duration>6</duration> // in minutes !
        <abstract>ժҪ1</abstract>
    </message>
......
</messages>
*/

/*
<?xml version="1.0" encoding="UTF-8" ?> 
<messages>
<message>
  <id>10029</id> 
  <start_show_time>2007-08-07 15:07:00</start_show_time> 
  <end_show_time>2007-08-07 15:07:00</end_show_time> 
  <character_sign>13</character_sign> 
  <abstract>test test</abstract> 
  <msg_url_ok>www.sina.com.cn</msg_url_ok> 
  <msg_url_cancel /> 
  <show_mode>1</show_mode> 
  <show_size>1</show_size> 
  <msg_priority>100</msg_priority> 
  <msg_show_type>2</msg_show_type> 
  <msg_type>1</msg_type> 
</message>
.........
</messages>

<?xml version="1.0" encoding="UTF-8" ?> 
<messages>
<message>
<del_id>10029</del_id> 
</message>
.........
</messages>
*/
function message(id, start_time, end_time, csign, abstract, url_ok
    , url_cancel, mode, show_size, priority, show_type, msg_type)
{
    /*the unique number*/
    this.id          = id;

    /*
    the message valid period.include start and end time.
    */
    this.start_time  = start_time;
    this.end_time    = end_time;

    /*
    the character sign.
    the full compose is 00000(5 sp id)-000000
    (6 service id)-00000(5 sub service id)(separated by -)
    but the string could be composed by spid or spid-serviceid 
    or spid-service-subserviceid.
    the current sign of sp page must be composed by 
    spid-serviceid-subserviceid.
    so the pricipal is if the sign of message is part of the current sign 
    of sp page, then the message should belong to the current sp page 
    for show. 
    the default sign of sp page is 00000-000000-00000.
    meaning it can show all message. 
    */
    this.csign       = csign;

    /*the string with compliant with html/xul specification.
    the provider should check the valid, we don't check. 
    */
    this.content     = abstract;
 
    //the url is used for show the information.
    this.url_ok      = url_ok;

    //the url is used for cancel operation.through ajax process.
    this.url_cancel  = url_cancel;
    this.mode        = mode;

    //0 full screen 1 half screen
    this.show_size   = show_size;
    
    //the number is lower, the priority is higher.
    this.priority    = priority;

    /* 1 after response then delete; 
       2 after response,don't change state; 
       3 after response then delete,but during show, 
        couldn't interrupt by low priority msg.
    */
    this.show_type   = show_type;
    this.show_count  = 0;//the count of show
    this.msg_type    = msg_type;
}

message.prototype.procCancel  = procCancel;
message.prototype.onCancelMsgState  = onCancelMsgState;

/**
 * procCancel 
 * 
 * Description:
 *  process the cancel process of the message.
 *
 * History:
 *  2007.8.17      xszhong        Creation
 *
 * @param 
 * @return 
 */
function procCancel()
{
    if (this.url_cancel != '')
    {
        try 
        {        
            var reqObj = new XMLHttpRequest();
            var uri = this.url_cancel;

            reqObj.open('GET', encodeURI(uri), true);
            var obj = this;   
            reqObj.onreadystatechange = function(){obj.onCancelMsgState();};
            dumpLog("procCancel:send cancel url=" + uri);
            reqObj.send(null);
        }
        catch(ex)
        {
            return;
        }
    }
}

/**
 * onCancelMsgState
 * 
 * Description:
 *   the result of process cancel url 
 *
 * History:
 *  2007.8.16      xszhong        Creation
 *
 * @param  none
 * @return none
 */
function onCancelMsgState()
{ 
    try 
    {             
        dumpLog("the result of Cancel Process is OK!");
        return;
    }
    catch(ex)
    {
        dumpLog("the result of Cancel Process is Error!");
        return;
    }  
}

/**
 * msgManager 
 * 
 * Description:
 *  maintain the message list from the service, 
 *  and show in div or show detail.
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param msgDiv used to show the content
 * msgBox is the container of the msgDiv.
 * @return 
 */
function msgManager(msgBox, msgDiv)
{ 
    this.msgBox      = msgBox;
    this.msgDiv      = msgDiv;
    this.aMsgs       = new Array();
    this.innerState  = 0;//0 idle; 1 del or add msg; 2 save msg;

    /*the index of the message which is 
      currently showing tip or detail information.
    */
    this.curMsgIndex = -1; 

    /*when the message obj is deleted, set the index to idleIndexs*/    
    this.idleIndexs     = [];
    this.curSign    = ''; 
    this.curShowType    = '0';//0 invisible; 1 tip show; 2 detail show.
    this.tmCheckShowEnd = null;

    this.msgDetailWin   = null;
    /*1 normal; 0 order loop the number is set by findMsgToShow.*/
    this.curChgType     = '0';
    this.tmCheckValidMsg= null;

    /*the innerHTML type of msgDiv :0 MT_DEF; 1 MT_CHGVOL; 2 MT_PUSH
    *bVolMuteShow describe the mute status, if true then msgDiv'width
    *is screen.width-volMutePic.width and curMsgType is MT_DEF or MT_PUSH
    *and msgDiv is always showing.
    *if false then msgDiv'width is screen.width and curMsgType is MT_CHGVOL
    *or MT_PUSH and msgDiv can invisible.   
    */
    this.curMsgType     = '0';
    this.bVolMuteShow    = false;

    this.curVol           = 10;
    this.tmCheckVolChgEnd = null;
    this.bMute            = false;

    /**initialize audio to unmute..., 
    this should be, for forgetting mute status last time
    */
    setMute(false);
}

msgManager.prototype.setMsgFromXml  = setMsgFromXml;
msgManager.prototype.findMsgById    = findMsgById;
msgManager.prototype.delMsgById     = delMsgById;
msgManager.prototype.AddMsg         = AddMsg;
msgManager.prototype.onAddMsg       = onAddMsg;
msgManager.prototype.chgSign        = chgSign;
msgManager.prototype.onChgSign      = onChgSign;
msgManager.prototype.findMsgToShow  = findMsgToShow; 
msgManager.prototype.closeDetailWin = closeDetailWin;
msgManager.prototype.detailWinIsOpen= detailWinIsOpen;
msgManager.prototype.showMsgByIndex = showMsgByIndex;
msgManager.prototype.closeDivShow   = closeDivShow;
msgManager.prototype.openDivShow    = openDivShow;
msgManager.prototype.checkShowEnd   = checkShowEnd;
msgManager.prototype.clearResource  = clearResource;
msgManager.prototype.setCurVol      = setCurVol;
msgManager.prototype.msgBoxShowing  = msgBoxShowing;

/*for event handle process*/
msgManager.prototype.closeMsgShow   = closeMsgShow;
msgManager.prototype.showMsgDetail  = showMsgDetail;
msgManager.prototype.closeMsgDetail = closeMsgDetail;
msgManager.prototype.chgVol         = chgVol;
msgManager.prototype.setVolMute     = setVolMute;
msgManager.prototype.stopPushMsgShow= stopPushMsgShow;
msgManager.prototype.checkVolChgEnd = checkVolChgEnd;

const ST_INVISIBLE  = '0';//div is invisible but detial win is close;
const ST_SHOWTIP    = '1';//div is visible,detail win is close;
const ST_SHOWDETAIL = '2';//div is invisibl,but detail win is open;

const CT_LOOP       = '0';//the priority is same,give the opportunity.
const CT_NORMAL     = '1';//normal end style;


const SS_FULLSCREEN = '1';
const SS_HALFSCREEN = '0';

const MT_DEF        = '0';
const MT_CHGVOL     = '1';
const MT_PUSH       = '2';

const T_POWEROFF    = '00';
const T_REBOOT      = '01';
const T_STANDBY     = '02';
const T_DUPDATE     = '03';
const T_PHONE       = '10';

/**
 * setMsgFromXml
 * 
 * Description:
 *  add some messages or delete some message in a xml document
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param  strXml  a xml string.
 * @return 
 */
function setMsgFromXml(strXml)
{
    if (strXml.length == 0)
    {
        return;
    }
    var parser = new DOMParser();
    var dom    = parser.parseFromString(strXml, "text/xml");
    var root = dom.getElementsByTagName("messages");
    if (root.length == 0 || root[0].childNodes.length == 0) 
    {
        return;
    }
      
    var arraymsg = dom.getElementsByTagName ("message");
    var msgId, msgStartTime, msgEndTime, msgSign, msgContent, msgUrlOk
        , msgUrlCancel, msgMode, msgSize, msgPriority, msgShowType, msgType;
    var hasAddMsg = false;
    for(var i = 0; i < arraymsg.length; i++)
    {
        var delid = getChildElementByTagName(arraymsg[i], 'del_id');
        if (delid)
        {
            this.delMsgById(delid.textContent, false);
        }
        
        msgId = getChildElementByTagName(arraymsg[i], 'id');
        if (msgId)
        {
            msgId = msgId.textContent;
        }
        msgStartTime = getChildElementByTagName(arraymsg[i]
            , 'start_show_time');
        if (msgStartTime)
        {
            msgStartTime = stringToTime(msgStartTime.textContent);    
        }
        msgEndTime = getChildElementByTagName(arraymsg[i]
            , 'end_show_time');
        if (msgEndTime)
        {
            msgEndTime = stringToTime(msgEndTime.textContent);    
        }
        msgSign = getChildElementByTagName(arraymsg[i], 'character_sign');
        if (msgSign)
        {
            msgSign = msgSign.textContent;
        }
        msgContent= getChildElementByTagName(arraymsg[i], 'abstract');
        if (msgContent)
        {
            msgContent = msgContent.textContent;
        }
        msgUrlOk = getChildElementByTagName(arraymsg[i], 'msg_url_ok');
        if (msgUrlOk)
        {
            msgUrlOk = msgUrlOk.textContent;
        }
        msgUrlCancel = getChildElementByTagName(arraymsg[i]
            , 'msg_url_cancel');
        if (msgUrlCancel)
        {
            msgUrlCancel = msgUrlCancel.textContent;
        }
        msgMode = getChildElementByTagName(arraymsg[i], 'show_mode');
        if (msgMode)
        {
            msgMode = msgMode.textContent;
        }
        msgSize = getChildElementByTagName(arraymsg[i], 'show_size');
        if (msgSize)
        {
            msgSize = msgSize.textContent;
        }
        msgPriority = getChildElementByTagName(arraymsg[i], 'msg_priority');
        if (msgPriority)
        {
            msgPriority = msgPriority.textContent;
        }
        msgShowType = getChildElementByTagName(arraymsg[i], 'msg_show_type');
        if (msgShowType)
        {
            msgShowType = msgShowType.textContent;
        }
        msgType = getChildElementByTagName(arraymsg[i], 'msg_type');
        if (msgType)
        {
            msgType = msgType.textContent;
        }
        if (msgId)
        {
            /*
            dumpLog(msgId + " " + msgStartTime + " " + msgEndTime + "" 
                + msgSign + " " + msgContent + " " + msgUrlOk + ""
                + msgUrlCancel + " " + msgMode + " " + msgSize + " "
                + msgPriority + " " + msgShowType + " "+ msgType);
            */
            if (msgType == T_DUPDATE && stbUpdate)
            {
                dumpLog('get update message,so down update package');
                stbUpdate();
            }
            else
            {		
                var msgObj = new message(msgId, msgStartTime, msgEndTime
                    , msgSign, msgContent, msgUrlOk, msgUrlCancel
                    , msgMode, msgSize, msgPriority, msgShowType, msgType);
                hasAddMsg = true;
                this.AddMsg(msgObj);
            }
        }
    }
    if (hasAddMsg)
    {
        this.onAddMsg();
    }
}

/**
 * findMsgById
 * 
 * Description:
 *  find the message obj in the list according to id.
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param  message id
 * @return a message obj or null.
 */
function findMsgById(id)
{
    var ret = null;
    for (var i = 0; i < this.aMsgs.length; i++)
    {
        if (this.aMsgs[i] && this.aMsgs[i].id == id)
        {
            ret = this.aMsgs[i];
            break;
        }
    }
    return ret;
}

/**
 * delMsgById
 * 
 * Description:
 *  delete the message obj in the list according to id.
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param  message id
 * @param  message closed, set message don't show,don't find continuely.
 * @return boolean true or false.
 */
function delMsgById(id, closed)
{
    var ret = false;
    var index;
    for (var i = 0; i < this.aMsgs.length; i++)
    {
        if (this.aMsgs[i] && this.aMsgs[i].id == id)
        {
            ret = true;
            index = i;
            break;
        }
    }
    dumpLog("delMsgById: find the index of the message of id =" + id);
    /*find the message*/
    if (ret)
    {
        this.aMsgs[index] = null;
        this.idleIndexs.push(index);
        if (this.curMsgIndex == index)
        {
            if (this.tmCheckShowEnd)
            {
                clearTimeout(this.tmCheckShowEnd);
                this.tmCheckShowEnd = null;
            }
            if (!this.divVisible)
            {
                if (this.curShowType == ST_SHOWDETAIL)
                {
                //    this.closeDetailWin();
                //    this.curShowType = ST_INVISIBLE;
                }
                else
                {
                    dumpLog(" function delMsgById inner erro"  
                        + " divVisible = false, but don't show detail");
                }
            }
            else
            {
                this.curMsgIndex = -1;
                /*currently show the message*/
                if (this.curShowType == ST_SHOWTIP && !closed)
                {
                    var findIndex = this.findMsgToShow();
                    if (findIndex > -1 && this.showMsgByIndex(findIndex))
                    {
                        this.openDivShow();
                        return ret;
                    }
                }
                mar = document.getElementById('msgMarquee');
                if (mar && mar.stop)
                {
                    mar.stop();
                }
                if (this.bVolMuteShow)
                {
                    this.msgDiv.innerHTML = divDefInnerHTML;
                    this.curMsgType       = MT_DEF;
                }
                else
                {    
                    this.curMsgType       = MT_DEF;
                    this.closeDivShow();
                    this.curMsgIndex = -1;
                    this.curShowType = ST_INVISIBLE;
                }
            }
        }
    }
    return ret;
}

/**
 * detailWinIsOpen
 * 
 * Description:
 *  check the detail win is closed.
 *
 * History:
 *  2007.8.9      xszhong        Creation
 * @param  
 * @param 
 * @return 
 */
function detailWinIsOpen()
{
    var ret = false;
    if (this.msgDetailWin && !this.msgDetailWin.closed)
    {
        ret = true;
    }
    return ret; 
}

/**
 * closeDetailWin
 * 
 * Description:
 *  close the detail Win.
 *
 * History:
 *  2007.8.9      xszhong        Creation
 * @param  
 * @param 
 * @return 
 */
function closeDetailWin()
{
    if (this.detailWinIsOpen())
    {
        dumpLog("closeDetailWin:close the detail win.");
        this.msgDetailWin.close();
        this.msgDetailWin = null;
    }
    dumpLog("closeDetailWin: this.curShowType=" + this.curShowType);
    if (this.curShowType == ST_SHOWDETAIL)
    {    
        this.curShowType = ST_INVISIBLE;
    }
}

/**
 * showMsgByIndex
 * 
 * Description:
 *  set the correct index in manager, and inner html to msgDiv
 *  to be ready to show.
 *
 * History:
 *  2007.8.9      xszhong        Creation
 * @param  
 * @param 
 * @return 
 */
function showMsgByIndex(index)
{
    var ret = false;
    dumpLog("enter showMsgByIndex");   
    if (index > -1 && index < this.aMsgs.length && this.aMsgs[index])
    {
        var interval = this.aMsgs[index].end_time - getCurDate() + 50;
        dumpLog("the need interval =" + interval);
        if (interval > 0)
        {
            if (this.tmCheckShowEnd)
            {
                clearTimeout(this.tmCheckShowEnd);
            }
            if (this.curChgType == CT_LOOP)
            {
                if (interval > NINTERVALLOOPCHG)    
                {
                    interval = NINTERVALLOOPCHG;
                }
            }
            var obj = this;
            dumpLog("the real interval =" + interval);
            this.tmCheckShowEnd = setTimeout(function()
                {obj.checkShowEnd();}, interval);
            if (this.curMsgIndex > -1 && this.aMsgs[this.curMsgIndex]
                && this.aMsgs[this.curMsgIndex].id == this.aMsgs[index].id)
            {
                dumpLog("showMsgByIndex: the selected index is currently showing");
            }
            else
            {
                this.curMsgIndex = index;
                // dumpLog('this message mode= ' + this.aMsgs[index].mode);
                var mar = document.getElementById('msgMarquee');
                if (mar && mar.stop)
                {
                    mar.stop();
                }

                /*should be set the style width,because the default is blank*/
                if (this.bVolMuteShow)
                {
                    this.msgDiv.style.width = screen.width 
                        - parseInt(volMutePicWidth) + "px";
                }
                else
                {
                    this.msgDiv.style.width = screen.width + "px";
                }
                this.msgDiv.innerHTML = this.aMsgs[index].mode;
                
                this.curMsgType = MT_PUSH;
                mar = document.getElementById('msgMarquee');
                if (mar && mar.start)
                {
                    mar.start();
                }
            }
            ret = true;
        }
        else
        {
            dumpLog(" function showMsgByIndex inner erro" 
                + " end_time > current_time, but select it to show");
        }
    }
    return ret;
}


/**
 * closeDivShow
 * 
 * Description:
 *  after set the correct index in manager, set it to be invisible.
 *
 * History:
 *  2007.8.9      xszhong        Creation
 *
 * @param  
 * @param 
 * @return 
 */
function closeDivShow()
{
    if (this.msgDiv)
    {
        this.msgDiv.style.visibility = "hidden";
        this.msgBox.style.visibility = "hidden";
        gBrowser.height  = screen.height;
        var mar = document.getElementById('msgMarquee');
        if (mar && mar.stop)
        {
            mar.stop();
        }
    }
    this.divVisible = false;
}

/**
 * openDivShow
 * 
 * Description:
 *  after set the correct inner html to div, set it to be visible.
 *
 * History:
 *  2007.8.9      xszhong        Creation
 *
 * @param  
 * @param 
 * @return 
 */
function openDivShow()
{
    if (this.msgDiv)
    {
        this.msgDiv.style.visibility = "visible";
        this.msgBox.style.visibility = "visible";
        if (this.curMsgType == MT_DEF)
        {
            this.msgDiv.innerHTML = divDefInnerHTML; 
        }
        gBrowser.height         = screen.height - boxHeight + 2;
        /*   
        var mar = document.getElementById('msgMarquee');
        if (mar && mar.start)
        {
            mar.start();
        }
        */
    }
    this.divVisible = true;
}

/**
 * findMsgToShow
 * 
 * Description:
 *  change the show message according to the condition.
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param 
 * @param  
 * @return int the message index 
 */
function findMsgToShow()
{
    dumpLog("enter findMsgToShow");
    var ret         = -1;
    var curDate     = getCurDate();
    var findIndexs  = [];
    var nearestDate = null;
    if (!this.aMsgs)
    {
        return ret;
    }
    /*
    *first step:find out the valid and the character sign is ruled. 
    */
    for(var i = 0; i < this.aMsgs.length; i++)
    {
        if (this.aMsgs[i])
        {   
            dumpLog(this.aMsgs[i].id + " " + this.aMsgs[i].end_time + ""
                + this.aMsgs[i].start_time + " " + this.aMsgs[i].csign
                + " " + this.curSign );
            if (this.aMsgs[i] && this.aMsgs[i].end_time > curDate 
                && this.aMsgs[i].start_time <= curDate)
            {
                /*include the condition this.curSign == DEFAULT_CSIGN 
                *    && this.aMsgs[i].csign == DEFAULT_CSIGN)
                */
                dumpLog("valid time message");
                if (this.curSign.indexOf(this.aMsgs[i].csign) == 0 
                    || this.aMsgs[i].csign == DEFAULT_CSIGN)
                {
                    findIndexs.push(i);
                }
            }
            else if (this.aMsgs[i].end_time <= curDate)
            {
                dumpLog("delete the invalid tiem message.id= " 
                    + this.aMsgs[i].id);
                this.delMsgById(this.aMsgs[i].id, false);
            }
            else
            {
                if (!nearestDate || this.aMsgs[i].start_time < nearestDate)
                {
                    nearestDate = this.aMsgs[i].start_time;
                    dumpLog("findMsgToShow: set a nearestDate=" 
                        + nearestDate);
                }
            }
            
        }
    }
    dumpLog("after first step of find");
    if (this.tmCheckValidMsg)
    {
        clearTimeout(this.tmCheckValidMsg);
        this.tmCheckValidMsg = null;
    }
    if (findIndexs.length == 0)
    {
        dumpLog("first step - can't find a msg which is" 
            + " valid and csign is ruled");
        if (nearestDate > 0)
        {
            interval = nearestDate - curDate + 10;
            var obj = this;
            dumpLog("after the interval =" + interval 
                + " to check have valid msg");
            this.tmCheckValidMsg = setTimeout(function()
                {obj.onAddMsg();}, interval);
            
        }
        return ret;
    }

    /*
    *second step:according to up, in the filtered messages find 
    *the show count is lowest.
    */
    var curCnt = this.aMsgs[findIndexs[0]].show_count;
    var lowestIndexs = [findIndexs[0]];
    for(var j = 1; j < findIndexs.length; j++)
    {
        if (this.aMsgs[findIndexs[j]].show_count < curCnt)
        {
            curCnt = this.aMsgs[findIndexs[j]].show_count;
            lowestIndexs = [];
            lowestIndexs.push(findIndexs[j]);
        }
        else if (this.aMsgs[findIndexs[j]].show_count == curCnt)
        {
            lowestIndexs.push(findIndexs[j]);
        }
    }

    if (lowestIndexs.length == 1)
    {
        ret = lowestIndexs[0];
        if (this.aMsgs[ret].show_type == CT_LOOP)
        {
            this.curChgType = CT_LOOP;
            this.aMsgs[ret].show_count += 1; 
        }
        else
        {
            this.curChgType = CT_NORMAL;
        }
        dumpLog("second step select id =" + this.aMsgs[ret].id 
            + ", show_count = " + curCnt);
        return ret;
    }
    
    /*
    *third step:according to up, find the highest priority message.    
    */
    var curPrior = this.aMsgs[lowestIndexs[0]].priority;
    var highestIndexs = [lowestIndexs[0]];
    for(var j = 1; j < lowestIndexs.length; j++)
    {
        if (this.aMsgs[lowestIndexs[j]].priority > curPrior)
        {
            curPrior = this.aMsgs[lowestIndexs[j]].priority;
            highestIndexs = [];
            highestIndexs.push(lowestIndexs[j]);
        }
        else if (this.aMsgs[lowestIndexs[j]].priority == curPrior)
        {
            highestIndexs.push(lowestIndexs[j]);
        }
    }
    if (highestIndexs.length == 1)
    {
        ret = highestIndexs[0];
        if (this.aMsgs[ret].show_type == CT_LOOP)
        {
            this.curChgType = CT_LOOP;
            this.aMsgs[ret].show_count += 1; 
        }
        else
        {
            this.curChgType = CT_NORMAL;
        }
        dumpLog("third step - select id =" + this.aMsgs[ret].id 
            + ", priority = " + curPrior);
        return ret;
    }

    /*
    *fourth step: according to up, in the filtered messages 
    find the id is lowest.
    */
    var curId = this.aMsgs[highestIndexs[0]].id;
    ret       = highestIndexs[0];
    for(var j = 1; j < highestIndexs.length; j++)
    {
        if (parseFloat(this.aMsgs[highestIndexs[j]].id) < parseFloat(curId))
        {
            curId = this.aMsgs[highestIndexs[j]];
            ret = highestIndexs[j];
        }
    }
    dumpLog("fourth step select msg id = " + curId )
    if (this.aMsgs[ret].show_type == CT_LOOP)
    {
        this.curChgType = CT_LOOP;
        this.aMsgs[ret].show_count += 1; 
    }
    else
    {
        this.curChgType = CT_NORMAL;
    }
    return ret;
}

/**
 *dumpLog 
 * 
 * Description:
 * dump the current time and string.
 *
 * History:
 *  2007.8.10      xszhong        Creation
 *
 * @param 
 * @param 
 * @return 
 */
function dumpLog(str)
{
    var d   = getCurDate();
    var log = d.toString() + " " + d.getMilliseconds() + " ";
    log = log + ":" + str + "\n";
    if (window.dump)
    {		
        dump(log);
    }
}

/**
 * checkShowEnd
 * 
 * Description:
 *  check the current show message should be stop and 
 *  select a new message to show..
 *
 * triggered by a future time(an end time or predicted time)
 * History:
 *  2007.8.9      xszhong        Creation
 *
 * @param 
 * @param 
 * @return 
 */
function checkShowEnd()
{
    dumpLog("checkShowEnd:enter");   
    var index = this.curMsgIndex;
    if (index > -1 && this.aMsgs[index])
    {
        dumpLog("checkShowEnd:the curMsgIndex = " + this.curMsgIndex
            + "the message obj=" + this.aMsgs[this.curMsgIndex]);
        /*the current show message is invalid(end_time is coming)*/
        if (this.aMsgs[index].end_time < getCurDate())
        {
            dumpLog("checkShowEnd:the message time is over");
         //   this.aMsgs[index].procCancel();
            this.delMsgById(this.aMsgs[index].id, false);
            return;
        }
    }
    dumpLog("checkShowEnd:the message time isn't over,change "
        + "the show message.");
    /*currently show the message*/
    if (this.divVisible && this.curShowType == ST_SHOWTIP)
    {
        var findIndex = this.findMsgToShow();
        if (findIndex > -1 && this.showMsgByIndex(findIndex))
        {
            this.openDivShow();
            return ;
        }
        mar = document.getElementById('msgMarquee');
        if (mar && mar.stop)
        {
            mar.stop();
        }
        if (this.bVolMuteShow)
        {
            this.msgDiv.innerHTML = divDefInnerHTML;
            this.curMsgType       = MT_DEF;
        }
        else
        {    
            this.closeDivShow();
            this.curMsgIndex = -1;
            this.curShowType = ST_INVISIBLE;
        }
    }
    return;
}

/**
 * AddMsg
 * 
 * Description:
 *  add a message obj.
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param msg a message object.
 * @param  
 * @return 
 */
function AddMsg(msg)
{
    if (this.idleIndexs.length > 0)
    {
        var curIndex = this.idleIndexs.pop();
        if (curIndex >= 0 && curIndex < this.aMsgs.length)
        {
            this.aMsgs[curIndex] = msg;
            return;
        }
    }
    this.aMsgs.push(msg);
    return;
}

/**
 * onAddMsg
 * 
 * Description:
 *  after add some message, according to the current state, to change.
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param  
 * @param  
 * @return 
 */
function onAddMsg()
{
//    dumpLog("enter onAddmsg.this.curShowType=" + this.curShowType 
//        + "this.curMsgType=" + this.curMsgType);
    if (!this.divVisible && this.curShowType == ST_SHOWDETAIL)
    {
//        this.closeDetailWin();
        return;
    }
    /*currently change volume, can not interrupt it*/
    if (this.curMsgType == MT_CHGVOL)
    {
        return;
    }

    dumpLog('before findMsgToShow');
    var findIndex = this.findMsgToShow();
    dumpLog("find index = " + findIndex);
    if (findIndex > -1 && this.showMsgByIndex(findIndex))
    {
        this.curShowType = ST_SHOWTIP;
        this.openDivShow();
    }
    else
    {   
        this.curMsgType = MT_DEF;
        if (this.bVolMuteShow)
        {
            this.curShowType = ST_SHOWTIP;
            this.openDivShow();
        }
        else
        {
            dumpLog("couldn't show message");
            this.closeDivShow();
            this.curMsgIndex = -1;
            this.curShowType = ST_INVISIBLE;
        }
    }
    return;
}

/**
 * chgSign
 * 
 * Description:
 *   change the page current character sign.
 *
 * History:
 *  2007.8.10      xszhong        Creation
 *
 * @param  
 * @param  
 * @return 
 */
function chgSign(sign)
{
    if (sign != '' && this.curSign != sign)
    {
        this.curSign = sign;
        dumpLog("chgSign:the old sign=" + this.curSign 
            + " the new sign=" + sign);
        var obj = this;
        setTimeout(function(){obj.onChgSign();}, NINTERVALCHGSIGN);
    }
}

/**
 *onChgSign
 * 
 * Description:
 *   after change the page current character sign, change the message.
 *
 * History:
 *  2007.8.10      xszhong        Creation
 *
 * @param  
 * @param  
 * @return 
 */
function onChgSign()
{
    this.onAddMsg();
}

/**
 * closeMsgShow
 * 
 * Description:
 *  Hide the message
 *
 * History:
 *  2007.8.10      xszhong        Creation
 *
 * @param  none
 * @return none
 */
function closeMsgShow(forceClose)
{ 
    if (this.curMsgIndex > -1 
        && this.aMsgs[this.curMsgIndex])
    {
        this.aMsgs[this.curMsgIndex].procCancel();
        this.delMsgById(this.aMsgs[this.curMsgIndex].id, forceClose);
    }

    if (!this.divVisible)
    {    
        gBrowser.height         = screen.height;
    }
    return;  
}

/**
 * showMsgDetail
 * 
 * Description:
 *  Create the dialog to show detail of messages
 *  the url is passed by parameter.
 * History:
 *  2007.8.10      xszhong       Creation
 *
 * @param  none
 * @return none
 */   
function showMsgDetail()
{ 
    if (!this.detailWinIsOpen() && this.curMsgIndex > -1 
        && this.aMsgs[this.curMsgIndex])
    {

        var strURL = this.aMsgs[this.curMsgIndex].url_ok;
        var id = this.aMsgs[this.curMsgIndex].id;
        if (this.aMsgs[this.curMsgIndex].msg_type == T_POWEROFF)           
        {        
            this.delMsgById(id, true);
            if (stbPowerOff)
            {
                onClose();
                stbPowerOff();
            }
        }
        else if (this.aMsgs[this.curMsgIndex].msg_type == T_REBOOT)
        {
            this.delMsgById(id, true);
            if (stbRestart)
            {
                stbRestart();
            }
        }
        else if (this.aMsgs[this.curMsgIndex].msg_type == T_STANDBY)
        {
            this.delMsgById(id, true);
            if (stbStandBy)
            {
                onClose();
                stbStandBy(); 
            }
        }
        else if (strURL != '')
        {                     
            if (this.aMsgs[this.curMsgIndex].show_size == SS_FULLSCREEN)
            {
                browserGo(strURL);
                this.delMsgById(id, false);
            }
            else
            {
                dumpLog('before show Detail. the message of id=' 
                     + id);
                
                 /*delete the msg,and force the status box is hidden,but the
                 *bVolMuteShow state isnot changed.and when the message detail
                 *window is closed,onAddMsg()is called,the bVolMuteShow status
                 *can take effect.
                 *should notice that:in the message detail window can't change
                 *volume or mute status. 
                 */
                if (this.aMsgs[this.curMsgIndex].msg_type != T_PHONE)
                {
                    dumpLog('this message is not phone, delete the message ' 
                        + 'and show the message detail. id=' + id);
                    this.delMsgById(id, true);
                    this.msgDetailWin  = window.openDialog(
                        "chrome://gale/content/browser/message.xul", 
                        "msg-detail",
                        "dependent=yes",
                        strURL);  
                    this.curShowType = ST_SHOWDETAIL;
                }
                else
                {
                    dumpLog('this message is phone. id=' + id);
                    if (innerOpenPhoneWin(
                        strURL, 
                        winPhoneLeft,
                        winPhoneTop,
                        winPhoneWidth,
                        winPhoneHeight, PBWIN_CURPHONE))
                    {
                            dumpLog('open phonewin ok, thehandle=' + winPhone);
                            this.msgDetailWin = winPhone;
                            this.delMsgById(id, true);
                            this.curShowType = ST_SHOWDETAIL;
                    }
                    else
                    {
                            dumpLog('open phone win error.');
                            winPhone = null;
                            this.msgDetailWin = null;
                            this.delMsgById(id, false);
                    }
                }
            }            
            /*this is phone*/
            /*
            else
            {
                dumpLog("before getcurPageType");
                var pageType = innerGetCurPageType();
                dumpLog("curPageType=" + pageType);
                if (pageType == 0)//current page is home,directly go to page
                {
                    this.delMsgById(id, false);
                    browserGo(strURL);
                }
                else if (pageType == 1 || pageType == 2)
                {
                    this.delMsgById(id, true);
                   // strURL += "&amp;pageType=" + pageType;
                    innerOpenPhoneWin(
                        strURL, 400, 
                        0, 400, 600, PBWIN_PHONETIP);
                    this.curShowType  = ST_SHOWDETAIL;  
                }
                else
                {
                    this.delMsgById(id, false);
                }
            }
            */
        }
        else
        {
            this.delMsgById(id, false);
        }
    }
}

/**
 * closeMsgDetail
 * 
 * Description:
 *  Close the dialog which show detail of messages
 *
 * History:
 *  2007.8.10     xszhong        Creation
 *
 * @param  none
 * @return none
 */ 
function closeMsgDetail()
{ 
    this.closeDetailWin();
    dumpLog("closeMsgDetail:after closeDetailWin.this.curShowType=" 
        + this.curShowType + " this.curMsgType=" + this.curMsgType);
    this.onAddMsg();//check there is message to show.
}

/**
 * clearResource
 * 
 * Description:
 *  clear the resource of the msgManager.
 *
 * History:
 *  2007.8.22     xszhong        Creation
 *
 * @param  none
 * @return none
 */ 
function clearResource()
{ 
    this.closeMsgShow(true); 
    if (this.tmCheckValidMsg)
    {
        clearTimeout(this.tmCheckValidMsg);
    }    
    if (this.tmCheckShowEnd)
    {
        clearTimeout(this.tmCheckShowEnd);
    }
}

/**
 * setCurVol
 * 
 * Description:
 *  set the system volume .
 *
 * History:
 *  2007.8.24     xszhong        Creation
 *  2007.9.28     xszhong        change the set/get volume style.
 * @param  string the add or decrease.
 * @return boolean 
 */ 
function setCurVol(direct)
{
    var ret = false; 
    this.curVol      = getSysVolume();
    if (this.curVol < 0)
    {
         this.curVol = 0;
    }
    if (direct == CHGVOL_UP)
    {
        this.curVol += NSTEPCHGVOL;
    }
    else if (direct == CHGVOL_DOWN)
    {
        this.curVol -= NSTEPCHGVOL;
    }
    if (this.curVol < 0)
    {
        this.curVol = 0;
    }
    if (this.curVol > 100)
    {
        this.curVol = 100;
    }
    var val = setSysVolume(this.curVol);
    
    /**setSysVolume fail*/
    if (val < 0)
    {    
        ret = false;
        this.curVol = -1;
        return;   
    }
    if (this.curVol >= 0)
    {
        ret = true;
    }
    return ret;
}

/**
 * chgVol
 * 
 * Description:
 *  change the system volume and show the progress status.
 *
 * History:
 *  2007.8.24     xszhong        Creation
 *
 * @param  none
 * @return none
 */ 
function chgVol(direct)
{ 
    if (!this.setCurVol(direct))
    {
        return;
    }
    //message detail win is open
    if (this.curShowType == ST_SHOWDETAIL)
    {
        return;
    }
    /*current is mute*/ 
    if (this.bVolMuteShow)
    {
        if (this.curShowType == ST_INVISIBLE)
        {
            dumpLog("chgVol:inner error.bVolMuteShow=true and " 
                + " curShowType=INVISIBLE");
            return;
        }
        var img = document.getElementById('volMutePic');
        if (img)
        {
            img.width  = '0';
            img.height = '0';
        }
        this.msgDiv.style.width = screen.width + "px"; 
        if (this.curMsgType == MT_PUSH 
            || this.curMsgType == MT_DEF)
        {
            this.stopPushMsgShow();
        }
        else
        {
            dumpLog("chgVol:inner error, this.bVolMuteShow=true and"
                + " this.curMsgType=MT_CHGVOL ");
        }
        this.bVolMuteShow = false;
        this.bMute       = false;
        this.curMsgType  = MT_CHGVOL;
    }
    else //volMute is not showing.... 
    {
        if (this.curMsgType == MT_PUSH 
            || this.curMsgType == MT_DEF)
        {
            this.stopPushMsgShow();
            this.curMsgType  = MT_CHGVOL;
        }
        if (this.curShowType == ST_INVISIBLE)
        {
            this.curShowType = ST_SHOWTIP;
            this.openDivShow();
        }
    } 
    var volDiv = document.getElementById('volDiv');
    volDiv.style.visibility = "visible";
    img = document.getElementById('volProgressPic');
    var width = Math.ceil(this.curVol/100 * 637);
    
    if (img)
    {
        img.style.MozImageRegion   = 'rect(0px ' + width 
            + 'px 30px 0px)';
    }
    if (this.tmCheckVolChgEnd)
    {
        clearTimeout(this.tmCheckVolChgEnd);
        this.tmCheckVolChgEnd = null;
    }
    var obj = this;
    this.tmCheckVolChgEnd = setTimeout(function()
                {obj.checkVolChgEnd();}, NINTCHGVOLCLOSE);
    return;
}

/**
 *setVolMute 
 * 
 * Description:
 *  change the system volume to mute.
 *
 * History:
 *  2007.8.24     xszhong        Creation
 *  2007.9.28     xszhong        change the set/get mute style.
 * @param  none
 * @return none
 */ 
function setVolMute()
{
    if(this.curShowType == ST_SHOWDETAIL)
    {
        return;
    }

    /*current statusBox is open*/
    else if(this.curShowType == ST_SHOWTIP)
    {
        if (this.bMute && this.bVolMuteShow)
        {
            /**if set unmute false, should return, wait next action*/
            if (!setMute(false))
            {
                return;
            }
            this.bMute = false;
            this.bVolMuteShow = false;
            var img = document.getElementById('volMutePic');
            if (img)
            {
                img.width  = '0';
                img.height = '0';
            }
          
            if (this.curMsgType == MT_DEF)
            {
                this.curShowType = ST_INVISIBLE;
                this.closeDivShow();
            }
            else if (this.curMsgType == MT_PUSH)
            {
                this.msgDiv.style.width = screen.width + 'px';
            }
        } 
        else if(!this.bMute && !this.bVolMuteShow)
        {
            /**if set mute false, should return, wait next action*/
            if (!setMute(true))
            {
                return;
            }
            this.bMute = true;
            this.bVolMuteShow = true;
            var img = document.getElementById('volMutePic');
            if (img)
            {
                img.width  = volMutePicWidth;
                img.height = volMutePicHeight;
            }
       
            if (this.curMsgType == MT_CHGVOL)
            {
                if (this.tmCheckVolChgEnd)
                {
                    clearTimeout(this.tmCheckVolChgEnd);
                    this.tmCheckVolChgEnd = null;
                }
                var volDiv = document.getElementById('volDiv');
                volDiv.style.visibility = "hidden";
                this.curMsgType = MT_DEF;
                this.onAddMsg(); 
            }
            else if (this.curMsgType == MT_PUSH)
            {
                dumpLog("this.msgDiv.style.width=" + this.msgDiv.style.width);
                this.msgDiv.style.width = screen.width -  
                    parseInt(volMutePicWidth)+ 'px';
            }
        }
        else
        {
            dumpLog('setVolMute:inner error.bVolMuteShow = '
                + this.bVolMuteShow 
                + " bMute =" +this.bMute);
        }
    }

    /*the statusBox is invisible....*/
    else if(this.curShowType == ST_INVISIBLE)
    {
        if (this.bMute && !this.bVolMuteShow)
        {
            setMute(false);
            this.bMute = false;
            return;
        } 
        else if(!this.bMute && !this.bVolMuteShow)
        {
            /**if set mute false, should return, wait next action*/
            if (!setMute(true))
            {
                return;
            }
            this.bMute       = true;
            this.bVolMuteShow = true;
            var img = document.getElementById('volMutePic');
            if (img)
            {
                img.width  = volMutePicWidth;
                img.height = volMutePicHeight;
            }
       
            this.msgDiv.style.width = screen.width -  
                parseInt(volMutePicWidth)+ 'px';
            this.curMsgType = MT_DEF;
            this.curShowType = ST_SHOWTIP;
            this.onAddMsg();
        }
        else if(this.bMute && this.bVolMuteShow)
        {
            /**if set unmute false, should return, wait next action*/
            if (!setMute(false))
            {
                return;
            }
            this.bMute = false;
            this.bVolMuteShow = false;
      
            var img = document.getElementById('volMutePic');
            if (img)
            {
                img.width  = '0';
                img.height = '0';
            }
     
            if (this.curMsgType == MT_DEF)
            {
                this.curShowType = ST_INVISIBLE;
                this.closeDivShow();
            }
        }
        else
        {
            dumpLog('setVolMute:inner error.bVolMuteShow = ' 
                + this.bVolMuteShow 
                + "bMute =" + bMute 
                + "this.curShowType=ST_INVISIBLE");
        }
    }
}

/**
 * stopPushMsgShow
 * 
 * Description:
 *  stop the currently show push message.
 *
 * History:
 *  2007.8.24     xszhong        Creation
 *
 * @param  none
 * @return none
 */ 
function stopPushMsgShow()
{
    this.curMsgIndex = -1;    
    if (this.tmCheckShowEnd)
    {
        clearTimeout(this.tmCheckShowEnd);
    }
    var mar = document.getElementById('msgMarquee');
    if (mar && mar.stop)
    {
        mar.stop();
    }
    this.msgDiv.innerHTML = " ";
}

/**
 * checkVolChgEnd
 * 
 * Description:
 *  check the change volume end is over.
 *
 * History:
 *  2007.8.24     xszhong        Creation
 *
 * @param  none
 * @return none
 */ 
function checkVolChgEnd()
{
    if (this.curMsgType == MT_CHGVOL)
    {
        if (this.bVolMuteShow)
        {
            dumpLog("checkVolChgEnd:inner error.bVolMuteShow=true");
        }
        if (this.curShowType == ST_INVISIBLE 
            || this.curShowType == ST_SHOWDETAIL)
        {
            dumpLog("checkVolChgEnd:inner error.this.curShowType=" 
                + this.curShowType);
        }
        var volDiv = document.getElementById('volDiv');
        volDiv.style.visibility = "hidden";
        this.curMsgType = MT_DEF;
        this.onAddMsg();
    }
}

/**
 * msgBoxShowing
 * 
 * Description:
 *  check the msgBox is showing and there is message.
 *
 * History:
 *  2007.10.25     xszhong        Creation
 *
 * @param  none
 * @return boolean.true if yes, or return false
 */ 
function msgBoxShowing()
{
    var ret = false;
    if ((this.msgBox.style.visibility == "visible") && (this.curMsgIndex > -1) 
        && this.aMsgs[this.curMsgIndex])
    {
        ret = true;
    }
    return ret;
}

/**
 * getChildElementByTagName
 * 
 * Description:
 *  Get a child element by tagname in a xml document
 *
 * History:
 *  2007.5.9      xbluo        Creation
 *
 * @param  parent   parent node
 * @param  tagName  tagname
 * @return child element with the tagname,null if find none.
 */
function getChildElementByTagName(parent, tagName)
{ 
    var children = parent.childNodes;
    for (var i = 0; i < children.length; i++)
    { 
        if (children[i].tagName == tagName)
        {
            return children[i];
        }
    } 
    return null;
}

/**
 * stringToTime
 * 
 * Description:
 *  Convert a string like 2007-5-7 12:05  to a js Date object
 *
 * History:
 *  2007.5.9      xbluo        Creation
 *  2007.10.24    xszhong      string format: 2007-5-7 12:05:10
 *
 * @param  string   
 * @return Date object with the time the string specified
 */
function stringToTime (string)
{ 
    //string format: 2007-5-7 12:05:10
    var reg = /([\d]+)-([\d]+)-([\d]+)\s([\d]+):([\d]+):([\d]+)/; 
    var rlt = string.match (reg);
    if (rlt) 
    {
         var t = new Date (rlt[1],rlt[2]-1,rlt[3],rlt[4],rlt[5],rlt[6]);
         return t;
    }
    else
    { 
         debugalert ('match failed!');
    }     
    return null;
}

/**
 * getTimeString
 * 
 * Description:
 *  return string that contain current time,in format "2007-5-2 12:23:20"
 *
 * History:
 *  2007.5.10      xbluo        Creation
 *  2007.10.24    xszhong      string format: 2007-5-2 12:23:20
 *
 * @param  none
 * @return return string that contain current time
 */
function getTimeString ()
{ 
    var now = new Date ();
    var str = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + 
      now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() +
      ':' + now.getSeconds(); 
    return str;                       
}

/**
 * getMessage
 * 
 * Description:
 *  send a XMLHttpRequest to get a message xml in async call, response in 
 *  OnMessageState()
 *
 * History:
 *  2007.5.10      xbluo        Creation
 *
 * @param  none
 * @return none
 */
function getMessage() 
{    
    try 
    {        
        if (!gRequest)
        {
            gRequest = new XMLHttpRequest();
        }
        var uri = strGetMsgURL;
        gRequest.open('GET', encodeURI(uri), true);   
        gRequest.onreadystatechange = onMessageState;
        gRequest.send(null);
    }
    catch (ex)
    {
        return;
    }   
}

/**
 * onMessageState
 * 
 * Description:
 *  Call back for xml request
 *
 * History:
 *  2007.5.10      xbluo        Creation
 *
 * @param  none
 * @return none
 */
function onMessageState()
{ 
    try 
    {             
        if (gRequest.readyState == 4 && gRequest.status == 200 
            && bStartMessage)
        {
            if (gStatusManager)
            {
                gStatusManager.setMsgFromXml(gRequest.responseText);     
            }
        } 
        return;
    }
    catch(ex)
    {
        return;
    }  
}

/**
 * startProcMessage
 * 
 * Description:
 *  start processing message
 *
 * History:
 *  2007.8.8      xszhong        Creation
 *
 * @param  none
 * @return none
 */
function startProcMessage()
{
    bStartMessage = true;
    dumpLog("begin Start proc message");
    if (!gStatusManager)
    {
        gStatusManager = new msgManager(document.getElementById("msgBox")
            , document.getElementById("msgDiv"));
        gStatusManager.chgSign(DEFAULT_CSIGN);
    }
    if (tmStartGetMsg)
    {
        clearInterval(tmStartGetMsg);
    }
    tmStartGetMsg = setInterval(getMessage, NINTERVALGETMSG); 
}

/**
 * stopProcMessage
 * 
 * Description:
 *  stop processing message
 *
 * History:
 *  2007.8.8      xszhong      change according to v2
 * @param  none
 * @return none
 */
function stopProcMessage()
{
    if (tmStartGetMsg)
    {
        clearInterval(tmStartGetMsg);
    }
    bStartMessage = false;
    if (gStatusManager)
    {
        gStatusManager.clearResource();
        gStatusManager = null;
    }
    dumpLog("stopProcMessage...");
}

/**
 *getCurDate 
 * 
 * Description:
 *  get the current time obj
 *
 * History:
 *  2007.8.8      xszhong      change according to v2
 */
function getCurDate()
{
    return new Date();
}
