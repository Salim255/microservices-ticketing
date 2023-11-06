# Dependencies

- npm install typescript
- npm i ts-node-dev, to execute our project in development environment
- npm i express @types/express
- tsc --init
- npm install node-nats-streaming
- npm install ts-node-dev typescript @types/node

# To get access to a running pod inside a cluster

- nats-test % kubectl port-forward nats-depl-7f46c9d9cd-g5qm6 4222:4222
- rs , then enter to restart a running programme in terminal

# TO go to NATS Streaming page

- kubectl port-forward nats-depl-ff6bd54d7-p7gmc 8222:8222
- http://localhost:8222/streaming/channelsz?subs=1
- http://localhost:8222/streaming
