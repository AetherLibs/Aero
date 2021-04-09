FROM node:lts-alpine

RUN apk add git python g++ make pkgconf cairo-dev jpeg-dev pango-dev giflib-dev openssh-client

RUN ln -sf pkgconf /usr/bin/pkg-config

RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

WORKDIR /opt/aero/aero

COPY package*.json ./

ENV CXXFLAGS="-w"

RUN npm ci --legacy-peer-deps

COPY . .

CMD [ "npm", "start" ]
