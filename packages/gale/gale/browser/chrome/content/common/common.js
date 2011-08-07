/**
 * stbShutdown
 * 
 * Description:
 *  关闭stb
 *
 * History:
 *  2007.6.1      xbluo      Creation
 *
 * @param
 * @return
 */   
function stbShutdown()
{
    try 
    {
        var file = Components.classes["@mozilla.org/file/local;1"]
            .createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath("/sbin/init");
        var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
        process.init(file);
        var args = ["0"];
        process.run(true, args, args.length);
    }
    catch (ex)
    {
        return;
    }
}

/**
 * stbRestart
 * 
 * Description:
 *  重启stb
 *
 * History:
 *  2007.6.1      xbluo      Creation
 *
 * @param
 * @return
 */  
function stbRestart()
{
    try
    {
        var file = Components.classes["@mozilla.org/file/local;1"]
            .createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath("/sbin/init");
        var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
        process.init(file);
        var args = ["6"];
        process.run(true, args, args.length);
    }
    catch (ex)
    {
        return;
    }    
}

/**
 * stbStandBy
 * 
 * Description:
 *  boost the stand by shell script
 *
 * History:
 *  2007.8.21      xszhong      Creation
 *
 * @param
 * @return
 */  
function stbStandBy()
{
    var ret = 1;
    try
    {
        var dirSrv = Components
            .classes["@mozilla.org/file/directory_service;1"]
            .getService(Components.interfaces.nsIProperties);
        var xulbinPath = dirSrv.get("CurProcD"
            , Components.interfaces.nsILocalFile);
        var shFile = xulbinPath.parent.parent;
        shFile.append("gale_standby");
        if (shFile.exists())
        {
            var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
            process.init(shFile);
            var args = [];
            process.run(false, args, args.length);
            ret = 0;
        }
    }
    catch(ex)
    {
        ;    
    }
    return ret;    
}

/**
 * stbPowerOff
 * 
 * Description:
 *  boost the power off shell script.
 *  the project file location is following
 *     gale
 *         ->bin //the executed file location
 *            ->gale_poweroff
 *            ->gale_standby
 *            ->browser
 *                    ->components
 *                            ->ILiveClient.so
 *                            ................
 *                    ->plugins
 *                            ->libflashplayer.so
 *                            ->libvlcplugin.so
 *                            ................
 *                    ->chrome
 *                            ................
 *                    ->defaults
 *                            ................
 *                    ->extensions
 *                            ................
 *                    ->xulrunner
 *                            -> xulrunner=>the main xulrunner execute file
 *                            ..............
              ...............
 *        ->conf //the configure file location
 *            ...........
 *        ->lib //the library file location
 *            ...........
 *        ->update //the file location which is relative to update.
 *               ->stb.py
 *               .............
 * History:
 *  2007.8.21      xszhong      Creation
 *
 * @param
 * @return
 */  
function stbPowerOff()
{
    var ret = 1;
    try
    {
        var dirSrv = Components
            .classes["@mozilla.org/file/directory_service;1"]
            .getService(Components.interfaces.nsIProperties);
        var xulbinPath = dirSrv.get("CurProcD"
            , Components.interfaces.nsILocalFile);
        var shFile = xulbinPath.parent.parent;
        shFile.append("gale_poweroff");
        if (shFile.exists())
        {
            var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
            process.init(shFile);
            var args = [];
            process.run(false, args, args.length);
            ret = 0
        }
    }
    catch(ex)
    {
        ;
    }
    return ret;    
}

/**
 * stbUpdate
 * 
 * Description:
 *  boost the update script
 *
 * History:
 *  2007.8.31      xszhong      Creation
 *
 * @param
 * @return
 */  
function stbUpdate()
{
    var ret = 1;
    try
    {
        var dirSrv = Components
            .classes["@mozilla.org/file/directory_service;1"]
            .getService(Components.interfaces.nsIProperties);
        var xulbinPath = dirSrv.get("CurProcD"
            , Components.interfaces.nsILocalFile);
        var shFile = xulbinPath.parent.parent.parent;
        shFile.append("update");
        shFile.append("stb.py")
        if (shFile.exists())
        {
            var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
            process.init(shFile);
            var args = ["-d"];
            process.run(false, args, args.length);
            ret = 0;
        }
    }
    catch(ex)
    {
        ;    
    }
    return ret;
}

/**
 * stbChgVol
 * 
 * Description:
 *  change the status of audio.the gale_volume.py parameter should reference
 *  to the description of program.
 *
 * History:
 *  2007.9.27      xszhong      Creation
 *  2007.10.31     xszhong      Update
 *
 * @param array. the length of array is 2 or 3.for example: 
 *   set Headphone [0..100]/unmute/mute
 *   get Headphone  
 * @return int if change volume has error,return -1;
 * when get or set volume, if return value is between 51 and 101, this 
 * describes the audio's current value= (ret -51)*2,and unmute status;
 * if return value is between 102 an 152, this describes the audio's
 * current value=(ret -102)*2, and mute status.if has error,return -1.
 */  
function stbChgVol()
{
    var ret = -1;
    if (arguments.length != 3 && arguments.length != 2)
    {
        return -1;
    }
    if (arguments[0] != SETVOLCOM && arguments[0] != GETVOLCOM)
    {
        return -1;
    }
    try
    {
        var dirSrv = Components
            .classes["@mozilla.org/file/directory_service;1"]
            .getService(Components.interfaces.nsIProperties);
        var xulbinPath = dirSrv.get("CurProcD"
            , Components.interfaces.nsILocalFile);
        var shFile = xulbinPath.parent.parent;
        shFile.append("gale_volume");
        if (shFile.exists())
        {
            var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
            process.init(shFile);
            var args = new Array(arguments.length);
            for(var i = 0; i < arguments.length; i++)
            {
                args[i] = arguments[i];
            }
            process.run(true, args, args.length);
            ret = process.exitValue;

            /**set/get action result*/
            /**unmute status,current value can be calculated this value*/
            if (!(ret >= UNMUTEVALBEGIN && ret <= UNMUTEVALEND) && 
                !(ret >= MUTEVALBEGIN && ret <= MUTEVALEND))/**mute status*/
            {
                ret = -1; /**get/set action has error*/
                return ret;
            }

            /*check when chage volume, if mute, then set unmute*/
            if ((arguments[0] == SETVOLCOM) && (arguments.length == 3) 
                && (arguments[2] != VOLMUTE) && (arguments[2] != VOLUNMUTE) 
                && (ret >= MUTEVALBEGIN) && (ret <= MUTEVALEND))
            {
                args[2] = VOLUNMUTE;
                process.run(true, args, args.length);
                ret = process.exitValue;
    
                /**set/get action result*/
                /**unmute status,current value can be calculated this value*/
                if (!(ret >= UNMUTEVALBEGIN && ret <= UNMUTEVALEND) && 
                    !(ret >= MUTEVALBEGIN && ret <= MUTEVALEND))/**mute status*/
                {
                    ret = -1; /**get/set action has error*/
                    return ret;
                }
            }            
        }
    }
    catch(ex)
    {
        ret = -1;    
    }
    return ret;    
}
 
/**
 * comChgFullScreen
 * 
 * Description:
 *  设置是否全屏
 *
 * History:
 *  2006.12.18      xszhong        Creation
 *
 * @param fullscreen boolean
 * @param intervals integer after time intervals(unit ms) change
 * @return
 */ 
function comChgFullScreen(fullscreen, intervals) 
{
    
	window.doFullScreen = window.setInterval(
    	function() {            
            window.fullScreen = fullscreen;
            window.clearInterval(window.doFullScreen);
	    }
		,intervals);
		
}

/**
 * loadSP
 *
 * Description:
 * load sp page used in linux.
 *
 * History:
 *  2007.05.15      xszhong        Creation
 *
 * @param   spUrl

 * @return
 */	
function loadSP(spUrl)
{
    if (window.opener)
    {
        window.loadSPTimeout = setTimeout(
        function() {
            window.clearTimeout(window.loadSPTimeout);
            browserGo(spUrl);
            window.close();
        }
        ,1000);
    }
}
