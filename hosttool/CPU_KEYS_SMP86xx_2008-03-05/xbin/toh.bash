#!/bin/bash
set -e
#
if [ $# != 1 ]; then 
    cat <<EOF
Syntax: $0 file.bin

Refer to xbin documentation (type: xbin.bash)
EOF
    exit -1 
fi
#
SIZE=`wc -c "$1" |awk '{print $1}'`
# in words
SIZE=$[(SIZE+3)/4]
BASE=`basename "$1"`
BASE=${BASE%.*}
#
cat <<EOF
const RMuint32 $BASE[$SIZE];
const RMuint32 $BASE[$SIZE] = {
EOF
#
od -A n -t x4 -v "$1" |sed -e 's/ /0x/' -e 's/ /, 0x/g' -e 's/$/,/'
cat <<EOF
};
EOF
