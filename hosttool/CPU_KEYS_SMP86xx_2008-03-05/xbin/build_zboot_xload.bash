#!/bin/bash
set -e
#
if [ $# != 3 ]; then 
    cat <<EOF
Syntax:
  $0 <zboot> <cert_id> <key_domain>

  zboot      : zboot bootloader basename
  cert_id    : Certificate ID to use (4 hex characters), must be same as
               the certificate you want to bind
  key_domain : ES4_dev for dev chips (ES4/ES5/ES6/ES7) or
               ES4_prod for prod chips (revA/revB)
 
Description:
  Create a zboot xload file
  
Example:
  $0 zboot-2.7.115 0008 ES4_dev

EOF
    exit -1 
fi
#
ZBOOT=$1
CERTID=$2
REV=$3

source xsdk_env.bash

XLOAD_BIN=`basename ${ZBOOT_XLOAD}`

check_cert_type $CERT_TYPE_ZBOOT

mkxload.bash $XSDK_ROOT $REV $CERTID $ZBOOT_BIN $ZBOOT_SIG $XLOAD_BIN

echo Created ${XLOAD_BIN}
echo To release: cp ${XLOAD_BIN} ${ZBOOT_XLOAD}

