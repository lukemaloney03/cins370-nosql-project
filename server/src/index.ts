import jsonFileImport from './json-file-import';
import Mongo from './mongo';
import runQueries from './query';

const start = async () => {
  try {
    await Mongo.connect();
    console.log('> MongoDB connected. Starting JSON import...');
    await jsonFileImport.allJsonFiles();
    await runQueries(Mongo.connection());
  } catch (error) {
    console.error(
      '> Failed to start the server due to MongoDB connection error:',
      (error as Error).message,
    );
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('> Received SIGINT, closing MongoDB connection...');
  await Mongo.disconnect();
  process.exit(0);
});

start();
