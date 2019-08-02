const axios = require("axios");
const formatGenres = require("./formatGenres");
const filterResults = require("./filterResults")

const getStyles = (styles, genres, movieTitle) => {
  const style = formatGenres(styles);
  const genre = formatGenres(genres);
  console.log(genre, style)
  return axios.get(
    `https://api.discogs.com/database/search?&key=${
      process.env.DISCOGS_KEY
    }&secret=${
      process.env.DISCOGS_SECRET
    }&type=release&style=${style}&genre=${genre}`
  )
  .then(response => {
    if (response.data.results.length > 0) {
      let mappedResults = response.data.results.map(({ id, title }) => {
        return { id, title };
      });

      let filteredResults = filterResults(mappedResults, movieTitle);
      console.log("***********************************", filteredResults)
      return filteredResults;
    } else {
      return [];
    }
  })
};

module.exports = getStyles;
