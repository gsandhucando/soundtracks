function titleCheck(str, compareStr) {
  return str.split("-").some(each => {
    return each.trim().includes(compareStr);
  });
}

module.exports = titleCheck;
