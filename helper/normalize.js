const normalize = (arr, normalArr) => {
  let newArr = [];
  for (let i = 0; i < normalArr.length; i++) {
    let { mean, max, min } = normalArr[i];
    let normalized = (arr[i] - mean) / (max - min);
    newArr.push(normalized);
  }
  return newArr;
};

module.exports = normalize;
