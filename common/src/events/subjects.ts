//Subject in the world of NATS is the name of a channel

export enum Subjects {
  //enum it's somewhat similar to an object
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:update",
}

//const printSubject = (subject: Subjects) => {};

//printSubject(Subjects.TicketCreated);
