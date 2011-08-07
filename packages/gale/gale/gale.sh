#!/bin/sh
export DISPLAY=127.0.0.1:0

#for DEV in `grep '^/dev/disk' /etc/mnts | cut -f1`; do
#  DIR=`grep "^$DEV" /etc/mnts | cut -f2-`
#    if [ -d "$DIR/gale" ]; then          
##      export APPDIR="$DIR/gale"
#      break                    
#    fi                         
#done  
#echo $APPDIR
#APPDIR4SED=`echo "$APPDIR" | sed -e 's/\//\\\\\//g;s/\s/\\ /g;s/\./\\\./g;' `
#echo $APPDIR4SED
#sed -i -e s/'<dir>\~\/\.fonts'/"<dir>${APPDIR4SED}\/fonts"/ /etc/fonts/fonts.conf 
#echo $APPDIR

APPDIR=/usr/local/gale
export LD_LIBRARY_PATH=/usr/local/xulrunner/:"$APPDIR"/browser

Xfbdev &
/usr/bin/icewm &
/usr/bin/icewm-session &

MOZ_USER_DIR="/.mozilla/xulrunner"                                         
cd "$APPDIR"/browser
/usr/local/xulrunner/xulrunner-bin ./application.ini
