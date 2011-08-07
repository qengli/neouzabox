#!/bin/bash
set -e
#
if [ $# != 4 ]; then 
    cat <<EOF
Syntax:
  $0 <zboot> <cert_id> <key_domain> <loadaddr>

  zboot      : zboot bootloader basename
  cert_id    : Certificate ID to use (4 hex characters), must be of
               zboot type
  key_domain : ES4_dev for dev chips (ES4/ES5/ES6/ES7) or
               ES4_prod for prod chips (revA/revB)
  load_addr  : physicall address where the bootloader will be loaded
 
Description:
  Create an zboot XLOAD xrpc file
  
Example:
  $0 zboot-2.7.115 0008 ES4_dev 0x10008000

EOF
    exit -1 
fi
#
ZBOOT=$1
CERTID=$2
REV=$3
LOADADDR=$4
#
source xsdk_env.bash

XRPC_BIN=xrpc_xload_${ZBOOT}-${REV}_${CERTID}.bin
SIZE=`wc -c $ZBOOT_BIN | awk '{print $1}'`

#xrpc wrapping:
buildxrpc.bash XRPC_CALLERID_IGNORED XRPC_ID_XLOAD $SIZE $LOADADDR 0 0 0 $ZBOOT_XLOAD $XRPC_BIN

echo Created $XRPC_BIN

