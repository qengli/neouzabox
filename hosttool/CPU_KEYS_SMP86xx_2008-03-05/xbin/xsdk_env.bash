# Set default env variable

# REV is a misnomer and denotes the "Key Domain" to use
# REV should be of the form 8634_ES4_dev, 8644_ES1_prod, ...
# that is: a Chip_Rev_Bonding triplet.
# In the past only 8634 key domains where supported and as such
# the valid form for REV were ES4_dev or ES4_prod
# The next 5 lines are here to support 
R1=${REV#*_}
R2=${REV%_*}
if [ "$R2" = "ES4" -a "$R1" = "dev" -o "$R1" = "prod" ]; then
	echo "W: Key Domain specified as $REV"
        REV=8634_$REV
	echo "W: Changed to $REV, please update your Makefile and scripts"
	echo "W: (This message courtesy of xsdk_env.bash)"
fi

if [ -z "$XSDK_ROOT" ]; then
	echo "*** You need to define XSDK_ROOT ***"
	exit -1;
fi
if [ -z "$XSDK_ITEMS" ]; then 
	XSDK_ITEMS=$XSDK_ROOT/items
fi
if [ -z "$XSDK_SIGS" ]; then 
	XSDK_SIGS=$XSDK_ROOT/signatures
fi
if [ -z "$XSDK_XLOADS" ]; then 
	XSDK_XLOADS=$XSDK_ROOT/xloads
fi
if [ -z "$XSDK_CERT" ]; then
	XSDK_CERT=$XSDK_ITEMS/xload_certificates
fi
if [ -z "$XSDK_CERT_SIG" ]; then
	XSDK_CERT_SIG=$XSDK_SIGS/xload_certificates
fi
if [ -z "$XSDK_PUBLIC_KEYS" ]; then
	XSDK_PUBLIC_KEYS=$XSDK_ROOT/public_keys
fi
if [ -z "$XSDK_PRIVATE_KEYS" ]; then
	XSDK_PRIVATE_KEYS=$XSDK_ROOT/dummy_private_keys
fi
if [ -z "$XSDK_SEKAES" ]; then
	XSDK_SEKAES=$XSDK_PRIVATE_KEYS/sekaes
fi
if [ -z "$XSDK_OPENSSL" ]; then
	XSDK_OPENSSL=/usr/bin/openssl
fi
#Openssl for private key handling
if [ -z "$XSDK_PRIVATE_OPENSSL" ]; then
	XSDK_PRIVATE_OPENSSL=$XSDK_OPENSSL
fi

# public keys
SIGMA_SFLA_PUBLIC_KEY=${SIGMA_SFLA_PUBLIC_KEY:-${XSDK_PUBLIC_KEYS}/${REV}_ser_pubkey.pem}
SIGMA_PFLA_PUBLIC_KEY=${SIGMA_PFLA_PUBLIC_KEY:-${XSDK_PUBLIC_KEYS}/${REV}_par_pubkey.pem}

# certificates
CERT_BIN=${CERT_BIN:-${XSDK_CERT}/xload_certificate_${REV}_${CERTID}.bin}
CERT_SIG=${CERT_SIG:-${XSDK_CERT_SIG}/xload_certificate_${REV}_${CERTID}.bin.${REV}_ser.bin}
CERT_PUBLIC_KEY=${CERT_PUBLIC_KEY:-${XSDK_PUBLIC_KEYS}/${REV}_${CERTID}_pubkey.pem;}
CERT_PRIVATE_KEY=${CERT_PRIVATE_KEY:-${XSDK_PRIVATE_KEYS}/${REV}_${CERTID}_keyboth.pem}

#xos kernels
XOS_SIGNABLEAREA=${XOS_SIGNABLEAREA:-${XSDK_ITEMS}/xos_kernel/signablearea-xos${VERSION}.bin}
XOS_SIGNATURE=${XOS_SIGNATURE:-${XSDK_SIGS}/xos_kernel/signablearea-xos${VERSION}.bin.${REV}_ser.bin}

# xosu files:
XOSU=${XOSU:-xosu-xos${VERSION}-${REV}}
XOSU_BIN=${XOSU_BIN:-${XSDK_ITEMS}/xosu/${XOSU}.bin}
XOSU_SIG=${XOSU_SIG:-${XSDK_SIGS}/xosu/${XOSU}.bin.${REV}_${CERTID}.bin}
XOSU_XLOAD=${XOSU_XLOAD:-${XSDK_XLOADS}/xosu/${XOSU}_${CERTID}.xload}

# xtokens files:
TOKEN_BIN=${TOKEN_BIN:-${XSDK_ITEMS}/tokens/${TOKEN}.bin}
TOKEN_SIG=${TOKEN_SIG:-${XSDK_SIGS}/tokens/${TOKEN}.bin.${REV}_${CERTID}.bin}
TOKEN_XLOAD=${TOKEN_XLOAD:-${XSDK_XLOADS}/tokens/${TOKEN}_${REV}_${CERTID}.xload}

# irq handler files:
IH_BIN=${IH_BIN:-${XSDK_ITEMS}/ih/${IH}.bin}
IH_SIG=${IH_SIG:-${XSDK_SIGS}/ih/${IH}.bin.${REV}_${CERTID}.bin}
IH_XLOAD=${IH_XLOAD:-${XSDK_XLOADS}/ih/${IH}_${REV}_${CERTID}.xload}

# ucodes files:
UCODE_BIN=${UCODE_BIN:-${XSDK_ITEMS}/ucode/${UCODE}.bin}
UCODE_SIG=${UCODE_SIG:-${XSDK_SIGS}/ucode/${UCODE}.bin.${REV}_${CERTID}.bin}
UCODE_XLOAD=${UCODE_XLOAD:-${XSDK_XLOADS}/ucode/${UCODE}_${REV}_${CERTID}.xload}

# xtasks files:
XTASK_BIN=${XTASK_BIN:-${XSDK_ITEMS}/xtasks/${XTASK}.bin}
XTASK_SIG=${XTASK_SIG:-${XSDK_SIGS}/xtasks/${XTASK}.bin.${REV}_${CERTID}.bin}
XTASK_XLOAD=${XTASK_XLOAD:-${XSDK_XLOADS}/xtasks/${XTASK}_${REV}_${CERTID}.xload}

# zboot files:
ZBOOT_BIN=${ZBOOT_BIN:-${XSDK_ITEMS}/zboot/${ZBOOT}.bin}
ZBOOT_SIG=${ZBOOT_SIG:-${XSDK_SIGS}/zboot/${ZBOOT}.bin.${REV}_${CERTID}.bin}
ZBOOT_XLOAD=${ZBOOT_XLOAD:-${XSDK_XLOADS}/zboot/${ZBOOT}_${REV}_${CERTID}.xload}

# cpu program files:
CPU_BIN=${CPU_BIN:-${XSDK_ITEMS}/cpu/${CPU}.bin}
CPU_SIG=${CPU_SIG:-${XSDK_SIGS}/cpu/${CPU}.bin.${REV}_${CERTID}.bin}
CPU_XLOAD=${CPU_XLOAD:-${XSDK_XLOADS}/cpu/${CPU}_${REV}_${CERTID}.xload}

# certificates ID:
CERT_TYPE_ZBOOT=00
CERT_TYPE_CPU=01
CERT_TYPE_XTASK1=02
CERT_TYPE_VIDEO_UCODE=03
CERT_TYPE_AUDIO_UCODE=04
CERT_TYPE_DEMUX_UCODE=05
CERT_TYPE_IH=06
CERT_TYPE_XTASK2=07
CERT_TYPE_XTASK3=08
CERT_TYPE_XTASK4=09
CERT_TYPE_XOSU=ff

# helper functions

extract()
{
	if [ -z $3 ]; then
		dd bs=1 skip=$1 count=$2 2> /dev/null
	else
		dd bs=1 skip=$1 count=$2 if=$3 2> /dev/null
	fi
}

cert_id()
{
	extract 0 2 $1 | frombin.bash -
}

cert_type()
{
	extract 2 1 $1 | frombin.bash -

}

cert_sekid()
{
	extract 3 1 $1 | frombin.bash -
}

check_cert_type()
{
	CERT_TYPE=`cert_type $CERT_BIN`

	echo Cert: $CERT_BIN
	echo Type: $CERT_TYPE
	
	while [ $# -ne 0 ]; do
		if [ $CERT_TYPE = $1 ]; then
			echo Certificate type checked: $1 OK
			return 
		fi
		shift 1;
	done
	
	echo "Certificate type $CERT_TYPE is invalid."
	exit -1;
}



