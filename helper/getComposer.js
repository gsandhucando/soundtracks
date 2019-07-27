const axios = require('axios');

function getComposer(id) {
  console.log(id, 'message next to id')
  return axios.get(`https://api.discogs.com/artists/${id}/releases?key=${
    process.env.DISCOGS_KEY
  }&secret=${
    process.env.DISCOGS_SECRET
  }&sort=title&sort_order=asc`)
  .then(response => {
    // console.log(response.data.releases[0], '%%%%%%%%%%%%%%%%%')
    //maping through and grabbing the id and title from respnse.data.releases
    let reducedReleases = response.data.releases.map(({id, title}) => {
      return {id, title}
    })
    return reducedReleases
  })

}

module.exports = getComposer;