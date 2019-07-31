let getDistance = require('../helper/getDistance');

function nearestN(mat, vector) {
  let results = []
  for(let i = 0; i < mat.length; i++) {
    results.push(getDistance(vector, mat[i]))
  }
  return results
}

module.exports = nearestN;