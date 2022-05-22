# SPDX-License-Identifier: MIT OR CC0-1.0
# Bryn (ARA)

FROM node:18.2.0-alpine3.15

WORKDIR /opt/build/arabot

ENV NODE_ENV="production"

COPY . .

RUN npm install

RUN npm run cleanBuild

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
