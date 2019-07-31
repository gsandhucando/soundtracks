const axios = require("axios");

const getDetails = (movie, soundTrackId) => {
  movie = movie.trim().replace(/\s+/, "+");

  let arr = [];
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.MOVIEDB_KEY
      }&query=${movie}`
    )
    .then(response => {
      let [results] = response.data;
      const titleMatchIndex = results.findIndex(
        film =>
          film.title.trim().toLowerCase() === movieTitle ||
          film.title
            .trim()
            .toLowerCase()
            .includes(movieTitle)
      );
      if (titleMatchIndex === -1) {
        return [];
      }
      //if movie found its grabbed out the array
      const selectedMovie = results[titleMatchIndex];
      // console.log(titleMatchIndex, selectedMovie, movieTitle, "********");
      //call api again to get extra data about the movie
      return axios.get(
        `https://api.themoviedb.org/3/movie/${selectedMovie.id}?api_key=${
          process.env.MOVIEDB_KEY
        }`
      );
    })
    .then(response => {
      let film = response.data;
      arr.push(film);
      return axios.get(
        `https://api.discogs.com/releases/${soundTrackId}?key=${
          process.env.DISCOGS_KEY
        }&secret=${process.env.DISCOGS_SECRET}`
      );
    })
    .then(response => {
      let soundTrack = response.data;
      arr.push(soundTrack);
      return arr;
    })
    .catch();
};

module.exports = getDetails;
