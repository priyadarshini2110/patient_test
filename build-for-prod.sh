#!/bin/sh

rm -rf dist emsdashboard
rm emsdashboard.tar.gz
node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --output-hashing=all --prod --base-href "/emsdashboard/" --deploy-url "/emsdashboard/"
# in local you could run this command instead of the above
#ng build --prod --base-href "/emsdashboard/" --deploy-url "/emsdashboard/"
mv dist emsdashboard
tar -czvf emsdashboard.tar.gz emsdashboard
