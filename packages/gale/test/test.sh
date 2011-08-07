#!/bin/sh 
export DISPLAY=127.0.0.1:0 

for DEV in `grep '^/dev/disk' /etc/mnts | cut -f1`; do
  DIR=`grep "^$DEV" /etc/mnts | cut -f2-`
    if [ -d "$DIR/test/chrome" ]; then
      export APPDIR="$DIR/test"
      break
    fi
done

echo $APPDIR
#export APPDIR=/mnt/"disk 1"/test
export LD_LIBRARY_PATH=/usr/local/xulrunner:"$APPDIR"/plugins
cd "$APPDIR"
Xfbdev &
/usr/local/xulrunner/xulrunner-bin "$APPDIR"/application.ini
