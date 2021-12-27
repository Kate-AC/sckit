FROM node:16-alpine3.12

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash

ADD ./package.json .
ADD ./package-lock.json .

RUN npm install

ENV PATH $PATH:/node_modules/.bin

WORKDIR /projects/sckit