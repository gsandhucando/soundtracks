let formatTitle = title => {
  title = title.toLowerCase();
  let pattern = /\(.+\)/;
  let newTitle = "";
  if (pattern.test(title)) {
    // console.log(title, "*****************************");
    newTitle = title.replace(pattern, "").trim();
  }
  if (title.includes(":")) {
    newTitle =
      newTitle.length > 0
        ? newTitle.replace(":", "").trim()
        : title.replace(":", "").trim();
  }
  if (newTitle.length === 0) {
    newTitle = title;
  }
  // console.log(newTitle);
  return newTitle;
};

module.exports = formatTitle;
