# BullMQ 1656 reproduction repo

This repo reproduces the issue [1656](https://github.com/taskforcesh/bullmq/issues/1656).

There are 1000 jobs scheduled with 10 seconds interval each, when Redis restarts (10s interval) there is a high chance that worker won't resume and freeze indefinitely.

## How to run

```
npm i
docker-compose up -d
npm run start
```
