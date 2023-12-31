import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();
//Client to connect to our nats streaming server
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

//Here we listen to connect event
stan.on("connect", async () => {
  console.log("====================================");
  console.log("Publisher connected to NATS ");
  console.log("====================================");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "conecrt",
      price: 50,
    });
  } catch (error) {
    console.log("====================================");
    console.error(error);
    console.log("====================================");
  }
  //This is will be the information we want to share
  //In order to send data to NATS Streaming server we must convert the data to JSON format
  /*  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  }); */
  //The publish function is how we publish some data, when we call publish we are going to passe in the name of the the channel or the subject we want to publish this information to, and we'll also pass in the data we want to share as well
  /*  stan.publish("ticket:created", data, () => {
    console.log("====================================");
    console.log("Event published!!");
    console.log("====================================");
  }); */
});
