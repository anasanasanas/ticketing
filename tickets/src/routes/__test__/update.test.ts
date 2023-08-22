import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.cookie())
        .send({
            title: "asdasd",
            price: 20,
        })
        .expect(404)
});

it("return a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}}`)
        .send({
            title: "asdf",
            price: 20,
        })
        .expect(401)
});

it("return a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.cookie('123456'))
        .send({
            title: "asdf",
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.cookie('eqwe23423da'))
        .send({
            title: "new title",
            price: 50,
        })
        .expect(401);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual("asdf");
    expect(ticketResponse.body.price).toEqual(20);
});

it("return a 400 if the user provides an invalid title or price", async () => {

    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}}`)
        .set("Cookie", global.cookie())
        .send({
            title: "",
            price: 20,
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${id}}`)
        .set("Cookie", global.cookie())
        .send({
            price: 20,
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${id}}`)
        .set("Cookie", global.cookie())
        .send({
            title: "title",
            price: -1,
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${id}}`)
        .set("Cookie", global.cookie())
        .send({
            title: "title",
        })
        .expect(400)

    const response = await request(app)
        .put(`/api/tickets/${id}}`)
        .set("Cookie", global.cookie())
        .send({
            title: "title",
        })
        .expect(400)

    expect(response.body.errors.length).toEqual(2);

});

it("updates the ticket provided valid inputs", async () => {
    const cookie = global.cookie();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "asdf",
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new title",
            price: 50,
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual("new title");
    expect(ticketResponse.body.price).toEqual(50);
});