#!/bin/bash
apt-get update
apt-get install -y pip
pip install certbot
pip install certbot-dns-transip
/usr/local/bin/certbot certonly -n -d 'key.favoretti.net' -a dns-transip --dns-transip-credentials /root/transip.ini --dns-transip-propagation-seconds 120 -m vlad@lazarenko.net --agree-tos --eff-email
export NODE_PATH="/usr/share/unifi-core/app/node_modules/"
CID=$(/usr/bin/node18 cert.js)
cp /etc/letsencrypt/live/key.favoretti.net/fullchain.pem ${CID}.crt
cp /etc/letsencrypt/live/key.favoretti.net/privkey.pem ${CID}.key
sed -i "s/activeCertId.*/activeCertId: ${CID}/g" /data/unifi-core/config/settings.yaml
service unifi-core restart
