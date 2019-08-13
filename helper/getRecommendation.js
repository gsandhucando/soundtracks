const axios = require('axios');

function getRecommendation(movieId) {
  axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${
    process.env.MOVIEDB_KEY}`)
    .then(response => {
      return response.data.results
    })

}

module.exports = getRecommendation;