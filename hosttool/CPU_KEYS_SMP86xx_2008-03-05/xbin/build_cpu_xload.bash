#!/bin/bash
set -e
#
if [ $# != 3 ]; then 
    cat <<EOF
Syntax:
  $0 <cpu> <cert_id> <key_domain>

  cpu        : cpu program basename
  cert_id    : Certificate ID to use (4 hex characters), must be same as
               the certificate you want to bind
  key_domain : ES4_dev for dev chips (ES4/ES5/ES6/ES7) or
               ES4_prod for prod chips (revA/revB)
 
Description:
  Create a cpu xload file.
  
Example:
  $0 yamon 0008 ES4_dev

EOF
    exit -1 
fi
#
CPU=$1
CERTID=$2
REV=$3
#
source xsdk_env.bash

XLOAD_BIN=`basename ${CPU_XLOAD}`

mkxload.bash $XSDK_ROOT $REV $CERTID $CPU_BIN $CPU_SIG $XLOAD_BIN

echo Created ${XLOAD_BIN}
echo To release: cp ${XLOAD_BIN} ${CPU_XLOAD}

