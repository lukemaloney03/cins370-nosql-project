import mongoose from 'mongoose';

class Mongo {
  private static mongoHost =
    process.env.MONGO_URI || 'mongodb://mongo:27017/test_db';

  private static isConnected = false;

  static async connect() {
    try {
      if (!Mongo.isConnected) {
        await mongoose.connect(Mongo.mongoHost);
        Mongo.isConnected = true;
        await mongoose.connection.dropDatabase();
      }
    } catch (error) {
      console.error('> MongoDB connection failed', (error as Error).message);
      throw error;
    }
  }

  static async disconnect() {
    if (Mongo.isConnected) {
      await mongoose.disconnect();
      Mongo.isConnected = false;
      console.log('> MongoDB connection closed');
    }
  }

  static connection() {
    if (!Mongo.isConnected) {
      throw new Error('Mongoose is not connected. Call connect() first.');
    }
    return mongoose.connection;
  }
}

export default Mongo;
