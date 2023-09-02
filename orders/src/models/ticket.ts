import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@jaxeam/common";

// An interface that describes the properties
// that are required to create a new Ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// An interface that describes the properties
// that a Ticket Document has
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;

    isReserved(): Promise<boolean>;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

// Run query to look at all orders. Find an order where the ticket
// is the ticket we just found *and* the orders status is *not* cancelled.
// If we find an order from that means the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });
    return !!existingOrder
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);