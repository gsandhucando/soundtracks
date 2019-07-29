const axios = require("axios");

function titleSearch(tracks) {
  let searchPromisies = tracks.map(track => {
    // console.log(track)
    // console.log(track.title, track.artist)
    return axios
      .get(
        `https://api.discogs.com/database/search?key=${
          process.env.DISCOGS_KEY
        }&secret=${process.env.DISCOGS_SECRET}&track=${track.title}&artist=${
          track.artist
        }&style=soundtrack&type=release`
      )
      .then(response => {
        // console.log(track.title, track.artist ,response.data.results.length)
        // console.log('************************************************')
        if (response.data.results.length > 0) {
          let mappedResults = response.data.results.map(({ id, title }) => {
            return { id, title };
          });
          let memo = new Set();
          let filteredResults = mappedResults.filter(movie => {
            let condition = memo.has(movie.title);
            memo.add(movie.title);
            return !condition;
          });
          return filteredResults;
        } else {
          return [];
        }
      });
  });
  return Promise.all(searchPromisies);
}

module.exports = titleSearch;
