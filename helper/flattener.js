function flattener(arr) {
  let b = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      b = b.concat(flattener(arr[i]))
    } else {
      b.push(arr[i])
    }
  }
  return b
}

module.exports = flattener;