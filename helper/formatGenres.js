const replacer = require("./replacer");

function formatGenres(arr) {
  console.log(arr)
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    result +=
      arr[i].replace(/\W+/g, replacer) + (i !== arr.length - 1 ? "+" : "");
  }
  return result;
}

module.exports = formatGenres;
