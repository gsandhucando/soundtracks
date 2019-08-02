const axios = require("axios");

const getSimilar = (movie_id) => {

  return axios
    .get(
      `https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=${
        process.env.MOVIEDB_KEY
      }`
    )
    .then(response => {
      let { results } = response.data;
      console.log(results)
      return results
    });
};

module.exports = getSimilar;
