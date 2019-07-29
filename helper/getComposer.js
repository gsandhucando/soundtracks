const axios = require('axios');

function getComposer(id) {
  // console.log(id, 'message next to id')
  return axios.get(`https://api.discogs.com/artists/${id}/releases?key=${
    process.env.DISCOGS_KEY
  }&secret=${
    process.env.DISCOGS_SECRET
  }&sort=title&sort_order=asc`)
  .then(response => {
    // console.log(response.data.releases, '%%%%%%%%%%%%%%%%%')
    //maping through and grabbing the id and title from respnse.data.releases
    if (response.data.releases.length > 0) {
      let mappedReleases = response.data.releases.map(({ id, title }) => {
        return { id, title };
      });
      let memo = new Set();
      let filteredReleases = mappedReleases.filter(movie => {
        let condition = memo.has(movie.title);
        memo.add(movie.title);
        return !condition;
      });
      // console.log(filteredReleases, '^^^^^^^^^^^^^^^^^^^^^^^^^^^')
      return filteredReleases;
    } else {
      return [];
    }
  })

}

module.exports = getComposer;