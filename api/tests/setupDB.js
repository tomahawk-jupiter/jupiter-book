const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (err) {
      if (error.message === 'ns not found') return;
      if (error.message.includes('a background operation is currently running'))
        return;
    }
  }
};

module.exports = {
  setupDB(db) {
    beforeAll(async () => {
      const mongoUri = process.env.MONGO_URI_L + db + process.env.MONGO_URI_R;
      await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
    });
  }
};
