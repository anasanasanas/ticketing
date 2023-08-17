import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import requests from 'supertest';
import { app } from '../app';

declare global {
    var signup: () => Promise<string[]>;
}


let mongo: MongoMemoryServer
beforeAll(async () => {
    process.env.JWT_KEY = 'privateKey'
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});


beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    collections.forEach(async (collection) => {
        await collection.deleteMany({})
    })
})

afterAll(async () => {
    mongo.stop()
    await mongoose.connection.close();
})


global.signup = async () => {
    const email = 'test@example.com'
    const password = '12345678'

    const response = await requests(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);
    const cookie = response.get('Set-Cookie')
    return cookie
}
