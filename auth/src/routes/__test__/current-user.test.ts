import requests from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    const cookie = await global.signup();

    const response = await requests(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@example.com')
});