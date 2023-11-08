import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queGroupName = "payment-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("====================================");
    console.log("Event Data!", data);
    console.log("====================================");

    console.log("====================================");
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
