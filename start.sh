#!/bin/bash
set -e
ENV_FILE=./$1
if test -f "$ENV_FILE"; then
  echo starting with env ENV_FILE $ENV_FILE
  source $ENV_FILE
  export $(cut -d= -f1 $ENV_FILE)
  npx ts-node src/index.ts
else
  echo $ENV_FILE file des not exist
fi
