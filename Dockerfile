# SPDX-License-Identifier: MIT OR CC0-1.0
# Bryn (ARA)

FROM node:17.1.0-alpine3.14

WORKDIR /opt/build/arabot

ENV NODE_ENV="production"

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
