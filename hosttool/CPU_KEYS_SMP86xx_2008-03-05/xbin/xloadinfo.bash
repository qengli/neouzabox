#!/bin/bash
set -e
#
if [ $# -lt 2 ]; then 
    cat <<EOF
Syntax: $0 <key domain> <xload file> [<payload file>]
 <key domain> : Chip_Rev_Bonding triplet describing the key domain to use.
 <file.xload> : The xload file to analyze
 <file.bin>   : The decrypted payload of the xload (if decryption is possible)

Example:
	$0 8634_ES4_dev file.xload file.bin  

EOF
    exit -1 
fi
#
source `dirname $0`/xos_xrpc.inc
#

REV=$1
XLOAD=$2
PAYLOAD=$3

source xsdk_env.bash

XLOADSIZE=`wc -c "$XLOAD" |awk '{print $1}'`

if [ $XLOADSIZE -lt 770 ]; then
	echo Too small to be a valid XLOAD
	exit -1
fi

CERT_ID=0x`cert_id $XLOAD`
CERT_TYPE=0x`cert_type $XLOAD` 
CERT_SEK=0x`cert_sekid $XLOAD` 
CERT_PUBKEY=`extract 4 256 $XLOAD | frombin.bash -`
CERT_SIG=`extract 260 256 $XLOAD | frombin.bash -`
BIN_SIG=`extract 516 256 $XLOAD | frombin.bash -`

TMPFILESSL=`mktemp /tmp/mkxload.ssl.XXXXXX`

echo Checking Certificate Signature...
TMPSIG=`mktemp /tmp/sig.XXXXXX`
TMPBIN=`mktemp /tmp/bin.XXXXXX`
tobin.bash $CERT_SIG | revbytes.pl > $TMPSIG
extract 0 260 $XLOAD > $TMPBIN

if $XSDK_OPENSSL sha1 -verify $SIGMA_SFLA_PUBLIC_KEY -signature $TMPSIG $TMPBIN; then
        echo Certificate signature verified.
else
        echo Certificate signature verification failed.
        exit -1;
fi

if [ $CERT_SEK == 0xff ]; then
      ESK="N/A (clear payload)"
      SK="N/A (clear payload)"
      IV="N/A (clear payload)"
      BINOFS=772
else
      F=`printf "%d" $CERT_SEK`
      extract 772 256 $XLOAD > $TMPFILESSL
      ESK=`frombin.bash $TMPFILESSL`
      IV=`extract 1028 16 $XLOAD | frombin.bash -`
      if [ $F -lt 7 ]; then
	PK=${XSDK_PRIVATE_KEYS}/${REV}_sek${F}_keyboth.pem
	if [ -f $PK ]; then
		echo About to use SEKRSA key : $PK 
		SK=`revbytes.pl $TMPFILESSL | $XSDK_OPENSSL rsautl -decrypt -inkey "$PK" | revbytes.pl - | frombin.bash -`
	else
		echo Missing SEKRSA key : $PK
	      	SK="Cant decrypt Session Key, I dont know where the SEK RSA private key is!"
	fi
      else
	F=$[F-7]
	H=`extract 0 260 $XLOAD | sha1sum | awk '{print $1}'`
	PK=${XSDK_SEKAES}/${REV}_${H}_sekaes/${REV}_${H}_sekaes${F}.bin
	if [ -f $PK ]; then 
		echo About to use SEKAES key : $PK
		SEKAES=`frombin.bash $PK`
		SK=`$XSDK_OPENSSL enc -d -aes-128-cbc -K $SEKAES -iv $IV -nopad -in $TMPFILESSL | extract 0 16 | frombin.bash -`
	else
		echo Missing SEKAES key : $PK
		SK="Cant decrypt Session Key, I dont know where the SEK AES key is!"
	fi
      fi
      BINOFS=1044
fi

cat <<EOF
Certificate: 
 ID = $CERT_ID
 Type = $CERT_TYPE
 SEK = $CERT_SEK
 PubKey = $CERT_PUBKEY
Certificate Sig : $CERT_SIG
Payload Sig : $BIN_SIG
Session Key : $SK
Session IV : $IV
Real Size is $XLOADSIZE
EOF

if [ ! -z $PAYLOAD ]; then
	dd bs=1 skip=$BINOFS if=$XLOAD 2>/dev/null | $XSDK_OPENSSL enc -d -aes-128-cbc -K $SK -iv $IV -nopad > $PAYLOAD
	echo Decrypted payload: `sha1sum $PAYLOAD`

	echo Checking Payload Signature...
	TMPSIG=`mktemp /tmp/sig.XXXXXX`
	TMPPUBKEY=`mktemp /tmp/pubkey.XXXXXX`
	tobin.bash $BIN_SIG | revbytes.pl > $TMPSIG


	if $XSDK_OPENSSL sha1 -verify $TMPPUBKEY -signature $TMPSIG $PAYLOAD; then
        	echo Payload signature verified.
	else
        	echo Payload signature verification failed.
        	exit -1;
	fi
fi	

