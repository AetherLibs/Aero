FROM node:alpine AS builder

RUN apk add build-base

RUN wget -O - https://github.com/jemalloc/jemalloc/releases/download/5.2.1/jemalloc-5.2.1.tar.bz2 | tar -xj && \
    cd jemalloc-5.2.1 && \
    ./configure && \
    make && \
    make install

FROM node:alpine

RUN apk add git python g++ make pkgconf cairo-dev jpeg-dev pango-dev giflib-dev

RUN ln -sf pkgconf /usr/bin/pkg-config

WORKDIR /opt/aero/aero

COPY package*.json ./

ENV CXXFLAGS="-w"

RUN npm ci

COPY . .

COPY --from=builder /usr/local/lib/libjemalloc.so.2 /usr/local/lib/

ENV LD_PRELOAD="/usr/local/lib/libjemalloc.so.2"

CMD [ "npm", "start" ]
