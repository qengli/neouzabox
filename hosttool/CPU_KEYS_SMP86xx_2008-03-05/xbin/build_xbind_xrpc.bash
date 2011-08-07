#!/bin/bash
set -e
#
if [ $# != 3 ]; then 
    cat <<EOF
Syntax:
  $0 <token> <cert_id> <key_domain>

  token      : Bind operation ("bind" or "unbind")
  cert_id    : Certificate ID to use (4 hex characters), must be same as
               the certificate you want to bind
  key_domain : ES4_dev for dev chips (ES4/ES5/ES6/ES7) or
               ES4_prod for prod chips (revA/revB)
 
Description:
  Create an XBIND xrpc file
  
Example:
  $0 bind 0008 ES4_dev

EOF
    exit -1 
fi
#
TOKEN=$1
CERTID=$2
REV=$3

#
source xsdk_env.bash

XRPC_BIN=xrpc_x${TOKEN}-${REV}_${CERTID}.bin

SIZE=`wc -c $TOKEN_BIN | awk '{print $1}'`

buildxrpc.bash XRPC_CALLERID_IGNORED XRPC_ID_XBIND $SIZE 0 0 0 0 $TOKEN_XLOAD $XRPC_BIN

echo Created $XRPC_BIN

