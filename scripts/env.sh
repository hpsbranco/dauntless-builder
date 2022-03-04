#!/usr/bin/env bash

docker build -t dauntlessbuilder-env .

docker run \
	--rm \
	-v ${PWD}:/app \
	-u $(id -u ${USER}):$(id -g ${USER}) \
	-p 4000:4000 \
	-it \
	dauntlessbuilder-env
