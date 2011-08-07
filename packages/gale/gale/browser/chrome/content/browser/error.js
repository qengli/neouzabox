/**
 * onStart
 * 
 * Description:
 *  Load the error message on start
 *
 * History:
 *  2007.5.29      xbluo        Creation
 *
 * @param  none
 * @return none
 */ 
var tmAutoPic;
function onStart ()
{
    var msg = document.getElementById ('errmsg');
    var win = getBrowserWindow ();
    msg.value = win.strErrorMessage;
    tmAutoPic = setInterval (autoPic, 5000);
    document.onkeydown = onKey;
}

/**
 * autoPic
 * 
 * Description:
 *  auto load picture every 5 seconds
 *
 * History:
 *  2007.5.29      xbluo        Creation
 *
 * @param  none
 * @return none
 */ 
const nPic = 7;
const prefPath = 'chrome://gale/skin/errbg';
const picFormat = '.jpg';
var   currentPic = 1;

function autoPic ()
{
    currentPic += 1;
    if (currentPic > nPic)
    {
        currentPic = 1;
    }
    var pic = document.getElementById ('errorbg');   
    var path = prefPath + currentPic + picFormat;
    //alert (path);
    pic.src = path;     
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
        case GK_BACK :
            browserHome ();
            break;
    }
    return;
}
