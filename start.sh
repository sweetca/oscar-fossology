# Copyright (c) Codescoop Oy 2019. Licensed under the MIT license.
# SPDX-License-Identifier: MIT
#!/usr/bin/env bash

docker build --no-cache -t gcr.io/codescoop-175906/oscar-fossology:0.0.1 .
docker run -p 3000:3000 --env PROFILE=bigserver gcr.io/codescoop-175906/oscar-fossology:0.0.1