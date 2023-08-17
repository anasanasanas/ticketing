import requests from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
    await requests(app)
        .post('/api/users/signin')
        .send({
            email: 'test@example.com',
            password: '12345678'
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    const cookie = await global.signup()

    await requests(app)
        .post('/api/users/signin')
        .send({
            email: 'test@example.com',
            password: 'adskdkalksd'
        })
        .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
    const cookie = await global.signup()

    const response = await requests(app)
        .post('/api/users/signin')
        .send({
            email: 'test@example.com',
            password: '12345678'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});