#!/bin/bash

curl -X POST http://localhost:3000 -d '{ "agentName": "summarizer", "message": "hi there" }' -H 'Content-Type: application/json'
