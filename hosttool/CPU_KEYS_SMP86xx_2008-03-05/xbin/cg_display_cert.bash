#!/bin/bash
set -e

CERT=""

CERT_TYPE_NAME=(
	"cpu bootloader (zboot), cpu zone"
	"cpu code, cpu zone (cpu kernels and applications)"
	"xtask1, xpu zone"
	"video microcode, protected risc zone"
	"audio microcode, protected risc zone"
	"transport demux microcode, protected risc zone"
	"irq handler running on xpu, xpu zone"
	"xtask2, xpu zone"
	"xtask3, xpu zone"
	"xtask4, xpu zone")
	
CERT_XOS_KEY_ID_NAME=(
	"XOSRSAPublicKey(0)"
	"XOSRSAPublicKey(1)"
	"XOSRSAPublicKey(2)"
	"XOSRSAPublicKey(3)"
	"XOSRSAPublicKey(4)"
	"XOSRSAPublicKey(5)"
	"XOSRSAPublicKey(6)"
	"XOSAESSymmetricKey(0)"
	"XOSAESSymmetricKey(1)"
	"XOSAESSymmetricKey(2)"
	"XOSAESSymmetricKey(3)"
	"XOSAESSymmetricKey(4)"
	"XOSAESSymmetricKey(5)"
	"XOSAESSymmetricKey(6)")

		
USAGE=`cat<<EOF
Usage : $0 <-c certificate>
	Display a human readable description of a certificate
	-c certificate : certificate file to read
	-s : short form (do not print RSA key or SHA-1 hash)
EOF`

##
# Cleanup and exits
# @param $1 - exit code
##
function cleanup_exit(){
	exit $1
}

##
# Print usage and exits
# @return -1
##
function usage(){
	log "$USAGE"
	cleanup_exit -1
}

##
# Print a message on standard error
# param $1 - message to print
##
function log(){
	echo "$1" >&2
}


#Main
SHORT=0

while [ -n "$1" ]; do
	case "$1" in
		"-c" )  shift
			CERT=$1
			;;
		"-s" )  SHORT=1
			;;
		"-rev" )  shift
			REV=$1
			;;
		"-certid" ) shift
			CERTID=$1
			;;
		"*" ) 	log "Unknown parameter : $1"
			usage
			;;
	esac
	shift
done

source xsdk_env.bash

if [ -z "$CERT" ]; then
	CERT=$CERT_BIN
fi

if [ ! -f "$CERT" ]; then
	log "Cannot read $CERT"
	cleanup_exit -1
fi

CERT_SIZE=`wc -c $CERT | awk '{print $1}'`
if [ $[$CERT_SIZE] != 260 ]; then
	log "Certificate doesn't have the right size, abort.\n"
	cleanup_exit -1
fi

CERT_ID=`head -c 2 $CERT | frombin.bash -`

CERT_TYPE=`tail -c+3 $CERT | head -c 1 |  frombin.bash -`
if [ $CERT_TYPE = "ff" ]; then
	CERT_TYPE_STRING="xos update"
else
	CERT_TYPE_STRING=${CERT_TYPE_NAME[$[0x$CERT_TYPE]]}
fi

CERT_XOS_KEY_ID=`tail -c+4 $CERT | head -c 1 |  frombin.bash -`
if [ $CERT_XOS_KEY_ID = "ff" ]; then
	CERT_XOS_KEY_ID_STRING="binary not encrypted"
else
	CERT_XOS_KEY_ID_STRING="session key encrypted with ${CERT_XOS_KEY_ID_NAME[$[0x$CERT_XOS_KEY_ID]]}"
fi

CERT_RSA_PUBLIC_KEY=`tail -c+5 $CERT | head -c 256 | frombin.bash - | sed -e 's/\(.\{60\}\)/\1\n                 /g'`

CERT_SHA1=`sha1sum $CERT | cut -d \  -f 1`

echo "Certificate $CERT"
echo "ID             = $CERT_ID"
echo "Type           = $CERT_TYPE ($CERT_TYPE_STRING)"
echo "XOSKEYId       = $CERT_XOS_KEY_ID ($CERT_XOS_KEY_ID_STRING)"
if [ $SHORT -eq 0 ]; then
	echo "RSA public key = $CERT_RSA_PUBLIC_KEY"
	echo "SHA1           = $CERT_SHA1"
fi

cleanup_exit 0
