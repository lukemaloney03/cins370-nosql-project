import fs from 'fs';
import path from 'path';
import Mongo from './mongo';

const jsonFileToMongoCollection = async (
  filePath: string,
  collectionName: string,
) => {
  try {
    await Mongo.connection()
      .collection(collectionName)
      .insertMany(JSON.parse(fs.readFileSync(filePath, 'utf8')));
    console.log(`> Imported data into '${collectionName}' collection`);
  } catch (error) {
    console.error(
      `> Error importing data into '${collectionName}':`,
      (error as Error).message,
    );
  }
};

const allJsonFiles = async () => {
  try {
    const dataDir = '/app/data';
    const files = fs.readdirSync(dataDir);
    const importPromises = files.map((file) => {
      const filePath = path.join(dataDir, file);
      const collectionName = path.basename(file, '.json');
      return jsonFileToMongoCollection(filePath, collectionName);
    });
    await Promise.all(importPromises);
    console.log('> All JSON files imported successfully');
  } catch (error) {
    console.error('> Error importing JSON files:', (error as Error).message);
  }
};

export default { allJsonFiles };
