/**
 * Copyright (C) by B-Star.
 *
 * Do not use, copy, modify, and distribute this software and its documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 */
 
// TODO: remove all alert berfore release! 
  
var _DEBUG  = false;

const SystemInfCID    = "@b-star.cn/SystemInformation/SystemInformation;1";
var PMenablePrivilege = netscape.security.PrivilegeManager.enablePrivilege;


const SETVOLCOM = 'set';
const GETVOLCOM = 'get';
const VOLNAMEHEADPHONE = 'Headphone';
const VOLNAMEALL       = 'all';
const VOLNAMEMAIN      = 'main';
const VOLMUTE          = 'mute';
const VOLUNMUTE        = 'unmute';
const UNMUTEVALBEGIN   = 51;
const UNMUTEVALEND     = 101;
const MUTEVALBEGIN     = 102;
const MUTEVALEND       = 152;
const VOLNAMEFRONTMIC  = 'Front Mic';

/**
 * getBrowserWindow
 * 
 * Description:
 *  Get the main chrome window, not public
 *
 * History:
 *  2007.4.13      xbluo        Creation
 *
 * @param  none
 * @return the browser window, return null if failed 
 */ 
function getBrowserWindow ()
{   
    try
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var windowManager = Components.
          classes['@mozilla.org/appshell/window-mediator;1'].getService();
        var windowManagerInterface = windowManager.
          QueryInterface( Components.interfaces.nsIWindowMediator);
        var BrowserWindow = windowManagerInterface.
          getMostRecentWindow( "navigator:browser" );
    }
    catch (ex)
    {
        /* alert for debug */
        debugalert ('Failed to get browser window! ' + ex);
        return null;
    }
    return BrowserWindow;
}

/**
 * getBrowser
 * 
 * Description:
 *  Get the browser core, not public
 *
 * History:
 *  2007.4.13      xbluo        Creation
 *
 * @param  none
 * @return the browser object, return null if failed 
 */ 
function getBrowser()
{
    try
    {
         netscape.security.PrivilegeManager.
           enablePrivilege ("UniversalXPConnect");  
         var BrowserWindow = getBrowserWindow ();
         if(!BrowserWindow)
         {
              return null;
         }
         var Browser = BrowserWindow.gBrowser;
    }
    catch(ex)
    {
        /* alert for debug */
        debugalert ('Failed to get browser! ' + ex);
        return null;
    }
    return Browser;
}

/**
 * browserGo
 * 
 * Description:
 *  Load the URI into the main browser window
 *
 * History:
 *  2007.4.13      xbluo        Creation
 *
 * @param  URI  string 
 * @return none 
 */ 
function browserGo(URI)
{
    try
    {
        netscape.security.PrivilegeManager.
          enablePrivilege ("UniversalXPConnect");  
        var win = getBrowserWindow();
        if (win)
        {
            win.innerBrowserGo (URI); 
        }
    }
    catch (ex)
    {
        debugalert (ex);
        return;
    }
}

/**
 * broserHome
 * 
 * Description:
 *  Load the home page into the browser window
 *
 * History:
 *  2007.4.13      xbluo        Creation
 *
 * @param  none
 * @return none 
 */ 
function browserHome()
{
    try
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win)
        {
            win.innerBrowserHome (); 
        }
    }
    catch (ex)
    {
        debugalert ('browserHome failed! '+ ex);
        return;
    }
}

/**
 * broswerLogin
 * 
 * Description:
 *  Load the login page into the browser window
 *
 * History:
 *  2007.9.13      xszhong        Creation
 *
 * @param  none
 * @return none 
 */ 
function browserLogin()
{
    try
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.loadLoginPage)
        {
            win.loadLoginPage(); 
        }
    }
    catch(ex)
    {
        return;
    }
}

/**
 * getUserID
 * 
 * Description:
 *  return the user id that login module got
 *
 * History:
 *  2007.5.30      xbluo        Creation
 *
 * @param  none
 * @return user id
 */ 
function getUserID ()
{
    netscape.security.PrivilegeManager.
      enablePrivilege("UniversalXPConnect");
    var win = getBrowserWindow ();
    if (win.strUserID)
    {
        return win.strUserID;
    }
    return ''; 
}

/**
 * setVolulme
 *
 * Description:
 *  Set devices volume of the according device name
 * History:
 *  2007.10.17  xszhong        Creation
 *  2007.10.31  xszhong        adpate the result to the current value.
 * @param:
 *   devname string
 *   val from 0 to 100
 * @return:
 *    0..100:set sucessfully, equal to current value.
 *   -1:     set fail.
 */
function setVolume(devname, val) 
{
    ret = -1;
    try 
    {
        var chgVolFun;
        netscape.security.PrivilegeManager.
            enablePrivilege("UniversalXPConnect");
        var win = getBrowserWindow();
        if (win && win.stbChgVol)
        {
            chgVolFun = win.stbChgVol; 
        }
        else
        {
            return ret;
        }
        if (val < 0)
        {
            val = 0;
        }
        else if (val > 100)
        {
            val = 100;
        }

        /**
        *change the value of audio
        */
        ret = chgVolFun(SETVOLCOM, devname, val);
        if (ret >= UNMUTEVALBEGIN && ret <= UNMUTEVALEND)
        {
            ret = (ret - UNMUTEVALBEGIN) * 2;
        }
        else if (ret >= MUTEVALBEGIN && ret <= MUTEVALEND)
        {
            ret = (ret - MUTEVALBEGIN) * 2;
        }
        else
        {
            ret = -1;
        }
    }
    catch(ex) 
    {
        ret = -1;
    }
    return ret;
}

/**
 * setSysVolulme
 *
 * Description:
 *  Set system sound devices volume
 * History:
 *  2007.7.3    xbluo        Creation
 *  2007.9.27   xszhong  change set system volume according python script.
 *  2007.10.18  xszhong  change through public functin of setVolume.
 * @param:
 *   val from 0 to 100
 * @return:
 *    0..100:set sucessfully, equal to current value.
 *   -1:fail
 */
function setSysVolume (val) 
{
    return setVolume(VOLNAMEMAIN, val);
}

/**
 * setMicVolulme
 *
 * Description:
 *  Set capture source mic volume
 * History:
 *  2007.10.17   xszhong  change set mic volume according python script.
 * @param:
 *   val from 0 to 100
 * @return:
 *    0..100:set sucessfully, equal to current value.
 *   -1:fail
 */
function setMicVolume(val) 
{
    return setVolume(VOLNAMEFRONTMIC, val);
}

/**
 * setMute
 *
 * Description:
 *  Set sound channel mute status 
 * History:
 *  2007.7.3  xbluo     Creation
 *  2007.9.27 xszhong   set mute status of audio according to python script.
 * @param:
 *  bMute ,true if set mute, false set unmute.
 * @return:
 *  boolean, true describes the action sucessfully, else unsucessfully,
 *  don't describe the current status of audio. 
 */
function setMute(bMute) 
{
    ret = false;
    try 
    {
        var chgVolFun;
        netscape.security.PrivilegeManager.
            enablePrivilege("UniversalXPConnect");
        var win = getBrowserWindow();
        if (win && win.stbChgVol)
        {
            chgVolFun = win.stbChgVol; 
        }
        else
        {
            return ret;
        }
        var val;
        if (bMute)
        {
            val = VOLMUTE;
        }
        else
        {
            val = VOLUNMUTE;
        }
        ret = chgVolFun(SETVOLCOM, VOLNAMEMAIN, val);
        if ((bMute && ret >= MUTEVALBEGIN && ret <= MUTEVALEND) 
            ||(!bMute && ret >= UNMUTEVALBEGIN && ret <= UNMUTEVALEND)) 
        {
            ret = true;
        }
    }
    catch(ex) 
    {
        ret = false;
    }
    return ret;
}

/**
 * getMute
 *
 * Description:
 *  Get sound channel mute status 
 * History:
 *  2007.7.3  xbluo       Creation
 *  2007.9.28 xszhong     getmute status of audio according to python script.
 *  2007.10.31 xszhong    change the result.
 * @param:
 *  none
 * @return:
 *  true if mute, if unmute, return false, if fail, return -1.
 */

function getMute() 
{
    ret = false;
    try 
    {
        var chgVolFun;
        netscape.security.PrivilegeManager.
            enablePrivilege("UniversalXPConnect");
        var win = getBrowserWindow();
        if (win && win.stbChgVol)
        {
            chgVolFun = win.stbChgVol; 
        }
        else
        {
            return ret;
        }
        ret = chgVolFun(GETVOLCOM, VOLNAMEHEADPHONE);
        if (ret >= MUTEVALBEGIN && ret <= MUTEVALEND)
        {
            ret = true;
        }
        else if (ret >= UNMUTEVALBEGIN && ret <= UNMUTEVALEND)
        {
            ret = false;
        }
        else
        {
            ret = -1;
        }
    }
    catch(ex) 
    {
        ret = -1;
    }
    return ret;
}

/**
 * getSoundCardId
 *
 * Description:
 *  Get sound card id ?????
 *
 * History:
 *  2007.7.3      xbluo        Creation
 * @param:
 *  none
 * @return:
 *  sound card id
 */
function getSoundCardId()
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        return obj.GetSndCardId();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getSndChannel
 *
 * Description:
 *  Get sound channel  ?????
 * History:
 *  2007.7.3    xbluo     Creation
 * @param:
 *  none
 * @return:
 *  dound card channel
 */
function getSoundChannel() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        return obj.GetSndChannel(0);
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getVolulme
 *
 * Description:
 *  get devices volume according to device
 * History:
 *  2007.10.17    xszhong Creation.
 * @param:
 *  devname string
 * @return:
 *  _retval PRInt32 * return value
              0-100 : successful
              -1    : get volume failed
 */
function getVolume(devname) 
{
    ret = -1;
    try 
    {
        var chgVolFun;
        PMenablePrivilege("UniversalXPConnect");
        var win = getBrowserWindow();
        if (win && win.stbChgVol)
        {
            chgVolFun = win.stbChgVol; 
        }
        else
        {
            return ret;
        }
        ret = chgVolFun(GETVOLCOM, devname);
        if (ret >= UNMUTEVALBEGIN && ret <= UNMUTEVALEND)
        {
            ret = (ret - UNMUTEVALBEGIN) * 2;
        }
        else if (ret >= MUTEVALBEGIN && ret <= MUTEVALEND)
        {
            ret = (ret - MUTEVALBEGIN) * 2;
        }
        else
        {
            ret = -1;
        }
    }
    catch(ex) 
    {
        ret = -1;
    }
    return ret;
}

/**
 * getSysVolulme
 *
 * Description:
 *  Set system sound devices volume
 * History:
 *  2007.7.3  xbluo        Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 *  2007.9.28     xszhong change the style of get sys volume.
 *  2007.10.18    xszhong change through public functin of setVolume.
 * @param:
 *  none
 * @return:
 *  _retval PRInt32 * return value
              0-100 : successful
              -1 : get volume failed
 */
function getSysVolume() 
{
    return getVolume(VOLNAMEHEADPHONE);
}

/**
 * getMicVolulme
 *
 * Description:
 *  get capture source mic volume
 * History:
 *  2007.10.17    xszhong Creation
 * @param:
 *  none
 * @return:
 *  _retval PRInt32 * return value
              0-100 : successful
              -1    : get volume failed
 */
function getMicVolume() 
{
    return getVolume(VOLNAMEFRONTMIC);
}

/**
 * getIp
 *
 * Description:
 *  Get the ip of eht0
 * History:
 *  2007.7.3      xbluo       Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param: none
 * @return: ip string
 */
function getIp() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);

        var ip = obj.GetIp();
        return ip.toString ();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getMac
 *
 * Description:
 *  Get the mac
 * History:
 *  2007.7.3      xbluo       Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 * @return:
 *  mac string
 */
function getMac() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        var mac = "000000"; //obj.GetMac();
        return mac.toString ();
    }
    catch (err)
    {
        debugalert(err);
        return "000000"; //null;
    }
}

/**
 * getCpuType
 *
 *  Description:
 * Get cpu type
 * History:
 *  2007.7.3      xbluo       Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 * @return:
 *  string on cpu type
 */
function getCpuType() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        var ctype = obj.GetCpuType();
        return ctype.toString ();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getCpuUsage
 *
 * Description:
 * Get cpu use status
 * History:
 *  2007.7.3      xbluo       Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 * @return:
 *  cpu usage 
 */
function getCpuUsage() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        var usage = obj.GetCpuUsage();
        return usage.toString ();
    }
    catch (err)
     {
        debugalert(err);
        return null;
    }
}

/**
 * getRunTime
 *
 * Description:
 * Get how long time the computer has been running from last boot
 *
 * History:
 *  2007.7.3    xbluo       Creation
 *  2007.7.20   xszhong   change cid and get obj by getservice.
 * @param:
 *  none 
 *
 * @return:
 *  string of run time from last boot 
 */
function getRunTime() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        runTime = obj.GetRunTime();
        return runTime.toString ();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getKernelVersion
 *
 * Description:
 * Get Kernel Version
 *
 * History:
 *  2007.7.3    xbluo        Creation
 *  2007.7.20   xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 *
 * @return:
 *  kernel version 
 */
function getKernelVersion() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        ret = obj.GetKernelVersion();
        return ret.toString ();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getDiskUsage
 *
 * Description:
 * Get disk use status ?????
 *
 * History:
 *  2007.7.3      xbluo       Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 *
 * @return:
 *  disk usage 
 */
function getDiskUsage() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        return obj.GetDiskUsage();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getMemoryUsage
 *
 * Description:
 * Get memory use status
 *
 * History:
 *  2007.7.3      xbluo      Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 *
 * @return:
 *  memory usage
 */
function getMemoryUsage() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        return obj.GetMemoryUsage();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getUsbDevices
 *
 * Description:
 * Get all usb devices used with this computer. The information includes,product name,venderid,
 * productid,manufacturer and so on
 *
 * History:
 *  2007.7.3      xbluo        Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 *
 * @return:
 *  usb devices list
 */
function getUsbDevices() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        ret = obj.GetUsbDevices();
        return ret.toString ();
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 * getNetStatus
 *
 * Description:
 * Detect the whether the net line is linked ok
 *
 * History:
 *  2007.7.3      xbluo        Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 

 * @return:
 *  network status
 */

function getNetStatus() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        ret = obj.GetNetStatus();
        return ret.toString ();
    }
    catch (err) 
    {
        debugalert (err);
        return null;
    }
}

/**
 * getNetBandWidth
 *
 * Description: 
 * Detect the current data stream. Sometimes,it may be is zero,but not prove the net link is not ok.
 *
 * History:
 *  2007.7.3      xbluo        Creation
 *  2007.7.20     xszhong change cid and get obj by getservice.
 * @param:
 *  none 
 *
 * @return:
 *  net band width 
 */
function getNetBandWidth() 
{
    try 
    {
        PMenablePrivilege("UniversalXPConnect");
        var obj = Components.classes[SystemInfCID]
            .getService(Components.interfaces.ISystemInformation);
        var netBandWidth = {};
        obj.GetNetBandwidth(netBandWidth );
        return netBandWidth.value;
    }
    catch (err) 
    {
        debugalert(err);
        return null;
    }
}

/**
 *set_character_sign 
 *
 * Description: 
 * set the character sign of the current page
 *
 * History:
 *  2007.8.20      xszhong        Creation
 * @param:string the sign value .
 * the default code is 00000-000000-00000,describe that 
 * it can show the normal information
 *
 * @return:
 */
function set_character_sign(csign) 
{
    try 
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.setPageCsign)
        {
            win.setPageCsign(csign); 
        }
    }
    catch(err) 
    {
        ;
    }
}

/**
 *getCurPageType 
 *
 * Description: 
 * get the type of the current page
 *
 * History:
 *  2007.8.28      xszhong        Creation
 * @param:
 *
 * @return:int 0 ->homepage
               1 ->television
               2 ->no television
               -1->error  
 */
function getCurPageType() 
{
    ret = -1;
    try 
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.innerGetCurPageType)
        {
            ret = win.innerGetCurPageType(); 
        }
    }
    catch(err) 
    {
        ;
    }
    return ret;
}

/**
 *openPhoneWin() 
 *
 * Description: 
 * open a dialog window which is relative to phone
 * only used for phone service.

 * History:
 *  2007.8.29      xszhong        Creation
 * @param:url    string->describe the url of the open phone window should open
          left   int   ->describe the left position of the open phone window.
          top    int   ->describe the top position of the open phone window.
          width  int   ->describe the width position of the open phone window.
          height int   ->describe the height position of the open phone window
          type   int   ->describe the use type of the open phone window.
                 0     ->tip
                 1     ->phone
                 2     ->message detail
 * 
 * @return:boolean describing open successfully or not
 */
function openPhoneWin(url, left, top, width, height, type)
{
    ret = false;
    try 
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.innerOpenPhoneWin)
        {
            ret = win.innerOpenPhoneWin(url, 
                left, top, width, height, type); 
        }
    }
    catch(err) 
    {
        ;
    }
    return ret;
}  

/**
 *closePhoneWin() 
 *
 * Description: 
 * close the window which is relative to phone
 * only used for phone service.

 * History:
 *  2007.8.29      xszhong        Creation
 * @param:
 *
 * @return:boolean describing close successfully or not
 */
function closePhoneWin()
{
    ret = false;
    try 
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.innerClosePhoneWin)
        {
            ret = win.innerClosePhoneWin(); 
        }
    }
    catch(err) 
    {
        ;
    }
    return ret;
}  

/**
 *setPhoneWinPos() 
 *
 * Description: 
 * set the position of the window which is relative to phone
 * only used for phone service.

 * History:
 *  2007.8.29      xszhong        Creation
 * @param:
 *
 * @return:boolean describing close successfully or not
 */
function setPhoneWinPos(left, top, width, height)
{
    ret = false;
    try 
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.innerSetPhoneWinPos)
        {
            ret = win.innerSetPhoneWinPos(left, top, width, height); 
        }
    }
    catch(err) 
    {
        ;
    }
    return ret;
}

/**
 *closeMenuWin() 
 *
 * Description: 
 * close the window which is relative to menu
 * only used for sp0 service.

 * History:
 *  2007.9.26      xszhong        Creation
 * @param:
 *
 * @return:boolean describing close successfully or not
 */
function closeMenuWin()
{
    try 
    {
        netscape.security.PrivilegeManager.
          enablePrivilege("UniversalXPConnect"); 
        var win = getBrowserWindow();
        if (win && win.closeMenu)
        {
            win.closeMenu(); 
        }
    }
    catch(err) 
    {
        ;
    }
}

function debugalert (info)
{
    if (_DEBUG)
    {
        alert (info);
    }
}

