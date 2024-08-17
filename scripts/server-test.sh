#!/bin/bash

message="$1"
stateful=""
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
    --stateful)
        stateful="true"
        shift
        ;;
    *)
        # unknown option
        shift
        ;;
    esac
done

if [[ "$stateful" == "true" ]]; then
    curl -X POST http://localhost:3000 -d '{ "agentName": "summarizer", "message": "'"$message"'", "stateful": true }' -H 'Content-Type: application/json'
else
    curl -X POST http://localhost:3000 -d '{ "agentName": "summarizer", "message": "'"$message"'" }' -H 'Content-Type: application/json'
fi
