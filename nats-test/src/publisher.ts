import nats from "node-nats-streaming";

//Client to connect to our nats streaming server
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

//Here we listen to connect event
stan.on("connect", () => {
  console.log("====================================");
  console.log("Publisher connected to NATS");
  console.log("====================================");
});
