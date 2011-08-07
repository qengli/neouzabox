/* JavaScript Document*/

/**
 * Copyright (C), 1988-2006, by B-Star.
 *
 * Do not use, copy, modify, and distribute this  software and its documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 */ 

const enablePrivilege     = netscape.security.PrivilegeManager.enablePrivilege;
const DIRSRV_CTRID        = "@mozilla.org/file/directory_service;1";
const FILEINSTREAM_CTRID  = "@mozilla.org/network/file-input-stream;1";
const FILEOUTSTREAM_CTRID = "@mozilla.org/network/file-output-stream;1";
const DOMSERIALIZER       = "@mozilla.org/xmlextras/xmlserializer;1";

const CURPROPATH          = "resource:app" //Leo 2007.11.20
const galefile            = "gale.xml";
const portalfile          = "portal.xml";
const configfile          = "config.xml";
const CONFPATHNAME        = "conf";
const CHROMEPATHNAME      = "chrome";
const CONTENTPATHNAME     = "content";
const PORTALPATHNAME      = "portal";
const HOMEPATHNAME        = "home";           
const MENUPATHNAME        = "menu";
const HOMENAME            = "index";           
const MENUNAME            = "menu";
const SUFFIXHTMLS         = ".html,.htm,.xul";
const PATHSEPARATOR       = "/";
const PREFIXPORTALPATH    = "chrome://gale/content/portal/";

const charSetCode         = "UTF-8";

/* notice that these valuse are octal. */
const PERM_IRWXU = 00700;  /* read, write, execute/search by owner */
const PERM_IRUSR = 00400;  /* read permission, owner */
const PERM_IWUSR = 00200;  /* write permission, owner */
const PERM_IXUSR = 00100;  /* execute/search permission, owner */
const PERM_IRWXG = 00070;  /* read, write, execute/search by group */
const PERM_IRGRP = 00040;  /* read permission, group */
const PERM_IWGRP = 00020;  /* write permission, group */
const PERM_IXGRP = 00010;  /* execute/search permission, group */
const PERM_IRWXO = 00007;  /* read, write, execute/search by others */
const PERM_IROTH = 00004;  /* read permission, others */
const PERM_IWOTH = 00002;  /* write permission, others */
const PERM_IXOTH = 00001;  /* execute/search permission, others */

const PERMS_FILE    = 0644;

const MODE_RDONLY   = 0x01;
const MODE_WRONLY   = 0x02;
const MODE_RDWR     = 0x04;
const MODE_CREATE   = 0x08;
const MODE_APPEND   = 0x10;
const MODE_TRUNCATE = 0x20;
const MODE_SYNC     = 0x40;
const MODE_EXCL     = 0x80;


/**
 * UserInfo
 * 
 * Description:
 *  user info class
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  uid user id
 * @param  passwd user passwd
 * @return 
 */ 
function UserInfo(uid, passwd)
{
    this.user   = uid;
    this.passwd = passwd;
}

/**
 * PortalStyle
 * 
 * Description:
 *  portal style configure
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  def default style
 * @param  pref user setup style
 * @param  styles current styles array of portalconfigstyle
 * @return 
 */ 
function PortalStyle(def, pref)
{
    this.defStyle  = def;
    this.prefStyle = pref;
    this.styles    = null;
}

/**
 * PortalConfigStyle
 * 
 * Description:
 *  portal configure style information
 *
 * History:
 *  2007.5.20      xszhong        Creation
 * 
 * @param  portal name according to pathname
 * @parm   version current version
 * @param  picurl  thumb pic url
 * @return 
 */ 
function PortalConfigStyle(portname, version, picurl)
{
    this.stylename  = portname;
    this.ver   = version;
    this.picurl = picurl;
}

/**
 * getGaleFile
 * 
 * Description:
 *  Open Gale Configure File gale.xml
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  none
 * @return gale.xml file handle
 */ 
function getGaleFile()
{
    enablePrivilege('UniversalXPConnect');
    var dirSrv = Components.classes[DIRSRV_CTRID]
        .getService(Components.interfaces.nsIProperties);
    //"CurProcD"=>current process path
    var curPath = dirSrv.get(CURPROPATH
        , Components.interfaces.nsILocalFile);
    try
    {
        curPath = curPath.parent; //Leo 2007.11.20
        curPath.append(CONFPATHNAME);   
        curPath.append(galefile);
        if (!curPath.exists())
        {
            curPath = null;
        }
    }
    catch(ex)
    {
        curPath = null;
    }
    return curPath;
}

/**
 * getUserInfo
 * 
 * Description:
 *  Get UserInfo From Gale Configure File gale.xml
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  xmlfile gale.xml file
 * @param  userInfo UserInfo object
 * @return boolean describe whether get userinfo.
 */ 
function getUserInfo(xmlfile, userInfo)
{
    userInfo.user   = null;
    userInfo.passwd = null;
    if (!xmlfile)
    {
        return false;
    }
    enablePrivilege('UniversalXPConnect');
    var fileInStream = Components.classes[FILEINSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileInputStream);

    fileInStream.init(xmlfile, MODE_RDONLY, PERMS_FILE, false);

    var domParser = new DOMParser();
    try
    {
        var dom = domParser.parseFromStream(fileInStream, charSetCode,
                    xmlfile.fileSize, "text/xml");

        if (dom.documentElement.nodeName == "parsererror")
        {
            return false;
        }
        
        var rootChildren = dom.documentElement.childNodes;
            
        for (var i = 0; i < rootChildren.length; i++)
        {
            if (rootChildren[i].nodeType != 1)
            {
                continue;
            }
            
            if (rootChildren[i].tagName == 'user')
            {
                var userChildren = rootChildren[i].childNodes;
                for (var j = 0; j < userChildren.length; j++)
                {
                    if (userChildren[j].nodeType != 1)
                    {
                        continue;
                    }
            
                    if (userChildren[j].tagName == 'uid')
                    {
                        userInfo.user   = userChildren[j]
                            .childNodes[0].textContent;
                    }
                    if (userChildren[j].tagName == 'password')
                    {
                        userInfo.passwd = userChildren[j]
                            .childNodes[0].textContent;                     
                    }

                }
                break;
            }
        }
        fileInStream.close();
    }
    catch(e)
    {
        return false;
    }    
    return true;
}

/**
 * setUserInfo
 * 
 * Description:
 *  set UserInfo To Gale Configure File gale.xml
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  xmlfile gale.xml file
 * @param  userInfo UserInfo object
 * @return boolean describe whether set userinfo to file successfully.
 */ 
function setUserInfo(xmlfile, userInfo)
{
    if (!xmlfile)
    {
        return false;
    }
    enablePrivilege('UniversalXPConnect');
    var fileInStream = Components.classes[FILEINSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileInputStream);

    fileInStream.init(xmlfile, MODE_RDONLY, PERMS_FILE, false);

    var domParser = new DOMParser();
    try
    {
        var dom = domParser.parseFromStream(fileInStream, charSetCode,
                    xmlfile.fileSize, "text/xml");

        if (dom.documentElement.nodeName == "parsererror")
        {
            return false;
        }        
        /*  
            dom.getElementsByTagName("uid")[0]
            .childNodes[0].textContent;
            dom.getElementsByTagName("password")[0]
            .childNodes[0].textContent;
            OK?
        */
        var rootChildren = dom.documentElement.childNodes;
            
        for (var i = 0; i < rootChildren.length; i++)
        {
            if (rootChildren[i].nodeType != 1)
            {
                continue;
            }
            
            if (rootChildren[i].tagName == 'user')
            {
                var userChildren = rootChildren[i].childNodes;
                for (var j = 0; j < userChildren.length; j++)
                {
                    if (userChildren[j].nodeType != 1)
                    {
                        continue;
                    }
            
                    if (userChildren[j].tagName == 'uid')
                    {
                        userChildren[j].childNodes[0].textContent = 
                            userInfo.user;
                    }
                    if (userChildren[j].tagName == 'password')
                    {
                        userChildren[j].childNodes[0].textContent =
                            userInfo.passwd;                     
                    }
                }
                break;
            }
        }
        fileInStream.close();

		var fileOutStream = Components.classes[FILEOUTSTREAM_CTRID]
			.createInstance(Components.interfaces.nsIFileOutputStream);
		fileOutStream.init(xmlfile, MODE_RDWR | MODE_TRUNCATE, 420, 0);
		var domSerializer =Components.classes[DOMSERIALIZER]
		    .createInstance(Components.interfaces.nsIDOMSerializer);
		
		domSerializer.serializeToStream(dom, fileOutStream, charSetCode);

		fileOutStream.close();
    }
    catch(e)
    {
        return false;
    }    
    return true;
}

/**
 * getPortalStyle
 * 
 * Description:
 *  Get portalStyle From Gale Configure File gale.xml
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  xmlfile gale.xml file
 * @param  portalStyle PortalStyle object
 * @return boolean describe whether get userinfo.
 */ 
function getPortalStyle(xmlfile, portalStyle)
{
    portalStyle.defStyle   = null;
    portalStyle.prefStyle  = null;
    if (!xmlfile)
    {       
        return false;
    }
    enablePrivilege('UniversalXPConnect');
    var fileInStream = Components.classes[FILEINSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileInputStream);

    fileInStream.init(xmlfile, MODE_RDONLY, PERMS_FILE, false);

    var domParser = new DOMParser();
    try
    {
        var dom = domParser.parseFromStream(fileInStream, charSetCode,
                    xmlfile.fileSize, "text/xml");

        if (dom.documentElement.nodeName == "parsererror")
        {
            return false;
        }      
        
        var rootChildren = dom.documentElement.getElementsByTagName('portal');
        if (!rootChildren)    
        {
            return fals;
        }
        for (var i = 0; i < rootChildren.length; i++)
        {
            if (rootChildren[i].nodeType != 1)
            {
                continue;
            }
            else
            {
                var portalChildren = rootChildren[i].childNodes;
                for (var k = 0; k < portalChildren.length; k++)
                {                    
                    if (portalChildren[k].nodeType != 1)
                    {
                        continue;
                    }
                    if (portalChildren[k].tagName == 'style')
                    {
                        var styleChildren = portalChildren[k].childNodes;
                        for (var j = 0; j < styleChildren.length; j++)
                        {
                            if (styleChildren[j].nodeType != 1)
                            {
                                continue;
                            }
                            try
                            {
                                if (styleChildren[j].tagName == 'default')
                                {
                                    portalStyle.defStyle   = 
                                        styleChildren[j]
                                        .childNodes[0].textContent;
                                }
                                if (styleChildren[j].tagName == 'pref')
                                {
                                    portalStyle.prefStyle  = styleChildren[j]
                                        .childNodes[0].textContent;                     
                                }
                            }
                            catch(ex)
                            {}
                        }
                        break;
                    }
                }
                break;
            }
        }
        fileInStream.close();
    }
    catch(e)
    {
        return false;
    }    
    return true;
}


/**
 * setPortalStyle
 * 
 * Description:
 *  set PortalStyle To Gale Configure File gale.xml
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  xmlfile gale.xml file
 * @param  portalStyle UserInfo object
 * @return boolean describe whether set portalStyle to file successfully.
 */ 
function setPortalStyle(xmlfile, portalStyle)
{
    if (!xmlfile)
    {
        enablePrivilege('UniversalXPConnect');
        var dirSrv = Components.classes[DIRSRV_CTRID]
            .getService(Components.interfaces.nsIProperties);
        //"CurProcD"=>current process path
        var curPath = dirSrv.get(CURPROPATH
            , Components.interfaces.nsILocalFile);
        dump(curPath.path);
        curPath = curPath.parent;  //Leo 2007.11.20
        curPath.append(galefile);
        if (!curPath.exists())
        {
            return false;
        }
        xmlfile = curPath;
    }
    enablePrivilege('UniversalXPConnect');
    var fileInStream = Components.classes[FILEINSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileInputStream);

    fileInStream.init(xmlfile, MODE_RDONLY, PERMS_FILE, false);

    var domParser = new DOMParser();
    try
    {
        var dom = domParser.parseFromStream(fileInStream, charSetCode,
                    xmlfile.fileSize, "text/xml");

        if (dom.documentElement.nodeName == "parsererror")
        {
            return false;
        }
        
        var rootChildren = dom.documentElement.getElementsByTagName('portal');
        if (!rootChildren)    
        {
            return fals;
        }
        for (var i = 0; i < rootChildren.length; i++)
        {
            if (rootChildren[i].nodeType != 1)
            {
                continue;
            }
            else
            {
                var portalChildren = rootChildren[i].childNodes;
                for (var k = 0; k < portalChildren.length; k++)
                {                    
                    if (portalChildren[k].nodeType != 1)
                    {
                        continue;
                    }
                    if (portalChildren[k].tagName == 'style')
                    {
                        
                        var styleChildren = portalChildren[k].childNodes;
                        for (var j = 0; j < styleChildren.length; j++)
                        {
                            if (styleChildren[j].nodeType != 1)
                            {
                                continue;
                            }
                    
                            if (styleChildren[j].tagName == 'default')
                            {
                                styleChildren[j].childNodes[0].textContent =
                                    portalStyle.defStyle; 
                            }
                            if (styleChildren[j].tagName == 'pref')
                            {
                                styleChildren[j].childNodes[0].textContent =
                                    portalStyle.prefStyle;                     
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        fileInStream.close();

		var fileOutStream = Components.classes[FILEOUTSTREAM_CTRID]
			.createInstance(Components.interfaces.nsIFileOutputStream);
		fileOutStream.init(xmlfile, MODE_RDWR | MODE_TRUNCATE, 420, 0);
		var domSerializer =Components.classes[DOMSERIALIZER]
		    .createInstance(Components.interfaces.nsIDOMSerializer);
		
		domSerializer.serializeToStream(dom.documentElement, fileOutStream
            , charSetCode);

		fileOutStream.close();
    }
    catch(e)
    {
        return false;
    }    
    return true;
}

/**
 * writePortalFile
 * 
 * Description:
 *  write to ..\chrome\content\portal\portal.xml
 *
 * History:
 *  2007.5.9      xszhong        Creation
 * 
 * @param  str to written
 * @return boolean to describe to whether write successfully.
 */
function writePortalFile(str)
{
    enablePrivilege('UniversalXPConnect');
    var dirSrv = Components.classes[DIRSRV_CTRID]
        .getService(Components.interfaces.nsIProperties);
    //"CurProcD"=>current process path
    var curPath = dirSrv.get(CURPROPATH, Components.interfaces.nsILocalFile);
    try
    {
        curPath = curPath;  //Leo 2007.11.20
        curPath.append(CHROMEPATHNAME);    
        curPath.append(CONTENTPATHNAME);
        curPath.append(PORTALPATHNAME);
        curPath.append(portalfile);
    }
    catch(ex)
    {
        return false;
    }
    var file = curPath;
    try 
    {
        file.remove(false);                         
    } 
    catch (ex) 
    {
    }
    try
    {
        var fos = Components.classes[FILEOUTSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileOutputStream);
        fos.init(file, MODE_WRONLY | MODE_CREATE | MODE_TRUNCATE
            , PERMS_FILE, false);//-1,-1
        fos.write(str, str.length);
        fos.close();
    }
    catch(ex)
    {
        return false;
    }
    return true;
}

/**
 * getPortalVer
 * 
 * Description:
 *  Get portal version from portal.xml
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  no
 * @param  no
 * @return float describe the version.
 */ 
function getPortalVer()
{
    var ver = 0.0;
    enablePrivilege('UniversalXPConnect');    
    var dirSrv = Components.classes[DIRSRV_CTRID]
        .getService(Components.interfaces.nsIProperties);
    //"CurProcD"=>current process path
    var curPath = dirSrv.get(CURPROPATH, Components.interfaces.nsILocalFile);
    try
    {
        curPath = curPath; //Leo 2007.11.20
        curPath.append(CHROMEPATHNAME);    
        curPath.append(CONTENTPATHNAME);
        curPath.append(PORTALPATHNAME);
        curPath.append(portalfile);
    }
    catch(ex)
    {
        return ver;
    }

    enablePrivilege('UniversalXPConnect');
    var fileInStream = Components.classes[FILEINSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileInputStream);

    fileInStream.init(curPath, MODE_RDONLY, PERMS_FILE, false);
    var domParser = new DOMParser();
    try
    {
        var dom = domParser.parseFromStream(fileInStream, charSetCode,
                    curPath.fileSize, "application/xml");
        if (dom.documentElement.nodeName == "parsererror")
        {
            //alert('domelement error');
        }
        try
        {
            if (dom.documentElement.hasAttribute("version"))
            {
                ver = parseFloat(dom.documentElement
                    .getAttribute("version"));    
            }
        }
        catch(ex)
        {
            ver = 0.0;
        }
        fileInStream.close();
    }
    catch(e)
    {
        ver = 0.0;
    }    
    return ver;
}


/**
 * getConfigInfo
 * 
 * Description:
 *  Get config version from config.xml on the stylepath directory
 *
 * History:
 *  2007.5.18      xszhong        Creation
 * 
 * @param  stylepath portal directory.
 * @param  no
 * @return an object of PortalConfigStyle.
 */ 
function getConfigInfo(stylepath)
{ 
    var ret = new PortalConfigStyle(stylepath, 0, null);
    enablePrivilege('UniversalXPConnect');    
    var dirSrv = Components.classes[DIRSRV_CTRID]
        .getService(Components.interfaces.nsIProperties);
    //"CurProcD"=>current process path
    var curPath = dirSrv.get(CURPROPATH, Components.interfaces.nsILocalFile);
    try
    {
        curPath = curPath;   //Leo 2007.11.20
        curPath.append(CHROMEPATHNAME);    
        curPath.append(CONTENTPATHNAME);
        curPath.append(PORTALPATHNAME);
        curPath.append(stylepath);
        curPath.append(configfile);
        if (!curPath.exists())
        {
            return ret;
        }
    }
    catch(ex)
    {
        return ret;
    }
    enablePrivilege('UniversalXPConnect');
    var fileInStream = Components.classes[FILEINSTREAM_CTRID]
            .createInstance(Components.interfaces.nsIFileInputStream);

    fileInStream.init(curPath, MODE_RDONLY, PERMS_FILE, false);

    var domParser = new DOMParser();
    try
    {
        var dom = domParser.parseFromStream(fileInStream, charSetCode,
                    curPath.fileSize, "text/xml");

        if (dom.documentElement.nodeName == "parsererror")
        {
            return ret;
        }
        try
        {
            try
            {
                if (dom.documentElement.hasAttribute("version"))
                {
                    ret.ver = parseFloat(dom.documentElement
                        .getAttribute("version"));    
                }
            }
            catch(ex)
            {
                ;
            }
            var rootChildren = dom.documentElement.childNodes;
                
            for (var i = 0; i < rootChildren.length; i++)
            {
                if (rootChildren[i].nodeType != 1)
                {
                    continue;
                }
                if (rootChildren[i].tagName == 'thumb')
                {                    
                    try
                    {
                        ret.picurl = rootChildren[i].childNodes[0]
                            .textContent;
                        break;
                    }
                    catch(ex)
                    {
                        break;
                    }
                }
            }
        }
        catch(ex)
        {
            ;
        }
        fileInStream.close();
    }
    catch(e)
    {
        ;
    }    
    return ret;
}

/**
 * getConfigStyles
 * 
 * Description:
 *  Get all config style according to current version.
 *
 * History:
 *  2007.5.20      xszhong        Creation
 * 
 * @param  curVer if is null ,get all config style,else get 
 *   only ver >= curVer config style.
 * @return array of PortalConfigStyle.
 */ 
function getConfigStyles(Ver)
{
    var ret = new Array();
    if (arguments.length = 1)
    {
        curVer = parseFloat(arguments[0]);
    }
    else
    {
        curVer = 0;    
    }
    enablePrivilege('UniversalXPConnect');    
    var dirSrv = Components.classes[DIRSRV_CTRID]
        .getService(Components.interfaces.nsIProperties);
    var curPath = dirSrv.get(CURPROPATH, Components.interfaces.nsILocalFile);
    try
    {
        curPath = curPath;  //Leo 2007.11.20
        curPath.append(CHROMEPATHNAME);    
        curPath.append(CONTENTPATHNAME);
        curPath.append(PORTALPATHNAME);
        if(!curPath.isDirectory())
            return ret;
        var list = curPath.directoryEntries;

        var obj; 
        var dir;  
        while(list.hasMoreElements()) 
        {
            dir = list.getNext();
            dir = dir.QueryInterface(Components.interfaces.nsIFile);
            if(dir.isDirectory())
            {
                obj = getConfigInfo(dir.leafName);
                if (curVer > 0)
                {
                    /*if the version of config.xml is 
                        greater or equal to portal, push*/
                    if (obj.ver >= curVer)
                    {
                        ret.push(obj);
                    }
                }
                else
                {
                    if (obj.ver && obj.picurl)
                    {
                        ret.push(obj);
                    }
                }
            }       
        }
    }
    catch(ex)
    {
        return ret;
    }
    
    return ret;
}

/**
 * getIndexOfStyle
 * 
 * Description:
 *  get the index in the style array according to style name.
 *
 * History:
 *  2007.5.30      xszhong        Creation
 * 
 * @param  confs the array of PortalConfigStyle
 * @param  portname the portal name
 * @return the index in the array.
 */ 
function getIndexOfStyle(confs, portname)
{
    var ret = -1; /*should be < 0*/
    if (confs.length == 0 || !portname)
    {
        return ret;
    }
    var obj;
    for (var i = 0; i < confs.length; i++)
    {
        obj = confs[i];
        if (obj.stylename == portname)
        {
            ret = i;
            break;
        }
    }
    return ret;
}

/**
 * convertFromUnicode()
 * 
 * Description:
 *  conert from unicode to charset.
 *
 * History:
 *  2007.5.30      xszhong        Creation
 * 
 * @param str sting
 * @return string
 */
function convertFromUnicode(charset, str)
{
    try 
    {
        var unicodeConverter = Components
            .classes["@mozilla.org/intl/scriptableunicodeconverter"]
            .createInstance(Components.interfaces
            .nsIScriptableUnicodeConverter);
        unicodeConverter.charset = charset;
        str = unicodeConverter.ConvertFromUnicode(str);
        return str + unicodeConverter.Finish();
    } 
    catch(ex) 
    {
        return null; 
    }
}

/**
 * strTrim()
 * 
 * Description:
 *  trim blank in the header or tailer of the string.
 *
 * History:
 *  2007.5.21      xszhong        Creation
 * 
 * @param str sting
 * @return string
 */
function strTrim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

/**
 * checkFileExists()
 * 
 * Description:
 *  check the file is exists.
 *
 * History:
 *  2007.5.31      xszhong        Creation
 * 
 * @param path the check file path sting
 * @return boolean 
 */
function checkFileExists(path)
{
    var ret = false;
    var localfile = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsILocalFile);
    try
    {
        localfile.initWithPath(path);
        if (localfile.exists())
        {
            ret = true;
        }
    }
    catch(ex)
    {}
    return ret;
}

/**
 * getPortalPath()
 * 
 * Description:
 *  check the file is suffixed the according suffix and is exists.
 *
 * History:
 *  2007.5.31      xszhong        Creation
 * 
 * @param path the check file path sting,but not suffixed
 * example:/home/b-star/portal/home/home(.html/.xul/.htm)
 * @return the first exists file 
 */
function getPortalPath(path)
{
    var ret = null;
    var objs = SUFFIXHTMLS.split(",");
    for (var i = 0; i < objs.length; i++)
    {
        if (checkFileExists(path + objs[i]))
        {
            ret = path + objs[i];
            break;
        }
    }
    return ret;
}

/**
 * setPortInfoToBrowserWin()
 * 
 * Description:
 *  set portal information to browser win for example home/menu path.
 *
 * History:
 *  2007.5.31      xszhong        Creation
 * 
 * @param portal string current select portal name.
 * @param autoHome boolean after set information and then change to home page.
 * @return the first exists file 
 */
function setPortInfoToBrowserWin(portal, autoHome)
{
    var ret = false;
    enablePrivilege('UniversalXPConnect');
    var dirSrv = Components.classes[DIRSRV_CTRID]
        .getService(Components.interfaces.nsIProperties);
    //"CurProcD"=>current process path
    var curPath = dirSrv.get(CURPROPATH
        , Components.interfaces.nsILocalFile);
    dump(curPath.path);
    curPath = curPath;//Leo 2007.11.20
    
    /**get the portal absolute path*/
    var portalPath = curPath.path + PATHSEPARATOR + CHROMEPATHNAME 
        + PATHSEPARATOR + CONTENTPATHNAME + PATHSEPARATOR 
        + PORTALPATHNAME + PATHSEPARATOR;

    var win = getBrowserWindow();
    if (win)
    {
        var preHomePath = portalPath + portal + PATHSEPARATOR 
            + HOMEPATHNAME + PATHSEPARATOR + HOMENAME;

        preHomePath = getPortalPath(preHomePath);

        var preMenuPath = portalPath + portal + PATHSEPARATOR 
            + MENUPATHNAME + PATHSEPARATOR + MENUNAME;
        preMenuPath = getPortalPath(preMenuPath);

        if (preHomePath && preMenuPath)
        {
            preHomePath = preHomePath.replace(portalPath, PREFIXPORTALPATH);
            preMenuPath = preMenuPath.replace(portalPath, PREFIXPORTALPATH);
            preHomePath = preHomePath.replace(/\\/g, "/"); 
            preMenuPath = preMenuPath.replace(/\\/g, "/");
 
            win.strHomeURL = preHomePath;
            win.strMenuURL = preMenuPath;
            ret = true;               
            if (autoHome && win.onLoginOK)
            {
                win.onLoginOK();
            }
        }
    }
    return ret;
}
