stb browser 目录说明
browser(浏览器程序目录)
│  application.ini(xulrunner安装启动参数)
│  readme.txt
│
├─chrome
│  │  chrome.manifest (content,locale,skin,etc目录映射定义)
│  │  readme.txt
│  │
│  ├─content                 (各个模块代码)
│  │      browser          (包含与主浏览器窗口相关文件)
│  │         galeBrowser.xul    (主浏览器窗口界面文件)
│  │         galeBrowser.js     (主浏览器窗口脚本文件)
│  │         galeBrowser.xml    (主浏览器窗口配置文件)
│  │         browserMsg.js      (与推送消息相关的脚本文件)
│  │         message.xul        (消息内容窗口界面文件)
│  │         message.js         (消息内容脚本文件)
│  │         error.xul          (错误页面界面文件)
│  │         error.js           (错误页面脚本文件)
│  │         plusBrowser.xul    (弹出浏览器窗口界面文件)
│  │         plusBrowser.js     (弹出浏览器窗口脚本文件)
│  │         tip.html           (提示窗口文件)
│  │      login            (包含与登录相关的文件)
│  │         login.html       (登录窗口界面文件)
│  │         login.js         (登录脚本文件)
│  │         loginconf.js     (与登录配置相关脚本文件)
│  │         AjaxHelper.js    (ajax脚本文件)
│  │      common           (包含通用或共用js函数)
│  │         common.js         (公共脚本文件)
│  │         inf.js            (可提供给sp使用的通用的脚本文件)
│  │         keyboard.js       (可提供给sp使用的与键盘脚本文件)
│  │
│  ├─etc                     (配置文件。)
│  │   
│  │
│  ├─locale           (与语言相关的资源)
│  │  └─en-US
│  │         galeBrowser.dtd         
│  │         galeBrowser.properties  
│  │              
│  │  └─zh-CN
│  │         galeBrowser.dtd         
│  │         galeBrowser.properties
│  │         
│  └─skin                       (存放图片或css文件)
│      │  galeBrowser.css       (主浏览器窗口css文件)
│      │  login.css             (登录页面css文件)
│      │  message.css           (消息窗口css文件)
│      │  plusBrowser.css       (弹出浏览器消息窗口css文件)
│      └─icon                  (各个模块使用的图标)
│          
│
├─components                     (存放组件文件目录)
│   └─LiveClient.so
│     ILiveClient.xpt
│     SystemInformation.so
│     ISystemInformation.xpt      
│
├─defaults
│  └─preferences
│          set-main-window.js     (程序相关参数设置)
│          readme.txt
│
├─extensions                     (extension使用目录)
└─plugins                        (plugin使用目录)
        libflashplayer.so
        libvlc.so
        libvlcplugin.so
        nsIQTScriptablePlugin.xpt


