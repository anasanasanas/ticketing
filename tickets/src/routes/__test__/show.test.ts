import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .set("Cookie", global.cookie())
        .send()
        .expect(404)
})

it("returns the ticket if the ticket is found", async () => {
    const title = "asdf";
    const price = 20;

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.cookie())
        .send({
            title: title,
            price: price,
        })
        .expect(201);

    const getTicketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.cookie())
        .send()
        .expect(200)

    expect(getTicketResponse.body.title).toEqual(title)
    expect(getTicketResponse.body.price).toEqual(price)
})