#!/bin/sh

####
# This script can be used to install heroku
####

###
# Node.js
###
echo "Updating apt-get"
apt-get -qy update

echo "Updating PPAs"
curl -sL https://deb.nodesource.com/setup | bash -

echo "Installing Node.js"
apt-get -qy install nodejs

echo "Installing NPM"
apt-get -qy install npm
