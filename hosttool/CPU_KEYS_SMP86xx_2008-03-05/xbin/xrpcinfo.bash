#!/bin/bash
set -e
#
if [ $# -lt 1 ]; then 
    cat <<EOF
Syntax: $0 xrpc.bin [block.bin]

EOF
    exit -1 
fi
#
source `dirname $0`/xos_xrpc.inc
#

XRPCSIZE=`wc -c "$1" |awk '{print $1}'`

if [ $XRPCSIZE -lt 32 ]; then
	echo Too small to be a valid XRPC
	exit -1
fi

CALLERID=0x`head -c4 $1 | frombin.bash -`
XRPCID=0x`tail -c+5 $1 | head -c4 | frombin.bash -` 
P0=0x`tail -c+9 $1 | head -c4 | frombin.bash -` 
P1=0x`tail -c+13 $1 | head -c4 | frombin.bash -` 
P2=0x`tail -c+17 $1 | head -c4 | frombin.bash -` 
P3=0x`tail -c+21 $1 | head -c4 | frombin.bash -` 
P4=0x`tail -c+25 $1 | head -c4 | frombin.bash -`
SIZE=0x`tail -c+29 $1 | head -c4 | frombin.bash -`
PAYLOADSHA1=`tail -c+33 $1 | sha1sum | awk '{print $1}'`

cat <<EOF
XRPC Header: 
 Caller ID = $CALLERID
 XRPC ID = $XRPCID
 Parameters = $P0 $P1 $P2 $P3 $P4
 SIZE = $SIZE
Payload SHA1 : $PAYLOADSHA1
Real Size is $XRPCSIZE
EOF

if [ $2 ]; then
	tail -c+33 $1 > $2
	echo XRPC payload dumped to $2
fi

