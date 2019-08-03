const axios = require("axios");

const filterResults = require("./filterResults");

function titleSearch(tracks, movieTitle) {
  let searchPromisies = tracks.map(track => {
    // console.log(track)
    // console.log(track.title, track.artist)
    return axios
      .get(
        `https://api.discogs.com/database/search?key=${
          process.env.DISCOGS_KEY
        }&secret=${process.env.DISCOGS_SECRET}&track=${track.title}&style=soundtrack&type=release`
      )
      .then(response => {
        // console.log(track.title ,response.data.results.length)
        // console.log('************************************************')
        if (response.data.results.length > 0) {
          // let mappedResults = response.data.results.map(({ id, title }) => {
          //   return { id, title };
          // });

          let filteredResults = filterResults(response.data.results, movieTitle);
          return filteredResults;
        } else {
          return [];
        }
      });
  });
  return Promise.all(searchPromisies);
}

module.exports = titleSearch;
