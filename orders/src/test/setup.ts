import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';

declare global {
    var cookie: (userId?:string) => string;
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


global.cookie = (userId:string = '123456') => {
    const payload = {
        id: `${userId}`,
        email: 'anas@example.com',
    }

    const jwt_token = jwt.sign(payload, process.env.JWT_KEY!)

    const session_json = JSON.stringify({ jwt: jwt_token })

    const base64 = Buffer.from(session_json).toString('base64')

    return `session=${base64}`
}