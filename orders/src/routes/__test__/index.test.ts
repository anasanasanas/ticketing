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

    // Create three tickets
    const ticketOne =  await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const tickets = await Ticket.find()
    expect((tickets).length).toEqual(3);

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

    const { body: orderThree } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: (await Ticket.find())[2].id })
        .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderTwo.id);
    expect(response.body[1].id).toEqual(orderThree.id);
    expect(response.body[0].ticket.userId).toEqual((await Ticket.find())[1].userId);
    expect(response.body[1].ticket.userId).toEqual((await Ticket.find())[2].userId);
});