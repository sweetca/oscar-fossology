# Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
# SPDX-License-Identifier: MIT

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)