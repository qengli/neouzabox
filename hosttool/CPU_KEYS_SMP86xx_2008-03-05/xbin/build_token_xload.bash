#!/bin/bash
set -e
#
if [ $# != 3 ]; then 
    cat <<EOF
Syntax:
  $0 <token> <cert_id> <key_domain>

  token      : Token name ("bind", "unbind" or "unload")
  cert_id    : Certificate ID to use (4 hex characters), must be same as
               the certificate you want to use the token with
  key_domain : ES4_dev for dev chips (ES4/ES5/ES6/ES7) or
               ES4_prod for prod chips (revA/revB)
 
Description:
  Create an token xload file
  
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

XLOAD_BIN=`basename ${TOKEN_XLOAD}`

mkxload.bash $XSDK_ROOT $REV $CERTID $TOKEN_BIN $TOKEN_SIG $XLOAD_BIN

echo Created ${XLOAD_BIN}
echo To release: cp ${XLOAD_BIN} ${TOKEN_XLOAD}

