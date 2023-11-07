import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
//Client to connect to our nats streaming server
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("====================================");
  console.log("Listener connected to NATS");
  console.log("====================================");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  //The option setManualAckMode(true) allow us to retreat received event in case something went wrong during saving data in DB for example
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("orders-service-Queue-group");

  //this is the object that we're going to listen to and we're going to receive some data through the subscription
  const subscription = stan.subscribe(
    "ticket:created",
    "gueue-group-name",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
    //To inform NATS that we well received the event,then process ended
    msg.ack();
  });
});

//Intercept terminate or interrupt request to our program, then we close the client gracefully, then the client will not receive event while it's closing
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
