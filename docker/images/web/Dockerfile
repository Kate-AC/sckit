FROM node:16-alpine3.12

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash

ADD . .

RUN npm install

ENV PATH $PATH:/projects/sckit/node_modules/.bin
