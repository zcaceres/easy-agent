#! /bin/bash

if grep -r --exclude-dir=node_modules --exclude=check-for-api-key.sh --exclude=.gitignore -l 'sk-' .; then
    echo "Error: Files containing 'sk-' pattern found."
    exit 1
fi
