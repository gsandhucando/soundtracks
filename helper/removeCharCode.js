function removeCharCode(str) {
  let newStr = ''
  const range = 150;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) <= range) {
      newStr += str[i]
    }
  }
  return newStr
}

module.exports = removeCharCode;