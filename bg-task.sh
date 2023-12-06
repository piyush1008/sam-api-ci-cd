#! /bin/sh
ROLE_ARN=$1
OUTPUT_PROFILE=$2

while :
do
    ./assume-role.sh $ROLE_ARN $OUTPUT_PROFILE
    sleep 600
done