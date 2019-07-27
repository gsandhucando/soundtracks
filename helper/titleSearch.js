const axios = require('axios');

function titleSearch(tracks) {
  let searchPromisies = tracks.map(track => {
    console.log(track)
    return axios.get(`https://api.discogs.com/database/search?key=${
      process.env.DISCOGS_KEY
    }&secret=${
      process.env.DISCOGS_SECRET
    }&track=${track.title}&artist=${track.artist}&style=soundtrack&type=release`)
    .then(response => {
      // console.log(response.data)
      return response.data.results.map(({id, title}) => {
        return {id, title}
      })
    })
  })
  return Promise.all(searchPromisies)
}

module.exports = titleSearch;