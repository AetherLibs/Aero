FROM node:alpine

RUN apk add git python g++ make pkgconf cairo-dev jpeg-dev pango-dev giflib-dev jemalloc-dev

RUN ln -sf pkgconf /usr/bin/pkg-config

WORKDIR /opt/aero/aero

COPY package*.json ./

ENV CXXFLAGS="-w"

RUN npm ci

COPY . .

ENV LD_PRELOAD="/usr/lib/libjemalloc.so"

CMD [ "npm", "start" ]
