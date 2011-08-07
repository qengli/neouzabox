/**
 * Copyright (C) by B-Star.
 *
 * Do not use, copy, modify, and distribute this software and its documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 *
 * File:  
 *    plusBrowser.js
 * Description:
 *    this file defines behavior of a plus browser which can load tip page 
 * and phone page 
 */


/**
 * onStart
 * 
 * Description:
 *  Initial Window size/position and load the url 
 *
 * History:
 *  2007.8.28      xszhong        Creation
 *
 * @param  window.arguments[0] is url
 * @param  window.arguments[1] is left
 * @param  window.arguments[2] is top
 * @param  window.arguments[3] is width
 * @param  window.arguments[4] is height
 * @param  window.arguments[5] is type
 * @return none
 */
var winLeft   = 0;
var winTop    = 500;
var winWidth  = 800;
var winHeight = 300; 
var winUrl    = null;
var winType   = 0;
var bTransmitEvt = false;

const PBWIN_PAGETIP   = 0;
const PBWIN_PHONETIP  = 1;
const PBWIN_CURPHONE  = 2;
const PBWIN_MENU      = 3;

function onStart ()
{
    try
    {
        winUrl = window.arguments[0];
        winLeft = window.arguments[1];
        winTop = window.arguments[2];
        winWidth = window.arguments[3];
        winHeight = window.arguments[4];
        winType = window.arguments[5];
    }
    catch(ex)
    {
        ;
    }
    var win = document.getElementById("plus-window");
    win.setAttribute("width", winWidth);
    win.setAttribute("height", winHeight);
    win.setAttribute("screenX", winLeft);
    win.setAttribute("screenY", winTop);
    loadWinUrl(winUrl);
    addEventListener('keydown', onKey, true);
}

/**
 * onKey
 * 
 * Description:
 *  handle keydown event
 *
 * History:
 *  2007.8.29      xszhong        Creation
 *
 * @param  evt event object
 * @return none
 */
function onKey(evt)
{
    var key = getKey(evt);
    if (bTransmitEvt)
    {
        if (key == GK_SWITCH)
        {
            setWinFocus(true);
            return;    
        }
        else if (key == GK_MENU  || key == GK_HOME)
        {
            return;
        }
        transmitEvtToBrowser(evt);
        evt.preventDefault();
        evt.stopPropagation();
        return;
    }
    switch (key)
    {
        default: break;
        case GK_BACK:
        case GK_CLEAR:
            if (winType == PBWIN_PAGETIP)
            {
                var browserWin = getBrowserWindow();
                if (browserWin && browserWin.closeTipWin)
                {
                    browserWin.closeTipWin();
                }
                else
                {    
                    self.close();
                }                  
            }
            if (winType == PBWIN_MENU)
            {
                closeMenuWin();
            }
            break;

        case  GK_MENU:
            if (winType == PBWIN_MENU)
            {
                closeMenuWin();
            }
            break;

        /*when keypress Home, go to Homepage and closeMenu*/
        case  GK_HOME:
            if (winType == PBWIN_MENU)
            {
                browserHome();
                closeMenuWin();
            }
            break;

        /*when keypress more info, to check message is showing, if so,
        then closemenu and show the detail win of the message
        */
        case  GK_MESSAGE:
            if (winType == PBWIN_MENU)
            {
                var browserWin = getBrowserWindow();
                if (browserWin && browserWin.gStatusManager 
                    && browserWin.gStatusManager.msgBoxShowing)
                {
                    if (browserWin.gStatusManager.msgBoxShowing())
                    {
                        closeMenuWin();
                        browserWin.gStatusManager.showMsgDetail();
                    }
                }                
            }
            else if (winType == PBWIN_CURPHONE)//message detail win
            {
                closeWin();
            }
            break;
        case  GK_SWITCH:
            if (!bTransmitEvt)
            {
                var browserWin = getBrowserWindow();
                if (browserWin && browserWin.getCurPageType 
                    && (browserWin.getCurPageType() == 1))
                /*the current page is live or vod page, so can switch focus*/ 
                {
                    setWinFocus(false);
                }
            }
            break;
    }
    return;
}

/**
 * closeWin
 * 
 * Description:
 *  close the message window,and notify the browser.
 *
 * History:
 *  2007.8.20      xszhong        Creation
 *
 * @param  
 * @return none
 */
function closeWin()
{
    var browserWin = getBrowserWindow();
    if (browserWin && browserWin.gStatusManager
        && browserWin.gStatusManager.closeMsgDetail)
    {
        browserWin.gStatusManager.closeMsgDetail();
    }
    else
    {    
        self.close();
    }
    return;
}

/**
 * setWinPos
 * 
 * Description:
 *  set the window position.
 *
 * History:
 *  2007.8.28      xszhong        Creation
 *
 * @param  
 * @return none
 */
function setWinPos(left, top, width, height)
{
    winLeft   = left;
    winTop    = top;
    winWidth  = width;
    winHeight = height;
    window.moveTo(left, top);
    window.resizeTo(width, height);
}

/**
 * loadWinUrl
 * 
 * Description:
 *  load the win url.
 *
 * History:
 *  2007.8.28      xszhong        Creation
 *
 * @param  
 * @return none
 */
function loadWinUrl(url)
{
    winUrl = url;
    var browser = document.getElementById("content");
    if (winUrl)
    {
        browser.loadURI(winUrl);
    }
}


/**
 *transmitEvtToBrowser 
 * 
 * Description:
 *  transmit event to the gale browser.
 *
 * History:
 *  2007.8.28      xszhong        Creation
 *
 * @param  
 * @return none
 */
function transmitEvtToBrowser(evt)
{
    var browserWin = getBrowserWindow();
    if (browserWin) 
    {
        var evtObj = browserWin.gBrowser.browsers[0].contentDocument
            .createEvent('KeyEvents');
        evtObj.initKeyEvent("keydown", true, true, null
            , evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey
            , evt.keyCode, evt.charCode);
        browserWin.gBrowser.browsers[0].contentDocument.dispatchEvent(evtObj);        
    }
}

/**
 * leaveWinFocus
 * 
 * Description:
 *  the current page lose focus.
 *
 * History:
 *  2007.10.26      xszhong        Creation
 *
 * @param  
 * @return none
 */
function leaveWinFocus()
{
    var browser = document.getElementById("content");
    if (browser && browser.contentWindow 
        && browser.contentWindow.leaveWinFocus)
    {
        try
        {
            browser.contentWindow.leaveWinFocus();
        }
        catch(ex)
        {}
    }
}

/**
 * enterWinFocus
 * 
 * Description:
 *  the current page get focus.
 *
 * History:
 *  2007.10.26      xszhong        Creation
 *
 * @param  
 * @return none
 */
function enterWinFocus()
{
    var browser = document.getElementById("content");
    if (browser && browser.contentWindow 
        && browser.contentWindow.enterWinFocus)
    {
        try
        {
            browser.contentWindow.enterWinFocus();
        }
        catch(ex)
        {}
    }
}

/**
 * setWinFocus
 * 
 * Description:
 *  the current page get focus or not focus.
 *
 * History:
 *  2007.10.26      xszhong        Creation
 *
 * @param  boolean true the current page get focus, or lose focus.
 * @return none
 */
function setWinFocus(flag)
{
    if (flag)
    {
        if (bTransmitEvt)
        {
            enterWinFocus();
            bTransmitEvt = false;  
        }
    }
    else
    {
        if (!bTransmitEvt)
        {
            bTransmitEvt = true;
            leaveWinFocus();  
        }
    }
}
