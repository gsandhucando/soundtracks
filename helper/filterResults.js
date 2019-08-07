const formatTitle = require("./formatTitle");

const filterResults = (arr, movieTitle) => {
  let memo = new Set();
  return arr.filter(movie => {
    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', movie)
    if (movie.title && movie.title.length > 0) {
      const newTitle = formatTitle(movie.title);
      let condition = memo.has(newTitle);

      // console.log(newTitle);
      // console.log(movieTitle, "@@@@@@@@@@@@@@@@@@@");
      if (movieTitle) {
        if (newTitle.toLowerCase().includes(movieTitle.toLowerCase())) {
          // console.log(movie.title, '***************')
          return false;
        }
        memo.add(newTitle);
        return !condition;
      } else {
        return false;
      }
    }
  });
};

module.exports = filterResults;
