#!/bin/bash
set -e
#
if [ $# != 4 ]; then 
    cat <<EOF
Syntax:
  $0 <cpu> <cert_id> <key_domain>

  cpu        : cpu binary basename
  cert_id    : Certificate ID to use (4 hex characters)
  key_domain : ES4_dev for dev chips (ES4/ES5/ES6/ES7) or
               ES4_prod for prod chips (revA/revB)
  load_addr  : physicall address where the cpu binary will be loaded
 
Description:
  Create a XLOAD xrpc file of CPU type
  
Example:
  $0 yamon 0008 8634_ES4_dev 0x10020000

EOF
    exit -1 
fi
#
CPU=$1
CERTID=$2
REV=$3
LOADADDR=$4
#
source xsdk_env.bash

XRPC_BIN=xrpc_xload_${CPU}-${REV}_${CERTID}.bin
SIZE=`wc -c $CPU_BIN | awk '{print $1}'`

#xrpc wrapping:
buildxrpc.bash XRPC_CALLERID_IGNORED XRPC_ID_XLOAD $SIZE $LOADADDR 0 0 0 $CPU_XLOAD $XRPC_BIN


echo Created $XRPC_BIN

