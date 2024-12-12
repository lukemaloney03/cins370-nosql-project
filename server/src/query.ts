import { Connection } from 'mongoose';

const runQueries = async (mongoConnection: Connection) => {
  try {
    const firstQueryResult = await mongoConnection
      .collection('Song')
      .aggregate([
        {
          $lookup: {
            from: 'Album',
            localField: 'albumURL',
            foreignField: 'albumURL',
            as: 'albumDetails',
          },
        },
        { $unwind: '$albumDetails' },
        {
          $lookup: {
            from: 'Artist',
            localField: 'artistURL',
            foreignField: 'artistURL',
            as: 'artistDetails',
          },
        },
        { $unwind: '$artistDetails' },
        {
          $match: {
            'albumDetails.albumReleaseDate': {
              $gte: '1990-01-01',
              $lte: '1999-12-31',
            },
          },
        },
        {
          $addFields: {
            artistName: '$artistDetails.artistName',
            albumName: '$albumDetails.albumName',
          },
        },
        {
          $project: {
            _id: 0,
            trackName: 1,
            artistName: 1,
            albumName: 1,
          },
        },
      ])
      .toArray();
    console.log('First Query Result:', firstQueryResult);

    const secondQueryResult = await mongoConnection
      .collection('User')
      .aggregate([
        {
          $match: {
            preferences: { $regex: 'Pop', $options: 'i' },
          },
        },
        {
          $lookup: {
            from: 'SongTasteProfile',
            localField: 'userID',
            foreignField: 'userID',
            as: 'tasteProfiles',
          },
        },
        { $unwind: '$tasteProfiles' },
        {
          $project: {
            _id: 0,
            username: 1,
            tastes: '$tasteProfiles.tastes',
          },
        },
      ])
      .toArray();
    console.log('Second Query Result:', secondQueryResult);

    const thirdQueryResult = await mongoConnection
      .collection('Song')
      .aggregate([
        {
          $lookup: {
            from: 'SongAttribute',
            localField: 'trackURL',
            foreignField: 'trackURL',
            as: 'songAttributes',
          },
        },
        { $unwind: '$songAttributes' },
        {
          $match: {
            'songAttributes.energy': { $gt: 0.7 },
          },
        },
        {
          $lookup: {
            from: 'Album',
            localField: 'albumURL',
            foreignField: 'albumURL',
            as: 'albumDetails',
          },
        },
        { $unwind: '$albumDetails' },
        {
          $lookup: {
            from: 'Artist',
            localField: 'albumDetails.albumArtistURL',
            foreignField: 'artistURL',
            as: 'artistDetails',
          },
        },
        { $unwind: '$artistDetails' },
        {
          $group: {
            _id: {
              albumName: '$albumDetails.albumName',
              artistName: '$artistDetails.artistName',
            },
          },
        },
        {
          $project: {
            _id: 0,
            albumName: '$_id.albumName',
            artistName: '$_id.artistName',
          },
        },
      ])
      .toArray();
    console.log('Third Query Result:', thirdQueryResult);

    const fourthQueryResult = await mongoConnection
      .collection('User')
      .aggregate([
        {
          $lookup: {
            from: 'SongTasteProfile',
            let: { user_id: '$userID' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$userID' }, { $toString: '$$user_id' }],
                  },
                },
              },
            ],
            as: 'tasteProfiles',
          },
        },
        { $unwind: '$tasteProfiles' },
        {
          $project: {
            _id: 0,
            username: 1,
            tastes: '$tasteProfiles.tastes',
          },
        },
      ])
      .toArray();
    console.log('Fourth Query Result:', fourthQueryResult);

    const fifthQueryResult = await mongoConnection
      .collection('Song')
      .aggregate([
        {
          $lookup: {
            from: 'Album',
            localField: 'albumURL',
            foreignField: 'albumURL',
            as: 'albumDetails',
          },
        },
        { $unwind: '$albumDetails' },
        {
          $lookup: {
            from: 'SongAttribute',
            localField: 'trackURL',
            foreignField: 'trackURL',
            as: 'songAttributeDetails',
          },
        },
        { $unwind: '$songAttributeDetails' },
        {
          $addFields: {
            albumName: '$albumDetails.albumName',
            danceability: '$songAttributeDetails.danceability',
            tempo: '$songAttributeDetails.tempo',
          },
        },
        {
          $project: {
            _id: 0,
            trackName: 1,
            albumName: 1,
            danceability: 1,
            tempo: 1,
          },
        },
      ])
      .toArray();
    console.log('Fifth Query Result:', fifthQueryResult);

    const sixthQueryResult = await mongoConnection
      .collection('Song')
      .aggregate([
        {
          $lookup: {
            from: 'SongAttribute',
            localField: 'trackURL',
            foreignField: 'trackURL',
            as: 'songAttributes',
          },
        },
        { $unwind: '$songAttributes' },
        {
          $lookup: {
            from: 'Artist',
            localField: 'artistURL',
            foreignField: 'artistURL',
            as: 'artistDetails',
          },
        },
        { $unwind: '$artistDetails' },
        {
          $match: {
            'songAttributes.danceability': { $gt: 0.7 },
            'songAttributes.acousticness': { $lt: 0.1 },
          },
        },
        {
          $addFields: {
            artistName: '$artistDetails.artistName',
          },
        },
        {
          $project: {
            _id: 0,
            trackName: 1,
            artistName: 1,
          },
        },
      ])
      .toArray();
    console.log('Sixth Query Result:', sixthQueryResult);

    const seventhQueryResult = await mongoConnection
      .collection('User')
      .aggregate([
        {
          $lookup: {
            from: 'SongTasteProfile',
            localField: 'userID',
            foreignField: 'userID',
            as: 'tasteProfiles',
          },
        },
        { $unwind: '$tasteProfiles' },
        {
          $lookup: {
            from: 'SongAttribute',
            localField: 'tasteProfiles.profileID',
            foreignField: 'songAttributeID',
            as: 'songAttributes',
          },
        },
        { $unwind: '$songAttributes' },
        {
          $match: {
            'songAttributes.liveness': { $gt: 0.2 },
          },
        },
        {
          $addFields: {
            tastes: '$tasteProfiles.tastes',
          },
        },
        {
          $project: {
            _id: 0,
            username: 1,
            tastes: 1,
          },
        },
      ])
      .toArray();
    console.log('Seventh Query Result:', seventhQueryResult);

    const eighthQueryResult = await mongoConnection
      .collection('Album')
      .aggregate([
        {
          $lookup: {
            from: 'Artist',
            localField: 'albumArtistURL',
            foreignField: 'artistURL',
            as: 'artistDetails',
          },
        },
        { $unwind: '$artistDetails' },
        {
          $addFields: {
            artistName: '$artistDetails.artistName',
          },
        },
        {
          $project: {
            _id: 0,
            albumName: 1,
            albumReleaseDate: 1,
            artistName: 1,
          },
        },
      ])
      .toArray();
    console.log('Eighth Query Result:', eighthQueryResult);
  } catch (error) {
    console.error(
      'Error running aggregation pipelines:',
      (error as Error).message,
    );
  }
};

export default runQueries;
