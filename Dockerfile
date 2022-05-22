# SPDX-License-Identifier: MIT OR CC0-1.0
# Bryn (ARA)

FROM node:18.2.0-alpine3.15@sha256:0677e437543d10f6cb050d92c792a14e5eb84340e3d5b4c25a88baa723d8a4ae

WORKDIR /opt/build/arabot

ENV NODE_ENV="production"

COPY . .

RUN npm install

RUN npm run cleanBuild

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
