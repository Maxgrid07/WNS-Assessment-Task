# WNS-Assessment-Task

NodeJS and mongoDB needs to be installed first.

Commands to be run after cloning the project:
 - npm install
 - bower install
 
Command to run the project:
 - pm2 start ecosystem.config.js

API Endpoints:
1. API to read file from filesystem and modify the contents through streams and produce data:
    - localhost:3000/api/stream
2. Scheduled job API to transform data and store it back in json:
    - localhost:3000/api/cron