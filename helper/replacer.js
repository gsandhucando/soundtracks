function replacer(match) {
  if(match === " ") {
      return '+'
  } else if (match === "&" ) {
      return "\&"
  } else {
      return ''
  }
}

module.exports = replacer;