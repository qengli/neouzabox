#####!/bin/sh
export LD_LIBRARY_PATH=/lib:/usr/lib:/mnt/nfs/lib:/mnt/nfs/usr/lib:./
export PATH=$PATH:/mnt/nfs/bin:/mnt/nfs/usr/bin
export DISPLAY=192.168.110.10:0
ln -fs /mnt/nfs/etc/pango /etc/
ln -fs /mnt/nfs/etc/fonts /etc/
ln -fs /mnt/nfs/usr/share/fonts /usr/share/
