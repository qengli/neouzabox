/**
 * Ajax
 * 
 * Description:
 *  ajax class constructor
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return an ajax object
 */
function Ajax()
{
    this.XmlHttp = this.getHttpObject();
    this.paramArray = {url:null, type: "get", value:null};
}
 
/**
 * getHttpObject
 * 
 * Description:
 *  get ajax object
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return an ajax object
 */
Ajax.prototype.getHttpObject = function()
{
    var xmlhttp = false;
    if (window.XMLHttpRequest) 
    {
        xmlhttp = new XMLHttpRequest();// Mozilla, Safari,...
    } 
    else if (window.ActiveXObject) 
    {   // IE
        try 
        {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } 
        catch (e) 
        {
            try 
            {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } 
            catch (e) 
            {}
        }
    }
    
    if (!xmlhttp) 
    {
        return false;
    }      
    return xmlhttp;
}

/**
 * setParam
 * 
 * Description:
 *  set ajax object param
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */
Ajax.prototype.setParam = function(name, value)
{
    this.paramArray[name] = value;
}

/**
 * isAvailable
 * 
 * Description:
 *  check ajax object is available
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return a bool value
 */ 
Ajax.prototype.isAvailable = function()
{
	if(this.XmlHttp.readyState == 4 || this.XmlHttp.readyState == 0)
    {
        return true;
	}
    return false;
}

/**
 * send
 * 
 * Description:
 *  ajax object send a request.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */
Ajax.prototype.send = function()
{      
    var url =  this.paramArray["url"];
    var type=  this.paramArray["type"];     
    var value= this.paramArray["value"];  
    
    if(this.XmlHttp)
    {
	    if(this.XmlHttp.readyState == 4 || this.XmlHttp.readyState == 0)
		{
		    netscape.security.PrivilegeManager
                .enablePrivilege("UniversalBrowserRead");
            var obj = this;
            this.XmlHttp.open(type, url, true);
			this.XmlHttp.onreadystatechange = function(){ obj.readyStateChange(); };
			if(type=="post")
            {
                this.XmlHttp.setRequestHeader('Content-Type'
                    , 'application/x-www-form-urlencoded');
			}
            this.XmlHttp.send(value);
		}
    }
}

/**
 * abort
 * 
 * Description:
 *  abort ajax object abort process a request.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */
Ajax.prototype.abort = function()
{
  if( this.XmlHttp )
    this.XmlHttp.abort();
}

/**
 * onLoading
 * 
 * Description:
 *  ajax object is loading.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */ 
Ajax.prototype.onLoading = function()
{
  // Loading
}

/**
 * onLoaded
 * 
 * Description:
 *  ajax object is loaded.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */ 
Ajax.prototype.onLoaded = function()
{
  // Loaded
}

/**
 * onInteractive
 * 
 * Description:
 *  ajax object is loaded.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */  
Ajax.prototype.onInteractive = function()
{
  // Interactive
}

/**
 * onComplete
 * 
 * Description:
 *  ajax object handle complete event.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */  
Ajax.prototype.onComplete = function(responseText, responseXml)
{
  // Complete
}

/**
 * onAbort
 * 
 * Description:
 *  ajax object handle abort.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */  
Ajax.prototype.onAbort = function()
{
  // Abort
}

/**
 * onError
 * 
 * Description:
 *  ajax object handle error.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */
Ajax.prototype.onError = function(status, statusText)
{
  // Error
}

/**
 * readyStateChange
 * 
 * Description:
 *  ajax object state change.
 *
 * History:
 *  2007.5.10      xszhong        Creation
 * 
 * @param  
 * @return 
 */
Ajax.prototype.readyStateChange = function()
{
    if(this.XmlHttp.readyState == 1)
    {
        this.onLoading();
    }
    else if(this.XmlHttp.readyState == 2)
    {
        this.onLoaded();
    }
    else if(this.XmlHttp.readyState == 3)
    {
        this.onInteractive();
    }
    else if(this.XmlHttp.readyState == 4)
    {
        try
        {
            if(this.XmlHttp.status == 0)
            {
                this.onAbort();
            }
            
//          if(this.XmlHttp.status == 200 && this.XmlHttp.statusText == "OK")
            if(this.XmlHttp.status == 200)
            {
                this.onComplete(this.XmlHttp.responseText
                    ,this.XmlHttp.responseXML);
            }
            else
            {

                this.onError(this.XmlHttp.status, this.XmlHttp.statusText 
                    ,this.XmlHttp.responseText);
            }
        }
        catch(ex)
        {
            /**couldn't go to web */
            this.onError(-1, '', '');
        }
    }
}

