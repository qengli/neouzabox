#!/bin/bash
set -e
#
if [ $# != 3 ]; then 
    cat <<EOF
Syntax: $0 /path/to/item.bin 0007 ES4_dev

You have to specify the item to sign, the certificate id to use, and the chip key domain (ES4_dev or ES4_prod) .
EOF
    exit -1 
fi
#
ITEM_BIN=$1
CERTID=$2
REV=$3

source xsdk_env.bash

ITEM=`basename ${ITEM_BIN}`
ITEM_SIG=${ITEM}.${REV}_${CERTID}.bin

if [ ! -f ${CERT_PRIVATE_KEY} ]; then
	echo You dont have the private key matching the certificate you want to use.
	echo Missing file: $CERT_PRIVATE_KEY
	exit -1
fi	

FTMP=`mktemp /tmp/xsign.XXXXXX`
$XSDK_PRIVATE_OPENSSL sha1 -sign $CERT_PRIVATE_KEY -out $FTMP $ITEM_BIN
cat $FTMP | revbytes.pl > $ITEM_SIG
rm -f $FTMP

