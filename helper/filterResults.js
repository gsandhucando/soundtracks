const filterResults = (arr, movieTitle) => {
  let memo = new Set();
  return arr.filter(movie => {
    let condition = memo.has(movie.title);

    // console.log(movie.title);

    if (movie.title.toLowerCase().includes(movieTitle.toLowerCase())) {
      // console.log(movie.title, '***************')
      return false
    }
    memo.add(movie.title);
    return !condition;
  });
};

module.exports = filterResults;
