# Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
# SPDX-License-Identifier: MIT

FROM fossology/fossology:3.3.0

MAINTAINER Alex Skorohod <alex.skorohod@codescoop.com>

WORKDIR /fossology

RUN wget https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz
RUN mkdir -p /usr/local/lib/nodejs
RUN tar -xJvf node-v10.15.3-linux-x64.tar.xz -C /usr/local/lib/nodejs
RUN export PATH=/usr/local/lib/nodejs/node-v10.15.3-linux-x64/bin:$PATH

COPY . .

RUN export PATH=/usr/local/lib/nodejs/node-v10.15.3-linux-x64/bin:$PATH && npm install

EXPOSE 3000

RUN chmod +x /fossology/docker-entrypoint.sh
ENTRYPOINT ["/fossology/docker-entrypoint.sh"]