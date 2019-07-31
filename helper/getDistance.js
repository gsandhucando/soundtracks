const getDistance = (arr1, arr2) => {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    let difference = arr2[i] - arr1[i]
    sum += Math.pow(difference, 2)
  }
  return Math.sqrt(sum)
}

module.exports = getDistance;