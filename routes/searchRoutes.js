//https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
///<https://api.discogs.com/database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}
const router = require("express").Router();
const axios = require("axios");
let Spotify = require("node-spotify-api");
// console.log(process.env.SPOTIFY_ID)

const getComposer = require("../helper/getComposer");
const titleSearch = require("../helper/titleSearch");
const flattener = require("../helper/flattener");
const getSimilar = require("../helper/getSimilar");
const replacer = require("../helper/replacer");
const getStyles = require("../helper/getStyles");
const formatTitle = require("../helper/formatTitle");
const getAlbums = require("../helper/getAlbums");

const plusCheck = /[+]{1}(?=\+)+/g;
const symbolCheck = /\W+/g;

router.route("/search").post((req, res) => {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });
  // console.log(req.body, '*********')
  //movie title adding + to spaces
  const movie = req.body.movie.trim().replace(/\s+/, "+");
  const year = req.body.year ? req.body.year.trim() : null;
  let mainSoundtrack = {}
  let mainMovie = {}
  //correctly formated title
  let movieTitle = req.body.movie
    .trim()
    .replace(/\s+/, " ")
    .toLowerCase();
  let movieId = 0;

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
      // console.log(response.data, "^^^^^^^^^^^^^^");
      movieTitle = film.title.toLowerCase();
      movieId = film.id;
      //gets exact year and film title just in case user error
      const year = film.release_date.slice(0, 4);
      const country = film.production_countries[0].iso_3166_1.toLowerCase();
      // console.log(film, "film$$$$$$");
      //calling discogs api to check the sound tracks
      // console.log(year, country);
      return axios.get(
        `https://api.discogs.com/database/search?q=${movieTitle}&key=${
          process.env.DISCOGS_KEY
        }&secret=${process.env.DISCOGS_SECRET}&type=release&style=soundtrack`
      );
    })
    .then(({ data }) => {
      //we get a response back from searching for title year and country and get back a response of soundtracks
      const { results } = data;
      //look through each soundtrack and compare the title for the one we looked for
      let titleMatchIndex = -1;
      if (results.length > 0) {
        titleMatchIndex = results.findIndex(
          soundTrack =>
            soundTrack.title.trim().toLowerCase() === movieTitle ||
            soundTrack.title
              .trim()
              .toLowerCase()
              .includes(movieTitle)
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
    .then(({ data }) => {
      // console.log(data);
      const soundtrack = data
      // console.log(soundtrack)
      mainSoundtrack = soundtrack
      let { id, name } = soundtrack.artists[0];
      const { genres, styles, tracklist } = soundtrack;
      let composerId = id;
      // const titles = tracklist.map(track => {
      //   let escapedTitle = track.title
      //     .replace(symbolCheck, replacer)
      //     .replace(plusCheck, "");
      //   let escapedName = track.artists
      //     ? track.artists[0].name
      //         .replace(symbolCheck, replacer)
      //         .replace(plusCheck, "")
      //     : name.replace(symbolCheck, replacer).replace(plusCheck, "");
      //   // console.log(escapedTitle);
      //   // console.log(track.artists, track.title);
      //   return track.artists && name.toLowerCase() === "various"
      //     ? { title: escapedTitle, artist: escapedName }
      //     : { title: escapedTitle, artist: escapedName };
      // });
      //we use Promise.all it resulves all seperate operations it alls each one to do it job sepretally and once done it combaines into one promise
      // if (name.toLowerCase() === "various") {
      //   return Promise.all([
      //     titleSearch(titles, movieTitle),
      //     getStyles(styles, genres, movieTitle),
      //     getSimilar(movieId)
      //   ]);
      // }

      return getSimilar(movieId)

    })
    .then(results => {
      let flattened = flattener(results);
      const pattern = /(\W{1})/g;
      let filteredFlattened = flattened.map(movie => {
        let newTitle = formatTitle(movie.title);
        return { ...movie, title: newTitle };
      })
      // .unshift(mainSoundtrack)
      // console.log(filteredFlattened)
      // let allPromises = filteredFlattened.map(each => {
      //   return getDetails(each.title, each.id);
      // });
      let resultHash = {};
      for (let soundTrack of filteredFlattened) {
        // console.log(soundTrack.title, 'soundTrack')
        if (resultHash[soundTrack.title]) {
          resultHash[soundTrack.title] += 1;
        } else {
          resultHash[soundTrack.title] = 1;
        }
      }
      return getAlbums(spotify, filteredFlattened.slice(0,10));
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});

module.exports = router;
