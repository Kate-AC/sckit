FROM ethereum/solc:0.8.10-alpine

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash \
  && apk add nodejs \
  && apk add npm

WORKDIR /projects/sckit/node_modules/.bin

ENV PATH $PATH:/projects/sckit/node_modules/.bin

WORKDIR /projects/sckit
