import nats, { Message, Stan } from "node-nats-streaming";
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

abstract class Listener {
  abstract subject: string;
  abstract queGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queGroupName}`);
      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
