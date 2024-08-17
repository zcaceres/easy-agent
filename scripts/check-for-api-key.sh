#! /bin/bash

if grep -r --exclude-dir=node_modules --exclude=check-for-api-key.sh --exclude=.gitignore -l 'sk-' .; then
    echo "Error: Above are files containing 'sk-' pattern found."
    echo "!!!!!!!!!!!!!!!!YOU MIGHT BE COMMITING YOUR API KEY!!!!!!!!!!!"
    exit 1
fi
