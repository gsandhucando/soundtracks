//https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
///<https://api.discogs.com/database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}
const router = require("express").Router();
const axios = require("axios");

router.route("/search").post((req, res) => {
  // console.log(req.body, '*********')
  //movie title adding + to spaces
  const movie = req.body.movie.trim().replace(/\s+/, "+");
  //correctly formated title
  let movieTitle = req.body.movie.trim().replace(/\s+/, " ");
  //call api to get all the resualts for movies
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.MOVIEDB_KEY
      }&query=${movie}`
    )
    .then(response => {
      //compare the searched title with the results that we get
      const { results } = response.data;
      // console.log(response.data.results)
      //its comparing the titles and returns index of where it is in the array
      const titleMatchIndex = results.findIndex(
        film =>
          film.title.trim().toLowerCase() === movieTitle ||
          film.title
            .trim()
            .toLowerCase()
            .includes(movieTitle)
      );
      if (titleMatchIndex === -1) {
        throw new Error("Movie not found.");
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
      //get information we need from the film
      const film = response.data;
      movieTitle = film.title;
      const year = film.release_date.slice(0, 4);
      const country = film.production_countries[0].iso_3166_1.toLowerCase();
      // console.log(film, "film$$$$$$");
      //calling discogs api to check the sound tracks
      console.log(year, country);
      return axios.get(
        `https://api.discogs.com/database/search?q=${movieTitle}&key=${
          process.env.DISCOGS_KEY
        }&secret=${
          process.env.DISCOGS_SECRET
        }&type=release&style=soundtrack&year=${year}&country=${country}`
      );
    })
    .then(response => {
      //we get a response back from searching for title year and country and get back a response of soundtracks
      console.log(response.data.results.length);
      const { results } = response.data;
      //look through each soundtrack and compare the title for the one we looked for
      const titleMatchIndex = results.findIndex(
        soundTrack =>
          soundTrack.title.trim().toLowerCase() === movieTitle.toLowerCase() ||
          soundTrack.title
            .trim()
            .toLowerCase()
            .includes(movieTitle.toLowerCase())
      );
      if (titleMatchIndex === -1) {
        throw new Error("Soundtrack not found.");
      }
      //axios call to get detailed data for the soundtrack
      ///releases/{release_id}{?curr_abbr}
      const selectedSoundtrack = results[titleMatchIndex];
      return axios.get(
        `https://api.discogs.com/releases/${selectedSoundtrack.id}?key=${
          process.env.DISCOGS_KEY
        }&secret=${
          process.env.DISCOGS_SECRET
        }`
      );
    })
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.log(err.message);
    });
});

module.exports = router;
