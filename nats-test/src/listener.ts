import nats from "node-nats-streaming";
console.clear();
//Client to connect to our nats streaming server
const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("====================================");
  console.log("Listener connected to NATS");
  console.log("====================================");

  //this is the object that we're going to listen to and we're going to receive some data through the subscription
  const subscription = stan.subscribe("ticket:created");

  subscription.on("message", (msg) => {
    console.log("====================================");
    console.log("Message received");
    console.log("====================================");
  });
});
