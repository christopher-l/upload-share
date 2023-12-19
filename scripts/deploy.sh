#!/usr/bin/env bash

set -e

source .env

podman build . -t upload-share --platform=$DEPLOY_PLATFORM --pull
podman save upload-share | pv | ssh $DEPLOY_HOST docker load
ssh vortex "cd $DEPLOY_PATH; docker compose up -d"