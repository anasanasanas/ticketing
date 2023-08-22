import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});


it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});


it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({});
  expect(response.status).not.toEqual(401);
});


it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({
      price: 10,
    })
    .expect(400);
});


it("returns an error if an invalid price is provided", async () => {
  let res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({
      title: "asdf",
      price: -10,
    })
    .expect(400);

    expect(res.body.errors.length).toEqual(1);
    expect(res.body.errors[0].field).toEqual("price");
    expect(res.body.errors[0].message).toEqual("Price must be greater than 0");

  res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({
      title: "asdf",
    })
    .expect(400);
    expect(res.body.errors.length).toEqual(2);
    res.body.errors.forEach((err: any) => {
      expect(err.field).toEqual("price");
    });

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({
      title: "asdf",
      price: "asdf",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.cookie())
    .send({
      title: "asdf",
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("asdf");
  expect(tickets[0].price).toEqual(20);

});