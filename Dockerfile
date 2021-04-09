FROM node:lts

RUN apt update

RUN apt install git build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

WORKDIR /opt/aero/aero

COPY package*.json ./

ENV CXXFLAGS="-w"

RUN npm ci --legacy-peer-deps

COPY . .

CMD [ "npm", "start" ]
