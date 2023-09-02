import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';


const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    return ticket;
};

it('fetch orders for a particular user ', async () => {

    // Create a ticket
    await buildTicket();
    await buildTicket();

    const userOne = global.cookie("userOne");

    // Create one order as User #1
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: (await Ticket.find())[0].id })
        .expect(201);

    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${orderOne.id}`)
        .set('Cookie', userOne)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(orderOne.id);
});

it('returns an error if one user tries to fetch another users order', async () => {

        await buildTicket();
        await buildTicket();

        const userOne = global.cookie("userOne");
        const userTwo = global.cookie("userTwo");

        // Create one order as User #1
        const { body: orderOne } = await request(app)
            .post('/api/orders')
            .set('Cookie', userOne)
            .send({ ticketId: (await Ticket.find())[0].id })
            .expect(201);

        // Create two orders as User #2
        const { body: orderTwo } = await request(app)
            .post('/api/orders')
            .set('Cookie', userTwo)
            .send({ ticketId: (await Ticket.find())[1].id })
            .expect(201);

        const { body: fetchOrder } = await request(app)
            .get(`/api/orders/${orderOne.id}`)
            .set('Cookie', userTwo)
            .send()
            .expect(401);
});