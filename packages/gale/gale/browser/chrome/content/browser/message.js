/**
 * Copyright (C) by B-Star.
 *
 * Do not use, copy, modify, and distribute this software and its documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 *
 * File:  
 *    message.js
 * Description:
 *    this file defines behavior of the message-detail window 
 */

// TODO: disable new window in this browser!

/**
 * onStart
 * 
 * Description:
 *  Initial Window size and load the message detail url 
 *
 * History:
 *  2007.4.29      xbluo        Creation
 *
 * @param  none
 * @return none
 */ 
function onStart ()
{
    var url = null;
    if (window.arguments[0])
    {
        url = window.arguments[0];
    }
    var win = document.getElementById('messages-window');
    win.setAttribute("height",  300);
    win.setAttribute("width",   800);
    win.setAttribute("screenX", 0);
    win.setAttribute("screenY", screen.height - 300);
    
    var messages = document.getElementById("messages");
    if (url)
    {
        messages.loadURI(url);
    }
    else
    {
//        messages.loadURI("www.google.cn");
        ;
    }
    addEventListener('keydown', onKey, true);
}

/**
 * onKey
 * 
 * Description:
 *  handle keydown event
 *
 * History:
 *  2007.5.29      xbluo        Creation
 *
 * @param  evt event object
 * @return none
 */
function onKey (evt)
{
    var key = getKey (evt);
    switch (key)
    {
        default : break;
        case GK_MESSAGE :
            closeWin();
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
