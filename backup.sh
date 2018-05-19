#!/bin/bash

apt-get update; apt-get install -y s3cmd

MONGODUMP_PATH="/usr/bin/mongodump"
TIMESTAMP=`date +%F-%H%M`
S3_CONFIG="/root/.s3cfg"

CHUNK_SIZE="500m" # 500 mg
DUMPS_TO_KEEP=30

if [ $# -lt 2 ]
then
  echo "Usage: `basename $0` database s3_bucket"
  exit 1
fi

# get instance address
DATABASE=$1

# get instance address
S3_BUCKET_NAME=$2

# temporary folder to perform the dump
TEMP_FOLDER=/tmp/backup
mkdir $TEMP_FOLDER
cd  $TEMP_FOLDER

echo "Backing up database..."


# exit if something fails
set -e

# Create backup
echo "Performing the database dump..."
rm -rf dump
$MONGODUMP_PATH --db $DATABASE
echo "Done."

# Add timestamp to backup
echo "Archiving..."
rm -rf mongodb-*
mv dump mongodb-$DATABASE-$TIMESTAMP
tar cvzf mongodb-$DATABASE-$TIMESTAMP.tar.gz mongodb-$DATABASE-$TIMESTAMP
rm -rf mongodb-$DATABASE-$TIMESTAMP
echo "Done."

echo "Splitting..."
mkdir mongodb-$DATABASE-$TIMESTAMP
cd mongodb-$DATABASE-$TIMESTAMP
split -b${CHUNK_SIZE} ../mongodb-$DATABASE-$TIMESTAMP.tar.gz mongodb-$DATABASE-$TIMESTAMP.tar.gz-
cd ..
rm -rf mongodb-$DATABASE-$TIMESTAMP.tar.gz
echo "Done."

# Upload to S3
echo "Uploading to S3..."
s3cmd --config $S3_CONFIG put -r mongodb-$DATABASE-$TIMESTAMP s3://$S3_BUCKET_NAME/
rm -rf mongodb-$DATABASE-$TIMESTAMP
echo "Done."

echo "Removing old dumps..."
dumps=`s3cmd --config $S3_CONFIG ls s3://$S3_BUCKET_NAME | awk '{print $2}' | tac | tail -n+$DUMPS_TO_KEEP`
for dump in $dumps; do
  echo "Removing $dump"
  s3cmd --config $S3_CONFIG del --recursive $dump
done
echo "Done."


echo "Backup saved to s3://$S3_BUCKET_NAME/mongodb-$DATABASE-$TIMESTAMP"
