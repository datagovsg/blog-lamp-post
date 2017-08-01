export function neighbourKeys (key) {
  const keyX = +(key.slice(0, key.length / 2))
  const keyY = +(key.slice(key.length / 2, key.length))
  return [
    (keyX + 1).toFixed() + (keyY).toFixed(),
    (keyX + 1).toFixed() + (keyY - 1).toFixed(),
    (keyX).toFixed() + (keyY - 1).toFixed(),
    (keyX - 1).toFixed() + (keyY - 1).toFixed(),
    (keyX - 1).toFixed() + (keyY).toFixed(),
    (keyX - 1).toFixed() + (keyY + 1).toFixed(),
    (keyX).toFixed() + (keyY + 1).toFixed(),
    (keyX + 1).toFixed() + (keyY + 1).toFixed()
  ]
}

export function chain (segments, epsilon2 = 1) {
  const result = []
  let unchecked = segments
  while (unchecked.length > 0) {
    let checked = []
    let target = unchecked.pop()
    while (unchecked.length > 0) {
      const test = unchecked.pop()
      const joined = join(target, test, epsilon2)
      if (joined) {
        target = joined
        unchecked.push(...checked)
        checked = []
      } else {
        checked.push(test)
      }
    }
    result.push(target)
    unchecked = checked
  }
  return result
}

function canJoin (a, b, epsilon2 = 1) {
  return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) <= epsilon2
}

function join (a, b, epsilon2 = 1) {
  if (canJoin(b[0], a[a.length - 1], epsilon2)) return a.concat(b)
  if (canJoin(a[0], b[b.length - 1], epsilon2)) return b.concat(a)
  if (canJoin(a[0], b[0], epsilon2)) return [...a].reverse().concat(b)
  if (canJoin(a[a.length - 1], b[b.length - 1], epsilon2)) return b.concat([...a].reverse())
  return null
}
