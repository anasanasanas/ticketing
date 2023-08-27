import { Publisher, Subjects, TicketCreatedEvent } from "@jaxeam/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}