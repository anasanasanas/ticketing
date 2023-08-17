import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

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