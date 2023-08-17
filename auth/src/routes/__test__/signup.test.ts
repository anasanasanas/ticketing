import requests from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: '12345678'
        })
        .expect(201);
});


it('returns a 400 with an invalid email', async () => {
    await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'testexample.com',
            password: '12345678'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: '123'
        })
        .expect(400);
});


it('returns a 400 with missing email or password', async () => {
    await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com'
        })
        .expect(400);

    await requests(app)
        .post('/api/users/signup')
        .send({
            password: '12345678'
        })
        .expect(400);

    await requests(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: '12345678'
        })
        .expect(201);

    await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: '12345678'
        })
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await requests(app)
        .post('/api/users/signup')
        .send({
            email: 'test@example.com',
            password: '12345678'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();

});
