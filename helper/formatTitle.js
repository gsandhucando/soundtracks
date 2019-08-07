const removeCharCode = require('./removeCharCode');

let formatTitle = title => {
  title = title.toLowerCase();
  let pattern = /\(.+\)/;
  let pattern2 = /[&\/,="'*]+/g;
  let newTitle = "";
  if (pattern.test(title)) {
    // console.log(title, "*****************************");
    newTitle = title.replace(pattern, "").trim();
  }
  if (pattern2.test(title)) {
    newTitle =
      newTitle.length > 0
        ? newTitle.replace(pattern2, "-").trim()
        : title.replace(pattern2, "-").trim();
  }
  if (title.includes("various")) {
    newTitle =
      newTitle.length > 0
        ? newTitle.replace("various", "").trim()
        : title.replace("various", "").trim();
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
  return removeCharCode(newTitle)
};

module.exports = formatTitle;
