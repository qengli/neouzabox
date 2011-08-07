/**
 * Copyright (C) by B-Star.
 *
 * Do not use, copy, modify, and distribute this software and its documentation
 * out of the Open Lab for Interactive Media of B-Star company.
 *
 * File:  
 *    keyboard.js
 * Description:
 *    this file define gale stb remote control device key code, so the web pages 
 *    don't need to know the key's keycode of remote control device any more
 */
 

/* available keys for service provider

GK_UNDEFINE           // 没定义的
GK_UP                 // 向上
GK_DOWN               // 向下
GK_LEFT               // 向左
GK_RIGHT              // 向右
GK_ENTER              // 确定
GK_REW                // 回退播放
GK_FWD                // 向前播放
GK_PLAY               // 播放/暂停
GK_STOP               // 停止
GK_HELP               // 帮助
GK_BACK               // 返回
GK_CLEAR              // 清除
GK_0                  // 数字0，以下同
GK_1               
GK_2          
GK_3          
GK_4         
GK_5      
GK_6            
GK_7            
GK_8               
GK_9                
GK_STAR               // *
GK_SHARP              // #
GK_GREEN              // 绿
GK_RED                // 红
GK_YELLOW             // 黄
GK_BLUE               // 蓝

*/ 
 
/*  test.html

<html>
    <!--a sample to show how to use getKey() -->
    <body onkeydown= "onKey(evt);">           
        <script type="text/javascript" src = "chrome://gale/content/common/keyboard.js" ></script>
        <script type="text/javascript" >
            function onKey (evt)
            {
                var key = getKey (evt);
                switch (key)
                {
                    default:  
                        break;
                    case GK_STAR:
                        alert ('U press the * key!');
                        break;
                    case GK_0:
                        alert ('0!');
                        break;
                }
                return;
            }
        </script>  
    </body>
</html>

*/

/* keys reserved for galeBrowser

    GK_POWEROFF
    GK_HOME
    GK_MENU
    GK_SWITCH
    GK_MESSAGE
    GK_VOLUP  
    GK_VOLDOWN    
    GK_MUTE
    
*/

// Gale STB keys define, total 36 keys
// this value is return by getKey()

const GK_KEY_NUMBER      =  39;

const GK_UNDEFINE        =  0x00;   // 没定义的
const GK_POWEROFF        =  0x01;   // 关机,浏览器使用
const GK_UP              =  0x02;   // 向上
const GK_DOWN            =  0x03;   // 向下
const GK_LEFT            =  0x04;   // 向左
const GK_RIGHT           =  0x05;   // 向右
const GK_ENTER           =  0x06;   // 确定
const GK_REW             =  0x07;   // 回退播放
const GK_FWD             =  0x08;   // 向前播放
const GK_PLAY            =  0x09;   // 播放/暂停
const GK_STOP            =  0x0A;   // 停止
const GK_MENU            =  0x0B;   // 菜单,浏览器使用
const GK_HOME            =  0x0C;   // 返回主页,浏览器使用
const GK_HELP            =  0x0D;   // 帮助
const GK_BACK            =  0x0E;   // 返回
const GK_SWITCH          =  0x0F;   // 切换窗口,浏览器使用
const GK_MESSAGE         =  0x10;   // 消息,浏览器使用
const GK_CLEAR           =  0x11;   // 清除
const GK_0               =  0x12;   // 数字0，以下同
const GK_1               =  0x13;    
const GK_2               =  0x14; 
const GK_3               =  0x15; 
const GK_4               =  0x16; 
const GK_5               =  0x17; 
const GK_6               =  0x18; 
const GK_7               =  0x19; 
const GK_8               =  0x1A; 
const GK_9               =  0x1B; 
const GK_STAR            =  0x1C;   // *
const GK_SHARP           =  0x1D;   // #
const GK_GREEN           =  0x1E;   // 绿
const GK_RED             =  0x1F;   // 红
const GK_YELLOW          =  0x20;   // 黄
const GK_BLUE            =  0x21;   // 蓝
const GK_VOLUP           =  0x22;   // 音量增加,浏览器使用
const GK_VOLDOWN         =  0x23;   // 音量减少,浏览器使用
const GK_MUTE            =  0x24;   // 静音,浏览器使用
const GK_SEARCH          =  0x25;   // 搜索
const GK_PROGUP          =  0x26;   // 频道上升
const GK_PROGDOWN        =  0x27;   // 频道下降

const GK_SHIFT_MASK      = 0x100;
const GK_ALT_MASK        = 0x200;
const GK_CTRL_MASK       = 0x400; 

// key value define 
const GK_POWEROFF_VALUE  =  0x474;  // Ctrl+ F5
const GK_UP_VALUE        =  0x026; 
const GK_DOWN_VALUE      =  0x028;
const GK_LEFT_VALUE      =  0x025;
const GK_RIGHT_VALUE     =  0x027;
const GK_ENTER_VALUE     =  0x00D;
const GK_REW_VALUE       =  0x442;  // Ctrl + B
const GK_FWD_VALUE       =  0x446;  // Ctrl + F
const GK_PLAY_VALUE      =  0x450;  // Ctrl + P
const GK_STOP_VALUE      =  0x453;  // Ctrl + S
const GK_MENU_VALUE      =  0x44c;  // Ctrl + L
const GK_HOME_VALUE      =  0x44F;  // Ctrl + O
const GK_HELP_VALUE      =  0x448;  // Ctrl + H
const GK_BACK_VALUE      =  0x447;  // Ctrl + G
const GK_SWITCH_VALUE    =  0x454;  // Ctrl + T
const GK_MESSAGE_VALUE   =  0x457;  // Ctrl + W
const GK_CLEAR_VALUE     =  0x01B;  // ESC 
const GK_0_VALUE         =  0x030;  // 0
const GK_1_VALUE         =  0x031;  // 1
const GK_2_VALUE         =  0x032;  // 2
const GK_3_VALUE         =  0x033;  // .
const GK_4_VALUE         =  0x034;  // .
const GK_5_VALUE         =  0x035;  // .
const GK_6_VALUE         =  0x036;
const GK_7_VALUE         =  0x037;
const GK_8_VALUE         =  0x038;  // .
const GK_9_VALUE         =  0x039;  // 9
const GK_STAR_VALUE      =  0x138;  // Shift + 8 
const GK_SHARP_VALUE     =  0x133;  // Shift + 3
const GK_RED_VALUE       =  0x470;  // Ctrl + F1
const GK_GREEN_VALUE     =  0x471;  // Ctrl + F2 
const GK_YELLOW_VALUE    =  0x472;  // Ctrl + F3
const GK_BLUE_VALUE      =  0x473;  // Ctrl + F4
const GK_VOLUP_VALUE     =  0x455;  // Ctrl + U
const GK_VOLDOWN_VALUE   =  0x444;  // Ctrl + D
const GK_MUTE_VALUE      =  0x44D;  // Ctrl + M
const GK_SEARCH_VALUE    =  0x477;  // Ctrl + F8
const GK_PROGUP_VALUE    =  0x4BE;  // Ctrl + .
const GK_PROGDOWN_VALUE  =  0x4BC;  // Ctrl + ,

var arryKeys = null;

/**
 * initKey
 * 
 * Description:
 *  initial key value table
 *
 * History:
 *  2007.7.9     xbluo        Creation
 * 
 * @param  none
 * @return none
 */
function initKey ()
{
    // init
    arryKeys = new Array ();
    arryKeys [GK_UNDEFINE]  = null;
    arryKeys [GK_POWEROFF]  = GK_POWEROFF_VALUE;       
    arryKeys [GK_UP]        = GK_UP_VALUE;
    arryKeys [GK_DOWN]      = GK_DOWN_VALUE;
    arryKeys [GK_LEFT]      = GK_LEFT_VALUE;
    arryKeys [GK_RIGHT]     = GK_RIGHT_VALUE;
    arryKeys [GK_ENTER]     = GK_ENTER_VALUE;
    arryKeys [GK_REW]       = GK_REW_VALUE;
    arryKeys [GK_FWD]       = GK_FWD_VALUE;
    arryKeys [GK_PLAY]      = GK_PLAY_VALUE;
    arryKeys [GK_STOP]      = GK_STOP_VALUE;
    arryKeys [GK_MENU]      = GK_MENU_VALUE;
    arryKeys [GK_HOME]      = GK_HOME_VALUE;
    arryKeys [GK_HELP]      = GK_HELP_VALUE;
    arryKeys [GK_BACK]      = GK_BACK_VALUE;
    arryKeys [GK_SWITCH]    = GK_SWITCH_VALUE;
    arryKeys [GK_MESSAGE]   = GK_MESSAGE_VALUE;
    arryKeys [GK_CLEAR]     = GK_CLEAR_VALUE;
    arryKeys [GK_0]         = GK_0_VALUE;
    arryKeys [GK_1]         = GK_1_VALUE;
    arryKeys [GK_2]         = GK_2_VALUE;
    arryKeys [GK_3]         = GK_3_VALUE;
    arryKeys [GK_4]         = GK_4_VALUE;
    arryKeys [GK_5]         = GK_5_VALUE;
    arryKeys [GK_6]         = GK_6_VALUE;
    arryKeys [GK_7]         = GK_7_VALUE;
    arryKeys [GK_8]         = GK_8_VALUE;
    arryKeys [GK_9]         = GK_9_VALUE;
    arryKeys [GK_STAR]      = GK_STAR_VALUE;
    arryKeys [GK_SHARP]     = GK_SHARP_VALUE;
    arryKeys [GK_GREEN]     = GK_GREEN_VALUE;
    arryKeys [GK_RED]       = GK_RED_VALUE;
    arryKeys [GK_YELLOW]    = GK_YELLOW_VALUE;
    arryKeys [GK_BLUE]      = GK_BLUE_VALUE;
    arryKeys [GK_VOLUP]     = GK_VOLUP_VALUE;
    arryKeys [GK_VOLDOWN]   = GK_VOLDOWN_VALUE;
    arryKeys [GK_MUTE]      = GK_MUTE_VALUE;
    arryKeys [GK_SEARCH]    = GK_SEARCH_VALUE;
    arryKeys [GK_PROGUP]    = GK_PROGUP_VALUE;
    arryKeys [GK_PROGDOWN]  = GK_PROGDOWN_VALUE;    
}

/**
 * getKey
 * 
 * Description:
 *  return the remote control key pressed, return GK_UNDEFINE 
 *  if the key is not defined, or any error occur 
 *
 * History:
 *  2007.7.10      xbluo        Creation
 * 
 * @param  evt : keydown event
 * @return key name
 */
function getKey (evt)
{
    try 
    {
        if (arryKeys == null)
        {
            initKey ();
        }
        return checkKeyByKeycode (evt.keyCode, evt.shiftKey, 
          evt.altKey, evt.ctrlKey);
    }
    catch (ex)
    {
        alert (ex);
        return 0;
    }
}

/**
 * checkKeyByKeycode
 * 
 * Description:
 *  return the remote control key pressed.
 *
 * History:
 *  2007.7.10      xbluo        Creation
 * 
 * @param  kCode   keycode
 *         bShift  if shift pressed
 *         bAlt    if Alt pressed
 *         bCtrl   if Ctrl pressed
 * @return key name
 */
function checkKeyByKeycode (kCode, bShift, bAlt, bCtrl)
{
    var k = kCode 
      | ( bShift ? GK_SHIFT_MASK : 0 )
      | ( bAlt   ? GK_ALT_MASK   : 0 )
      | ( bCtrl  ? GK_CTRL_MASK  : 0 );
      
    for (var i = 1; i <= GK_KEY_NUMBER; ++i)  
    {
        if (arryKeys [i] == k)
        {
            return i;
        }
    }
    return 0;  
}