FROM ethereum/solc:0.8.10-alpine

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash \
  && apk add nodejs \
  && apk add npm

WORKDIR /projects/sckit

ADD . .

RUN npm install

ENV PATH $PATH:/projects/sckit/node_modules/.bin