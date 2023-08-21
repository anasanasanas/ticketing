import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import requests from 'supertest';
import { app } from '../app';

declare global {
    var cookie: () => string;
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


global.cookie = () => {
    return 'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwWlRNNFltVTBOREZtTkRsaU9UZzRaVFkxTVRZMllpSXNJbVZ0WVdsc0lqb2lZVzVoYzBCbGVHRnRjR3hsTG1OdmJTSXNJbWxoZENJNk1UWTVNall6TkRBNE5IMC52OF9jWkI2YjBlSVVBa0M3eEVrMnhZdnNRMUE5dUdhc0YxQlVUc0FPVU5FIn0='
}
