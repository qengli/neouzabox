#!/bin/bash
# ${x%.*} : remove one rank of . from x=a.b.c.d
set -e
#
if [ $# != 1 ]; then 
    cat <<EOF
Syntax: $0 path/to/signed_items
EOF
    exit -1 
fi
#
TMPFILE=`mktemp /tmp/check_signed_items.XXXXXX`
pushd $1 >/dev/null
for x in `find signatures -type f`; do
	echo Considering $x
	echo
	revbytes.pl "$x" >$TMPFILE
	PUBKEY=${x%.*}
	ITEM=${PUBKEY%.*}
	PUBKEY=public_keys/${PUBKEY##*.}_pubkey.pem
	ITEM=items/${ITEM#*/}
	echo Checking $ITEM against $PUBKEY:
	/usr/bin/openssl rsautl -verify -pubin -inkey $PUBKEY -asn1parse <$TMPFILE
	sha1sum $ITEM
	/usr/bin/openssl sha1 -verify $PUBKEY -signature $TMPFILE <$ITEM
	echo
done
popd >/dev/null
rm $TMPFILE
