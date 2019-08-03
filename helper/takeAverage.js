function takeAverage(features) {
  let result = [];
  for (let feature of features) {
    const {
      danceability,
      energy,
      mode,
      speechiness,
      acousticness,
      instrumentalness,
      liveness,
      valence
    } = feature;
    if (result.length === 0) {
      result = result.concat([
        danceability,
        energy,
        mode,
        speechiness,
        acousticness,
        instrumentalness,
        liveness,
        valence
      ]);
    } else {
      result[0] += danceability;
      result[1] += energy;
      result[2] += mode;
      result[3] += speechiness;
      result[4] += acousticness;
      result[5] += instrumentalness;
      result[6] += liveness;
      result[7] += valence;
    }
  }
  return result.map((each, i, a) => each / a.length);
}

module.exports = takeAverage;
