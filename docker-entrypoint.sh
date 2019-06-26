#!/bin/bash

# Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
# SPDX-License-Identifier: MIT

set -o errexit -o nounset -o pipefail

db_host="localhost"
db_name="fossology"
db_user="fossy"
db_password="fossy"

# Write configuration
cat <<EOM > /usr/local/etc/fossology/Db.conf
dbname=$db_name;
host=$db_host;
user=$db_user;
password=$db_password;
EOM

sed -i 's/address = .*/address = '"localhost"'/' \
    /usr/local/etc/fossology/fossology.conf

# Start postgres
sleep 5
/etc/init.d/postgresql start

# Setup environment
/usr/local/lib/fossology/fo-postinstall --common --database --licenseref

# Setup environment
if [[ $# -eq 0 || ($# -eq 1 && "$1" == "scheduler") ]]; then
  /usr/local/lib/fossology/fo-postinstall --common --database --licenseref
fi

echo
echo "Fossology initialisation complete"
echo
/etc/init.d/fossology start
echo
echo "Fossology started! Starting fossy ..."
echo
cd /fossology
export TZ=UTC
export PATH=/usr/local/lib/nodejs/node-v10.15.3-linux-x64/bin:$PATH
PROFILE=$PROFILE node src/index.js