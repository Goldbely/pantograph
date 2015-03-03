
#!/bin/sh

####
# This script can be used to setup python
####

echo "Installing python 2.6 for node-gyp"
add-apt-repository -y ppa:fkrull/deadsnakes
apt-get -qy update
apt-get -qy install python2.6
update-alternatives --install /usr/bin/python python /usr/bin/python2.6 20
update-alternatives --install /usr/bin/python python /usr/bin/python2.7 10

#you can switch between 2.6 & 2.7 using:
#update-alternatives --config python
