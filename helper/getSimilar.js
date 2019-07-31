const axios = require("axios");

const getSimilar = (movie_id, i=1, allResults=[]) => {

  return axios
    .get(
      `https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=${
        process.env.MOVIEDB_KEY
      }&page=${i}`
    )
    .then(response => {
      let { results, total_pages } = response.data;
      // console.log(results, "total pages number");
      if (total_pages - i === 0) {
        return allResults
      }
      allResults = allResults.concat(results)
      i++
      return getSimilar(movie_id, i, allResults);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = getSimilar;
