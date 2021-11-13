FROM ethereum/client-go:latest

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash

# WORKDIR /root/files

# ADD ./docker/config/eth/genesis.json .
# ADD ./docker/config/eth/password.txt .

WORKDIR /root/private_net

# データベース初期化
# RUN geth \
#  --datadir /root/private_net \
#  init /root/files/genesis.json

#RUN geth \
#  account new \
#  --password /root/files/password.txt \
#  --keystore /root/private_net/keystore

ENTRYPOINT geth \
  --dev \
  --http \
  --http.addr '0.0.0.0' \
  --http.port 8545 \
  --http.api 'eth,web3,personal,net' \
  --http.corsdomain '*' \
  --http.vhosts '*'