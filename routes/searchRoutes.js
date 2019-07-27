//https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
///<https://api.discogs.com/database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}
const router = require("express").Router();
const axios = require("axios");

const getComposer = require("../helper/getComposer");
const titleSearch = require("../helper/titleSearch");

router.route("/search").post((req, res) => {
  // console.log(req.body, '*********')
  //movie title adding + to spaces
  const movie = req.body.movie.trim().replace(/\s+/, "+");
  const year = req.body.year ? req.body.year.trim() : null;
  //correctly formated title
  let movieTitle = req.body.movie.trim().replace(/\s+/, " ");
  //call api to get all the resualts for movies
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.MOVIEDB_KEY
      }&query=${movie}${year ? "&year=" + year : ""}`
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
      // console.log(film, "***********");
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
        }&type=release&style=soundtrack`
      );
    })
    .then(response => {
      //we get a response back from searching for title year and country and get back a response of soundtracks
      const { results } = response.data;
      //look through each soundtrack and compare the title for the one we looked for
      // console.log(results, movieTitle);
      let titleMatchIndex = -1;
      if (results.length > 0) {
        titleMatchIndex = results.findIndex(
          soundTrack =>
            soundTrack.title.trim().toLowerCase() ===
              movieTitle.toLowerCase() ||
            soundTrack.title
              .trim()
              .toLowerCase()
              .includes(movieTitle.toLowerCase())
        );
        if (titleMatchIndex === -1) {
          titleMatchIndex = 0;
        }
      }

      if (titleMatchIndex === -1) {
        throw new Error("Soundtrack not found.");
      }
      //axios call to get detailed data for the soundtrack
      ///releases/{release_id}{?curr_abbr}
      const selectedSoundtrack = results[titleMatchIndex];
      return axios.get(
        `https://api.discogs.com/releases/${selectedSoundtrack.id}?key=${
          process.env.DISCOGS_KEY
        }&secret=${process.env.DISCOGS_SECRET}`
      );
    })
    .then(response => {
      let { id, name } = response.data.artists[0];
      // console.log(response.data, '&&&&&&&&&&&&&&&&&');
      const titles = response.data.tracklist.map((track) => {
        // let escapedTitle = track.title.replace(/(\W{1})/g)
        console.log(track.artists)
        return track.artists && name.toLowerCase() === 'various' ? {title : track.title, artist: track.artists[0].name} : {title: track.title, artist: name}
      })
      //we use Promise.all it resulves all seperate operations it alls each one to do it job sepretally and once done it combaines into one promise
      return Promise.all([getComposer(id), titleSearch(titles)]);
    })
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      console.log(err.message);
      res.end();
    });
});

module.exports = router;
